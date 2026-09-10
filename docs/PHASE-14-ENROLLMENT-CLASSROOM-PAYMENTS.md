# Phase 14 — Enrollment, Classroom, Recordings & Payment Access

## Purpose
Phase 14 formalizes the distinction between official Hawza students and learners who purchase standalone content.

## Official academic student
- Admission/enrollment is the source of access.
- Google Classroom remains the day-to-day live teaching and announcement surface.
- Google Meet recordings are reviewed, associated with the correct lesson, then exposed through the ESPO Student Portal.
- An official enrollment can unlock the offerings included in that academic semester without requiring a separate payment for every recording.

## Standalone learner
- Access comes from a matching paid entitlement or an explicit grant.
- A purchase unlocks only the purchased resource, never the whole academic semester.

## Recording lifecycle
Google Meet / manual upload -> Google Drive -> pending review -> approved -> mapped to lesson -> published in Student Portal.

The portal should not expose arbitrary Drive links. The server resolves whether the current viewer may access the recording first.

## Payment lifecycle
Course page -> checkout -> provider -> verified server webhook -> purchase marked paid -> entitlement created -> course appears in My Learning.

The browser redirect to a success page is not proof of payment. Entitlements are granted only from a verified webhook/event.

## Google Classroom boundary
The current safe copy contains a provider-neutral Classroom gateway only. No Classroom credentials or API writes are enabled yet. Future integration can:
1. map Classroom course IDs to ESPO course offerings,
2. sync membership for institutional convenience,
3. post an announcement linking an approved recording back to the secure ESPO lesson page.

## Still required before live activation
- Google OAuth client and callback configuration
- persistent production database
- payment provider selection and merchant approval
- webhook secret configuration
- Google Classroom API authorization/scopes
- institutional policy on recording retention, downloads and student privacy
