import { getTranslations } from "next-intl/server";
import { Clock3, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApprovalForm } from "@/features/admin/components/approval-form";
import type { ApprovalStatus, AppRole } from "@/lib/types/database";

type Props = {
  locale: string;
  profile: {
    id: string;
    full_name: string;
    email?: string | null;
    role: AppRole;
    approval_status: ApprovalStatus;
    bio: string;
    created_at?: string;
    application?: {
      primary_interest?: string;
      previous_courses?: string;
      has_taken_courses?: boolean;
      submitted_at?: string;
    } | null;
  };
};

function getStatusVariant(status: ApprovalStatus) {
  switch (status) {
    case "approved":
      return "default";
    case "rejected":
      return "outline";
    default:
      return "muted";
  }
}

export async function AdminUserCard({ locale, profile }: Props) {
  const t = await getTranslations({ locale, namespace: "admin.userCard" });
  const tRoles = await getTranslations({ locale, namespace: "common.roles" });
  const submittedLabel = profile.application?.submitted_at
    ? new Intl.DateTimeFormat(locale).format(new Date(profile.application.submitted_at))
    : profile.created_at
      ? new Intl.DateTimeFormat(locale).format(new Date(profile.created_at))
      : t("unknown");

  return (
    <Card tone="soft">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
            <CardDescription className="max-w-2xl leading-6">
              {profile.bio || t("noBio")}
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(profile.approval_status)} className="rounded-full px-3 py-1">
            {t(`statuses.${profile.approval_status}`)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full px-3 py-1">{tRoles(profile.role)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-6 pt-0">

        <div className="grid gap-3 sm:grid-cols-2">
          <Card tone="subtle" className="sm:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.24em]">{t("contactLabel")}</span>
              </div>
              <p className="mt-2 break-all text-sm font-medium text-foreground">
                {profile.email || t("emailUnavailable")}
              </p>
            </CardContent>
          </Card>
          <Card tone="subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserRound className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.24em]">{t("roleLabel")}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{tRoles(profile.role)}</p>
            </CardContent>
          </Card>

          <Card tone="subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.24em]">{t("approvalLabel")}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {t(`statuses.${profile.approval_status}`)}
              </p>
            </CardContent>
          </Card>
          <Card tone="subtle" className="sm:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.24em]">{t("timelineLabel")}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {t("submittedDate", { date: submittedLabel })}
              </p>
            </CardContent>
          </Card>
        </div>

        {profile.application ? (
          <Card tone="subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.24em]">{t("studentContextLabel")}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {t("interestLabel")}: {profile.application.primary_interest || t("notSpecified")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("previousStudyExperience")}: {profile.application.has_taken_courses ? t("yes") : t("no")}
              </p>
              {profile.application.previous_courses ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("previousStudyDetails")}: {profile.application.previous_courses}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
          <ApprovalForm
            locale={locale}
            profileId={profile.id}
            approvalStatus={profile.approval_status}
            role={profile.role}
          />
        </div>
      </CardContent>
    </Card>
  );
}
