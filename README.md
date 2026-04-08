# Espo Paris Frontend

Single-app Next.js rebuild powered by Supabase Auth, Postgres, and Storage.

## Stack

- `Next.js 14` with the App Router
- `Supabase Auth` for sessions and approval-gated roles
- `Supabase Postgres` with SQL migrations
- `Supabase Storage` for avatars, thumbnails, and private course media
- `next-intl` for locale routing

## Project structure

- `app/`: routes, layouts, route handlers
- `features/`: domain-focused forms, actions, and feature UI
- `components/`: shared layout and UI primitives
- `lib/`: env, Supabase clients, constants, validation, shared types
- `server/queries/`: read-side data composition
- `server/repositories/`: write-side persistence helpers
- `server/permissions/`: reusable server authorization checks
- `server/services/`: cross-feature dashboard aggregation
- `server/storage/`: path rules and signed/public URL helpers
- `supabase/`: config, migrations, and seed/bootstrap notes
- `scripts/`: local developer utilities

## Getting started

1. Copy `.env.example` to `.env` and set your Supabase keys.
2. Add Resend credentials if you want transactional email notifications in local or production environments.
3. Install dependencies with `npm install`.
4. Start local Supabase with `npm run supabase:start`.
5. Reset the local database with `npm run supabase:reset`.
6. Generate fresh types with `npm run supabase:types`.
7. Start the app with `npm run dev`.

## Useful scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run clean`
- `npm run supabase:start`
- `npm run supabase:stop`
- `npm run supabase:status`
- `npm run supabase:reset`
- `npm run supabase:types`
- `npm run supabase:promote-admin -- --email admin@example.com`

## Bootstrap notes

- Sign up the first user normally.
- Promote that user with `npm run supabase:promote-admin -- --email you@example.com`.
- Sign out and sign back in to load the updated admin role.
- If `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are missing, email notifications are skipped without breaking the app.
