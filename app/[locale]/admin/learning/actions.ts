"use server";

import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import { canOpenAdminSection } from "@/server/auth/admin-policy";
import { getAuthSession } from "@/server/auth/session";
import { validateLearningRecord, type LearningCatalogRecord } from "@/server/digital/catalog";
import { saveLearningRecord, transitionLearningRecord } from "@/server/digital/repository";

async function requireLearningIdentity() {
  const session = await getAuthSession();
  const decision = canOpenAdminSection(session, "digital-learning");
  if (!decision.allowed || !session.identity) throw new Error("Learning Platform permission denied.");
  return session.identity;
}

function safeLocale(locale: string) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) throw new Error("Invalid locale.");
  return locale;
}

export async function saveLearningRecordAction(locale: string, record: LearningCatalogRecord) {
  const validatedLocale = safeLocale(locale);
  const identity = await requireLearningIdentity();
  const errors = validateLearningRecord(record);
  if (errors.length) throw new Error(`Invalid learning record: ${errors.join(" ")}`);
  await saveLearningRecord(identity, record);
  revalidatePath(`/${validatedLocale}/admin/learning`);
  revalidatePath(`/${validatedLocale}/learning`);
}

export async function transitionLearningRecordAction(locale: string, id: string, status: LearningCatalogRecord["status"]) {
  const validatedLocale = safeLocale(locale);
  const identity = await requireLearningIdentity();
  await transitionLearningRecord(identity, id.trim(), status);
  revalidatePath(`/${validatedLocale}/admin/learning`);
  revalidatePath(`/${validatedLocale}/learning`);
}
