import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { MediaKind } from "@/lib/types/database";

export type StorageBucket = "avatars" | "course-thumbnails" | "course-media";

function getExtension(name: string) {
  const segments = name.split(".");
  return segments.length > 1 ? segments.pop()!.toLowerCase() : "bin";
}

function sanitizeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function buildAvatarPath(profileId: string, fileName: string) {
  return `profiles/${profileId}/avatar-${crypto.randomUUID()}.${getExtension(fileName)}`;
}

export function buildCourseThumbnailPath(courseId: string, fileName: string) {
  return `courses/${courseId}/thumbnails/cover-${crypto.randomUUID()}.${getExtension(fileName)}`;
}

export function buildCourseMediaPath(
  courseId: string,
  kind: MediaKind,
  title: string,
  fileName: string
) {
  const name = sanitizeSegment(title) || "asset";
  return `courses/${courseId}/${kind}/${name}-${crypto.randomUUID()}.${getExtension(fileName)}`;
}

export function buildCourseMediaThumbnailPath(
  courseId: string,
  title: string,
  fileName: string
) {
  const name = sanitizeSegment(title) || "asset";
  return `courses/${courseId}/media-thumbnails/${name}-${crypto.randomUUID()}.${getExtension(fileName)}`;
}

export async function uploadFileToStorage(
  bucket: StorageBucket,
  path: string,
  file: File
) {
  const admin = createSupabaseAdminClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await admin.storage.from(bucket).upload(path, Buffer.from(arrayBuffer), {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

export async function removeStorageObjects(
  removals: Array<{
    bucket: StorageBucket;
    paths: Array<string | null | undefined>;
  }>
) {
  const admin = createSupabaseAdminClient();

  await Promise.all(
    removals.map(async ({ bucket, paths }) => {
      const filtered = paths.filter((path): path is string => Boolean(path));

      if (!filtered.length) {
        return;
      }

      await admin.storage.from(bucket).remove(filtered);
    })
  );
}
