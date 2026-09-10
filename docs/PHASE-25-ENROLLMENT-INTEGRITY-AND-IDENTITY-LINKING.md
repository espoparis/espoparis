# Phase 25 — Enrollment Integrity & Identity Linking

## Purpose
Phase 25 hardens the real enrollment integration before any production repair or student account linking is enabled. It keeps the existing Google Forms → language response sheets → central Applications database architecture and preserves every existing `AIC-YYYY-NNNN` identity.

## Key controls
- Six source response sheets remain raw evidence.
- Central `Applications` remains the administrative enrollment source of truth.
- Account creation does not create a second student record.
- Verified email is the matching key; only accepted/active records are eligible for automatic linking.
- Repair is dry-run first. Live repair requires an authorized enrollment administrator and explicit confirmation.
- Existing non-empty administrator edits are not overwritten by backfill.
- Student folders are renamed only after a verified source name is recovered.

## Security hardening
The Next.js ↔ Apps Script signed-envelope protocol now signs actor identity consistently. Apps Script rejects replayed nonces during the request-validity window. Enrollment repair operations require the caller email to exist in `ENROLLMENT_ADMIN_EMAILS` Script Property.

## Production sequence
1. Back up the central spreadsheet.
2. Configure source IDs and archive folder in Script Properties.
3. Run `auditCentralEnrollment()` and inspect proposals.
4. Submit one test response in each language.
5. Confirm all canonical fields arrive in `Applications`.
6. Run live backfill only with explicit confirmation.
7. Re-run audit; target zero missing-name and unknown-folder issues.
8. Only then enable website account ↔ AIC linking.

## Cost posture
No dedicated server is introduced. The workflow uses existing Google Workspace, Apps Script and the Next.js deployment. Migration to a managed database remains possible later without changing the public/student/teacher interfaces.
