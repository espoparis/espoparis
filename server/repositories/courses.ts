import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CourseStatus, CourseType } from "@/lib/types/database";

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function getCourseStorageAssets(courseId: string) {
  const supabase = createSupabaseServerClient();
  const [{ data: course }, { data: media }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, teacher_id, thumbnail_path")
      .eq("id", courseId)
      .maybeSingle(),
    supabase
      .from("course_media")
      .select("storage_path, thumbnail_path")
      .eq("course_id", courseId),
  ]);

  return {
    course,
    media: media ?? [],
  };
}

export async function updateCourseThumbnailPath(
  courseId: string,
  thumbnailPath: string | null
) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .update({ thumbnail_path: thumbnailPath })
    .eq("id", courseId)
    .select("id, teacher_id, thumbnail_path")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCourseMediaAssetById(mediaId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("course_media")
    .select("id, course_id, title, kind, storage_path, thumbnail_path")
    .eq("id", mediaId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getNextCourseMediaSortOrder(courseId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("course_media")
    .select("sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data?.sort_order ?? -1) + 1;
}

export async function updateCourseMediaTitle(mediaId: string, title: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("course_media")
    .update({ title })
    .eq("id", mediaId)
    .select("id, course_id, title")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function normalizeCourseMediaSortOrder(courseId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("course_media")
    .select("id")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const orderedItems = data ?? [];

  await Promise.all(
    orderedItems.map((item, index) =>
      supabase.from("course_media").update({ sort_order: index }).eq("id", item.id)
    )
  );

  return orderedItems.length;
}

export async function reorderCourseMedia(
  mediaId: string,
  direction: "up" | "down"
) {
  const current = await getCourseMediaAssetById(mediaId);

  if (!current) {
    throw new Error("Media item not found.");
  }

  await normalizeCourseMediaSortOrder(current.course_id);

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("course_media")
    .select("id")
    .eq("course_id", current.course_id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const orderedItems = data ?? [];
  const currentIndex = orderedItems.findIndex((item) => item.id === mediaId);

  if (currentIndex === -1) {
    throw new Error("Media item not found.");
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= orderedItems.length) {
    return { courseId: current.course_id };
  }

  const nextOrder = [...orderedItems];
  [nextOrder[currentIndex], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[currentIndex]];

  await Promise.all(
    nextOrder.map((item, index) =>
      supabase.from("course_media").update({ sort_order: index }).eq("id", item.id)
    )
  );

  return { courseId: current.course_id };
}

export async function saveCourse(input: {
  teacherId: string;
  courseId?: string;
  title: string;
  description: string;
  type: CourseType;
  level: "beginner" | "intermediate" | "advanced";
  durationLabel: string;
  status: CourseStatus;
}) {
  const supabase = createSupabaseServerClient();
  const payload = {
    teacher_id: input.teacherId,
    title: input.title,
    slug: toSlug(input.title),
    description: input.description,
    type: input.type,
    level: input.level,
    duration_label: input.durationLabel,
    status: input.status,
  };

  if (input.courseId) {
    const { data, error } = await supabase
      .from("courses")
      .update(payload)
      .eq("id", input.courseId)
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data.id;
  }

  const { data, error } = await supabase
    .from("courses")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}

export async function deleteCourse(courseId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCourseMedia(mediaId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("course_media")
    .delete()
    .eq("id", mediaId)
    .select("course_id, storage_path, thumbnail_path")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await normalizeCourseMediaSortOrder(data.course_id);

  return data;
}
