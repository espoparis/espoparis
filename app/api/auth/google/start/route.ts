import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { buildGoogleAuthorizationUrl, getGoogleRedirectUri } from "@/server/auth/google-oauth";
import { createOAuthStateBundle, sanitizeReturnTo } from "@/server/auth/oauth-state";

const FLOW_COOKIE = "espo_oauth_flow";

export async function GET(request: NextRequest) {
  const env = getServerEnv();
  if (!env?.GOOGLE_OAUTH_CLIENT_ID || !env.GOOGLE_OAUTH_CLIENT_SECRET || !env.AUTH_SESSION_SECRET || !env.AUTH_BASE_URL) {
    return NextResponse.json({ error: "Google OAuth is not configured." }, { status: 503 });
  }

  const locale = request.nextUrl.searchParams.get("locale") || "en";
  const returnTo = sanitizeReturnTo(request.nextUrl.searchParams.get("returnTo"), locale);
  const flow = createOAuthStateBundle();
  const redirectUri = getGoogleRedirectUri(env.AUTH_BASE_URL);
  const googleUrl = buildGoogleAuthorizationUrl({ clientId: env.GOOGLE_OAUTH_CLIENT_ID, redirectUri, state: flow.state, codeChallenge: flow.challenge });
  const response = NextResponse.redirect(googleUrl);
  response.cookies.set(FLOW_COOKIE, Buffer.from(JSON.stringify({ state: flow.state, verifier: flow.verifier, returnTo })).toString("base64url"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
