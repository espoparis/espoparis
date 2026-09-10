import { createHmac, timingSafeEqual } from "node:crypto";
import type { UserRole } from "@/server/platform/types";

export type SessionTokenPayload = {
  sub: string;
  email: string;
  name?: string;
  role: UserRole;
  provider: "google-workspace";
  iat: number;
  exp: number;
};

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function signBody(body: string, secret: string) {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

export function createSessionToken(
  input: Omit<SessionTokenPayload, "iat" | "exp">,
  secret: string,
  options: { now?: Date; ttlSeconds?: number } = {},
) {
  if (secret.length < 32) throw new Error("AUTH_SESSION_SECRET must be at least 32 characters.");
  const now = Math.floor((options.now ?? new Date()).getTime() / 1000);
  const ttl = options.ttlSeconds ?? 60 * 60 * 8;
  const payload: SessionTokenPayload = { ...input, iat: now, exp: now + ttl };
  const body = base64url(JSON.stringify(payload));
  return `${body}.${signBody(body, secret)}`;
}

export function verifySessionToken(token: string, secret: string, now = new Date()): SessionTokenPayload | null {
  if (!token || secret.length < 32) return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra) return null;

  const expected = signBody(body, secret);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionTokenPayload;
    const epoch = Math.floor(now.getTime() / 1000);
    if (!payload.sub || !payload.email || !payload.role || payload.provider !== "google-workspace") return null;
    if (!Number.isFinite(payload.iat) || !Number.isFinite(payload.exp)) return null;
    if (payload.iat > epoch + 60 || payload.exp <= epoch) return null;
    return payload;
  } catch {
    return null;
  }
}
