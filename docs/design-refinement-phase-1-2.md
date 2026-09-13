# Institutional design refinement — phases 1 and 2

Branch: `design-refinement-2026`
Reviewed baseline: `75f93278b7f2b8157307848348d2267760c7d6e7`

## Audit

Reviewed the locale homepage/layout, global CSS, font definitions, both Tailwind
configurations, homepage hero and institutional sections, shared shell/header/footer,
founder and faculty views, admin dashboard and authorization layout, and public
library/learning pages and their interactive shells.

- Headings and body shared Manrope; there was no editorial serif hierarchy or
  dedicated Arabic font. Latin negative tracking and tight line heights also
  affected Arabic/Persian headings.
- Shared panels used 22–32px radii, blur and broad shadows. Many individual public
  sections additionally hard-code large radii and card grids.
- The shared shell placed a technical grid behind every page.
- Portrait treatment differed between the homepage, founder and faculty pages.
- The homepage hero included a perpetual decorative animation.
- Support precedes the institutional narrative. Reordering belongs to phase 3.
- Header, faculty, library, learning and dashboard components still contain
  local pill/card styling; this foundation does not claim those layouts are rebuilt.
- Library filters and learning year selection are functional stateful controls;
  their behavior must survive the subsequent visual refinement.

## Implemented foundation

- Inter/Fraunces for Latin text; IBM Plex Sans Arabic/Amiri for Arabic and Persian,
  loaded through next/font with swap and locale-specific Arabic font variables.
- Responsive shared headline scales, including a 96px homepage hero maximum.
- Arabic/Persian tracking resets and more generous heading line height.
- Restrained shared surface radii, hairline borders and reduced shadows; existing
  deep green/ivory palette retained, with dark text on the gold accent token.
- Plain shared page background, reusable editorial spacing/row/layout utilities,
  and a consistent grayscale portrait class applied to existing academic portraits.
- Shorter reveal distances, gentle stagger, reduced-motion CSS and removal of the
  looping hero frame animation. Visible keyboard focus and fixed-header scroll offset.
- Both existing Tailwind config files retain matching font-family definitions.

## Scope boundary

No dependency, authentication, authorization, enrollment, CMS, integration,
secure delivery, routing, metadata, contact detail or institutional claim changes.
Next.js remains 15.5.25 in the installed lockfile resolution. No main branch edits
or merges. Editorial homepage composition, individual page layouts and dashboard
refinement remain phases 3–5.

## Validation

- Existing 165 server tests passed.
- All four locale message trees match across 1,482 paths.
- Tailwind content coverage check and TypeScript check passed.
- Git diff reviewed for presentation-only changes and whitespace errors.
- Production build and browser checks are reported separately in the delivery
  message; automated checks do not establish live OAuth or integration behavior.
