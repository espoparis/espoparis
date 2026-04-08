import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { SectionBlock } from "@/components/layout/section-block";
import { requireApprovedRole } from "@/server/auth/session";
import { approvalLabels, roleLabels } from "@/lib/constants/app";
import { getPublicStorageUrl } from "@/server/storage/urls";
import { AvatarUploader } from "@/features/profiles/components/avatar-uploader";
import { ProfileIdentityCard } from "@/features/profiles/components/profile-identity-card";
import { ProfileForm } from "@/features/profiles/components/profile-form";

export default async function StudentProfilePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "profile.identity" });
  const { profile } = await requireApprovedRole(params.locale, "student");

  return (
    <div className="space-y-6">
      <WorkspaceHero
        eyebrow={t("student")}
        title="Profile settings"
        description="Keep your avatar, identity, and bio aligned across the student workspace."
        badges={
          <>
            <Badge variant="secondary">{roleLabels.student}</Badge>
            <Badge variant="outline">{approvalLabels[profile.approvalStatus]}</Badge>
          </>
        }
        actions={
          <Button asChild variant="nav" className="border border-border/60 bg-background/82">
            <Link href="/student" locale={params.locale}>
              Back to workspace
            </Link>
          </Button>
        }
      />

      <SectionBlock
        eyebrow="Identity"
        title="Profile and access details"
        description="Update the details that carry through your approved courses and learner workspace."
        contentClassName="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="space-y-6">
          <AvatarUploader
            imageUrl={getPublicStorageUrl("avatars", profile.avatarPath)}
            fullName={profile.fullName}
          />
          <ProfileIdentityCard label={t("student")} profile={profile} />
        </div>
        <ProfileForm locale={params.locale} profile={profile} />
      </SectionBlock>
    </div>
  );
}
