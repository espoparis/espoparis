import type { InstituteRecord } from "./institute.ts";
import type { FacultyProfile } from "./faculty-profile.ts";
import { randomUUID } from "node:crypto";
import { callAppsScript } from "../integrations/apps-script-client.ts";
import type { AuthIdentity } from "../auth/types.ts";
import type { CmsItem, DailyReflection } from "./cms.ts";

export type CmsRepositoryState = "connected" | "not-configured" | "error";

export type ContactInboxItem = {
  id: string;
  receivedAt: string;
  locale: string;
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
};

export type DonationSettings = { enabled: boolean; paypalUrl: string };

export function validPayPalDonationUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["paypal.com", "www.paypal.com"].includes(url.hostname) &&
      url.pathname.replace(/\/$/, "") === "/donate" && !url.hash && url.searchParams.size === 1 &&
      /^[A-Za-z0-9]+$/.test(url.searchParams.get("hosted_button_id") ?? "");
  } catch { return false; }
}


export type CmsPublicSnapshot = {
  state: CmsRepositoryState;
  items: CmsItem[];
  reflections: DailyReflection[];
  profiles?: FacultyProfile[]; institutes?: InstituteRecord[];
  donation?: DonationSettings;
  error?: string;
};

export type CmsAdminSnapshot = {
  state: CmsRepositoryState;
  items: CmsItem[];
  reflections: DailyReflection[];
  profiles?: FacultyProfile[]; institutes?: InstituteRecord[];
  donation?: DonationSettings;
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
    const result = await publicCmsCall<{ at: string }, { items: CmsItem[]; reflections: DailyReflection[]; profiles?: FacultyProfile[]; institutes?: InstituteRecord[]; donation?: DonationSettings }>("cms.public.snapshot", { at: at.toISOString() });
    return { state: "connected", items: result.items ?? [], reflections: result.reflections ?? [], profiles: result.profiles ?? [], institutes: result.institutes ?? [], donation: result.donation?.enabled && validPayPalDonationUrl(result.donation.paypalUrl) ? result.donation : undefined };
  } catch (error) {
    return { state: "error", items: [], reflections: [], error: error instanceof Error ? error.message : "Unknown CMS error." };
  }
}

export async function getCmsAdminSnapshot(identity: AuthIdentity): Promise<CmsAdminSnapshot> {
  if (!isCmsConfigured()) return { state: "not-configured", items: [], reflections: [] };
  try {
    const result = await cmsCall<Record<string, never>, { items: CmsItem[]; reflections: DailyReflection[]; profiles?: FacultyProfile[]; institutes?: InstituteRecord[]; donation?: DonationSettings }>("cms.admin.snapshot", {}, identity);
    return { state: "connected", items: result.items ?? [], reflections: result.reflections ?? [], profiles: result.profiles ?? [], institutes: result.institutes ?? [], donation: result.donation };
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

export async function uploadCmsImage(identity: AuthIdentity, input: { name: string; mime: string; base64: string }) {
  return cmsCall<typeof input, { id: string }>("cms.media.upload", input, identity);
}
export async function readCmsImage(id: string, identity?: AuthIdentity) {
  const input = { id };
  return identity
    ? cmsCall<typeof input, { mime: string; base64: string }>("cms.media.read", input, identity)
    : publicCmsCall<typeof input, { mime: string; base64: string }>("cms.media.read", input);
}

export async function saveFacultyProfile(identity: AuthIdentity, profile: FacultyProfile) {
  return cmsCall("cms.profile.save", { profile }, identity);
}

export async function saveContactInquiry(input: Omit<ContactInboxItem, "id" | "receivedAt">) {
  return publicCmsCall<typeof input, { id: string }>("cms.inquiry.create", input);
}

export async function getContactInbox(identity: AuthIdentity) {
  return cmsCall<Record<string, never>, ContactInboxItem[]>("cms.inquiries.list", {}, identity);
}

export async function saveDonationSettings(identity: AuthIdentity, settings: DonationSettings) {
  if (settings.enabled && !validPayPalDonationUrl(settings.paypalUrl)) throw new Error("A valid PayPal hosted donation URL is required to enable donations.");
  return cmsCall("cms.donation.save", { settings }, identity);
}

export async function saveInstitute(identity: AuthIdentity, institute: InstituteRecord) {
  return cmsCall("cms.institute.save", { institute }, identity);
}
export async function deleteInstitute(identity: AuthIdentity, id: string, locale: string) {
  return cmsCall("cms.institute.delete", { id, locale }, identity);
}
