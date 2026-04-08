import { useTranslations } from "next-intl";
import { CheckCircle2, Clock3, Eye, XCircle } from "lucide-react";
import { reviewEnrollmentAction } from "@/features/enrollments/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { EnrollmentRowData } from "@/lib/types/domain";
import { Link } from "@/lib/navigation";

type Props = {
  enrollment: EnrollmentRowData;
  locale: string;
};

function getStatusConfig(
  t: ReturnType<typeof useTranslations>,
  status: EnrollmentRowData["status"]
) {
  switch (status) {
    case "approved":
      return {
        label: t("approved"),
        variant: "default" as const,
        tone: "accent" as const,
        helper: t("approvedHelper"),
        icon: CheckCircle2,
      };
    case "rejected":
      return {
        label: t("rejected"),
        variant: "outline" as const,
        tone: "subtle" as const,
        helper: t("rejectedHelper"),
        icon: XCircle,
      };
    default:
      return {
        label: t("pending"),
        variant: "muted" as const,
        tone: "strong" as const,
        helper: t("pendingHelper"),
        icon: Clock3,
      };
  }
}

export function EnrollmentReviewCard({ enrollment, locale }: Props) {
  const t = useTranslations("enrollments.reviewCard");
  const tCommon = useTranslations("common.labels");
  const status = getStatusConfig(t, enrollment.status);
  const StatusIcon = status.icon;

  return (
    <Card tone={status.tone} className="overflow-hidden">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={status.variant} className="rounded-full px-3 py-1">{status.label}</Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            {t("appliedOn", { date: new Date(enrollment.appliedAt).toLocaleDateString() })}
          </Badge>
          {enrollment.reviewedAt ? (
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {t("reviewedOn", { date: new Date(enrollment.reviewedAt).toLocaleDateString() })}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            <span>{t("reviewLabel")}</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>{enrollment.courseSlug}</span>
          </div>
          <h3 className="text-2xl font-semibold text-foreground">{enrollment.studentName}</h3>
          <p className="text-sm text-muted-foreground">
            {t("requestingAccess", { course: enrollment.courseTitle })}
          </p>
          <div className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <StatusIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{status.helper}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {enrollment.courseType ? <Badge variant="outline">{enrollment.courseType}</Badge> : null}
          {enrollment.courseLevel ? (
            <Badge variant="outline">{enrollment.courseLevel}</Badge>
          ) : null}
          {enrollment.courseStatus ? (
            <Badge variant="outline">{enrollment.courseStatus}</Badge>
          ) : null}
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
              {tCommon("courseContext")}
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">{enrollment.courseTitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <form action={reviewEnrollmentAction}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="enrollmentId" value={enrollment.id} />
            <input type="hidden" name="status" value="approved" />
            <Button
              type="submit"
              size="sm"
              variant={enrollment.status === "approved" ? "secondary" : "hero"}
            >
              {t("approve")}
            </Button>
          </form>
          <form action={reviewEnrollmentAction}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="enrollmentId" value={enrollment.id} />
            <input type="hidden" name="status" value="rejected" />
            <Button
              type="submit"
              size="sm"
              variant={enrollment.status === "rejected" ? "secondary" : "outline"}
            >
              {t("reject")}
            </Button>
          </form>
          <Button asChild size="sm" variant="outline" className="px-4">
            <Link href={`/courses/${enrollment.courseId}`} locale={locale}>
              <Eye className="h-4 w-4" />
              {t("openCoursePage")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
