# ESPO Paris Digital Platform Architecture

## Digital Library
- Book metadata lives in the database: title, author, description, cover, language, category, keywords, publication year, page count, visibility and download permission.
- PDF and cover assets live in object storage, not GitHub and not the Next.js bundle.
- Reading uses an in-browser PDF reader. Downloads are controlled per item.
- Search indexes metadata; filters include language, author, category and topic.

## Recorded Learning
Hierarchy: Program → Level / Year → Subject → Course → Lesson.
Each lesson may contain video/audio, description, PDF notes, references, duration and supplementary files.

## Access model
`public` → `registered-free` → `student-only` → `paid`.
Paid/private files must use short-lived signed URLs after server-side entitlement checks.

## Storage
Recommended production direction: S3-compatible object storage such as Cloudflare R2 for PDFs, audio and downloadable files. Keep Google Drive as an internal editorial/archive source, not as the public delivery layer.
For larger video usage, migrate streaming to a dedicated video platform/CDN while keeping course metadata in the application database.

## Payments and accounts
Use an external hosted checkout (e.g. Stripe Checkout where the institution is eligible). A successful webhook writes an entitlement to the database; the website never handles raw card details.

## Data model (minimum)
User, Program, Level, Subject, Course, Lesson, Book, Asset, Enrollment, Purchase, Entitlement, Progress.

## Admin workflow
Authorized staff should be able to create/edit books and courses, upload assets, assign access rules, publish/unpublish, and review students/purchases without editing source code.

## Launch rule
The `/library` and `/learning` route shells may exist during development, but should not be promoted in the main navigation until real content, storage, permissions, and legal/payment requirements are ready.
