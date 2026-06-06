# ALTYN Mirror — Telegram bot handoff architecture (V3 → V4 prep)

This document defines the contract that lets `@altyntherapybot` recognize a user's
ALTYN Mirror scenario the moment they click `/start am_<token>` — **without** the
user having to retake the mirror inside Telegram.

> Status: **not implemented in this repo yet.** This is the spec the bot/CAPI
> integration should follow. No KV namespace, no Worker route, no bot edits were
> made in V3. Implementing this is the next single-biggest lift for lead quality.

---

## 1. Why

Today the bridge → bot transfer carries only `am_<token>` in the start payload.
The bot has to ask the user again *what* their scenario is. That kills momentum
and is the #1 leak between "Telegram opened" and "booking intent".

If the bot can read the scenario the second the user arrives, the first message
becomes:

> Здравствуйте. Вижу вашу карту: **{scenario_title}** (оттенок: {nuance}).
> Главный вопрос — *"{key_question}"*.
> Можем разложить его глубже на личном онлайн-разборе (60 минут, 10$).
> Подходит четверг 19:00 или суббота 11:00?

That is the V4 conversion play.

---

## 2. Surface

A tiny Cloudflare Worker (Pages Function `functions/api/mirror-session.ts` is
fine — same project, no new infra) backed by **one** KV namespace.

```
POST /api/mirror-session     # called from /result/[slug] right after MirrorCompleted
GET  /api/mirror-session?t=  # called from the bot/backend
```

No auth on POST (the token IS the secret, format `am_[a-z0-9]{4,16}`).
Optional shared header on GET (`X-Altyn-Bot: <secret>`).

KV namespace: `ALTYN_MIRROR_SESSIONS` (TTL 7 days = 604800 s).

---

## 3. Payload

```ts
type MirrorSession = {
  token: string;                 // am_<...>
  lang: 'ru' | 'uz';
  result_type: 'mayatnik'|'tuman'|'dogonyayu'|'iskra'|'dver';
  secondary_result?: same union | null;
  scenario_title: string;
  secondary_title?: string | null;
  key_question: string;
  markers: string[];              // 3 strings
  first_step: string;
  bring: string[];                // 3 strings
  answer_path: { sceneIndex:number; optionId:string; result:string }[];
  utm: {
    source?: string; medium?: string; campaign?: string;
    content?: string; term?: string;
  };
  fbclid?: string;
  created_at: string;             // ISO
  completed_at?: string;          // ISO
  source: 'altyn-mirror-pages';   // constant
};
```

The current `localStorage` shape already contains everything except the
denormalised `scenario_title / key_question / markers / first_step / bring` —
those just have to be looked up from `src/lib/results.ts` at POST time. The
result-client knows the language and the slug, so this is one extra fetch:

```ts
// pseudo, to be added to result-client.tsx once endpoint exists
await fetch('/api/mirror-session', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(buildMirrorSession(session, primary, secondary, lang)),
}).catch(() => { /* fire-and-forget; localStorage is still the source of truth */ });
```

This is a **best-effort enrichment**, not a blocker. If the POST fails, the
bridge/UI still works because the token is in the start payload and
localStorage. The bot just has to fall back to its old flow.

---

## 4. Bot side

When `/start am_xxxx` arrives:

```
GET https://altyn-mirror.pages.dev/api/mirror-session?t=am_xxxx
  -> 200 { ...MirrorSession } | 404
```

If 200 — bot greets with personalised first message (see section 1).
If 404 — bot falls back to the current cold greeting.

---

## 5. CAPI / Lead (preferred path)

After the user shows *clear booking intent* inside Telegram (clicks "записаться"
button, or replies with a slot), the bot/backend sends a server-side `Lead`
event to Meta via Conversions API:

```
POST https://graph.facebook.com/v19.0/{PIXEL_ID}/events
  access_token: <CAPI_TOKEN>
  data: [{
    event_name: 'Lead',
    event_time: <unix>,
    action_source: 'chat',
    event_source_url: 'https://altyn-mirror.pages.dev/go/telegram/',
    user_data: {
      em: <sha256 of email if available>,
      ph: <sha256 of phone if available>,
      fbc: 'fb.1.<ts>.<fbclid>'   // reconstructed from stored fbclid
    },
    custom_data: { content_name: 'altyn-mirror', result_type: '<...>' }
  }]
```

This is the **clean** Lead signal. It is server-side, deduplicated, and only
fires for users who actually expressed booking intent — not just openers. That's
why this project still does **not** fire `Lead` from the website.

The fallback (delayed Lead on `/go/telegram`) is wired in code but disabled by
default. Enable only if owner explicitly approves and CAPI is not yet in place:

```
NEXT_PUBLIC_ENABLE_BRIDGE_LEAD=1   # Cloudflare Pages env (per environment)
```

Then uncomment the block at the top of `src/app/go/telegram/page.tsx`.

---

## 6. What this repo prepared in V3 (and what it did NOT)

Prepared:
- `/go/telegram` is now personalised — reads `token / result_type / secondary`
  from localStorage and shows the scenario card before the user clicks
  "Открыть Telegram".
- Bridge fires `TelegramIntentClicked` so we can measure click-through.
- Tracking has a documented `leadHook_PLACEHOLDER` so the wiring point is
  obvious.
- This document defines the exact payload + endpoint shape.

NOT done (intentional, requires owner go-ahead):
- KV namespace not created.
- `/api/mirror-session` Pages Function not added.
- Bot code not touched.
- Meta CAPI access token not requested.
- Bridge `Lead` fallback not enabled.

Single command to unlock all of the above:
**owner approves Worker + KV creation and gives a CAPI access token.**
