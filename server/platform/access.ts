import type { AccessLevel, Viewer } from "./types";

export type AccessDecision = {
  allowed: boolean;
  reason:
    | "public"
    | "authentication-required"
    | "registered-user"
    | "academic-role"
    | "explicit-entitlement"
    | "entitlement-required";
};

export function canAccessResource(
  viewer: Viewer,
  accessLevel: AccessLevel,
  resourceId: string,
): AccessDecision {
  if (accessLevel === "public") {
    return { allowed: true, reason: "public" };
  }

  if (!viewer.authenticated) {
    return { allowed: false, reason: "authentication-required" };
  }

  if (viewer.role === "admin") {
    return { allowed: true, reason: "academic-role" };
  }

  if (accessLevel === "registered-free") {
    return { allowed: true, reason: "registered-user" };
  }

  if (accessLevel === "student-only" && viewer.role === "student") {
    return { allowed: true, reason: "academic-role" };
  }

  if (viewer.entitlementResourceIds?.includes(resourceId)) {
    return { allowed: true, reason: "explicit-entitlement" };
  }

  return { allowed: false, reason: "entitlement-required" };
}
