import { randomUUID } from "node:crypto";
import type { UserRole } from "@/server/platform/types";

export type AccountStatus = "active" | "suspended" | "closed";

export type UserAccount = {
  id: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createUserAccount(input: { email: string; displayName?: string; now?: Date }): UserAccount {
  const now = input.now ?? new Date();
  return {
    id: randomUUID(),
    email: normalizeEmail(input.email),
    displayName: input.displayName?.trim() || undefined,
    emailVerified: false,
    role: "member",
    status: "active",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}
