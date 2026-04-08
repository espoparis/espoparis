import { useTranslations } from "next-intl";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import type { SessionProfile } from "@/lib/types/domain";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ProfileIdentityCard({
  label,
  profile,
}: {
  label: string;
  profile: SessionProfile;
}) {
  const t = useTranslations("common.labels");

  return (
    <Card tone="subtle">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{label}</CardTitle>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Profile identity
          </Badge>
        </div>
        <CardDescription className="max-w-xl leading-6">
          Profile details that will stay consistent across the academy experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <div className="surface-subtle rounded-[1.35rem] border border-border/60 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserRound className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-[0.24em]">{t("role")}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">{profile.role}</p>
        </div>
        <div className="surface-subtle rounded-[1.35rem] border border-border/60 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-[0.24em]">{t("approval")}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">{profile.approvalStatus}</p>
        </div>
        <div className="surface-subtle rounded-[1.35rem] border border-border/60 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-[0.24em]">{t("email")}</span>
          </div>
          <p className="mt-2 break-all text-sm font-medium text-foreground">{profile.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
