import type { Entitlement } from "@/server/platform/types";
import type { AcademicEnrollment, CourseOffering } from "./types";

export type CourseAccessReason =
  | "public"
  | "academic-enrollment"
  | "purchase"
  | "grant"
  | "not-enrolled"
  | "not-published";

export type CourseAccessDecision = { allowed: boolean; reason: CourseAccessReason };

export function canAccessCourseOffering(input: {
  userId?: string;
  offering: CourseOffering;
  enrollments: AcademicEnrollment[];
  entitlements: Entitlement[];
}): CourseAccessDecision {
  const { userId, offering, enrollments, entitlements } = input;

  if (!offering.published) return { allowed: false, reason: "not-published" };
  if (offering.accessLevel === "public") return { allowed: true, reason: "public" };
  if (!userId) return { allowed: false, reason: "not-enrolled" };

  const enrolled = enrollments.some(
    (enrollment) =>
      enrollment.userId === userId &&
      enrollment.status === "active" &&
      enrollment.academicYear === offering.academicYear &&
      enrollment.semester === offering.semester,
  );

  if (offering.learningTrack === "academic-program" && enrolled) {
    return { allowed: true, reason: "academic-enrollment" };
  }

  const entitlement = entitlements.find(
    (item) =>
      item.userId === userId &&
      item.resourceKind === "course" &&
      item.resourceId === offering.id &&
      (!item.expiresAt || item.expiresAt.getTime() > Date.now()),
  );

  if (entitlement?.source === "purchase") return { allowed: true, reason: "purchase" };
  if (entitlement?.source === "grant" || entitlement?.source === "enrollment") {
    return { allowed: true, reason: "grant" };
  }

  return { allowed: false, reason: "not-enrolled" };
}
