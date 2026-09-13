> Historical RC1 record. For the current RC2 candidate, see RC2-VALIDATION.md and RC2-ACTIVATION.md.

# ESPO Paris — release candidate RC1

Target branch: design-refinement-2026
Base commit: 75f93278b7f2b8157307848348d2267760c7d6e7
Prepared: 2026-09-12
Deployment status: not pushed to GitHub; not deployed. Main is untouched.

## Included changes

- Fraunces/Inter and Amiri/IBM Plex Sans Arabic; deep green, warm ivory,
  restrained gold, smaller radii, hairline divisions and grayscale portraits.
- Editorial homepage hierarchy, existing academic biographies shown beside
  portraits, admissions followed by support. CMS-backed news and reflection
  retain their published-content and empty-state behavior.
- Registration now uses six institution-supplied Google Forms destinations.
  The current page language comes first. All six remain available; no new
  website locales were added. The obsolete shared iframe was removed and
  form selection is immediately below the registration introduction.
- Public, faculty, founder, advisory and global pages have consistent spacing.
  Faculty biographies and works are visible without expanding cards.
- Support layout is simpler; existing contact details and financial wording
  are preserved. No online payment integration or tax eligibility claim added.
- Admin visual hierarchy refined while role-dependent behavior is preserved.
- Public locale-aware links receive unprefixed paths, fixing duplicate language
  segments such as /fr/fr/support without changing middleware or auth redirects.
- Reveal animations trigger when tall sections first intersect the viewport;
  reduced-motion handling remains. Nested main landmarks removed from the
  reviewed public pages. RTL heading tracking and line height are corrected.

## Validation and limits

The final verification results accompany this candidate in
release-route-validation.json and RELEASE-VALIDATION.md.

No edits to server logic, API handlers, middleware, i18n routing configuration,
package.json or package-lock.json. Next.js remains 15.5.25 in the tested build.

The revised candidate has NOT been visually verified in the available cloud
browser: that browser blocks access to the local server. The old blue public
site was inspected earlier but is not evidence of this candidate's appearance.
Responsive CSS and rendered language/direction checks do not replace mobile
and desktop interaction testing.

Google Forms destinations are exactly those supplied by the institution;
external form contents and submissions have not been independently tested.
Live OAuth, admin access, student/teacher accounts, Apps Script and secure
file delivery still require the existing deployed environment's credentials.

## Release and rollback

This is the complete Next.js source, not a static HTML export. ZIP packages
exclude node_modules, .next, .git and local secrets. Preserve Vercel environment
settings and existing Google integrations outside the repository.

Only apply this candidate to design-refinement-2026. Check the remote head
against the base commit and reconcile newer edits before upload. Review the
branch deployment and the existing login/delivery journeys before production.
The previous working deployment should remain available for rollback.
No merge to main or production deployment was performed.
