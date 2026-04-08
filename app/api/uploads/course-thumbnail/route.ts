import { NextResponse } from "next/server";
import { getSessionContext } from "@/server/auth/session";
import { requireManagedCourse, CourseAccessError } from "@/server/permissions/courses";
import { updateCourseThumbnailPath } from "@/server/repositories/courses";
import {
  buildCourseThumbnailPath,
  removeStorageObjects,
  uploadFileToStorage,
} from "@/server/storage/files";
import { isSupabaseConfigured } from "@/lib/env";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { profile } = await getSessionContext();
  if (!profile) {
    return NextResponse.json(
      { error: "You are not allowed to update course thumbnails." },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const courseId = String(formData.get("courseId") || "");
  const file = formData.get("file");

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is missing." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "An image file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Course thumbnails must be images." }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Course thumbnails must be smaller than 8 MB." }, { status: 400 });
  }

  let assets;

  try {
    assets = await requireManagedCourse(profile, courseId);
  } catch (error) {
    if (error instanceof CourseAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to load this course." }, { status: 500 });
  }

  const nextPath = buildCourseThumbnailPath(courseId, file.name);

  try {
    await uploadFileToStorage("course-thumbnails", nextPath, file);
    await updateCourseThumbnailPath(courseId, nextPath);
    await removeStorageObjects([
      {
        bucket: "course-thumbnails",
        paths: [assets.course.thumbnail_path],
      },
    ]);
  } catch (error) {
    await removeStorageObjects([
      {
        bucket: "course-thumbnails",
        paths: [nextPath],
      },
    ]);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to update course thumbnail.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { profile } = await getSessionContext();
  if (!profile) {
    return NextResponse.json(
      { error: "You are not allowed to update course thumbnails." },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const courseId = url.searchParams.get("courseId") || "";

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is missing." }, { status: 400 });
  }

  let assets;

  try {
    assets = await requireManagedCourse(profile, courseId);
  } catch (error) {
    if (error instanceof CourseAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to load this course." }, { status: 500 });
  }

  try {
    await updateCourseThumbnailPath(courseId, null);
    await removeStorageObjects([
      {
        bucket: "course-thumbnails",
        paths: [assets.course.thumbnail_path],
      },
    ]);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to remove course thumbnail.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
