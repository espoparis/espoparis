# Phase 37 — Enrollment Live Repair Runbook

## Objective

Repair the existing six-language enrollment pipeline without changing existing AIC identifiers, overwriting administrator-edited values, or guessing ambiguous applicant matches.

## Hard rule

Do not run the write repair until the dry-run audit reports `canApply: true` and `blockers: []`.

## Production sequence

1. Confirm the Apps Script project is owned by the institutional enrollment account.
2. Configure the central spreadsheet, archive folder, six source spreadsheet IDs, administrator allowlist, API secret, and restricted backup folder as Script Properties.
3. Deploy the updated future-sync code before backfilling historical rows.
4. Install/verify exactly one form-submit trigger for each of the six language response spreadsheets.
5. Submit one controlled test application in Arabic, English, French, Persian, Turkish, and Azerbaijani.
6. Verify each test arrives in `Applications` with full name, email, language and remaining mapped fields, and receives one AIC ID and correctly named student folder.
7. Run the **read-only** audit.
8. Resolve every blocker manually. Never auto-merge duplicate emails or duplicate AIC IDs.
9. Run the audit again and retain the returned `auditToken`.
10. Apply repair using the exact confirmation phrase and that exact token.
11. The repair automatically creates a pre-write copy of the central spreadsheet in `ENROLLMENT_BACKUP_FOLDER_ID`.
12. Re-run the audit. It must report no missing names caused by the old mapping bug and no `Unknown Student` folder issue for repairable rows.
13. Spot-check every repaired AIC record against its original language response row.
14. Only after this checkpoint passes may website account linking be enabled.

## Stop conditions

Stop and investigate if any of these appear:

- duplicate source email;
- duplicate central email;
- duplicate/invalid AIC ID;
- source row missing a valid email or full name;
- source response with no central record;
- inaccessible student folder;
- stale audit token;
- backup creation failure.

These are not conditions the software should "cleverly" guess through.

## Current limitation in this working session

The Google Drive connector is unavailable, so this phase prepares and tests the production-safe repair path but does **not** claim that the live institutional Sheets or Apps Script deployment were modified.
