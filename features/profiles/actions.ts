"use server";

import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { profileSchema } from "@/lib/validation/profile";
import { localizePath } from "@/lib/constants/app";
import { requireApprovedRole } from "@/server/auth/session";
import { updateProfileContent } from "@/server/repositories/profiles";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse({
    locale: formData.get("locale"),
    fullName: formData.get("fullName"),
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const { profile } = await requireApprovedRole(parsed.data.locale, [
    "teacher",
    "student",
    "admin",
  ]);
  const t = await getTranslations({ locale: parsed.data.locale, namespace: "profile.form" });

  try {
    await updateProfileContent(profile.id, {
      fullName: parsed.data.fullName,
      bio: parsed.data.bio,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : t("updateError"),
    };
  }

  revalidatePath(localizePath(parsed.data.locale, `/${profile.role}`));
  revalidatePath(localizePath(parsed.data.locale, `/${profile.role}/profile`));
  return { success: t("updated") };
}
