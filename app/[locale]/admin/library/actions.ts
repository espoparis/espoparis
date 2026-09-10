"use server";

import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import { canOpenAdminSection } from "@/server/auth/admin-policy";
import { getAuthSession } from "@/server/auth/session";
import { validateLibraryRecord, type LibraryCatalogRecord } from "@/server/digital/catalog";
import { saveLibraryRecord, transitionLibraryRecord } from "@/server/digital/repository";

async function requireLibraryIdentity() {
  const session = await getAuthSession();
  const decision = canOpenAdminSection(session, "digital-library");
  if (!decision.allowed || !session.identity) throw new Error("Digital Library permission denied.");
  return session.identity;
}

function safeLocale(locale: string) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) throw new Error("Invalid locale.");
  return locale;
}

export async function saveLibraryRecordAction(locale: string, record: LibraryCatalogRecord) {
  const validatedLocale = safeLocale(locale);
  const identity = await requireLibraryIdentity();
  const errors = validateLibraryRecord(record);
  if (errors.length) throw new Error(`Invalid library record: ${errors.join(" ")}`);
  await saveLibraryRecord(identity, record);
  revalidatePath(`/${validatedLocale}/admin/library`);
  revalidatePath(`/${validatedLocale}/library`);
}

export async function transitionLibraryRecordAction(locale: string, id: string, status: LibraryCatalogRecord["status"]) {
  const validatedLocale = safeLocale(locale);
  const identity = await requireLibraryIdentity();
  await transitionLibraryRecord(identity, id.trim(), status);
  revalidatePath(`/${validatedLocale}/admin/library`);
  revalidatePath(`/${validatedLocale}/library`);
}
