# RC2 activation and release state

Source base: RC1 ec7d4a2, on design-refinement-2026.

## Verified external access

On 2026-09-12 the Drive connector returned digital@espoparis.com. The expected
03 - Catalog & Metadata folder was found; its child search returned no files.
A search for CMS returned no matching files. These observations do not prove
that no other database exists elsewhere, but activation cannot be marked done.
No Drive file or live Apps Script project was changed by this task.

On 2026-09-13 Vercel connector access was available. list_teams returned an empty
array; listing projects with a personal/empty team scope failed. No project ID,
project settings or environment configuration was accessible. No local Vercel
project linkage or deployment token was present. Deployment was not performed.

## Prepared activation sequence

1. Identify the Vercel account/team that owns espoparis.com and the matching
   espoparis/espoparis project. Preserve its existing domains and settings.
2. Identify existing CMS and digital Apps Script projects and spreadsheets
   before provisioning anything. Do not duplicate existing production databases.
3. CMS: deploy the updated integrations/google-apps-script/cms.gs in its own
   Apps Script project. Preserve CMS_API_SECRET and CMS_SPREADSHEET_ID. If no
   CMS database exists, provisionCmsWorkspace() creates it. Run
   provisionCmsMedia() once to set CMS_MEDIA_FOLDER_ID and create private media
   storage. Grant that project's owner the Drive access required by the new
   upload/read functions. The original CMS credential scope alone may be
   insufficient until the owner completes authorization.
4. Digital: follow DIGITAL-LIVE-ACTIVATION-RUNBOOK.md for the existing catalog
   folder, spreadsheet, allowlists and credentials. Update digital-platform.gs
   in its separate project. Do not combine the two doPost implementations.
5. Configure the existing Vercel project's preview environment with CMS_API_URL,
   CMS_API_SECRET and its existing DIGITAL_* and GOOGLE_OAUTH_* configuration.
   Values must remain private. AUTH_BASE_URL and authorized OAuth callback must
   match the preview sign-in environment. Never reuse production data for
   destructive preview tests without an explicit plan.
6. Deploy the exact reviewed branch candidate as a preview. Upload one test
   activity/poster, save/review/publish, verify visible content, then hide it.
   Test a book draft/review/publish/archive, and a profile override and approved
   daily text. Use authored test text, not invented scripture or biographies.
7. Verify admin access, student/teacher access and secure asset delivery with
   the existing roles. Then assess whether the production domain may be moved
   to this candidate. Preserve the previous deployment for rollback.

## Important operational limits

- Images: browser prepares JPEG, max 1 MiB after preparation; no SVG/GIF.
- Direct PDF upload: 3 MiB. Larger PDFs use the existing books Drive folder and
  a pasted Drive URL. The 4 MB Server Action cap is intentional.
- Archiving a book removes it from publication; it does not delete its Drive PDF.
- CMS permanent deletion deletes the record, not the Drive media file.
- Faculty overrides edit existing members, per locale. No automatic translation.
- A backend connection indicator is not a substitute for an actual upload test.
