# ESPO Paris Redesign — Phase 39

Digital Library + Learning Platform integration boundary prepared for the institution-owned `digital@espoparis.com` Google Workspace account.

Key additions:
- Signed `DIGITAL_API_URL` / `DIGITAL_API_SECRET` bridge.
- Google Apps Script metadata backend: `integrations/google-apps-script/digital-platform.gs`.
- Drive folder-bound validation for library PDFs/covers and learning assets.
- Public library now reads published catalog records through the repository boundary when configured.
- Protected `/admin/library` and `/admin/learning` workspaces.
- Split permissions: Editor/Admin for library, Academic Officer/Admin for learning.
- Draft/review/published/archived lifecycle.
- Public output excludes invalid or unpublished records.
- No private binary delivery is falsely treated as secure public access. Entitlement-aware asset delivery remains gated.

Activation remains intentionally blocked until live Enrollment repair and post-repair verification are complete.
