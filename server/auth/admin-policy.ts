import type { AuthSession } from "./types";
import type { UserRole } from "@/server/platform/types";

export type AdminSection = "root" | "content" | "academic" | "digital-library" | "digital-learning" | "site-settings" | "permissions";

export type AdminDecision =
  | { allowed: true; reason: "role-authorized" }
  | { allowed: false; reason: "sign-in-required" | "insufficient-role" };

const adminSectionRoles: Record<AdminSection, ReadonlySet<UserRole>> = {
  root: new Set(["editor", "academic-officer", "admin"]),
  content: new Set(["editor", "admin"]),
  academic: new Set(["academic-officer", "admin"]),
  "digital-library": new Set(["editor", "admin"]),
  "digital-learning": new Set(["academic-officer", "admin"]),
  "site-settings": new Set(["admin"]),
  permissions: new Set(["admin"]),
};

export function canOpenAdminSection(session: AuthSession, section: AdminSection): AdminDecision {
  if (!session.authenticated || !session.identity) {
    return { allowed: false, reason: "sign-in-required" };
  }

  if (!adminSectionRoles[section].has(session.identity.role)) {
    return { allowed: false, reason: "insufficient-role" };
  }

  return { allowed: true, reason: "role-authorized" };
}

export function isMasterAdmin(session: AuthSession): boolean {
  return Boolean(session.authenticated && session.identity?.role === "admin");
}
