# Phase 28 — Curriculum Control & Versioning

This phase turns curriculum governance into an explicit system boundary.

## Core rule
An activated curriculum version is immutable. Academic administration edits only draft versions. When a new academic year begins, the active curriculum is cloned into a new draft and modified there.

This prevents a 2027 subject rename from rewriting the 2026 transcript of students who studied under the previous title.

## Editable subject fields
- subject name
- subject code
- description
- year level
- semester
- display order
- active/inactive status

## Separation of concerns
Curriculum defines what should be studied. Course offerings define how a specific cohort studies it. Teacher assignment, Classroom linkage, recordings and live delivery must therefore remain outside the immutable curriculum record.

## Activation validation
A draft cannot activate when it has duplicate subject IDs/codes, missing names/codes, invalid academic year format, invalid display order, or a year/semester mismatch.

## Cost model
This logic is provider-neutral and requires no dedicated server. The first production implementation can persist curriculum data through the existing Google Workspace / Apps Script bridge while preserving a migration path to PostgreSQL later.
