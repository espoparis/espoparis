# Phase 27 — Academic Workspace Provisioning & Operations Console

## Purpose

Prepare the low-cost Google Workspace academic store so the Teacher Portal and Academic Control Center can operate without exposing backing spreadsheets to staff or students.

## Canonical sheets

1. Course Offerings
2. Assessments
3. Gradebook
4. Attendance
5. Staff Access
6. Academic Audit Log

The sheet schema is version-controlled in `server/academic/workspace-schema.ts` and mirrored by the Apps Script service. Do not rename headers ad hoc in production.

## Provisioning rule

`provisionAcademicWorkspace()` is idempotent. It creates missing sheets, verifies canonical headers, applies safe validations, freezes/stylizes header rows, and adds warnings against direct editing of operational sheets.

It intentionally uses warning-only sheet protection during the initial deployment because final Google Workspace ownership/editor policy must be confirmed before hard protection is applied.

## Staff workflow

Teachers use the website Teacher Portal only. Academic officers use the review/progression controls. Google Sheets remains an implementation detail and audit surface for IT/authorized administrators.

## Pre-live checks

- Back up the workbook.
- Run provisioning in a non-production copy first.
- Confirm Staff Access users and assigned Offering IDs.
- Confirm assessment weights total 100% per active course offering.
- Confirm no students or teachers have direct edit access to Gradebook, Attendance or Audit Log.
- Only then set `academicSheetsConfigured=true` in the production readiness process.

## Cost strategy

This preserves the Phase 1 stack: Vercel + Google Workspace + Apps Script. No VPS or dedicated database server is required at current scale. The portal contracts remain storage-agnostic so the institution can migrate later without rebuilding the user experience.
