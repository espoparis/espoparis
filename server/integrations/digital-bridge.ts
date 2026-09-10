import { randomUUID } from "node:crypto";
import type { AuthIdentity } from "../auth/types.ts";
import { callAppsScript } from "./apps-script-client.ts";

type AppsScriptResponse<T> = { ok: true; result: T } | { ok: false; error: string };

export function getDigitalBridgeConfig() {
  const url = process.env.DIGITAL_API_URL?.trim() ?? "";
  const secret = process.env.DIGITAL_API_SECRET?.trim() ?? "";
  if (!url || secret.length < 32) return null;
  try {
    return new URL(url).protocol === "https:" ? { url, secret } : null;
  } catch {
    return null;
  }
}

export async function callDigitalBridge<TInput, TOutput>(action: string, data: TInput, identity?: AuthIdentity): Promise<TOutput> {
  const config = getDigitalBridgeConfig();
  if (!config) throw new Error("Digital platform bridge is not configured.");
  const response = await callAppsScript<TInput, AppsScriptResponse<TOutput>>({
    ...config,
    action,
    data,
    nonce: randomUUID(),
    actor: identity ? { email: identity.email, role: identity.role } : null,
  });
  if (!response.ok) throw new Error(response.error || "Digital platform operation failed.");
  return response.result;
}
