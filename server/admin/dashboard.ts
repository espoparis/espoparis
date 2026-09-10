import type { UserRole } from "../platform/types.ts";
import { canOpenAdminSection, type AdminSection } from "../auth/admin-policy.ts";
import type { AuthSession } from "../auth/types.ts";

export type AdminModuleKey =
  | "content"
  | "academic"
  | "library"
  | "learning"
  | "people"
  | "settings";

export type AdminModule = {
  key: AdminModuleKey;
  href: string;
  section: AdminSection;
  state: "available" | "foundation" | "locked";
};

const moduleDefinitions: AdminModule[] = [
  { key: "content", href: "/admin/content", section: "content", state: "available" },
  { key: "academic", href: "/admin/academic", section: "academic", state: "available" },
  { key: "library", href: "/admin/library", section: "digital-library", state: "available" },
  { key: "learning", href: "/admin/learning", section: "digital-learning", state: "available" },
  { key: "people", href: "/admin/people", section: "permissions", state: "available" },
  { key: "settings", href: "/admin/settings", section: "site-settings", state: "available" },
];

export function getAdminModules(session: AuthSession): AdminModule[] {
  return moduleDefinitions.map((module) => {
    const decision = canOpenAdminSection(session, module.section);
    return decision.allowed ? module : { ...module, state: "locked" as const };
  });
}

export function getAdminRoleLabel(role: UserRole): "master" | "editor" | "academic" | "staff" {
  if (role === "admin") return "master";
  if (role === "editor") return "editor";
  if (role === "academic-officer") return "academic";
  return "staff";
}
