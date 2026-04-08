"use server";

import { revalidatePath } from "next/cache";
import { enrollmentDecisionSchema } from "@/lib/validation/course";
import { localizePath } from "@/lib/constants/app";
import { sendEnrollmentDecisionNotification } from "@/server/email/notifications";
import {
  createEnrollment,
  getEnrollmentNotificationData,
  reviewEnrollment,
} from "@/server/repositories/enrollments";
import { requireApprovedRole } from "@/server/auth/session";

export type EnrollmentActionState = {
  error?: string;
  success?: string;
};

export async function applyToCourseAction(
  _prevState: EnrollmentActionState,
  formData: FormData
): Promise<EnrollmentActionState> {
  const locale = String(formData.get("locale") || "en");
  const courseId = String(formData.get("courseId") || "");

  if (!courseId) {
    return { error: "Course ID is missing." };
  }

  const { profile } = await requireApprovedRole(locale, "student");

  try {
    await createEnrollment(courseId, profile.id);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to apply." };
  }

  revalidatePath(localizePath(locale, "/courses"));
  revalidatePath(localizePath(locale, "/student"));
  return { success: "Application submitted successfully." };
}

export async function reviewEnrollmentAction(formData: FormData) {
  const parsed = enrollmentDecisionSchema.safeParse({
    locale: formData.get("locale"),
    enrollmentId: formData.get("enrollmentId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid enrollment update.");
  }

  const { profile } = await requireApprovedRole(parsed.data.locale, ["teacher", "admin"]);
  await reviewEnrollment(parsed.data.enrollmentId, profile.id, parsed.data.status);

  try {
    const notification = await getEnrollmentNotificationData(parsed.data.enrollmentId);
    await sendEnrollmentDecisionNotification({
      studentId: notification.studentId,
      studentName: notification.studentName,
      courseTitle: notification.courseTitle,
      status: notification.status,
      locale: parsed.data.locale,
    });
  } catch (notificationError) {
    console.error("Failed to send enrollment notification", notificationError);
  }

  revalidatePath(localizePath(parsed.data.locale, "/teacher/enrollments"));
  revalidatePath(localizePath(parsed.data.locale, "/admin/users"));
}
