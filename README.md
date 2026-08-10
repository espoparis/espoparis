# Espo Paris Frontend

A public-facing Next.js site for Espo Paris Academy, presenting the work of
Imam (AJ) Center – Paris.

## Stack

- `Next.js 14` with the App Router
- `next-intl` for locale routing (`en`, `fr`, `ar`, `fa` — `ar` and `fa` are RTL)
- `Resend` for contact form delivery
- `framer-motion` for motion-rich public sections

## Project structure

- `app/`: routes, layouts, metadata routes
  - `app/layout.tsx` is a pass-through; `app/[locale]/layout.tsx` owns
    `<html lang dir>` so each locale renders with the correct language and
    writing direction
- `features/marketing`: public page sections, the contact action, and the About
  content reader
- `components/`: shared layout and UI primitives
- `lib/`: env, site config, constants, validation, and utilities
- `messages/`: **all** user-facing copy, per locale — `en.json` is the source of
  truth for both content and shape
- `server/`: contact email composition/delivery and the submission rate limiter
- `scripts/`: local developer utilities

## Getting started

1. Copy `.env.example` to `.env`.
2. Add Resend credentials if you want the contact form to deliver email.
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev`.

## Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Origin used for canonicals, hreflang, sitemap, and OG tags. **Read at build time** — set it per environment. Falls back to `https://www.espoparis.com`. |
| `RESEND_API_KEY` | Optional | Absent ⇒ email delivery is skipped, the app still runs. |
| `RESEND_FROM_EMAIL` | Optional | Required alongside the API key for delivery. |
| `RESEND_REPLY_TO_EMAIL` | Optional | Fallback reply-to; contact notifications reply to the enquirer instead. |

> Set `NEXT_PUBLIC_SITE_URL` to the production origin in the production
> environment. A build that inherits a local `.env` will emit `localhost`
> canonical URLs and sitemap entries.

## Translations

All copy lives in `messages/<locale>.json`. There is no hardcoded user-facing
string in a component — add the key to `messages/en.json` first, then to every
other locale.

`npm test` runs `scripts/check-messages.mjs`, which fails the build if any locale
is missing a key, has an extra key, disagrees on a value's type, has a different
array length, or contains an empty string.

## Useful scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm test` — message parity plus unit tests for email escaping and rate limiting
- `npm run test:messages` — message parity only
- `npm run clean`

## Registration

`/register` embeds the seminary's Google Form. Both the embed URL and the
open-in-new-tab fallback URL live in `siteConfig.registration` — change them
there, not in the component. The fallback exists because privacy extensions
routinely block third-party iframes.

## Faculty portraits

Portraits live in `public/faculty/` and are mapped by a stable `id` in
`features/marketing/faculty-images.ts` — deliberately not in `messages/*.json`,
since an image path is not translatable content. Faculty without an entry render
as a name-and-role card with an icon, so adding a portrait later is a one-line
change and no scholar is ever shown with someone else's photograph.

## Styling gotcha

`tailwind.config.js` `content` globs must list **every** directory that writes
Tailwind classes. `features/` was missing for a long time, which silently purged
the classes used by every public page section — headings rendered at body size,
card surfaces lost their borders. Nothing failed: not the build, not typecheck,
not lint. `npm test` now runs `scripts/check-tailwind-content.mjs`, which fails
if a directory using `className` is not covered by a glob.

## Known content gaps

These are placeholders that need real values before launch:

- Postal address, phone number, and the three `@espoparis.com` mailboxes in
  `lib/site-config.ts`
- **The About page gallery is generic Western corporate stock photography** —
  a woman at a laptop, an office meeting, a smartwatch close-up. It reads badly
  on a seminary page and should be replaced with real photographs of the hawza
  or the section removed. It lives in `app/[locale]/about/page.tsx`.
- Four of the seven faculty have no portrait yet (Shami-Zadeh, al-Kanawi,
  Abu Fatimah, Mujtaba al-Khaliq, al-Nasiri)
