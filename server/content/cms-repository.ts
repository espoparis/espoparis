import { randomUUID } from "node:crypto";
import { callAppsScript } from "../integrations/apps-script-client.ts";
import type { AuthIdentity } from "../auth/types.ts";
import type { CmsItem, DailyReflection } from "./cms.ts";

export type CmsRepositoryState = "connected" | "not-configured" | "error";


export type CmsPublicSnapshot = {
  state: CmsRepositoryState;
  items: CmsItem[];
  reflections: DailyReflection[];
  error?: string;
};

export type CmsAdminSnapshot = {
  state: CmsRepositoryState;
  items: CmsItem[];
  reflections: DailyReflection[];
  error?: string;
};

type AppsScriptResponse<T> = { ok: true; result: T } | { ok: false; error: string };

function cmsConfig() {
  const url = process.env.CMS_API_URL?.trim() ?? "";
  const secret = process.env.CMS_API_SECRET?.trim() ?? "";
  if (!url || !secret) return null;
  return { url, secret };
}

function actor(identity: AuthIdentity) {
  return { email: identity.email, role: identity.role };
}

async function cmsCall<TInput, TOutput>(action: string, data: TInput, identity: AuthIdentity): Promise<TOutput> {
  const config = cmsConfig();
  if (!config) throw new Error("CMS storage is not configured.");
  const response = await callAppsScript<TInput, AppsScriptResponse<TOutput>>({
    ...config,
    action,
    data,
    nonce: randomUUID(),
    actor: actor(identity),
  });
  if (!response.ok) throw new Error(response.error || "CMS operation failed.");
  return response.result;
}

export function isCmsConfigured() {
  return Boolean(cmsConfig());
}



async function publicCmsCall<TInput, TOutput>(action: string, data: TInput): Promise<TOutput> {
  const config = cmsConfig();
  if (!config) throw new Error("CMS storage is not configured.");
  const response = await callAppsScript<TInput, AppsScriptResponse<TOutput>>({
    ...config,
    action,
    data,
    nonce: randomUUID(),
    actor: null,
  });
  if (!response.ok) throw new Error(response.error || "CMS operation failed.");
  return response.result;
}

export async function getPublicCmsSnapshot(at = new Date()): Promise<CmsPublicSnapshot> {
  if (!isCmsConfigured()) return { state: "not-configured", items: [], reflections: [] };
  try {
    const result = await publicCmsCall<{ at: string }, { items: CmsItem[]; reflections: DailyReflection[] }>("cms.public.snapshot", { at: at.toISOString() });
    return { state: "connected", items: result.items ?? [], reflections: result.reflections ?? [] };
  } catch (error) {
    return { state: "error", items: [], reflections: [], error: error instanceof Error ? error.message : "Unknown CMS error." };
  }
}

export async function getCmsAdminSnapshot(identity: AuthIdentity): Promise<CmsAdminSnapshot> {
  if (!isCmsConfigured()) return { state: "not-configured", items: [], reflections: [] };
  try {
    const result = await cmsCall<Record<string, never>, { items: CmsItem[]; reflections: DailyReflection[] }>("cms.admin.snapshot", {}, identity);
    return { state: "connected", items: result.items ?? [], reflections: result.reflections ?? [] };
  } catch (error) {
    return { state: "error", items: [], reflections: [], error: error instanceof Error ? error.message : "Unknown CMS error." };
  }
}

export async function saveCmsItem(identity: AuthIdentity, item: CmsItem) {
  return cmsCall("cms.item.save", { item }, identity);
}

export async function transitionCmsItem(identity: AuthIdentity, input: { id: string; status: CmsItem["status"] }) {
  return cmsCall("cms.item.transition", input, identity);
}

export async function deleteCmsItem(identity: AuthIdentity, id: string) {
  return cmsCall("cms.item.delete", { id }, identity);
}

export async function saveDailyReflection(identity: AuthIdentity, reflection: DailyReflection) {
  return cmsCall("cms.reflection.save", { reflection }, identity);
}

export async function deleteDailyReflection(identity: AuthIdentity, id: string) {
  return cmsCall("cms.reflection.delete", { id }, identity);
}
