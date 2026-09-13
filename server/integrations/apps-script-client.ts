import { createHmac, timingSafeEqual } from "node:crypto";

export type AppsScriptActor = { email: string; role?: string } | null;

export type AppsScriptEnvelope<T> = {
  action: string;
  issuedAt: string;
  nonce: string;
  data: T;
  actor: AppsScriptActor;
};

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
}

export function signAppsScriptEnvelope<T>(envelope: AppsScriptEnvelope<T>, secret: string) {
  if (secret.length < 32) throw new Error("Apps Script shared secret must be at least 32 characters.");
  return createHmac("sha256", secret).update(canonicalJson(JSON.parse(JSON.stringify(envelope)))).digest("hex");
}

export function verifyAppsScriptEnvelope<T>(envelope: AppsScriptEnvelope<T>, signature: string, secret: string) {
  const expected = signAppsScriptEnvelope(envelope, secret);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function callAppsScript<TInput, TOutput>(input: {
  url: string;
  secret: string;
  action: string;
  data: TInput;
  nonce: string;
  actor?: AppsScriptActor;
  fetchImpl?: typeof fetch;
}): Promise<TOutput> {
  const fetchImpl = input.fetchImpl ?? fetch;
  const envelope: AppsScriptEnvelope<TInput> = {
    action: input.action,
    issuedAt: new Date().toISOString(),
    nonce: input.nonce,
    data: input.data,
    actor: input.actor ?? null,
  };
  const signature = signAppsScriptEnvelope(envelope, input.secret);
  const response = await fetchImpl(input.url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...envelope, signature }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Apps Script request failed with status ${response.status}.`);
  return response.json() as Promise<TOutput>;
}
