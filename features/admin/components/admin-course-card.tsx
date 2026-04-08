import { getTranslations } from "next-intl/server";
import { AlertTriangle, BookOpenText, RadioTower, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CourseCardData } from "@/lib/types/domain";
import { Link } from "@/lib/navigation";

type Props = {
  course: CourseCardData;
  locale: string;
};

function getStatusVariant(status: CourseCardData["status"]) {
  switch (status) {
    case "published":
      return "default";
    case "draft":
      return "muted";
    default:
      return "outline";
  }
}

function getSignal(course: CourseCardData, t: Awaited<ReturnType<typeof getTranslations>>) {
  if (course.status === "draft") {
    return {
      label: t("signals.draft.label"),
      variant: "muted" as const,
      description: t("signals.draft.description"),
    };
  }

  if (course.status === "archived") {
    return {
      label: t("signals.archived.label"),
      variant: "outline" as const,
      description: t("signals.archived.description"),
    };
  }

  if (course.reviewCount === 0) {
    return {
      label: t("signals.new.label"),
      variant: "secondary" as const,
      description: t("signals.new.description"),
    };
  }

  if ((course.averageRating ?? 0) < 4) {
    return {
      label: t("signals.watch.label"),
      variant: "outline" as const,
      description: t("signals.watch.description"),
    };
  }

  return {
    label: t("signals.healthy.label"),
    variant: "default" as const,
    description: t("signals.healthy.description"),
  };
}

export async function AdminCourseCard({ course, locale }: Props) {
  const t = await getTranslations({ locale, namespace: "admin.courseCard" });
  const signal = getSignal(course, t);
  const watchLabel = t("signals.watch.label");
  const tone =
    course.status === "published"
      ? signal.label === watchLabel
        ? "strong"
        : "soft"
      : course.status === "draft"
        ? "strong"
        : "subtle";

  return (
    <Card tone={tone} className="overflow-hidden">
      <div
        className="surface-subtle h-44 w-full border-b border-border/60 bg-cover bg-center"
        style={{
          backgroundImage: course.thumbnailUrl
            ? `url(${course.thumbnailUrl})`
            : undefined,
        }}
      />

      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={signal.variant} className="rounded-full px-3 py-1">{signal.label}</Badge>
          <Badge variant={getStatusVariant(course.status)} className="rounded-full px-3 py-1">{t(`statuses.${course.status}`)}</Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">{t(`types.${course.type}`)}</Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">{t(`levels.${course.level}`)}</Badge>
          {signal.label === watchLabel ? (
            <span className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <AlertTriangle className="h-3.5 w-3.5 text-primary" />
              {t("reviewPriority")}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">{course.title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {course.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="surface-subtle p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserRound className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.24em]">{t("teacherLabel")}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{course.teacherName}</p>
          </div>
          <div className="surface-subtle p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RadioTower className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.24em]">{t("catalogSignalLabel")}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{signal.description}</p>
          </div>
          <div className="surface-subtle p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpenText className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.24em]">{t("reviewsLabel")}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {course.averageRating ? course.averageRating.toFixed(1) : t("signals.new.label")} ·{" "}
              {course.reviewCount}
            </p>
          </div>
          <div className="surface-subtle p-4 sm:col-span-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RadioTower className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-[0.24em]">{t("durationLabel")}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{course.durationLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="hero">
            <Link href={`/courses/${course.id}`} locale={locale}>
              {t("openCoursePage")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="px-5">
            <Link href="/admin/users" locale={locale}>
              {t("reviewOwnerProfile")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
