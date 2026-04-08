import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { WorkspaceHero } from "@/components/layout/workspace-hero";
import { SectionBlock } from "@/components/layout/section-block";
import { requireAdmin } from "@/server/auth/session";
import { approvalLabels, roleLabels } from "@/lib/constants/app";
import { getPublicStorageUrl } from "@/server/storage/urls";
import { AvatarUploader } from "@/features/profiles/components/avatar-uploader";
import { ProfileIdentityCard } from "@/features/profiles/components/profile-identity-card";
import { ProfileForm } from "@/features/profiles/components/profile-form";

export default async function AdminProfilePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "profile.identity" });
  const { profile } = await requireAdmin(params.locale);

  return (
    <div className="space-y-6">
      <WorkspaceHero
        eyebrow={t("admin")}
        title="Profile settings"
        description="Keep your operator identity aligned across the admin workspace."
        badges={
          <>
            <Badge variant="secondary">{roleLabels.admin}</Badge>
            <Badge variant="outline">{approvalLabels[profile.approvalStatus]}</Badge>
          </>
        }
        actions={
          <Button asChild variant="nav" className="border border-border/60 bg-background/82">
            <Link href="/admin" locale={params.locale}>
              Back to workspace
            </Link>
          </Button>
        }
      />

      <SectionBlock
        eyebrow="Identity"
        title="Profile and access details"
        description="Update the details that identify you across approvals, course oversight, and admin workflows."
        contentClassName="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="space-y-6">
          <AvatarUploader
            imageUrl={getPublicStorageUrl("avatars", profile.avatarPath)}
            fullName={profile.fullName}
          />
          <ProfileIdentityCard label={t("admin")} profile={profile} />
        </div>
        <ProfileForm locale={params.locale} profile={profile} />
      </SectionBlock>
    </div>
  );
}
