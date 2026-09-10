import { getServerEnv } from "@/lib/env";

export type GoogleTokenIdentity = {
  sub: string;
  email: string;
  emailVerified: boolean;
  name?: string;
};

export function getGoogleRedirectUri(baseUrl: string) {
  return new URL("/api/auth/google/callback", baseUrl).toString();
}

export function buildGoogleAuthorizationUrl(input: {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
}) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", input.state);
  url.searchParams.set("code_challenge", input.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("prompt", "select_account");
  return url;
}

export async function exchangeGoogleCode(input: { code: string; verifier: string }) {
  const env = getServerEnv();
  if (!env?.GOOGLE_OAUTH_CLIENT_ID || !env.GOOGLE_OAUTH_CLIENT_SECRET || !env.AUTH_BASE_URL) {
    throw new Error("Google OAuth is not configured.");
  }
  const redirectUri = getGoogleRedirectUri(env.AUTH_BASE_URL);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: input.code,
      client_id: env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: input.verifier,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Google token exchange failed.");
  const json = (await response.json()) as { id_token?: string };
  if (!json.id_token) throw new Error("Google did not return an ID token.");
  return json.id_token;
}

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleTokenIdentity> {
  const env = getServerEnv();
  if (!env?.GOOGLE_OAUTH_CLIENT_ID) throw new Error("Google OAuth is not configured.");

  // Delegate signature, issuer, expiry and token validation to Google's official tokeninfo endpoint.
  // This avoids implementing a home-grown JWT/JWK verifier in the application.
  const url = new URL("https://oauth2.googleapis.com/tokeninfo");
  url.searchParams.set("id_token", idToken);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Google ID token validation failed.");
  const claims = (await response.json()) as Record<string, string | undefined>;
  if (claims.aud !== env.GOOGLE_OAUTH_CLIENT_ID) throw new Error("Google ID token audience mismatch.");
  if (!claims.sub || !claims.email || claims.email_verified !== "true") throw new Error("Google identity is not verified.");
  return { sub: claims.sub, email: claims.email.toLowerCase(), emailVerified: true, name: claims.name };
}
