# Phase 24 — Controlled Academic Writes

## Goal
Give teachers a very easy gradebook/attendance experience while keeping the backing Google Sheets private and controlled. The website is the UI. Google Sheets + Apps Script are the low-cost operational backend until scale justifies a managed database.

## Security boundary
- Teachers do **not** receive editor access to Gradebook/Attendance spreadsheets.
- Students do **not** receive spreadsheet links.
- Browser code does **not** call Apps Script directly.
- Next.js server signs each request with `PORTAL_API_SECRET`.
- Apps Script verifies the signature and then verifies the staff member again against `Staff Access`.
- Teachers can only edit course offerings explicitly assigned to them.
- Academic officers can approve/return/publish, but cannot impersonate teacher draft entry.
- Admin can perform all academic write actions.
- Every mutation writes an audit-log row.

## Sheets
`ensureAcademicSheets_()` provisions:
1. Course Offerings
2. Assessments
3. Gradebook
4. Attendance
5. Staff Access
6. Academic Audit Log

## Staff Access
Columns:
`Email | Role | Active | Allowed Offering Ids`

Example roles:
- `teacher`
- `academic-officer`
- `admin`

Allowed Offering IDs are comma-separated and are required for teachers.

## Grade lifecycle
`draft -> submitted -> approved -> published`

A review can return a submitted/approved/published record to `returned`. A teacher can resubmit after correction. Students receive only `published` grades.

## Idempotency
Grade rows use a stable `Enrollment Id::Assessment Id` key. Saving a draft updates the same row instead of appending duplicates. Attendance uses `Enrollment Id::Lesson Id` for the same reason.

## Student visibility
`student.academic-snapshot` first resolves the verified email against Central Enrollment, then returns only published grades plus attendance associated with that AIC ID. This preserves the existing AIC identity as the academic reference.

## Cost model
No VPS and no dedicated database server are required for this phase. Vercel runs the Next.js site/server functions and Google Workspace stores operational records. Migration to PostgreSQL/Firestore remains possible behind the same service interfaces later.

## Go-live checklist
1. Finish live enrollment repair first.
2. Create a dedicated Academic Records spreadsheet owned by the institutional Workspace account.
3. Deploy Apps Script under an institutional account, not a personal account.
4. Set `ACADEMIC_SPREADSHEET_ID` and `PORTAL_API_SECRET` in Script Properties.
5. Add authorized staff to `Staff Access`.
6. Configure the matching secret and Apps Script Web App URL in Vercel environment variables.
7. Test one teacher, one academic officer, and one test student before enabling production writes.
8. Verify audit rows and student published-only visibility.
