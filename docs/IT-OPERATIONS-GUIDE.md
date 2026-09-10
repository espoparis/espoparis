# ESPO Paris / Imam Center — IT Operations Guide

## System map

### `enrollment@espoparis.com`
Owns admissions intake: Forms, language response Sheets, Central Enrollment Database and applicant archive.

### `digital@espoparis.com`
Owns Digital Library and Learning storage structure. It must not own the admissions source of truth.

### Website
Next.js/Vercel provides the public institution website, Student Portal and Academic Control Center.

## Daily administration

- Admissions team reviews new central applications and changes application status.
- Teachers work in Classroom/Meet and submit academic data within their authorized scope.
- Academic officers publish grades and approve progression.
- Finance confirms authorized offline payments or reviews provider events.
- Editors manage public content; they do not gain access to grades/payments merely because they can edit website copy.

## Semester close

1. Freeze/close lesson delivery for the period.
2. Collect outstanding grades and attendance.
3. Resolve incomplete/exception records.
4. Academic officer publishes final results.
5. Generate progression recommendations.
6. Authorized academic authority approves/rejects progression.
7. Activate the next semester/level only after approval.
8. Preserve the previous curriculum/version and grades as immutable history.
9. Update Classroom memberships/course mappings.

## Curriculum changes

Never edit history in place. Create a new curriculum version for the next academic period. Existing students remain attached to the curriculum version under which their record was earned, subject to formal transition rules.

## Security

- Admin routes are non-indexed and must be server-authorized.
- Roles use least privilege.
- Sensitive mutations write an audit event.
- Private Drive resources remain private.
- Secrets belong in Vercel environment variables / Apps Script Properties, never source code.
- Staff account removal must include Workspace access, website role, Drive/Classroom access and integration secret rotation when appropriate.

## Backup

Keep periodic exports/backups of central academic workbooks and configuration. Drive file history is useful but does not replace a deliberate recovery procedure.
