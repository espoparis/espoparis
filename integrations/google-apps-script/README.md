# Google Apps Script integration

This folder is the cost-conscious Google Workspace bridge for the ESPO Paris / Imam Center platform.

## Why it exists

The institution already uses Google Forms, Google Sheets, Drive, Classroom, Meet, and Workspace. The first production stage therefore does **not** require a dedicated VPS or traditional backend server. Next.js stays on Vercel and Google Apps Script performs controlled Workspace-side automation.

## Files

- `enrollment-sync.gs` fixes the multilingual Form -> response Sheet -> central Enrollment Database pipeline, preserves existing `AIC-YYYY-NNNN` IDs, rejects missing-name records, detects duplicate emails, creates student folders, and includes a dry-run/backfill repair for existing records.
- `portal-api.gs` is the read-first bridge for the Student Portal. Keep it disabled until its shared secret and deployment URL are configured.
- `digital-platform.gs` is the signed metadata bridge for the Digital Library and Learning Platform owned by `digital@espoparis.com`.

## Digital Platform activation

Follow `docs/DIGITAL-LIVE-ACTIVATION-RUNBOOK.md`. It is the definitive procedure for spreadsheet provisioning, Script Properties, staff roles, entitlements, deployment, Vercel configuration, acceptance tests, and the private-binary activation gate.

## Safe deployment order

1. Make a copy/backup of the current central Enrollment spreadsheet and Apps Script project.
2. Add the required Script Properties listed at the top of `enrollment-sync.gs`.
3. Run `auditCentralEnrollment()` only. It must not change data.
4. Review the proposed repairs.
5. Install one `onEnrollmentFormSubmit` trigger on each of the six response spreadsheets.
6. Submit one controlled test form per language.
7. Only after all six pass, run `repairCentralEnrollment(true)` to backfill existing incomplete central rows.
8. Verify student folder names and source links.
9. Deploy `portal-api.gs` only after the website-side authentication and API secret are configured.

Never publish the central spreadsheet or student folders to "Anyone with the link".

## Phase 25 enrollment integrity controls
Add `ENROLLMENT_ADMIN_EMAILS` as a comma-separated Script Property containing only authorized enrollment administrators. Live repair through the signed web-app bridge requires both a valid HMAC request and an actor email in this allowlist. The audit action is read-only; the repair action additionally requires the literal confirmation `APPLY-ENROLLMENT-REPAIR`.

The portal bridge now caches request nonces for five minutes and rejects replays inside the signed-request validity window.

## Phase 37 repair safety gate

The live enrollment repair is now deliberately two-step and fail-closed:

1. `auditCentralEnrollment()` produces a read-only repair plan and `auditToken`.
2. Any duplicate central email, duplicate source email, invalid/duplicate AIC ID, missing central record, source parsing error, missing central email, or inaccessible student folder is a **blocker**.
3. No repair may run while blockers exist.
4. The repair call must include the exact `auditToken` from the latest clean audit. If the source/central state changes between audit and repair, the token changes and the repair is rejected as stale.
5. Before the first write, the script automatically copies the central Enrollment spreadsheet to the folder configured by `ENROLLMENT_BACKUP_FOLDER_ID`.
6. Backfill still fills only blank central cells. Existing non-empty administrator values and all existing AIC IDs remain untouched.
7. Folder rename is guarded by the name observed during audit; if it changed meanwhile, it is not overwritten.

Required additional Script Property:

- `ENROLLMENT_BACKUP_FOLDER_ID` — a restricted institutional Drive folder for pre-repair database copies.

The signed portal repair action now requires both:

- `confirmation = APPLY-ENROLLMENT-REPAIR`
- the fresh `auditToken` returned by the immediately preceding clean audit.
