# Phase 31 — Quality Hardening and Known-Issue Closure

## Scope

This phase closes all code-level issues that can be verified safely without production credentials or live Google Drive access.

## Fixed

- Removed the unverified public address and visiting hours from the public configuration.
- Contact page no longer renders a visit/location card until an official address and visiting hours are confirmed.
- Footer no longer exposes an unverified street address.
- Organization JSON-LD omits postal address until it is confirmed; this prevents publishing false structured data to search engines.
- Contact structured data now reflects the institution's confirmed language coverage more accurately.
- Converted the project package to explicit ESM mode and renamed the Tailwind config to `tailwind.config.cjs` so Node's test runner no longer reparses TypeScript test files as ESM with MODULE_TYPELESS warnings.
- Suppressed only Node's expected TypeScript stripping ExperimentalWarning during the test command; other warnings remain visible.
- Verified that all relative and `@/` project imports resolve to files in the repository.
- Verified every TypeScript/TSX source file parses/transpiles syntactically with TypeScript 5.8.3.
- Verified every Google Apps Script `.gs` file passes JavaScript syntax checking.
- Re-ran the full test suite: 105/105 tests passed.
- Re-ran message parity: 4 locales match across 1217 translation paths.
- Re-ran Tailwind content coverage successfully.
- Scanned the repository for common committed-secret patterns; none were found.

## Not falsely marked as solved

The following items require external facts, credentials, or live connected systems and therefore remain production gates rather than code bugs:

1. Full TypeScript semantic typecheck and Next production build require project dependencies (`npm ci`). The execution environment used for this phase cannot complete dependency installation within its network/time limit.
2. Live Enrollment repair requires Google Drive / Sheets / Apps Script access to `enrollment@espoparis.com`.
3. Google OAuth and real sessions require production OAuth credentials and a session secret.
4. Magic-link authentication requires durable one-time token persistence before activation.
5. Google Classroom runtime integration requires its production API credentials/configuration.
6. Payments remain provider-neutral until the institution selects and configures a payment provider.
7. The official public/legal institutional name still needs administrative confirmation before global SEO renaming.
8. The official physical address and visiting hours remain unpublished until confirmed.
9. Turkish/Azerbaijani public-site localization remains a future product decision; Enrollment supports those language sources but the public site currently ships four UI locales.
10. Digital Library / recorded-learning live storage still requires reconnecting the `digital@espoparis.com` Drive account after Enrollment is repaired.

## Required production verification

Run in a normal development/CI environment with dependencies available:

```bash
npm ci
npm run test
npm run typecheck
npm run build
```

Do not activate student-account linking or academic writes until the production-readiness gates pass.
