"use server";

import { revalidatePath } from "next/cache";
import { reviewSchema } from "@/lib/validation/review";
import { localizePath } from "@/lib/constants/app";
import { requireApprovedRole } from "@/server/auth/session";
import { upsertCourseReview } from "@/server/repositories/reviews";

export type ReviewActionState = {
  error?: string;
  success?: string;
};

export async function submitReviewAction(
  _prevState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const parsed = reviewSchema.safeParse({
    locale: formData.get("locale"),
    courseId: formData.get("courseId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const { profile } = await requireApprovedRole(parsed.data.locale, "student");

  try {
    await upsertCourseReview(
      parsed.data.courseId,
      profile.id,
      parsed.data.rating,
      parsed.data.comment
    );
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save review." };
  }

  revalidatePath(localizePath(parsed.data.locale, `/courses/${parsed.data.courseId}`));
  return { success: "Review saved." };
}
