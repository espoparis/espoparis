"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/server/auth/session";
import { canCms, validateCmsItem, validateDailyReflection, type CmsItem, type ContentStatus, type DailyReflection } from "@/server/content/cms";
import { deleteCmsItem, deleteDailyReflection, saveCmsItem, saveDailyReflection, transitionCmsItem } from "@/server/content/cms-repository";

function requireIdentity(capability: Parameters<typeof canCms>[1]) {
  return getAuthSession().then((session) => {
    const identity = session.identity;
    if (!session.authenticated || !identity || !canCms(identity.role, capability)) throw new Error("CMS permission denied.");
    return identity;
  });
}

function text(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function createCmsItemAction(locale: string, data: FormData) {
  const identity = await requireIdentity("content.create");
  const title = text(data, "title");
  const requestedSlug = text(data, "slug");
  const status = (text(data, "status") || "draft") as ContentStatus;
  const item: CmsItem = {
    id: randomUUID(),
    kind: (text(data, "kind") || "news") as CmsItem["kind"],
    title,
    slug: requestedSlug || slugify(title),
    excerpt: text(data, "excerpt") || undefined,
    body: text(data, "body") || undefined,
    coverImage: text(data, "coverImage") || undefined,
    status,
    schedule: {
      publishAt: text(data, "publishAt") || undefined,
      unpublishAt: text(data, "unpublishAt") || undefined,
    },
    authorEmail: identity.email,
    updatedAt: new Date().toISOString(),
  };
  const errors = validateCmsItem(item);
  if (errors.length) throw new Error(`Invalid CMS item: ${errors.join(", ")}`);
  await saveCmsItem(identity, item);
  revalidatePath(`/${locale}/admin/content`);
  revalidatePath(`/${locale}/activities`);
  revalidatePath(`/${locale}`);
}

export async function transitionCmsItemAction(locale: string, data: FormData) {
  const target = text(data, "status") as ContentStatus;
  const capability = target === "published" ? "content.publish" : target === "scheduled" ? "content.schedule" : "content.edit";
  const identity = await requireIdentity(capability);
  await transitionCmsItem(identity, { id: text(data, "id"), status: target });
  revalidatePath(`/${locale}/admin/content`);
  revalidatePath(`/${locale}/activities`);
  revalidatePath(`/${locale}`);
}

export async function deleteCmsItemAction(locale: string, data: FormData) {
  const identity = await requireIdentity("content.delete");
  await deleteCmsItem(identity, text(data, "id"));
  revalidatePath(`/${locale}/admin/content`);
  revalidatePath(`/${locale}/activities`);
}

export async function createReflectionAction(locale: string, data: FormData) {
  const identity = await requireIdentity("reflection.manage");
  const approved = text(data, "approved") === "true";
  if (approved && !canCms(identity.role, "content.publish")) throw new Error("Only the master administrator can approve reflections for public display.");
  const reflection: DailyReflection = {
    id: randomUUID(),
    kind: (text(data, "kind") || "quran") as DailyReflection["kind"],
    arabicText: text(data, "arabicText"),
    sourceLabel: text(data, "sourceLabel"),
    translations: {
      en: text(data, "translationEn") || undefined,
      fr: text(data, "translationFr") || undefined,
      ar: text(data, "translationAr") || undefined,
      fa: text(data, "translationFa") || undefined,
    },
    occasionLabel: text(data, "occasionLabel") || undefined,
    activeFrom: text(data, "activeFrom") || undefined,
    activeUntil: text(data, "activeUntil") || undefined,
    priority: Number(text(data, "priority") || "10"),
    approved,
  };
  const errors = validateDailyReflection(reflection);
  if (errors.length) throw new Error(`Invalid reflection: ${errors.join(", ")}`);
  await saveDailyReflection(identity, reflection);
  revalidatePath(`/${locale}/admin/content`);
  revalidatePath(`/${locale}`);
}

export async function deleteReflectionAction(locale: string, data: FormData) {
  const identity = await requireIdentity("content.delete");
  await deleteDailyReflection(identity, text(data, "id"));
  revalidatePath(`/${locale}/admin/content`);
  revalidatePath(`/${locale}`);
}
