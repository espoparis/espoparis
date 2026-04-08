import type { PublicTeacherSummary } from "@/lib/types/domain";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/server/storage/urls";

export async function listPublicTeachers(limit = 3): Promise<PublicTeacherSummary[]> {
  const supabase = createSupabaseServerClient();
  const { data: teachers } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_path, bio")
    .eq("role", "teacher")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  const teacherIds = (teachers ?? []).map((teacher) => teacher.id);

  const { data: courses } = teacherIds.length
    ? await supabase
        .from("courses")
        .select("teacher_id")
        .eq("status", "published")
        .in("teacher_id", teacherIds)
    : { data: [] as Array<{ teacher_id: string }> };

  const courseCountMap = new Map<string, number>();

  for (const course of courses ?? []) {
    courseCountMap.set(
      course.teacher_id,
      (courseCountMap.get(course.teacher_id) ?? 0) + 1
    );
  }

  return (teachers ?? []).map((teacher) => ({
    id: teacher.id,
    fullName: teacher.full_name,
    bio: teacher.bio,
    avatarUrl: getPublicStorageUrl("avatars", teacher.avatar_path),
    publishedCourseCount: courseCountMap.get(teacher.id) ?? 0,
  }));
}
