# Phase 33 — Admin Security Boundary

This phase turns the admin area from a merely unlinked/internal UI into a server-enforced protected boundary.

## Rules

- `/admin` is never included in public navigation or the public sitemap.
- Search engines are instructed not to crawl localized `/admin` routes.
- Anonymous visitors are redirected to the localized sign-in page.
- Authenticated non-staff users receive a concealed 404 response rather than an admin access screen.
- `/admin/content` is limited to `editor` and `admin`.
- `/admin/academic` is limited to `academic-officer` and `admin`.
- Site settings and permission administration are master-admin-only capabilities.
- Client-side UI state is never accepted as proof of authorization.

## Master administrator

`ESPO_MASTER_ADMIN_EMAILS` is a deployment-only allowlist intended for the trusted identity provisioning layer once production OAuth is connected. It must not be exposed to the browser and real addresses must not be committed to Git.

The current project intentionally keeps authentication inactive until real Google OAuth/session credentials are configured, so the protected routes currently redirect to sign-in instead of simulating privileged access.
