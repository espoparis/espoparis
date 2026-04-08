import { getTranslations } from "next-intl/server";
import { ArrowRight, CheckCircle2, Clock3, LayoutList, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplyButton } from "@/features/enrollments/components/apply-button";
import { Link } from "@/lib/navigation";

type CourseAccessState =
  | "guest"
  | "student-not-applied"
  | "student-pending"
  | "student-approved"
  | "teacher"
  | "admin";

type Props = {
  locale: string;
  courseId: string;
  courseTitle: string;
  mediaCount: number;
  reviewCount: number;
  accessState: CourseAccessState;
  enrollmentStatus: "pending" | "approved" | "rejected" | null;
};

async function getPanelCopy(locale: string, accessState: CourseAccessState) {
  const t = await getTranslations({ locale, namespace: "courseDetail.learning.panels" });

  switch (accessState) {
    case "student-approved":
      return {
        badge: t("studentApproved.badge"),
        title: t("studentApproved.title"),
        description: t("studentApproved.description"),
        nextStep: t("studentApproved.nextStep"),
        helper: t("studentApproved.helper"),
      };
    case "student-pending":
      return {
        badge: t("studentPending.badge"),
        title: t("studentPending.title"),
        description: t("studentPending.description"),
        nextStep: t("studentPending.nextStep"),
        helper: t("studentPending.helper"),
      };
    case "student-not-applied":
      return {
        badge: t("studentNotApplied.badge"),
        title: t("studentNotApplied.title"),
        description: t("studentNotApplied.description"),
        nextStep: t("studentNotApplied.nextStep"),
        helper: t("studentNotApplied.helper"),
      };
    case "teacher":
      return {
        badge: t("teacher.badge"),
        title: t("teacher.title"),
        description: t("teacher.description"),
        nextStep: t("teacher.nextStep"),
        helper: t("teacher.helper"),
      };
    case "admin":
      return {
        badge: t("admin.badge"),
        title: t("admin.title"),
        description: t("admin.description"),
        nextStep: t("admin.nextStep"),
        helper: t("admin.helper"),
      };
    default:
      return {
        badge: t("guest.badge"),
        title: t("guest.title"),
        description: t("guest.description"),
        nextStep: t("guest.nextStep"),
        helper: t("guest.helper"),
      };
  }
}

async function getSteps(locale: string, accessState: CourseAccessState) {
  const t = await getTranslations({ locale, namespace: "courseDetail.learning.steps" });

  switch (accessState) {
    case "student-approved":
      return [
        t("studentApproved.first"),
        t("studentApproved.second"),
        t("studentApproved.third"),
      ];
    case "student-pending":
      return [
        t("studentPending.first"),
        t("studentPending.second"),
        t("studentPending.third"),
      ];
    case "student-not-applied":
      return [
        t("studentNotApplied.first"),
        t("studentNotApplied.second"),
        t("studentNotApplied.third"),
      ];
    case "teacher":
    case "admin":
      return [t("manager.first"), t("manager.second"), t("manager.third")];
    default:
      return [t("guest.first"), t("guest.second"), t("guest.third")];
  }
}

async function getAccessLabel(
  locale: string,
  accessState: CourseAccessState,
  enrollmentStatus: Props["enrollmentStatus"],
) {
  const t = await getTranslations({ locale, namespace: "courseDetail.learning.access" });

  if (enrollmentStatus) {
    return t(enrollmentStatus);
  }

  switch (accessState) {
    case "student-not-applied":
      return t("notApplied");
    case "student-approved":
      return t("approved");
    case "student-pending":
      return t("pending");
    case "teacher":
      return t("teacher");
    case "admin":
      return t("admin");
    default:
      return t("guest");
  }
}

export async function CourseLearningPanel({
  locale,
  courseId,
  courseTitle,
  mediaCount,
  reviewCount,
  accessState,
  enrollmentStatus,
}: Props) {
  const t = await getTranslations({ locale, namespace: "courseDetail.learning" });
  const copy = await getPanelCopy(locale, accessState);
  const steps = await getSteps(locale, accessState);
  const accessLabel = await getAccessLabel(locale, accessState, enrollmentStatus);

  return (
    <Card tone="strong" className="display-shadow">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="secondary" className="rounded-full px-3 py-1">{copy.badge}</Badge>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <LayoutList className="h-4 w-4 text-primary" />
            {t("hubLabel")}
          </div>
        </div>
        <CardTitle>{copy.title}</CardTitle>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {courseTitle}
        </p>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {copy.description}
        </p>
      </CardHeader>

      <CardContent className="content-cluster pt-0">
        <div className="metric-strip">
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {t("metrics.lessons")}
            </p>
            <p className="mt-2 text-2xl font-semibold">{mediaCount}</p>
          </div>
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {t("metrics.reviews")}
            </p>
            <p className="mt-2 text-2xl font-semibold">{reviewCount}</p>
          </div>
          <div className="metric-tile">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {t("metrics.access")}
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">{accessLabel}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {t("nextSteps")}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="inset-panel"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                    {index + 1}
                  </span>
                  <span>{t("step", { number: index + 1 })}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-accent p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                {copy.nextStep}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{copy.helper}</p>
            </div>

            {accessState === "guest" ? (
              <Button asChild variant="hero" size="lg">
                <Link href="/auth/login" locale={locale}>
                  <ArrowRight className="h-4 w-4" />
                  {t("actions.signIn")}
                </Link>
              </Button>
            ) : null}

            {accessState === "student-not-applied" ? (
              <ApplyButton locale={locale} courseId={courseId} />
            ) : null}

            {accessState === "student-pending" ? (
              <Button asChild variant="hero" size="lg">
                <Link href="/student/applications" locale={locale}>
                  <ArrowRight className="h-4 w-4" />
                  {t("actions.viewApplications")}
                </Link>
              </Button>
            ) : null}

            {accessState === "student-approved" ? (
              <Button asChild variant="hero" size="lg">
                <Link href="/student/courses" locale={locale}>
                  <CheckCircle2 className="h-4 w-4" />
                  {t("actions.openCourses")}
                </Link>
              </Button>
            ) : null}

            {accessState === "teacher" ? (
              <Button asChild variant="hero" size="lg">
                <Link href="/teacher/courses" locale={locale}>
                  <ArrowRight className="h-4 w-4" />
                  {t("actions.openWorkspace")}
                </Link>
              </Button>
            ) : null}

            {accessState === "admin" ? (
              <Button asChild variant="hero" size="lg">
                <Link href="/admin" locale={locale}>
                  <ArrowRight className="h-4 w-4" />
                  {t("actions.openWorkspace")}
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
