# Phase 26 — Production Enrollment Deployment & Activation Gates

This phase converts the preceding architecture into an explicit go-live sequence. It does **not** claim that production OAuth, live Apps Script deployments, or live repairs have already been executed.

## Principle

No live feature is enabled merely because its UI exists. Student account linking, teacher writes, grade publication, and automated progression each have independent activation gates.

## Zero-dedicated-server first architecture

- **Vercel / Next.js**: public site, protected portal UI, server actions and signature generation.
- **Google Workspace**: Forms, response Sheets, Central Enrollment Database, academic Sheets, Drive and Classroom/Meet ecosystem.
- **Google Apps Script**: controlled bridge and automation layer.
- **Resend**: existing email transport where configured.
- No VPS or traditional backend server is required for the first production stage.

## Enrollment source of truth

`Al Imam Center – Enrollment Database 2026-2027 / Applications` remains the canonical admissions record for the current intake. Language response Sheets are raw intake sources, not independent student registries.

Existing `AIC-YYYY-NNNN` identities are preserved.

## Live repair sequence

1. Export/duplicate a recoverable backup of the Central Enrollment Database and verify it opens.
2. Run the six-language audit in dry-run mode.
3. Review every proposed field backfill and folder rename.
4. Verify no duplicate AIC identity would be created.
5. Deploy the corrected Apps Script mapping so future submissions are fixed before repairing history.
6. Submit one controlled test per supported enrollment language.
7. Confirm full name, email, DOB, education fields, prior hawza study, language, uploads, location and phone arrive in Central DB.
8. Apply the controlled historical backfill only with an authorized enrollment administrator.
9. Rename only folders whose AIC identity is already known and whose resolved name comes from the matching source submission.
10. Re-run the audit. Student linking remains disabled unless the post-repair audit is clean.

## Account-linking activation

Account creation is never the same as academic enrollment.

1. User authenticates through a production-grade identity provider.
2. Email must be verified.
3. Server normalizes the email.
4. Server locates exactly one canonical enrollment record.
5. Enrollment must be `Accepted` or `Active`.
6. Enrollment must contain a valid name and must not already be linked to another account.
7. Existing AIC ID is attached to the website user identity.
8. The portal grants the `student` role and derives current academic access from the linked enrollment.

If any step fails, the account stays a normal member and is sent to an administrative unmatched-account workflow. No duplicate student record is created.

## Academic-write activation

Teacher/academic write actions remain disabled until:

- production authentication is active;
- signed Apps Script bridge is active;
- `Staff Access` is configured;
- academic Sheets are provisioned;
- at least one teacher/offering assignment is tested end-to-end;
- audit logging is verified.

## Environment variables

Server-only variables. Never prefix secrets with `NEXT_PUBLIC_`.

- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `AUTH_SESSION_SECRET`
- `AUTH_BASE_URL`
- `ENROLLMENT_API_URL`
- `ENROLLMENT_API_SECRET`
- `ACADEMIC_API_URL`
- `ACADEMIC_API_SECRET`
- existing Resend variables where email is enabled

Apps Script properties should include the corresponding signing secret and explicit authorized staff/enrollment-admin identities. Secrets are never stored in Sheets or committed to Git.

## Rollback

If any production verification fails:

1. Disable the affected integration/action in Vercel environment configuration.
2. Do not delete historical rows.
3. Restore Central Enrollment data only from the verified backup when necessary.
4. Keep the AIC identity sequence stable.
5. Correct the source mapping/deployment before replaying any failed submission.
6. Record the incident in the administrative audit log.

## Digital Drive handoff

Do not switch the ChatGPT Google Drive connection to `digital@espoparis.com` until the live Enrollment repair and post-repair audit are complete. After that checkpoint the work moves to Digital Library (books only), Learning recordings/resources, and storage-delivery integration.
