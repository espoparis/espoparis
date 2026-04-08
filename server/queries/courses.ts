import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CourseCardData, CourseDetailData, CourseMediaItem } from "@/lib/types/domain";
import type { CourseLevel, CourseStatus, CourseType, MediaKind } from "@/lib/types/database";
import { getPublicStorageUrl } from "@/server/storage/urls";
import { getReviewStats, listReviewsForCourse } from "@/server/repositories/reviews";

type PublishedCourseFilters = {
  query?: string;
  type?: CourseType | "all";
  level?: CourseLevel | "all";
};

function bytesToLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function getTeacherMap(teacherIds: string[]) {
  if (!teacherIds.length) {
    return new Map<string, { full_name: string; avatar_path: string | null }>();
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_path")
    .in("id", teacherIds);

  return new Map(
    (data ?? []).map((profile) => [
      profile.id,
      { full_name: profile.full_name, avatar_path: profile.avatar_path },
    ])
  );
}

function mapMedia(media: {
  id: string;
  course_id: string;
  kind: MediaKind;
  title: string;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number | null;
  thumbnail_path: string | null;
}): CourseMediaItem {
  return {
    id: media.id,
    courseId: media.course_id,
    kind: media.kind,
    title: media.title,
    mimeType: `${media.mime_type} · ${bytesToLabel(media.size_bytes)}`,
    sizeBytes: media.size_bytes,
    durationSeconds: media.duration_seconds,
    thumbnailUrl: getPublicStorageUrl("course-thumbnails", media.thumbnail_path),
  };
}

async function hydrateCourseCards(
  courses: Array<{
    id: string;
    teacher_id: string;
    title: string;
    slug: string;
    description: string;
    type: CourseType;
    level: "beginner" | "intermediate" | "advanced";
    status: CourseStatus;
    duration_label: string;
    thumbnail_path: string | null;
  }>
): Promise<CourseCardData[]> {
  const teacherMap = await getTeacherMap(
    Array.from(new Set(courses.map((course) => course.teacher_id)))
  );
  const reviewStats = await getReviewStats(courses.map((course) => course.id));

  return courses.map((course) => {
    const teacher = teacherMap.get(course.teacher_id);
    const review = reviewStats.get(course.id);

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      type: course.type,
      level: course.level,
      status: course.status,
      durationLabel: course.duration_label,
      thumbnailUrl: getPublicStorageUrl("course-thumbnails", course.thumbnail_path),
      teacherName: teacher?.full_name ?? "Faculty",
      teacherAvatarUrl: getPublicStorageUrl("avatars", teacher?.avatar_path ?? null),
      reviewCount: review?.count ?? 0,
      averageRating: review?.average ?? null,
    };
  });
}

function normalizeSearchTerm(value?: string) {
  return value?.trim().replace(/[,%()]/g, " ") ?? "";
}

export async function listPublishedCourses(filters: PublishedCourseFilters = {}) {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  if (filters.level && filters.level !== "all") {
    query = query.eq("level", filters.level);
  }

  const searchTerm = normalizeSearchTerm(filters.query);

  if (searchTerm) {
    query = query.ilike("title", `%${searchTerm}%`);
  }

  const { data: courses } = await query;

  return hydrateCourseCards(courses ?? []);
}

export async function listRelatedPublishedCourses(
  courseId: string,
  filters: {
    type: CourseType;
    level: CourseLevel;
    limit?: number;
  }
) {
  const supabase = createSupabaseServerClient();
  const limit = filters.limit ?? 3;

  const { data: primaryMatches } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .eq("type", filters.type)
    .eq("level", filters.level)
    .neq("id", courseId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if ((primaryMatches ?? []).length >= limit) {
    return hydrateCourseCards(primaryMatches ?? []);
  }

  const missing = limit - (primaryMatches?.length ?? 0);

  const { data: fallbackMatches } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .neq("id", courseId)
    .neq("type", filters.type)
    .order("created_at", { ascending: false })
    .limit(missing);

  return hydrateCourseCards([...(primaryMatches ?? []), ...(fallbackMatches ?? [])]);
}

export async function listTeacherCourses(teacherId: string) {
  const supabase = createSupabaseServerClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("updated_at", { ascending: false });

  return hydrateCourseCards(courses ?? []);
}

export async function listAllCourses() {
  const supabase = createSupabaseServerClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("updated_at", { ascending: false });

  return hydrateCourseCards(courses ?? []);
}

export async function getCourseDetail(courseId: string): Promise<CourseDetailData | null> {
  const supabase = createSupabaseServerClient();
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .maybeSingle();

  if (!course) {
    return null;
  }

  const teacherMap = await getTeacherMap([course.teacher_id]);
  const teacher = teacherMap.get(course.teacher_id);
  const reviewStats = await getReviewStats([course.id]);
  const reviews = await listReviewsForCourse(course.id);

  const { data: media } = await supabase
    .from("course_media")
    .select("*")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  const review = reviewStats.get(course.id);

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    type: course.type,
    level: course.level,
    status: course.status,
    durationLabel: course.duration_label,
    teacherId: course.teacher_id,
    thumbnailUrl: getPublicStorageUrl("course-thumbnails", course.thumbnail_path),
    teacherName: teacher?.full_name ?? "Faculty",
    teacherAvatarUrl: getPublicStorageUrl("avatars", teacher?.avatar_path ?? null),
    reviewCount: review?.count ?? 0,
    averageRating: review?.average ?? null,
    media: (media ?? []).map(mapMedia),
    reviews,
  };
}

export async function getEnrollmentForCourse(courseId: string, studentId: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("student_id", studentId)
    .maybeSingle();

  return data;
}
