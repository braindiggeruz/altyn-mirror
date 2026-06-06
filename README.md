# ALTYN Mirror — Карта повторяющегося сценария

Premium mobile-first reflection map for women 25–45. **Non-medical** self-reflection / personal-review preparation tool. Meta-safe ad funnel.

> ALTYN Mirror is **not** a medical, diagnostic, psychotherapy, emergency, or treatment service. It is a self-reflection and personal review preparation tool.

## Stack

- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS
- Framer Motion
- Meta Pixel (custom events only — no Lead on homepage)
- Telegram bridge → `@altyntherapybot`
- Cloudflare Pages

## Scripts

```bash
yarn install
yarn dev         # local dev on port 3001
yarn build       # static export → ./out
yarn lint
yarn risk-grep   # fails if Meta risk words appear in shipped HTML
```

## Project layout

```
src/
  app/                # App Router pages
    page.tsx          # Hero (/)
    play/             # /play — 7-scene mirror flow
    result/[slug]/    # /result/<type> — result map
    go/telegram/      # Telegram bridge
    privacy|terms|contact|disclaimer/
  components/
  lib/
    i18n/             # ru.ts, uz.ts dictionaries (RU default, UZ best-effort placeholders)
    scenes.ts         # 7 cinematic scenes + answer→result mapping
    results.ts        # 5 result archetypes
    scoring.ts        # deterministic scoring + tie-breakers
    tracking.ts       # Meta Pixel + custom events
    token.ts          # am_<token> generator
    storage.ts        # localStorage helpers
    utm.ts            # UTM / fbclid capture
```

## Result types

`mayatnik`, `tuman`, `dogonyayu`, `iskra`, `dver`

## Meta safety

- Ad-facing copy uses situational language ("иногда отношения идут по кругу", "карта могла откликнуться").
- 0 risk words on `/`. Verify with `yarn risk-grep`.
- No `Lead` event on homepage. Lead is wired only on `/go/telegram` as fallback (see comments in `lib/tracking.ts`).

## Deploy

Cloudflare Pages, project `altyn-mirror`, output dir `out/`, build command `yarn build`.

## What this repo does NOT touch

`altyn-therapy.uz`, `altyn-meta-new.pages.dev`, the bot code, VPS, CRM, TORNADO, DNS, Google Ads.
