# Phase 35 — People, Permissions & Site Settings

## Scope
Phase 35 turns the two master-administration modules introduced in the dashboard into protected, localized workspaces.

### People & Permissions
- Adds `/[locale]/admin/people` behind the `permissions` server-side admin policy.
- Defines explicit capability boundaries for Teacher, Academic Officer, Finance, Content Editor and Master Admin.
- Defines a controlled staff lifecycle: invited → active → suspended/departed.
- Prevents silent reactivation of departed staff.
- Keeps live invitations and role mutations gated until production Google authentication and persistent identity storage are connected.

### Site Settings
- Adds `/[locale]/admin/settings` behind the `site-settings` server-side admin policy.
- Centralizes verified public contact channels.
- Keeps the official address, visiting hours and final legal/public institutional name explicitly unset until confirmed.
- Adds validation so required contact values cannot be published empty and invalid email values are rejected.
- Keeps live writes gated until authenticated production persistence is connected.

## Security rules
- Both routes are absent from public navigation and remain under the Phase 33 admin security boundary.
- Only `admin` can access People & Permissions and Site Settings.
- UI visibility is not treated as authorization; server-side section policy remains authoritative.
- Master Admin email allowlisting remains environment-driven and is not hard-coded in source.

## Verification
- `npm test`: 131/131 tests passed.
- Message parity: 4 locales matched across 1370 translation paths.
- Tailwind content coverage: passed.
- TS/TSX syntax transpilation: passed across the project.
- Full semantic typecheck remains intentionally unclaimed because project dependencies are not installed in this execution environment.
