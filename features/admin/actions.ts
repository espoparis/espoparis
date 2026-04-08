"use server";

import { revalidatePath } from "next/cache";
import { localizePath } from "@/lib/constants/app";
import { sendProfileApprovalNotification } from "@/server/email/notifications";
import {
  getProfileApprovalNotificationData,
  updateProfileApproval,
  updateProfileRole,
} from "@/server/repositories/profiles";
import { requireAdmin } from "@/server/auth/session";
import type { ApprovalStatus, AppRole } from "@/lib/types/database";

export async function updateProfileApprovalAction(formData: FormData) {
  const locale = String(formData.get("locale") || "en");
  const profileId = String(formData.get("profileId") || "");
  const approvalStatus = String(formData.get("approvalStatus") || "") as ApprovalStatus;

  await requireAdmin(locale);
  const profile = await updateProfileApproval(profileId, approvalStatus);

  try {
    const notificationProfile = await getProfileApprovalNotificationData(profile.id);
    await sendProfileApprovalNotification({
      profileId: notificationProfile.id,
      fullName: notificationProfile.full_name,
      status: notificationProfile.approval_status,
      locale,
    });
  } catch (notificationError) {
    console.error("Failed to send profile approval notification", notificationError);
  }

  revalidatePath(localizePath(locale, "/admin"));
  revalidatePath(localizePath(locale, "/admin/users"));
}

export async function updateProfileRoleAction(formData: FormData) {
  const locale = String(formData.get("locale") || "en");
  const profileId = String(formData.get("profileId") || "");
  const role = String(formData.get("role") || "") as AppRole;

  await requireAdmin(locale);
  await updateProfileRole(profileId, role);
  revalidatePath(localizePath(locale, "/admin/users"));
}
