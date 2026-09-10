# Phase 36 — Live CMS Storage & Publishing

## Goal
Move website news, activities, announcements, and the daily verse/hadith rotation from UI-only foundations to a production-ready storage boundary without introducing a dedicated VPS.

## Architecture

Browser → Next.js/Vercel server action → HMAC-signed request → Google Apps Script Web App → Google Sheets

The browser never receives the Apps Script shared secret and never writes directly to Sheets.

## Storage
`integrations/google-apps-script/cms.gs` provisions one institution-owned spreadsheet with:

- `CMS Content`
- `CMS Reflections`
- `CMS Audit Log`

Run `provisionCmsWorkspace()` once in the Apps Script project, then set:

- Script Property `CMS_API_SECRET`
- Vercel `CMS_API_URL`
- Vercel `CMS_API_SECRET`

The secret must be at least 32 characters and must never be committed to Git.

## Permissions
- Editor: create/edit/review/schedule content; manage unapproved reflections.
- Master Admin: editor permissions plus final publish, approval, permanent delete.
- Public visitors: read only content returned by `cms.public.snapshot` after server-side filtering.

Permission checks exist both in Next.js and Apps Script.

## Publishing rules
Content follows controlled transitions:

Draft → Review → Scheduled/Published → Archived

Final `published` state is restricted to Master Admin. Permanent deletion is also Master Admin only.

## Daily verse / hadith
- Arabic text and source attribution are mandatory.
- Entries are not public until approved.
- Normal entries rotate deterministically by UTC day.
- Occasion entries can use higher priority plus active date ranges.
- No verse or hadith is generated automatically by the system.

## Public integration
- `/activities` now reads published news/activities/announcements from the CMS bridge.
- The homepage displays the selected approved daily verse/hadith when one exists.
- If CMS is not configured or is unavailable, the site shows no fabricated content and existing public empty states remain safe.

## Activation gate
Phase 36 code is complete locally, but live storage remains intentionally disabled until the institution deploys the Apps Script Web App and configures Vercel secrets. This is an operational gate, not a code placeholder.
