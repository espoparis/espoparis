import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, Clock3, Eye, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StudentEnrollmentRowData } from "@/lib/types/domain";
import { Link } from "@/lib/navigation";

type Props = {
  enrollment: StudentEnrollmentRowData;
  locale: string;
  mode: "application" | "active";
};

function getStatusConfig(
  t: ReturnType<typeof useTranslations>,
  status: StudentEnrollmentRowData["status"]
) {
  switch (status) {
    case "approved":
      return {
        label: t("approved"),
        variant: "default" as const,
        icon: CheckCircle2,
        description: t("approvedDescription"),
        tone: "accent" as const,
      };
    case "rejected":
      return {
        label: t("rejected"),
        variant: "outline" as const,
        icon: XCircle,
        description: t("rejectedDescription"),
        tone: "subtle" as const,
      };
    default:
      return {
        label: t("pending"),
        variant: "muted" as const,
        icon: Clock3,
        description: t("pendingDescription"),
        tone: "soft" as const,
      };
  }
}

export function StudentEnrollmentCard({ enrollment, locale, mode }: Props) {
  const t = useTranslations("enrollments.card");
  const tCommon = useTranslations("common.labels");
  const status = getStatusConfig(t, enrollment.status);
  const StatusIcon = status.icon;
  const metaBadges = [
    enrollment.courseType,
    enrollment.courseLevel,
    enrollment.durationLabel,
    enrollment.mediaCount ? t("assets", { count: enrollment.mediaCount }) : null,
  ].filter(Boolean);

  return (
    <Card tone={status.tone} className="overflow-hidden">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={status.variant} className="rounded-full px-3 py-1">{status.label}</Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            {t("appliedOn", { date: new Date(enrollment.appliedAt).toLocaleDateString() })}
          </Badge>
        </div>

        <div className="space-y-2">
        <div
            className="surface-subtle h-36 rounded-[1.5rem] border border-border/60 bg-cover bg-center"
            style={{
              backgroundImage: enrollment.courseThumbnailUrl
                ? `url(${enrollment.courseThumbnailUrl})`
                : undefined,
            }}
          />
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <span>{mode === "active" ? t("learningLane") : t("applicationTrack")}</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>{enrollment.courseSlug}</span>
          </div>
          <h3 className="text-2xl font-semibold text-foreground">
            {enrollment.courseTitle}
          </h3>
          <p className="text-sm text-muted-foreground">{t("teacher", { name: enrollment.teacherName })}</p>
          <div className="flex flex-wrap gap-2">
            {metaBadges.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
          <div className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <StatusIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{status.description}</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="surface-subtle p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {tCommon("currentState")}
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">{status.label}</p>
          </div>
          <div className="surface-subtle p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {tCommon("studentFlow")}
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">
              {mode === "active" ? t("activeFlow") : t("applicationFlow")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="hero">
            <Link href={`/courses/${enrollment.courseId}`} locale={locale}>
              <Eye className="h-4 w-4" />
              {mode === "active" ? t("continueLearning") : t("openCourse")}
            </Link>
          </Button>

          {mode === "application" && enrollment.status === "pending" ? (
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link href="/courses" locale={locale}>
                {t("browseMoreCourses")}
              </Link>
            </Button>
          ) : null}

          {mode === "active" ? (
            <Button asChild variant="ghost" className="rounded-full px-5">
              <Link href={`/courses/${enrollment.courseId}`} locale={locale}>
                <ArrowRight className="h-4 w-4" />
                {t("viewLessonAssets")}
              </Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
