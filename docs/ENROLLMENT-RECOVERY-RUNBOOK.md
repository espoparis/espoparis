# Enrollment Recovery Runbook

This runbook protects the existing live admissions system while correcting the current incomplete central records.

## Rule 1 — Never repair the central rows first

Fix the source automation before backfilling old rows. Otherwise the next form submission will reproduce the same defect.

## Rule 2 — Preserve current AIC IDs

Existing IDs are institutional identifiers and must not be renumbered merely because data fields are being repaired.

## Safe procedure

1. Export/copy the central workbook and existing Apps Script project as a backup.
2. Record the six source response spreadsheet IDs as Script Properties.
3. Record the central workbook ID and student archive folder ID as Script Properties.
4. Install the replacement normalization logic but do not enable production triggers yet.
5. Run `auditCentralEnrollment()` and inspect output. It is read-only.
6. Use one controlled test submission in each language.
7. Confirm all 18 central columns map correctly.
8. Confirm the folder name contains the AIC ID and applicant full name.
9. Confirm uploaded certificate/photo/identity references are reachable only by authorized staff.
10. Enable the six installable `onEnrollmentFormSubmit` triggers.
11. Run `repairCentralEnrollment(true)` once to fill currently missing central fields.
12. Verify the repaired rows manually against each language response Sheet.
13. Verify that `Unknown Student` archive folders were renamed correctly.
14. Run duplicate checks on email and Application ID.
15. Only then connect the Student Portal lookup bridge.

## What the repair must not do

- delete source Form responses;
- change existing AIC IDs;
- replace a non-empty administrator-edited central field with source data;
- make private uploads public;
- create a second applicant record for the same email automatically;
- infer acceptance from the existence of a Form response;
- promote a student academically.
