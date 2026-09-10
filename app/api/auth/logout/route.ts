import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { SESSION_COOKIE_NAME } from "@/server/auth/session";

export async function POST(request: NextRequest) {
  const env = getServerEnv();
  const origin = env?.AUTH_BASE_URL || request.nextUrl.origin;
  const response = NextResponse.redirect(new URL("/", origin), 303);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
