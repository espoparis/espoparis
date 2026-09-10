import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { exchangeGoogleCode, verifyGoogleIdToken } from "@/server/auth/google-oauth";
import { resolveEffectiveStaffRole } from "@/server/auth/staff-role-repository";
import { sanitizeReturnTo } from "@/server/auth/oauth-state";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";
import { createSessionToken } from "@/server/auth/session-token";

const FLOW_COOKIE = "espo_oauth_flow";

type Flow = { state: string; verifier: string; returnTo: string };

function readFlow(value: string | undefined): Flow | null {
  if (!value) return null;
  try {
    const flow = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Flow;
    return flow.state && flow.verifier && flow.returnTo ? flow : null;
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const env = getServerEnv();
  if (!env?.AUTH_SESSION_SECRET || !env.AUTH_BASE_URL) return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });

  const flow = readFlow(request.cookies.get(FLOW_COOKIE)?.value);
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  if (!flow || !state || state !== flow.state || !code) {
    return NextResponse.json({ error: "Invalid or expired OAuth flow." }, { status: 400 });
  }

  try {
    const idToken = await exchangeGoogleCode({ code, verifier: flow.verifier });
    const identity = await verifyGoogleIdToken(idToken);
    const role = await resolveEffectiveStaffRole(identity.email, "member");
    const token = createSessionToken({ sub: identity.sub, email: identity.email, name: identity.name, role, provider: "google-workspace" }, env.AUTH_SESSION_SECRET);
    const destination = new URL(sanitizeReturnTo(flow.returnTo), env.AUTH_BASE_URL);
    const response = NextResponse.redirect(destination);
    response.cookies.delete(FLOW_COOKIE);
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/en/sign-in?error=oauth", env.AUTH_BASE_URL));
    response.cookies.delete(FLOW_COOKIE);
    return response;
  }
}
