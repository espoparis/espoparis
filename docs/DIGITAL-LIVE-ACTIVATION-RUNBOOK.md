# ESPO Paris Digital Platform live-activation runbook

This is the definitive activation procedure for the Digital Library and Learning Platform owned by `digital@espoparis.com`. Complete it manually only when production configuration is authorized. Never paste secrets into source control, tickets, screenshots, or this document.

## 1. Create the metadata spreadsheet

1. Sign in to Google Workspace as `digital@espoparis.com`.
2. Open **03 - Catalog & Metadata**, folder ID `1b83CAF_lcV8YrPUFpBKfiyjJ3QfJFQFF`.
3. Create one private Google spreadsheet directly inside that folder.
4. Copy the spreadsheet ID from its URL. Do not move the spreadsheet outside this folder; the bridge checks its direct parent before every operation.

## 2. Create the Apps Script project

1. Open the spreadsheet and choose **Extensions → Apps Script**.
2. Add the complete contents of `integrations/google-apps-script/digital-platform.gs`.
3. Confirm that the Apps Script project is owned and executed by `digital@espoparis.com`.

## 3. Configure Script Properties

Open **Project Settings → Script Properties** and add exactly these properties:

- `DIGITAL_DATABASE_SPREADSHEET_ID`: the spreadsheet ID from step 1.
- `DIGITAL_API_SECRET`: a cryptographically random secret of at least 32 characters.
- `DIGITAL_ADMIN_EMAILS`: comma-separated master-admin email addresses already approved by the institution.
- `DIGITAL_LIBRARY_EDITOR_EMAILS`: comma-separated approved library-editor email addresses.
- `DIGITAL_LEARNING_EDITOR_EMAILS`: comma-separated approved academic-officer email addresses.

The three email properties may contain only verified institutional operators. Do not grant app-level admin through the staff sheet; master-admin authority remains controlled by the Vercel `ESPO_MASTER_ADMIN_EMAILS` allowlist and `DIGITAL_ADMIN_EMAILS` together.

## 4. Provision the sheets

1. Select `provisionDigitalPlatform` in the Apps Script editor and run it once.
2. Approve the minimum requested Drive and Sheets permissions as `digital@espoparis.com`.
3. Confirm these five tabs exist:
   - `Library Catalog`
   - `Learning Catalog`
   - `Digital Staff Roles`
   - `Digital Entitlements`
   - `Digital Audit Log`
4. Verify the header rows exactly match the arrays in `digital-platform.gs`. Do not reorder or rename headers.
5. Protect the header rows and restrict spreadsheet editing to approved institutional operators.

The staff sheet accepts the roles `teacher`, `academic-officer`, `finance`, `editor`, and `admin`, and the states `invited`, `active`, `suspended`, and `departed`. Only `active` non-admin staff receive an effective role from this repository. Admin remains subject to the master-admin allowlist. Do not add sample or invented staff records.

The entitlement sheet records trusted server-side grants. Use stable authenticated user IDs and `book`, `course`, or `lesson` resource kinds. Only rows with status `active` and no expired `ExpiresAt` value grant paid access.

## 5. Deploy the web app

1. Choose **Deploy → New deployment → Web app**.
2. Set **Execute as** to `digital@espoparis.com`.
3. Set access to the narrowest option that accepts server POST requests from Vercel. If domain-only access blocks Vercel, use **Anyone**; every accepted operation still requires the HMAC secret, timestamp, and unused nonce.
4. Deploy and copy the HTTPS URL ending in `/exec`.
5. Record the deployment version and `/exec` URL in the institution’s restricted operations records. Never record the secret beside it.

## 6. Configure Vercel

Add these Production environment variables without exposing their values in build logs:

- `DIGITAL_API_URL`: the HTTPS `/exec` URL.
- `DIGITAL_API_SECRET`: the exact secret from Apps Script.
- `DIGITAL_DELIVERY_SECRET`: a separate random value of at least 32 characters for five-minute delivery authorization tokens.
- `DIGITAL_DRIVE_CLIENT_ID`: the approved Google OAuth client ID used only by the server-side delivery adapter.
- `DIGITAL_DRIVE_CLIENT_SECRET`: the matching OAuth client secret.
- `DIGITAL_DRIVE_REFRESH_TOKEN`: a restricted refresh token issued to `digital@espoparis.com` with read-only Drive access.

Use a separately approved OAuth credential flow for the Drive adapter. Do not reuse a browser session, expose the refresh token to client code, or grant write scope. The existing authenticated admin flow must also have `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `AUTH_SESSION_SECRET`, `AUTH_BASE_URL`, and `ESPO_MASTER_ADMIN_EMAILS` configured.

## 7. Run a safe connectivity check

1. Deploy the reviewed website build to a non-public Vercel preview when deployment is authorized.
2. Sign in with one allowlisted master-admin account.
3. Open `/en/admin/library` and `/en/admin/learning`.
4. Confirm both pages show **Digital bridge connected** and return counts without changing spreadsheet data.
5. Confirm an unsigned direct POST to `/exec` returns an `ok: false` response.

## 8. Run controlled acceptance tests

Use test files created for this purpose inside the existing Intake and Learning folders. Keep every file private.

1. **Valid admin:** confirm the allowlisted master admin can read both catalogs and perform final publication/archive transitions.
2. **Valid editor:** confirm an allowlisted `editor` can create and edit Library draft/review metadata but cannot publish or archive.
3. **Valid academic officer:** confirm an allowlisted `academic-officer` can create and edit Learning draft/review metadata but cannot publish or archive.
4. **Invalid signature:** change one signed request field after signing and confirm rejection.
5. **Replay rejection:** resend one identical signed request with the same nonce within five minutes and confirm the second request is rejected.
6. **Invalid folder:** reference a file outside an approved folder and confirm the save is rejected without a new metadata or audit row.
7. **Draft:** create one Library record and one Learning record and confirm both start as `draft`.
8. **Review:** submit each draft and confirm the status changes to `review` with an audit row.
9. **Publish:** move the approved files into their final Books/Covers or semester/shared-resource locations, publish as master admin, and confirm public metadata contains no Drive IDs.
10. **Archive:** move the files into the approved archive location, archive as master admin, and confirm the public catalog no longer returns the record.
11. **Audit log:** verify every successful save and transition records timestamp, normalized actor email, role, action, record type, record ID, status, and detail.
12. **Staff suspension:** mark a test staff row `suspended`, refresh its signed-in session, and confirm effective staff permissions are removed.
13. **Paid entitlement:** confirm an absent, inactive, expired, or mismatched entitlement is denied and an exact active entitlement is authorized.
14. **Restricted delivery:** request a registered, student-only, and paid asset through `/api/digital/assets/{book|lesson}/{resourceId}/{assetKind}` and confirm denied users receive no bytes or Drive identifiers.
15. **Range delivery:** seek within one approved audio/video asset and confirm the endpoint returns a valid partial response without a Google URL reaching the browser.

## 9. Preserve private-file controls

- Never enable **Anyone with the link** for registered, student-only, or paid Drive files.
- Never place a raw Drive ID in public page props, public metadata, browser storage, or delivery tokens.
- Keep browser mutations on the path Browser → authenticated Next.js server action → signed HMAC Apps Script request → Google Workspace.
- Keep the delivery endpoint disabled by leaving its three `DIGITAL_DRIVE_*` credentials unset until the OAuth client, read-only scope, account ownership, and revocation procedure have been reviewed.
- The delivery endpoint re-resolves published metadata and re-checks current access/paid entitlement when a token is redeemed. It proxies bytes and byte ranges; it never returns a Drive URL or file ID.

## Activation gate

Metadata authoring, staff-role resolution, entitlement lookup, short-lived authorization, and the restricted Drive streaming boundary are locally implemented. Live Digital configuration may begin. Restricted binary delivery must stay disabled until the OAuth credentials and read-only scope are institutionally approved, configured, security-reviewed, and exercised with the controlled acceptance tests above.
