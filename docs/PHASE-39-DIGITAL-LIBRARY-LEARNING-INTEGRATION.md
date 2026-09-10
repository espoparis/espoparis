# Phase 39 — Digital Library + Learning Drive Integration

## Purpose
Prepare the production boundary for `digital@espoparis.com`. The Enrollment checkpoint was resolved separately and is no longer part of this integration stage.

## Runtime
Browser → Next.js/Vercel → signed HMAC Apps Script bridge → Google Sheets metadata + institution-owned Google Drive.

## Rules
- Public pages receive only records marked `published`.
- No invented books or recorded lessons are shown when the bridge is unconfigured.
- Library administration is available to Content Editors and Master Admin.
- Learning administration is available to Academic Officers and Master Admin.
- Private binaries are not treated as public URLs. Metadata publication and asset delivery are separate concerns.
- Student-only/paid binary delivery remains gated until the server-only, read-only Drive OAuth credentials are approved and configured.

## Activation checkpoint
Use `docs/DIGITAL-LIVE-ACTIVATION-RUNBOOK.md` as the single operational procedure for configuration under `digital@espoparis.com`.

Public catalog data contains metadata only; the Next.js public repository removes Drive file IDs. Server-side entitlement lookup, five-minute authorization tokens, redemption-time access checks, and a byte-range-capable Drive proxy are implemented locally. The proxy route fails closed until its dedicated read-only OAuth credentials are configured.
