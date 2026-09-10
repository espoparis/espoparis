# Phase 38 — Google OAuth + Real Server Session

## What is implemented
- Google OAuth Authorization Code flow with PKCE.
- One-time state cookie for CSRF protection.
- Server-side code exchange with Google.
- ID-token verification delegated to Google's official `tokeninfo` endpoint; audience and verified-email checks are enforced.
- Signed, HttpOnly, SameSite=Lax session cookie with an 8-hour lifetime.
- Master-admin email is re-evaluated from `ESPO_MASTER_ADMIN_EMAILS` on every request.
- Non-master Google users default to `member`; no staff/student privilege is inferred from browser input.
- Logout endpoint deletes the session cookie.
- Open-redirect protection for post-login destinations.

## Required Google Cloud configuration
Create/own the OAuth application under the institution's Google Cloud organization/account. Configure the production redirect URI exactly as:

`https://www.espoparis.com/api/auth/google/callback`

Set Vercel environment variables (Production and Preview as appropriate):
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `AUTH_SESSION_SECRET` (random 32+ chars; prefer 64 bytes)
- `AUTH_BASE_URL=https://www.espoparis.com`
- `ESPO_MASTER_ADMIN_EMAILS=<institution-approved master admin email(s)>`

Never commit real credentials.

## Deliberately not enabled yet
- Automatic Student role activation. It stays blocked until Phase 37 enrollment repair has completed and post-repair audit is clean.
- Staff role persistence. Teacher/editor/academic-officer roles must come from the trusted staff store, not a client claim.
- Magic Link. It remains disabled until a persistent one-time token store exists.

## Production verification order
1. Complete Phase 37 enrollment repair and post-repair audit.
2. Create institution-owned Google OAuth credentials.
3. Add exact redirect URI.
4. Configure Vercel secrets.
5. Put the approved master-admin email in `ESPO_MASTER_ADMIN_EMAILS`.
6. Sign in as master admin and verify `/admin` access.
7. Sign in with a normal external email and verify it receives only `member`.
8. Verify logout invalidates access.
9. Only then enable enrollment-to-student linking.
