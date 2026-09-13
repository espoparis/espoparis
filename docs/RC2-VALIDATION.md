# RC2 validation — 2026-09-13

## Passed

- Production build completed on Next.js 15.5.25, including lint and TypeScript.
- 175 server/domain tests passed, zero failures.
- Four message trees match across 1,535 paths; Tailwind coverage passed.
- 99 HTTP checks: 82 public/profile/SEO routes, 16 protected admin routes
  redirecting unauthenticated visitors to sign-in, and an unpublished media
  request returning 404. Some Next streaming redirects are HTTP 200 responses
  containing the framework refresh meta; no editor form was exposed.
- Public language/direction checks and exact six-form registration mappings
  passed. No repeated locale prefixes in checked public links.
- Git diff whitespace check passed before local commits.

## Scope of new tests

Actual CMS Apps Script source is evaluated in a VM with mocked Google services.
Tests cover schedule/approval visibility, protected image references, prevention
of editor overwrites of approved content, and file signature validation. The
integration signature test verifies optional fields are normalized identically
to the transmitted JSON. These are not live Apps Script deployments.

## Not verified / not performed

- No authenticated browser transaction for upload/edit/publish/archive.
- No visual desktop/mobile verification of RC2.
- No live CMS or digital upload: Drive account identity is verified, while the
  expected catalog folder appeared empty and CMS search returned no matches.
- No Vercel deployment: connected account returned no teams and project listing
  failed. Project identity/environment values remain unverified.
- No remote GitHub push or merge to main.

The release can be reviewed as source. Production adoption still depends on
activating the two bridges and testing the exact candidate on an accessible
Vercel project. See RC2-ACTIVATION.md and ADMIN-USER-GUIDE-AR.md.
