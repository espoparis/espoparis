# Phase 20 — Teacher Gradebook & Assessment Workflow

## Decision
Teachers should not edit the central student database directly. The preferred low-cost model is:

Teacher Portal → authenticated write request → Apps Script → protected Google Sheets → Academic Officer review → publish → Student Portal.

Google Sheets remains the operational store in the first phase, but the teacher sees a purpose-built gradebook rather than a raw spreadsheet.

## Why this model
- No dedicated server is required in phase one.
- Teachers only see the students and courses assigned to them.
- Input validation happens before data is stored.
- Draft grades cannot leak to students.
- Academic officers retain final publication authority.
- All sensitive changes can be written to an audit log.
- The storage layer can later be migrated to a database without redesigning the teacher/student UI.

## Grade lifecycle
Draft → Submitted by Teacher → Reviewed/Approved by Academic Officer → Published → Visible to Student.

Teachers may correct draft/submitted work. Publishing is intentionally restricted to Academic Officer/Admin.

## Attendance
The teacher gets a fast per-session roster with Present / Absent / Excused / Late. The portal writes entries to the Attendance sheet through Apps Script. No direct student-facing access to the raw sheet.

## Assessment plan
Each course can define assessment items such as assignments, quizzes, midterm, final, participation, or other. Weights must total 100% before a final average is accepted.

## Storage sheets
The initial Google Workspace backend uses:
- Course Offerings
- Assessments
- Gradebook
- Attendance
- Academic Audit Log

These can live in one protected Academic Records spreadsheet owned by the institutional Workspace account.

## Student experience
Students see only published results. They never receive spreadsheet access. The Student Portal renders course grades, term average, attendance summary, progression status, and historical results based on their AIC enrollment identity.

## Future migration
When scale justifies it, move the storage repository from Sheets to Firestore/PostgreSQL while preserving the same portal workflow and access policies.
