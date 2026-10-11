import { getAuthEnv } from "@/lib/env";

export type AuthProviderReadiness = {
  google: boolean;
  magicLink: boolean;
};

export function getAuthProviderReadiness(): AuthProviderReadiness {
  const env = getAuthEnv();
  return {
    google: Boolean(env?.GOOGLE_OAUTH_CLIENT_ID && env?.GOOGLE_OAUTH_CLIENT_SECRET && env?.AUTH_SESSION_SECRET && env?.AUTH_BASE_URL),
    // No email token issuance/verification endpoint is implemented yet.
    // Mail credentials alone must never advertise a working sign-in method.
    magicLink: false,
  };
}
