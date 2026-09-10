import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";
import { resolveEffectiveStaffRole } from "./staff-role-repository";
import { verifySessionToken } from "./session-token";
import type { AuthConfig, AuthSession } from "./types";

export const SESSION_COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-espo_session" : "espo_session";

export const anonymousSession: AuthSession = { authenticated: false, identity: null };

export const authConfig: AuthConfig = { provider: "google-workspace" };

export async function getAuthSession(): Promise<AuthSession> {
  const env = getServerEnv();
  if (!env?.AUTH_SESSION_SECRET) return anonymousSession;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return anonymousSession;
  const payload = verifySessionToken(token, env.AUTH_SESSION_SECRET);
  if (!payload) return anonymousSession;

  // Staff state is re-evaluated on every request so suspensions and departures
  // take effect without waiting for the session cookie to expire.
  const role = await resolveEffectiveStaffRole(payload.email, payload.role);
  return {
    authenticated: true,
    identity: {
      id: payload.sub,
      email: payload.email,
      displayName: payload.name,
      role,
      provider: "google-workspace",
    },
  };
}
