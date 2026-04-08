import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function listReviewsForCourse(courseId: string) {
  const supabase = createSupabaseServerClient();
  const { data: reviews } = await supabase
    .from("course_reviews")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (!reviews?.length) {
    return [];
  }

  const studentIds = Array.from(new Set(reviews.map((review) => review.student_id)));
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", studentIds);

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.full_name])
  );

  return reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    studentName: profileMap.get(review.student_id) ?? "Student",
    createdAt: review.created_at,
  }));
}

export async function getReviewStats(courseIds: string[]) {
  if (!courseIds.length) {
    return new Map<string, { count: number; average: number | null }>();
  }

  const supabase = createSupabaseServerClient();
  const { data: reviews } = await supabase
    .from("course_reviews")
    .select("course_id, rating")
    .in("course_id", courseIds);

  const bucket = new Map<string, { sum: number; count: number }>();

  for (const review of reviews ?? []) {
    const item = bucket.get(review.course_id) ?? { sum: 0, count: 0 };
    item.sum += review.rating;
    item.count += 1;
    bucket.set(review.course_id, item);
  }

  return new Map(
    Array.from(bucket.entries()).map(([courseId, entry]) => [
      courseId,
      {
        count: entry.count,
        average: entry.count ? entry.sum / entry.count : null,
      },
    ])
  );
}

export async function upsertCourseReview(
  courseId: string,
  studentId: string,
  rating: number,
  comment?: string
) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("course_reviews").upsert(
    {
      course_id: courseId,
      student_id: studentId,
      rating,
      comment: comment?.trim() || null,
    },
    { onConflict: "course_id,student_id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}
