"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { localizePath } from "@/lib/constants/app";
import {
  courseMediaReorderSchema,
  courseMediaTitleSchema,
  courseSchema,
} from "@/lib/validation/course";
import {
  deleteCourse,
  deleteCourseMedia,
  getCourseMediaAssetById,
  reorderCourseMedia,
  saveCourse,
  updateCourseMediaTitle,
} from "@/server/repositories/courses";
import { requireApprovedRole } from "@/server/auth/session";
import { requireManagedCourse } from "@/server/permissions/courses";
import { removeStorageObjects } from "@/server/storage/files";

export type CourseActionState = {
  error?: string;
};

export async function saveCourseAction(
  _prevState: CourseActionState,
  formData: FormData
): Promise<CourseActionState> {
  const parsed = courseSchema.safeParse({
    locale: formData.get("locale"),
    courseId: formData.get("courseId") || undefined,
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    level: formData.get("level"),
    durationLabel: formData.get("durationLabel"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const { profile } = await requireApprovedRole(parsed.data.locale, ["teacher", "admin"]);

  if (parsed.data.courseId) {
    await requireManagedCourse(profile, parsed.data.courseId);
  }

  const courseId = await saveCourse({
    teacherId: profile.id,
    courseId: parsed.data.courseId,
    title: parsed.data.title,
    description: parsed.data.description,
    type: parsed.data.type,
    level: parsed.data.level,
    durationLabel: parsed.data.durationLabel,
    status: parsed.data.status,
  });

  revalidatePath(localizePath(parsed.data.locale, "/teacher"));
  redirect(localizePath(parsed.data.locale, `/teacher/courses/${courseId}/edit`));
}

export async function deleteCourseAction(courseId: string, locale: string) {
  const { profile } = await requireApprovedRole(locale, ["teacher", "admin"]);
  const assets = await requireManagedCourse(profile, courseId);
  await deleteCourse(courseId);
  await removeStorageObjects([
    {
      bucket: "course-thumbnails",
      paths: [
        assets.course?.thumbnail_path,
        ...assets.media.map((item) => item.thumbnail_path),
      ],
    },
    {
      bucket: "course-media",
      paths: assets.media.map((item) => item.storage_path),
    },
  ]);
  revalidatePath(localizePath(locale, "/teacher/courses"));
  redirect(localizePath(locale, "/teacher/courses"));
}

export async function deleteCourseMediaAction(mediaId: string, locale: string) {
  const { profile } = await requireApprovedRole(locale, ["teacher", "admin"]);
  const currentAsset = await getCourseMediaAssetById(mediaId);

  if (!currentAsset) {
    throw new Error("Media item not found.");
  }

  await requireManagedCourse(profile, currentAsset.course_id);
  const asset = await deleteCourseMedia(mediaId);

  await removeStorageObjects([
    {
      bucket: "course-media",
      paths: [asset.storage_path],
    },
    {
      bucket: "course-thumbnails",
      paths: [asset.thumbnail_path],
    },
  ]);
  revalidatePath(localizePath(locale, "/teacher/courses"));
  revalidatePath(localizePath(locale, `/teacher/courses/${asset.course_id}/edit`));
}

export async function updateCourseMediaTitleAction(
  mediaId: string,
  locale: string,
  title: string
) {
  const parsed = courseMediaTitleSchema.safeParse({
    mediaId,
    locale,
    title,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid media update.");
  }

  const { profile } = await requireApprovedRole(parsed.data.locale, ["teacher", "admin"]);
  const currentAsset = await getCourseMediaAssetById(parsed.data.mediaId);

  if (!currentAsset) {
    throw new Error("Media item not found.");
  }

  await requireManagedCourse(profile, currentAsset.course_id);
  const asset = await updateCourseMediaTitle(parsed.data.mediaId, parsed.data.title);
  revalidatePath(localizePath(parsed.data.locale, "/teacher/courses"));
  revalidatePath(localizePath(parsed.data.locale, `/teacher/courses/${asset.course_id}/edit`));
}

export async function reorderCourseMediaAction(
  mediaId: string,
  locale: string,
  direction: "up" | "down"
) {
  const parsed = courseMediaReorderSchema.safeParse({
    mediaId,
    locale,
    direction,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid media reorder request.");
  }

  const { profile } = await requireApprovedRole(parsed.data.locale, ["teacher", "admin"]);
  const currentAsset = await getCourseMediaAssetById(parsed.data.mediaId);

  if (!currentAsset) {
    throw new Error("Media item not found.");
  }

  await requireManagedCourse(profile, currentAsset.course_id);
  const result = await reorderCourseMedia(parsed.data.mediaId, parsed.data.direction);
  revalidatePath(localizePath(parsed.data.locale, "/teacher/courses"));
  revalidatePath(localizePath(parsed.data.locale, `/teacher/courses/${result.courseId}/edit`));
}
