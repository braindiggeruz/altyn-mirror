# Meta Ads — Audiences playbook for ALTYN Mirror

This document lists the **Custom Audiences** and **Lookalikes** to build in
Meta Ads Manager so the existing campaign can scale on real intent signals
rather than raw clicks / visits.

All audiences are based on the events the site already fires through the
Pixel + CAPI:

| Event                       | Source              | Standard? | Server-side (CAPI) |
|-----------------------------|---------------------|-----------|--------------------|
| `PageView`                  | Pixel base          | standard  | no                 |
| `ViewContent`               | Landing             | standard  | no                 |
| `StartMirror`               | Quiz start          | custom    | no                 |
| `AnswerScene`               | Each scene          | custom    | no                 |
| `MirrorCompleted`           | Quiz finished       | custom    | **yes**            |
| `ResultViewed`              | `/result/[slug]`    | custom    | no                 |
| `OwnerDirectIntentClicked`  | Click → @Altyn2304  | custom    | **yes**            |
| `Contact`                   | Click → @Altyn2304  | standard  | **yes**            |
| `TelegramIntentClicked`     | Click → bot         | custom    | no                 |

> `Lead` / `Purchase` / `InitiateCheckout` are **NEVER** fired client-side.
> `Lead` is reserved for the Telegram backend (`/start am_<token>` → CAPI).

---

## 1. All website visitors — 180d

- **Source**: Website / Pixel
- **Definition**: `All website visitors` (i.e. any `PageView`)
- **Retention**: 180 days
- **Use**: Broad retargeting upper-funnel video / carousel reminders.

## 2. StartMirror — 180d

- **Source**: Website / Pixel
- **Definition**: Custom event `StartMirror`
- **Retention**: 180 days
- **Use**: Re-engage people who began the quiz but didn’t finish.
- **Exclude**: audience #3 (MirrorCompleted) for cleaner retarget.

## 3. MirrorCompleted — 180d

- **Source**: Website / Pixel + CAPI (deduped via `event_id`)
- **Definition**: Custom event `MirrorCompleted`
- **Retention**: 180 days
- **Use**: Warm audience — they finished the map but may not have clicked
  through to Алтын. Show the personal-session offer.

## 4. ResultViewed but NOT OwnerDirectIntentClicked — 30d

- **Source**: Website / Pixel
- **Definition**:
  - Include: `ResultViewed`
  - Exclude: `OwnerDirectIntentClicked`, `Contact`
- **Retention**: 30 days
- **Use**: Hottest near-conversion audience that hesitated on the result
  page. Ideal for testimonial / objection-handling creative and a
  time-boxed CTA.

## 5. OwnerDirectIntentClicked / Contact — 180d

- **Source**: Website / Pixel + CAPI
- **Definition**: `OwnerDirectIntentClicked` OR `Contact`
  (both share `content_name = altyn_mirror_owner_direct`).
- **Retention**: 180 days
- **Use**: Exclude from acquisition campaigns to stop spending on people
  who already reached out. Also a seed for lookalike #7.

## 6. Instagram engagers — 365d

- **Source**: Meta sources → Instagram account
- **Definition**: Anyone who engaged with the IG profile, posted content,
  saved or shared a post, or sent a DM.
- **Retention**: 365 days
- **Use**: Cross-platform retargeting and lookalike seed when web volume is
  low.

## 7. Lookalike 1–3% from OwnerDirectIntentClicked / Contact

- **Country**: same geo as the active campaign.
- **Source audience**: audience #5 (`OwnerDirectIntentClicked / Contact`).
- **Sizes**: build 1%, 1–3%, 3–5% — let Advantage+ choose at the ad-set
  level.
- **Prerequisite**: source audience must reach **≥ 500–1,000 events** to
  be useful. Until then, stay with audience #8.

## 8. Lookalike from MirrorCompleted

- **Source audience**: audience #3 (`MirrorCompleted`).
- **Sizes**: 1% and 1–3%.
- **Use**: bridge lookalike while audience #5 is still volume-poor.
  Quality is lower than #7 but signal is strong because the user
  completed a multi-step quiz, not just visited.

---

## Match-quality checklist

The CAPI worker (`functions/api/capi.ts`) forwards, in addition to
`event_id` (browser/CAPI dedupe):

- `client_user_agent`
- `client_ip_address` (Cloudflare `cf-connecting-ip`)
- `fbp` (`_fbp` cookie; client-side payload fallback if cookies are
  partitioned)
- `fbc` (`_fbc` cookie or synthesised from `fbclid` when missing)
- `external_id` (SHA-256 of the anonymous `session_id`, never an email /
  phone / name / telegram username / token).

These fields raise Meta’s event match quality (EMQ) score, which directly
improves how well lookalikes #7 and #8 are seeded.

## Things we deliberately do NOT do

- We never fire `Lead`, `Purchase`, `InitiateCheckout` from the website.
- We never send PII (email, phone, name, telegram username, raw token) to
  Meta — neither in `custom_data` nor `user_data`.
- We never fire `Contact` on `PageView`, `ResultViewed`, `MirrorCompleted`,
  or `/result` page-load. `Contact` is reserved for the real click on the
  direct CTA to @Altyn2304.
