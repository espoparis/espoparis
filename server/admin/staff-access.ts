import type { UserRole } from "@/server/platform/types";

export type StaffStatus = "invited" | "active" | "suspended" | "departed";
export type StaffRole = Extract<UserRole, "teacher" | "academic-officer" | "finance" | "editor" | "admin">;

export type StaffMember = {
  id: string;
  email: string;
  displayName: string;
  role: StaffRole;
  status: StaffStatus;
  offeringIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type StaffMutation =
  | { type: "change-role"; role: StaffRole }
  | { type: "set-status"; status: StaffStatus }
  | { type: "assign-offering"; offeringId: string }
  | { type: "unassign-offering"; offeringId: string };

export function normalizeInstitutionalEmail(value: string) {
  return value.trim().toLowerCase();
}

export function validateStaffMember(member: StaffMember): string[] {
  const issues: string[] = [];
  const email = normalizeInstitutionalEmail(member.email);
  if (!member.id.trim()) issues.push("missing_staff_id");
  if (!email || !email.includes("@")) issues.push("invalid_email");
  if (!member.displayName.trim()) issues.push("missing_display_name");
  if (new Set(member.offeringIds).size !== member.offeringIds.length) issues.push("duplicate_offering_assignment");
  if (member.role !== "teacher" && member.offeringIds.length > 0) issues.push("non_teacher_has_offerings");
  return issues;
}

export function canManageStaff(actorRole: UserRole) {
  return actorRole === "admin";
}

export function canAssignTeacher(actorRole: UserRole) {
  return actorRole === "academic-officer" || actorRole === "admin";
}

export function applyStaffMutation(member: StaffMember, mutation: StaffMutation, actorRole: UserRole, now: string): StaffMember {
  if (!canManageStaff(actorRole) && mutation.type !== "assign-offering" && mutation.type !== "unassign-offering") {
    throw new Error("staff_management_requires_admin");
  }
  if ((mutation.type === "assign-offering" || mutation.type === "unassign-offering") && !canAssignTeacher(actorRole)) {
    throw new Error("teacher_assignment_requires_academic_officer");
  }

  let next = { ...member, offeringIds: [...member.offeringIds], updatedAt: now };
  if (mutation.type === "change-role") {
    next.role = mutation.role;
    if (mutation.role !== "teacher") next.offeringIds = [];
  }
  if (mutation.type === "set-status") next.status = mutation.status;
  if (mutation.type === "assign-offering") {
    if (next.role !== "teacher") throw new Error("only_teachers_can_receive_offerings");
    const offeringId = mutation.offeringId.trim();
    if (!offeringId) throw new Error("invalid_offering_id");
    if (!next.offeringIds.includes(offeringId)) next.offeringIds.push(offeringId);
  }
  if (mutation.type === "unassign-offering") {
    next.offeringIds = next.offeringIds.filter((id) => id !== mutation.offeringId);
  }
  return next;
}

export function effectiveStaffAccess(member: StaffMember) {
  return member.status === "active";
}
