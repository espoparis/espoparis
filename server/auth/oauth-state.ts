import { createHash, randomBytes } from "node:crypto";

export type OAuthStateBundle = {
  state: string;
  verifier: string;
  challenge: string;
};

export function createOAuthStateBundle(): OAuthStateBundle {
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { state, verifier, challenge };
}

export function sanitizeReturnTo(value: string | null | undefined, locale = "en") {
  const fallback = `/${locale}/student`;
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || /[\r\n]/.test(value)) return fallback;
  return value;
}
