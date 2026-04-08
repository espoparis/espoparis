import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { SectionBlock } from "@/components/layout/section-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/layout/page-frame";
import { SetupAlert } from "@/components/shared/setup-alert";
import { CourseCard } from "@/features/courses/components/course-card";
import { CourseDetailHero } from "@/features/courses/components/course-detail-hero";
import { CourseLearningPanel } from "@/features/courses/components/course-learning-panel";
import { CourseMediaList } from "@/features/courses/components/course-media-list";
import { ReviewForm } from "@/features/reviews/components/review-form";
import {
  getEnrollmentForCourse,
  getCourseDetail,
  listRelatedPublishedCourses,
} from "@/server/queries/courses";
import { getSessionContext } from "@/server/auth/session";
import { isSupabaseConfigured } from "@/lib/env";

export default async function CourseDetailPage({
  params,
}: {
  params: { locale: string; courseId: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "courseDetail" });
  if (!isSupabaseConfigured()) {
    return (
      <PageFrame className="py-10">
        <SetupAlert />
      </PageFrame>
    );
  }

  const course = await getCourseDetail(params.courseId);

  if (!course) {
    notFound();
  }

  const { profile } = await getSessionContext();
  const enrollment =
    profile?.role === "student"
      ? await getEnrollmentForCourse(course.id, profile.id)
      : null;
  const relatedCourses = await listRelatedPublishedCourses(course.id, {
    type: course.type,
    level: course.level,
    limit: 3,
  });

  const canAccessMedia =
    profile?.role === "admin" ||
    profile?.id === course.teacherId ||
    enrollment?.status === "approved";

  const accessState =
    profile?.role === "admin"
      ? "admin"
      : profile?.id === course.teacherId
        ? "teacher"
        : profile?.role === "student" && enrollment?.status === "approved"
          ? "student-approved"
          : profile?.role === "student" && enrollment
            ? "student-pending"
            : profile?.role === "student"
              ? "student-not-applied"
              : "guest";

  return (
    <PageFrame className="py-8 sm:py-10 lg:py-12">
      <CourseDetailHero locale={params.locale} course={course} />

      <section className="section-space grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="content-cluster">
          <CourseLearningPanel
            locale={params.locale}
            courseId={course.id}
            courseTitle={course.title}
            mediaCount={course.media.length}
            reviewCount={course.reviews.length}
            accessState={accessState}
            enrollmentStatus={enrollment?.status ?? null}
          />

          <CourseMediaList
            locale={params.locale}
            media={course.media}
            accessState={accessState}
          />
        </div>

        <div className="content-cluster">
          <Card tone="strong" className="display-shadow lg:sticky lg:top-28 lg:self-start">
            <CardHeader className="space-y-2">
              <CardTitle>{t("accessTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!profile ? (
                <div className="inset-panel">
                  <p className="font-medium">{t("guestTitle")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("guestDescription")}
                  </p>
                </div>
              ) : null}

              {profile?.role === "student" && !enrollment ? (
                <div className="inset-panel">
                  <p className="font-medium">{t("notStartedTitle")}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("notStartedDescription")}
                  </p>
                </div>
              ) : null}

              {profile?.role === "student" && enrollment ? (
                <div className="inset-panel">
                  <p className="font-medium">{t("applicationStatus", { status: enrollment.status })}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {enrollment.status === "approved"
                      ? t("approvedDescription")
                      : t("pendingDescription")}
                  </p>
                </div>
              ) : null}

              {(profile?.role === "teacher" || profile?.role === "admin") && canAccessMedia ? (
                <div className="inset-panel text-sm text-muted-foreground">
                  {t("managerDescription")}
                </div>
              ) : null}

              {profile?.role === "student" && enrollment?.status === "approved" ? (
                <div className="surface-accent p-5 text-sm text-muted-foreground">
                  {t("approvedNotice")}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card tone="strong" className="display-shadow">
            <CardHeader className="space-y-2">
              <CardTitle>{t("feedbackTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.reviews.length ? (
                course.reviews.map((review) => (
                  <div key={review.id} className="inset-panel">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{review.studentName}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-current text-primary" />
                        {review.rating}/5
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {review.comment || t("noComment")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("noReviews")}
                </p>
              )}
            </CardContent>
          </Card>

          {profile?.role === "student" && enrollment?.status === "approved" ? (
            <ReviewForm locale={params.locale} courseId={course.id} />
          ) : null}
        </div>
      </section>

      {relatedCourses.length ? (
        <SectionBlock
          eyebrow={t("relatedEyebrow")}
          title={t("relatedTitle")}
          description={t("relatedDescription")}
          className="section-space"
          contentClassName="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {relatedCourses.map((relatedCourse) => (
            <CourseCard
              key={relatedCourse.id}
              course={relatedCourse}
              locale={params.locale}
            />
          ))}
        </SectionBlock>
      ) : null}
    </PageFrame>
  );
}
