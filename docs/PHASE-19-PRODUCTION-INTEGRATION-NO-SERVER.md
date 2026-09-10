# Phase 19 — Production Integration Without a Dedicated Server

## Objective

Finish the website architecture so the institution can launch and operate the first production stage without renting a VPS or maintaining a traditional backend server.

The design deliberately uses services the institution already owns or already needs:

- **Vercel** — Next.js website and serverless request handlers.
- **Google Workspace** — Forms, Sheets, Drive, Classroom, Meet and institutional accounts.
- **Google Apps Script** — trusted automation next to the Workspace data.
- **Resend or approved institutional email provider** — magic-link and transactional email only when enabled.

A future database/CDN migration remains possible because the website uses repository and integration interfaces rather than reading Google Sheets directly from UI components.

## Source-of-truth boundaries

### Admissions

`Google Forms -> language response Sheets -> Central Enrollment Database`

The Central Enrollment Database owns the applicant/application truth and existing `AIC-YYYY-NNNN` identifier. The website must never issue a second competing academic identity.

### Website identity

The website creates a private internal user UUID only for authentication/session relationships. When a verified email matches an accepted/active application, that user UUID is linked to the existing AIC application/student identity.

### Academic operations

Grades, attendance, progression, curriculum versions and audit events are separate academic records. They reference the AIC identity and the website internal user ID but do not overwrite the original admission submission.

### Learning files

The Student Portal is the experience layer. Google Classroom remains the live teaching/communication layer. Google Drive stores recordings/resources in Stage 1. The student should not be forced to browse Drive folders manually.

### Library

Digital Library contains books only. Course handouts and recorded lessons remain under Learning.

## No-dedicated-server request path

```text
Browser
  -> Vercel / Next.js
      -> signed server session
      -> Google Apps Script bridge
          -> Google Sheets / Drive / Classroom
```

No Google Sheet is published publicly. No Drive folder is configured as "Anyone with the link" for private academic content.

## Enrollment repair

The currently observed failure is not in the Forms. Source language Sheets contain the full applicant name and other fields, while Central Enrollment rows currently retain mainly Application ID, date/language, email, status and folder URL. Because the full name is missing centrally, the archive folders become `AIC-... - Unknown Student`.

The included `integrations/google-apps-script/enrollment-sync.gs` fixes the pipeline by:

1. Normalizing all six response languages to one canonical field order.
2. Refusing to create a record if full name or valid email is missing.
3. Locking ID generation and central writes.
4. Preserving the existing `AIC-YYYY-NNNN` format.
5. Rejecting duplicate central email records instead of silently creating duplicates.
6. Creating a named student folder.
7. Creating Drive shortcuts to uploaded files rather than copying file bytes.
8. Providing a dry-run audit and controlled backfill for existing incomplete rows.
9. Preserving non-empty administrator-edited central values during repair.

## Student account lifecycle

```text
Sign in with Google / email magic link
  -> identity verified
  -> internal user UUID created
  -> Central Enrollment lookup by verified email
      -> no matching accepted record: Member
      -> accepted/active match: link to AIC ID -> Student
```

An account is not itself an academic enrollment.

## Academic progression

Progression remains human-approved and system-executed:

1. Teachers submit grades/attendance.
2. Authorized academic officer reviews and publishes results.
3. System computes eligibility/recommendation.
4. Academic authority approves promotion.
5. Old level is closed and kept historically.
6. New level/semester is activated.
7. Course entitlements and Classroom mappings are updated automatically.

The system must not auto-promote solely because a date changed.

## Payments and donations

Stage 1 supports:

- Free
- Contact for price
- Offline/manual payment with administrator confirmation
- Fixed online price when a provider is approved
- Donation/custom amount

A browser success page never grants paid access. Entitlements require a verified payment event or an authorized offline confirmation.

## Upgrade triggers

Do **not** migrate merely because a larger architecture looks fashionable. Reassess a managed database/video service when one or more become true:

- Sheet/App Script response time materially affects the portal.
- concurrent administrative writes cause lock contention;
- academic history grows beyond comfortable operational review in Sheets;
- reporting/query requirements become relational and complex;
- video traffic makes Drive delivery unsuitable;
- stronger transactional guarantees are required for payments/grades at scale.

At that point the repository boundaries allow migration to Firestore/Postgres/object storage/video streaming without replacing the website UI.

## Launch blockers still requiring credentials/administrative action

- Google OAuth client ID/secret and approved redirect URLs.
- Session secret.
- Apps Script deployment URL + shared integration secret.
- Final Apps Script backup/audit and six-language controlled submission test.
- Academic policies such as grading scale, attendance threshold and promotion rules if the administration has not formally approved them.
- Payment provider only when the institution selects one.
- Switch the ChatGPT Drive connection back to `digital@espoparis.com` only after Enrollment repair and verification are finished.
