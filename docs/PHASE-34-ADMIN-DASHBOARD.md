# Phase 34 — Admin Dashboard

## Purpose
Create the protected landing experience for authorized staff at `/admin` without fabricating live operational metrics before production data sources are connected.

## Security model
The Phase 33 server-side admin boundary remains authoritative. The dashboard only renders after the parent admin layout authorizes the session. Module cards are additionally filtered by role so staff do not receive navigation into sections they are not permitted to open.

## Current modules
- Content CMS — available to editor/admin.
- Academic administration — available to academic-officer/admin.
- Digital Library — foundation staged; live Drive repository not connected yet.
- Learning Platform — foundation staged; live course repository not connected yet.
- People & permissions — staged for master admin.
- Site settings — staged for master admin.

## No fake metrics
The dashboard deliberately does not show invented counts for students, articles, books, courses, revenue, grades, or pending approvals. Those widgets will be activated only after the corresponding production repositories can be read safely.

## Next activation step
Connect real authentication first, then connect the enrollment/academic repositories and replace foundation-state cards with live operational summaries.
