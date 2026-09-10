import type { UserRole } from "@/server/platform/types";

export type AuthProvider = "google-workspace" | "none";

export type AuthIdentity = {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  provider: AuthProvider;
};

export type AuthSession = {
  authenticated: boolean;
  identity: AuthIdentity | null;
};

export type AuthConfig = {
  provider: AuthProvider;
  allowedDomain?: string;
};
