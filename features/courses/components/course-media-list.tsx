import { getTranslations } from "next-intl/server";
import { BookOpen, Lock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CourseMediaItem } from "@/lib/types/domain";

type Props = {
  locale: string;
  media: CourseMediaItem[];
  accessState:
    | "guest"
    | "student-not-applied"
    | "student-pending"
    | "student-approved"
    | "teacher"
    | "admin";
};

async function getAccessCopy(locale: string, accessState: Props["accessState"]) {
  const t = await getTranslations({ locale, namespace: "courseDetail.media.states" });

  switch (accessState) {
    case "student-approved":
      return {
        title: t("studentApproved.title"),
        description: t("studentApproved.description"),
        helper: t("studentApproved.helper"),
        canAccessMedia: true,
      };
    case "student-pending":
      return {
        title: t("studentPending.title"),
        description: t("studentPending.description"),
        helper: t("studentPending.helper"),
        canAccessMedia: false,
      };
    case "student-not-applied":
      return {
        title: t("studentNotApplied.title"),
        description: t("studentNotApplied.description"),
        helper: t("studentNotApplied.helper"),
        canAccessMedia: false,
      };
    case "teacher":
    case "admin":
      return {
        title: t("manager.title"),
        description: t("manager.description"),
        helper: t("manager.helper"),
        canAccessMedia: true,
      };
    default:
      return {
        title: t("guest.title"),
        description: t("guest.description"),
        helper: t("guest.helper"),
        canAccessMedia: false,
      };
  }
}

export async function CourseMediaList({ locale, media, accessState }: Props) {
  const t = await getTranslations({ locale, namespace: "courseDetail.media" });
  const copy = await getAccessCopy(locale, accessState);

  return (
    <Card tone="strong" className="display-shadow">
      <CardHeader className="space-y-3">
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription className="max-w-2xl leading-6">{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className="content-cluster pt-0">
        <div className="inset-panel flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={copy.canAccessMedia ? "default" : "muted"} className="rounded-full px-3 py-1">
              {copy.canAccessMedia ? t("open") : t("locked")}
            </Badge>
            <span>{copy.helper}</span>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {t("lessonCount", { count: media.length })}
          </p>
        </div>

        {media.length ? (
          media.map((item, index) => (
            <div
              key={item.id}
              className="inset-panel flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-1 items-start gap-4">
                <div
                  className="surface-subtle h-20 w-28 shrink-0 rounded-2xl border border-border/60 bg-cover bg-center"
                  style={{
                    backgroundImage: item.thumbnailUrl
                      ? `url(${item.thumbnailUrl})`
                      : undefined,
                  }}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.kind === "video" ? (
                      <PlayCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-primary" />
                    )}
                    <Badge variant={index === 0 && copy.canAccessMedia ? "default" : "outline"} className="rounded-full px-3 py-1">
                      {t("lessonLabel", { number: String(index + 1).padStart(2, "0") })}
                    </Badge>
                    <p className="font-medium">{item.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.mimeType}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {t(`kind.${item.kind}`)}
                  </p>
                </div>
              </div>

              {copy.canAccessMedia ? (
                <Button asChild variant="soft" size="lg">
                  <a href={`/api/media/${item.id}`} target="_blank" rel="noreferrer">
                    {t("openAsset")}
                  </a>
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground md:justify-end">
                  <Lock className="h-4 w-4" />
                  {t("protectedAfterApproval")}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        )}
      </CardContent>
    </Card>
  );
}
