import { getAuthEnv, getServerEnv } from "@/lib/env";

export type AuthProviderReadiness = {
  google: boolean;
  magicLink: boolean;
};

export function getAuthProviderReadiness(): AuthProviderReadiness {
  const env = getAuthEnv();
  const emailEnv = getServerEnv();
  return {
    google: Boolean(env?.GOOGLE_OAUTH_CLIENT_ID && env?.GOOGLE_OAUTH_CLIENT_SECRET && env?.AUTH_SESSION_SECRET && env?.AUTH_BASE_URL),
    magicLink: Boolean(emailEnv?.RESEND_API_KEY && emailEnv?.RESEND_FROM_EMAIL && env?.AUTH_SESSION_SECRET),
  };
}
