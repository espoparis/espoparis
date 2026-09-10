/**
 * Production safeguard for the institution's master administrator account(s).
 *
 * This file does not assign roles from browser input. The allowlist is intended
 * to be consulted only by the trusted server-side identity provisioning layer
 * once real OAuth/session persistence is connected.
 */
export function parseMasterAdminEmails(raw = process.env.ESPO_MASTER_ADMIN_EMAILS ?? ""): ReadonlySet<string> {
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isMasterAdminEmail(email: string, raw?: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return parseMasterAdminEmails(raw).has(normalized);
}
