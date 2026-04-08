import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PublicCatalogStats = {
  publishedCourses: number;
  approvedTeachers: number;
  approvedEnrollments: number;
  totalReviews: number;
};

export async function getPublicCatalogStats(): Promise<PublicCatalogStats> {
  const supabase = createSupabaseServerClient();

  const [
    { count: publishedCourses },
    { count: approvedTeachers },
    { count: approvedEnrollments },
    { count: totalReviews },
  ] = await Promise.all([
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "teacher")
      .eq("approval_status", "approved"),
    supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("course_reviews")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    publishedCourses: publishedCourses ?? 0,
    approvedTeachers: approvedTeachers ?? 0,
    approvedEnrollments: approvedEnrollments ?? 0,
    totalReviews: totalReviews ?? 0,
  };
}
