import type { StaffRole, StaffStatus } from "../admin/staff-access.ts";
import { normalizeInstitutionalEmail } from "../admin/staff-access.ts";
import type { UserRole } from "../platform/types.ts";
import { callDigitalBridge, getDigitalBridgeConfig } from "../integrations/digital-bridge.ts";
import { isMasterAdminEmail } from "./master-admin.ts";

export type TrustedStaffRoleRecord = {
  email: string;
  role: StaffRole;
  status: StaffStatus;
};

export interface StaffRoleRepository {
  findByEmail(email: string): Promise<TrustedStaffRoleRecord | null>;
}

const managedRoles = new Set<UserRole>(["teacher", "academic-officer", "finance", "editor", "admin"]);
const staffStates = new Set<StaffStatus>(["invited", "active", "suspended", "departed"]);

export function parseTrustedStaffRoleRecord(value: unknown, expectedEmail: string): TrustedStaffRoleRecord | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<TrustedStaffRoleRecord>;
  const email = normalizeInstitutionalEmail(record.email ?? "");
  if (email !== normalizeInstitutionalEmail(expectedEmail) || !managedRoles.has(record.role as UserRole) || !staffStates.has(record.status as StaffStatus)) return null;
  return { email, role: record.role as StaffRole, status: record.status as StaffStatus };
}

export class AppsScriptStaffRoleRepository implements StaffRoleRepository {
  async findByEmail(email: string): Promise<TrustedStaffRoleRecord | null> {
    if (!getDigitalBridgeConfig()) return null;
    try {
      const normalized = normalizeInstitutionalEmail(email);
      const result = await callDigitalBridge<{ email: string }, unknown>("digital.staff.resolve", { email: normalized });
      return parseTrustedStaffRoleRecord(result, normalized);
    } catch {
      return null;
    }
  }
}

export function effectiveRoleFromStaffRecord(currentRole: UserRole, record: TrustedStaffRoleRecord | null, masterAdmin: boolean): UserRole {
  if (masterAdmin) return "admin";
  if (record?.status === "active" && record.role !== "admin") return record.role;
  return managedRoles.has(currentRole) ? "member" : currentRole;
}

export async function resolveEffectiveStaffRole(
  email: string,
  currentRole: UserRole,
  repository: StaffRoleRepository = new AppsScriptStaffRoleRepository(),
): Promise<UserRole> {
  const masterAdmin = isMasterAdminEmail(email);
  if (masterAdmin) return "admin";
  const record = await repository.findByEmail(email);
  return effectiveRoleFromStaffRecord(currentRole, record, false);
}
