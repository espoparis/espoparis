import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/server/auth/session";
import { CourseAccessError, requireManagedCourse } from "@/server/permissions/courses";
import { isSupabaseConfigured } from "@/lib/env";
import {
  buildCourseMediaPath,
  buildCourseMediaThumbnailPath,
  removeStorageObjects,
  uploadFileToStorage,
} from "@/server/storage/files";
import { getNextCourseMediaSortOrder } from "@/server/repositories/courses";

const uploadSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(2).max(160),
  kind: z.enum(["video", "document"]),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { profile } = await getSessionContext();

  if (!profile) {
    return NextResponse.json({ error: "You are not allowed to upload course media." }, { status: 403 });
  }

  const formData = await request.formData();
  const parsed = uploadSchema.safeParse({
    courseId: formData.get("courseId"),
    title: formData.get("title"),
    kind: formData.get("kind"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid upload request." }, { status: 400 });
  }

  const file = formData.get("file");
  const thumbnail = formData.get("thumbnail");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A media file is required." }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "The selected file is empty." }, { status: 400 });
  }

  if (file.size > 1024 * 1024 * 250) {
    return NextResponse.json({ error: "Files must be smaller than 250 MB." }, { status: 400 });
  }

  if (parsed.data.kind === "video" && !file.type.startsWith("video/")) {
    return NextResponse.json({ error: "Video lessons must use a video file." }, { status: 400 });
  }

  if (parsed.data.kind === "document" && file.type.startsWith("video/")) {
    return NextResponse.json({ error: "Document uploads cannot use a video file." }, { status: 400 });
  }

  if (thumbnail instanceof File && thumbnail.size > 0) {
    if (!thumbnail.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Media thumbnails must be image files." },
        { status: 400 }
      );
    }

    if (thumbnail.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Media thumbnails must be smaller than 8 MB." },
        { status: 400 }
      );
    }
  }

  try {
    await requireManagedCourse(profile, parsed.data.courseId);
  } catch (error) {
    if (error instanceof CourseAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to load this course." }, { status: 500 });
  }

  const supabase = createSupabaseServerClient();

  const mediaPath = buildCourseMediaPath(
    parsed.data.courseId,
    parsed.data.kind,
    parsed.data.title,
    file.name
  );
  const thumbnailPath =
    thumbnail instanceof File && thumbnail.size > 0
      ? buildCourseMediaThumbnailPath(
          parsed.data.courseId,
          parsed.data.title,
          thumbnail.name
        )
      : null;

  try {
    await uploadFileToStorage("course-media", mediaPath, file);

    if (thumbnailPath && thumbnail instanceof File && thumbnail.size > 0) {
      await uploadFileToStorage("course-thumbnails", thumbnailPath, thumbnail);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload media." },
      { status: 500 }
    );
  }

  const sortOrder = await getNextCourseMediaSortOrder(parsed.data.courseId);

  const { error: insertError } = await supabase.from("course_media").insert({
    course_id: parsed.data.courseId,
    kind: parsed.data.kind,
    title: parsed.data.title,
    storage_path: mediaPath,
    thumbnail_path: thumbnailPath,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
    sort_order: sortOrder,
  });

  if (insertError) {
    await removeStorageObjects([
      {
        bucket: "course-media",
        paths: [mediaPath],
      },
      {
        bucket: "course-thumbnails",
        paths: [thumbnailPath],
      },
    ]);

    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, uploadedPaths: [mediaPath, thumbnailPath] });
}
