# Phase 13 — Authentication & Student Portal Foundation

## Goal
Create the application boundary for student accounts without pretending authentication is live before Google OAuth credentials and an approved identity policy exist.

## Current state
- `/student` exists as the future authenticated student area.
- The current server session adapter is deliberately anonymous.
- No email, query parameter, localStorage value, or client-provided role is trusted as identity.
- Role policy is centralized and tested.
- The portal UI exposes the intended product structure without exposing private course data.

## Roles
- visitor: unauthenticated public visitor
- member: authenticated registered user
- student: enrolled learner
- teacher: teaching staff
- editor: content administrator
- admin: platform administrator

## Authentication target
Recommended first production provider: Google OAuth / OpenID Connect, with Workspace accounts for staff. Student identity policy must still be confirmed because students may use external Gmail or other addresses.

### Do not assume domain-only login for students
`@espoparis.com` should be required for privileged staff roles where appropriate, but the platform should not require every student to own an institutional Google account unless administration explicitly chooses that policy.

## Required before enabling Sign in
1. Create/approve a Google Cloud project under institutional control.
2. Configure OAuth consent screen and authorized domains.
3. Add localhost + Vercel preview + production callback URLs.
4. Store client ID/secret only in server-side environment variables.
5. Implement provider callback and signed server session.
6. Persist users/roles in the application database.
7. Map enrollment/purchases to entitlements.
8. Add audit logging for role and access changes.

## Security rule
Google Drive permissions are never the source of truth for purchases or enrollment. The application database owns entitlement state. Drive remains a storage/access adapter in Phase 1.
