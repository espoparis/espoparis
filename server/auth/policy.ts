import type { AuthSession } from "./types";
import type { UserRole } from "@/server/platform/types";

export type PortalDecision =
  | { allowed: true; reason: "authenticated" | "role-authorized" }
  | { allowed: false; reason: "sign-in-required" | "insufficient-role" };

const academicAccess: Record<Extract<UserRole, "student" | "teacher" | "editor" | "academic-officer" | "admin">, ReadonlySet<UserRole>> = {
  student: new Set(["student", "teacher", "academic-officer", "editor", "admin"]),
  teacher: new Set(["teacher", "academic-officer", "admin"]),
  editor: new Set(["editor", "admin"]),
  "academic-officer": new Set(["academic-officer", "admin"]),
  admin: new Set(["admin"]),
};

export function canOpenStudentPortal(session: AuthSession): PortalDecision {
  if (!session.authenticated || !session.identity) return { allowed: false, reason: "sign-in-required" };
  if (session.identity.role === "visitor") return { allowed: false, reason: "insufficient-role" };
  return { allowed: true, reason: "authenticated" };
}

export function canUseAcademicWorkspace(
  session: AuthSession,
  minimumRole: Extract<UserRole, "student" | "teacher" | "editor" | "academic-officer" | "admin"> = "student",
): PortalDecision {
  if (!session.authenticated || !session.identity) return { allowed: false, reason: "sign-in-required" };
  if (!academicAccess[minimumRole].has(session.identity.role)) return { allowed: false, reason: "insufficient-role" };
  return { allowed: true, reason: "role-authorized" };
}
