# ESPO / Imam Center — Go-Live Checklist

## Enrollment
- [ ] Verified backup exists.
- [ ] Corrected future-sync Apps Script is deployed.
- [ ] Six-language controlled submissions tested.
- [ ] Historical backfill reviewed and applied.
- [ ] `Unknown Student` folders resolved only from verified source records.
- [ ] Post-repair integrity audit is clean.

## Identity
- [ ] Institution-owned Google OAuth client created.
- [ ] Approved callback URLs configured for preview and production.
- [ ] Session secret stored only in Vercel environment variables.
- [ ] Email fallback uses expiring one-time tokens backed by persistent storage before activation.
- [ ] Accepted/active enrollment linking tested.
- [ ] Unmatched-email workflow tested.

## Academic operations
- [ ] Staff Access roles approved.
- [ ] Course offerings assigned to teachers.
- [ ] Grade Draft -> Submitted -> Approved -> Published tested.
- [ ] Student cannot see Draft/Submitted/Approved-only grades.
- [ ] Attendance upsert tested without duplicate rows.
- [ ] Audit log records actor, action, target and timestamp.
- [ ] Progression remains approval-based.

## Public launch
- [ ] Official address confirmed or omitted.
- [ ] Final institutional/legal name confirmed for SEO or current conservative naming retained.
- [ ] No unapproved credits/hours or unconfirmed subjects published.
- [ ] No fabricated books, news, activities or faculty biographies published.
- [ ] Support/donation contact verified.

## Digital handoff
- [ ] Enrollment checkpoint signed off.
- [ ] Switch Drive connector to `digital@espoparis.com` only now.
- [ ] Audit Library and Learning folder structure.
- [ ] Connect book catalog separately from course lessons/recordings.
