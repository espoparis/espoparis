# Phase 17 — Academic Control, Flexible Payments, and Institutional Support

## Purpose
This phase turns three previously discussed requirements into explicit platform rules without enabling unsafe production writes:

1. curriculum and student administration must be editable by authorized academic administrators;
2. course access must support free, fixed-price, contact-for-price, and donation/custom-amount models;
3. institutional donations require a dignified public entry point without collecting payment-card details before an approved payment provider exists.

## Academic Control Center
The protected `/admin/academic` route is intentionally inaccessible until institutional authentication and role mapping are connected. It must never trust query parameters, browser storage, or client-provided role values.

Authorized administrators will eventually manage:
- student/enrollment status and placement;
- curriculum versions;
- subjects and course offerings;
- grades and attendance publication;
- progression decisions;
- payment/access exceptions.

### Curriculum versioning
Do not mutate an active historical curriculum in a way that rewrites prior student records. Changes for a new academic year should be made in a new draft curriculum version, reviewed, then activated. Old cohorts remain linked to their original version.

## Pricing modes
The platform supports four pricing modes:
- `free`: no payment required;
- `fixed`: online checkout may be enabled only when an approved amount and provider exist;
- `contact`: administration quotes/arranges payment manually;
- `donation`: a custom amount model for approved donation workflows.

Until fixed pricing is approved, standalone paid learning should use `contact` mode. The learner submits or initiates a request tied to the exact course/resource. Administration can later send official instructions or a payment link.

## Offline payment rule
Submitting payment proof never grants access. Access may be created only after an authorized administrator marks the payment as confirmed. This decision should be auditable.

## Donations
The public `/support` page directs donors to administration at +44 7828 604011 or contact@espoparis.com. It does not currently collect card details. Online donations can be introduced later after the institution approves provider, currencies, receipts, refunds, accounting, and compliance procedures.

## Future integration
When the Central Enrollment Drive is made available, the academic control system must integrate with the existing Form → language spreadsheet → Central Database pipeline rather than creating a second source of truth. Existing application/student identifiers should be preserved and linked to website user IDs.
