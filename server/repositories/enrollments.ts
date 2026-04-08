import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EnrollmentRowData, StudentEnrollmentRowData } from "@/lib/types/domain";
import { getPublicStorageUrl } from "@/server/storage/urls";

export async function listStudentEnrollments(
  studentId: string
): Promise<StudentEnrollmentRowData[]> {
  const supabase = createSupabaseServerClient();
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", studentId)
    .order("applied_at", { ascending: false });

  if (!enrollments?.length) {
    return [];
  }

  const courseIds = Array.from(new Set(enrollments.map((item) => item.course_id)));
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, thumbnail_path, type, level, duration_label, teacher_id")
    .in("id", courseIds);

  const courseMap = new Map((courses ?? []).map((course) => [course.id, course]));
  const teacherIds = Array.from(
    new Set((courses ?? []).map((course) => course.teacher_id).filter(Boolean))
  );
  const { data: teachers } = teacherIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", teacherIds)
    : { data: [] as Array<{ id: string; full_name: string }> };
  const teacherMap = new Map((teachers ?? []).map((teacher) => [teacher.id, teacher.full_name]));
  const { data: media } = await supabase
    .from("course_media")
    .select("course_id")
    .in("course_id", courseIds);
  const mediaCountMap = new Map<string, number>();

  for (const item of media ?? []) {
    mediaCountMap.set(item.course_id, (mediaCountMap.get(item.course_id) ?? 0) + 1);
  }

  return enrollments.map((enrollment) => ({
    id: enrollment.id,
    courseId: enrollment.course_id,
    courseTitle: courseMap.get(enrollment.course_id)?.title ?? "Course",
    courseSlug: courseMap.get(enrollment.course_id)?.slug ?? enrollment.course_id,
    courseThumbnailUrl: getPublicStorageUrl(
      "course-thumbnails",
      courseMap.get(enrollment.course_id)?.thumbnail_path ?? null
    ),
    courseType: courseMap.get(enrollment.course_id)?.type ?? null,
    courseLevel: courseMap.get(enrollment.course_id)?.level ?? null,
    durationLabel: courseMap.get(enrollment.course_id)?.duration_label ?? null,
    teacherName:
      teacherMap.get(courseMap.get(enrollment.course_id)?.teacher_id ?? "") ?? "Faculty",
    mediaCount: mediaCountMap.get(enrollment.course_id) ?? 0,
    status: enrollment.status,
    appliedAt: enrollment.applied_at,
  }));
}

export async function listTeacherEnrollments(
  teacherId: string
): Promise<EnrollmentRowData[]> {
  const supabase = createSupabaseServerClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, type, level, status")
    .eq("teacher_id", teacherId);

  if (!courses?.length) {
    return [];
  }

  const courseIds = courses.map((course) => course.id);
  const courseMap = new Map(courses.map((course) => [course.id, course]));

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .in("course_id", courseIds)
    .order("applied_at", { ascending: false });

  if (!enrollments?.length) {
    return [];
  }

  const studentIds = Array.from(new Set(enrollments.map((item) => item.student_id)));
  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", studentIds);

  const studentMap = new Map(
    (students ?? []).map((student) => [student.id, student.full_name])
  );

  return enrollments.map((enrollment) => ({
    id: enrollment.id,
    courseId: enrollment.course_id,
    courseTitle: courseMap.get(enrollment.course_id)?.title ?? "Course",
    courseSlug: courseMap.get(enrollment.course_id)?.slug ?? enrollment.course_id,
    courseType: courseMap.get(enrollment.course_id)?.type ?? null,
    courseLevel: courseMap.get(enrollment.course_id)?.level ?? null,
    courseStatus: courseMap.get(enrollment.course_id)?.status ?? null,
    studentId: enrollment.student_id,
    studentName: studentMap.get(enrollment.student_id) ?? "Student",
    status: enrollment.status,
    appliedAt: enrollment.applied_at,
    reviewedAt: enrollment.reviewed_at,
  }));
}

export async function createEnrollment(courseId: string, studentId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("enrollments").insert({
    course_id: courseId,
    student_id: studentId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function reviewEnrollment(
  enrollmentId: string,
  reviewedBy: string,
  status: "approved" | "rejected"
) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("enrollments")
    .update({
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", enrollmentId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getEnrollmentNotificationData(enrollmentId: string) {
  const supabase = createSupabaseServerClient();
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("student_id, status, course_id")
    .eq("id", enrollmentId)
    .single();

  if (enrollmentError) {
    throw new Error(enrollmentError.message);
  }

  const [{ data: student, error: studentError }, { data: course, error: courseError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", enrollment.student_id)
        .single(),
      supabase
        .from("courses")
        .select("id, title")
        .eq("id", enrollment.course_id)
        .single(),
    ]);

  if (studentError) {
    throw new Error(studentError.message);
  }

  if (courseError) {
    throw new Error(courseError.message);
  }

  return {
    studentId: enrollment.student_id,
    studentName: student.full_name,
    courseTitle: course.title,
    status: enrollment.status,
  };
}
