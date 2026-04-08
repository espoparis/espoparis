import { LogOut, PanelLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { signOutAction } from "@/features/auth/actions";
import type { DashboardLink, SessionProfile } from "@/lib/types/domain";
import { Link } from "@/lib/navigation";
import { getPublicStorageUrl } from "@/server/storage/urls";

type Props = {
  locale: string;
  profile: SessionProfile;
  links: DashboardLink[];
  children: ReactNode;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function DashboardShell({ locale, profile, links, children }: Props) {
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tDashboard = await getTranslations({ locale, namespace: "shell.dashboard" });
  const avatarUrl = getPublicStorageUrl("avatars", profile.avatarPath);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border/60 bg-card/72 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="border-b border-border/60 px-6 py-7">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-border/60">
                <AvatarImage src={avatarUrl ?? undefined} alt={profile.fullName} />
                <AvatarFallback>{getInitials(profile.fullName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.35em] text-primary">
                  {tCommon(`roles.${profile.role}`)}
                </p>
                <h1 className="mt-2 truncate text-2xl font-semibold text-foreground">
                  {profile.fullName}
                </h1>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>
          <DashboardNav
            locale={locale}
            links={links}
            className="flex flex-1 flex-col gap-1 p-4"
          />
        </aside>

        <main className="min-w-0">
          <div className="border-b border-border/60 bg-background/78 px-6 py-5 backdrop-blur-xl md:px-10 lg:px-14 xl:px-16">
            <div className="mx-auto flex w-full max-w-[112rem] flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-primary">
                    {tCommon("siteName")}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">
                    {tDashboard("workspaceTitle", {
                      role: tCommon("roles." + profile.role),
                    })}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="nav" asChild>
                    <Link href="/" locale={locale}>
                      <PanelLeft className="h-4 w-4" />
                      {tDashboard("publicSite")}
                    </Link>
                  </Button>
                  <form action={signOutAction.bind(null, locale)}>
                    <Button variant="ghost" type="submit">
                      <LogOut className="h-4 w-4" />
                      {tCommon("actions.signOut")}
                    </Button>
                  </form>
                </div>
              </div>

              <DashboardNav
                locale={locale}
                links={links}
                className="flex gap-2 overflow-x-auto pb-1 lg:hidden"
              />
            </div>
          </div>
          <div className="mx-auto w-full max-w-[112rem] px-6 py-8 md:px-10 lg:px-14 xl:px-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
