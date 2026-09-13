> Historical RC1 record. For the current RC2 candidate, see RC2-VALIDATION.md and RC2-ACTIVATION.md.

# RC1 verification — 2026-09-12

- Next.js 15.5.25 production build: PASS, including lint and TypeScript.
- Existing server tests: 165 passed, zero failures.
- Message parity and Tailwind content checks: PASS.
- Public HTTP check: 82 routes returned 200, including 52 locale/public routes,
  28 faculty profile routes, sitemap.xml and robots.txt.
- Four HTML language/direction combinations: PASS.
- Six exact registration destinations, default language ordering and no old
  iframe on each of the four registration pages: PASS.
- Single main landmark on checked public pages and profiles: PASS.
- No repeated locale prefix in links on checked public pages: PASS.
- Git diff whitespace check: PASS.

Reproducible HTTP check: scripts/check-release-routes.py, after production build.
Raw route evidence: release-route-validation.json.

One intermediate build failed while cleaning a generated .next/export directory
(ENOTEMPTY); removing that generated directory and rebuilding succeeded.

Limits: HTTP checks do not verify visual geometry, client-side interactions,
external Google Forms completion, or credential-dependent live integrations.
The local candidate could not be opened by the available cloud browser.
OAuth, admin/student/teacher journeys and secure delivery require a branch
preview with the existing environment configuration before production adoption.
No production deployment or remote GitHub commit has been performed.
