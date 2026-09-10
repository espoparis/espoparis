# Phase 32 — Website Admin CMS

## Purpose
Give non-developer staff a protected website-management interface for news, activities, announcements, scheduling, and approved daily Qur'an/hadith content.

## Roles
- `admin`: master authority. Final publish, permanent delete, permissions, global settings.
- `editor`: create/edit/schedule and manage reflection drafts; cannot permanently delete or perform final publish.
- other roles: no public-content mutation rights by default.

## Daily reflection rules
- No religious text is fabricated by the application.
- Every entry must be institutionally supplied/approved and carry a source label.
- Approved normal entries rotate by UTC day.
- Occasion entries use a higher priority plus active date range and override normal rotation only during that range.
- Unapproved entries are never selected.

## Production storage
The current phase defines the domain model and protected UI. Persist CMS data through a production repository (Google Sheets/Drive for the first serverless stage, or a database later). Do not enable mutation endpoints until authenticated sessions, audit logging and storage are live.
