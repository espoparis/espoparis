import type { UserRole } from "../platform/types.ts";

export type ManagedStaffRole = Extract<UserRole, "teacher" | "academic-officer" | "finance" | "editor" | "admin">;

export type PermissionCapability =
  | "content:draft"
  | "content:publish"
  | "academic:teach"
  | "academic:review"
  | "finance:review"
  | "people:manage"
  | "settings:manage";

export type StaffAccessState = "invited" | "active" | "suspended" | "departed";

export const roleCapabilities: Record<ManagedStaffRole, ReadonlySet<PermissionCapability>> = {
  teacher: new Set(["academic:teach"]),
  "academic-officer": new Set(["academic:review"]),
  finance: new Set(["finance:review"]),
  editor: new Set(["content:draft"]),
  admin: new Set([
    "content:draft",
    "content:publish",
    "academic:teach",
    "academic:review",
    "finance:review",
    "people:manage",
    "settings:manage",
  ]),
};

export const staffAccessTransitions: Record<StaffAccessState, ReadonlySet<StaffAccessState>> = {
  invited: new Set(["active", "suspended"]),
  active: new Set(["suspended", "departed"]),
  suspended: new Set(["active", "departed"]),
  departed: new Set([]),
};

export function hasCapability(role: ManagedStaffRole, capability: PermissionCapability): boolean {
  return roleCapabilities[role].has(capability);
}

export function canTransitionStaffAccess(from: StaffAccessState, to: StaffAccessState): boolean {
  return staffAccessTransitions[from].has(to);
}

export function canAssignManagedRole(actorRole: UserRole, targetRole: ManagedStaffRole): boolean {
  if (actorRole !== "admin") return false;
  return targetRole !== "admin" || actorRole === "admin";
}

export function sanitizeStaffEmail(email: string): string {
  return email.trim().toLowerCase();
}
