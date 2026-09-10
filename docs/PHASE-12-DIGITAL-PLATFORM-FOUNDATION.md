# Phase 12 — Digital Platform Foundation

## Status

Google Drive account verified: `digital@espoparis.com`.

The connected Workspace account currently exposes **no Shared Drives** through the Drive API. Phase 12 therefore uses a dedicated institutional root folder in the account's My Drive. If Shared Drives become available later, the folder tree can be migrated without changing the public URL structure or the domain models below.

## Google Drive structure

- `ESPO Paris Digital Platform`
  - `01 - Digital Library`
    - `01 - Books (PDF)`
    - `02 - Covers`
    - `03 - Catalog & Metadata`
    - `04 - Intake (Unpublished)`
    - `05 - Archive`
  - `02 - Learning Platform`
    - `Academic Year 2026-2027`
      - `Year 1 - Foundations`
        - `Semester 1`
        - `Semester 2`
      - `Year 2 - Deepening`
        - `Semester 3`
        - `Semester 4`
      - `Year 3 - Specialization & Communication`
        - `Semester 5`
        - `Semester 6`
      - `Year 4 - Advanced & Applied`
        - `Semester 7`
        - `Semester 8`
    - `Teacher Uploads (Unpublished)`
    - `Shared Course Resources`
    - `Archive`
  - `03 - Operations & Administration`
    - `01 - Access & Entitlements`
    - `02 - Content Intake & Review`
    - `03 - Backups & Exports`

## Separation rule

**Digital Library is books only.** Public books may include PDF, cover, author, description, category, language, reading and download permissions.

**Learning Platform is academic delivery.** It contains years, semesters, subjects/courses, lessons, recordings, audio, notes and course-specific attachments.

A course handout belongs to Learning unless it is also formally approved as a standalone library book.

## Runtime architecture

The live Next.js site must not depend on a human Google account session or on the ChatGPT Drive connector. The production site will require an approved Google Cloud integration using a service identity or OAuth strategy.

The Phase 12 code therefore introduces provider-neutral interfaces for:

- library and lesson repositories;
- asset storage;
- Google Drive permission/link gateway;
- access control;
- payments;
- entitlements and progress.

No credentials, private keys, checkout keys, or fabricated content are committed.

## Access levels

- `public`: anyone can access;
- `registered-free`: authenticated users;
- `student-only`: academic roles or explicit entitlement;
- `paid`: explicit entitlement/purchase, with administrative override.

## Next implementation gate

Before the first live Drive-backed lesson or paid book is exposed, complete:

1. authentication provider decision;
2. database decision;
3. Google Cloud service identity / OAuth decision;
4. Drive API permission model;
5. first approved library book or recorded lesson;
6. payment provider decision for paid content.
