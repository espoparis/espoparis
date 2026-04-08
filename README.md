# Espo Paris Frontend

A public-facing Next.js site for Espo Paris Academy.

## Stack

- `Next.js 14` with the App Router
- `next-intl` for locale routing
- `Resend` for contact form delivery
- `framer-motion` for motion-rich public sections

## Project structure

- `app/`: routes, layouts, route handlers
- `features/marketing`: public page sections and actions
- `components/`: shared layout and UI primitives
- `lib/`: env, site config, constants, validation, and utilities
- `server/email/`: contact email composition and delivery
- `scripts/`: local developer utilities

## Getting started

1. Copy `.env.example` to `.env`.
2. Add Resend credentials if you want the contact form to deliver email in local or production environments.
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev`.

## Useful scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run clean`
- If `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are missing, email notifications are skipped without breaking the app .
