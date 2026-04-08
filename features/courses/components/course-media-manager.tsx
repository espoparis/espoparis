"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown, ArrowUp, FileText, Film, Loader2, Save, Trash2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CourseMediaItem } from "@/lib/types/domain";
import {
  deleteCourseMediaAction,
  reorderCourseMediaAction,
  updateCourseMediaTitleAction,
} from "@/features/courses/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Props = {
  locale: string;
  courseId: string;
  media: CourseMediaItem[];
};

export function CourseMediaManager({ locale, courseId, media }: Props) {
  const t = useTranslations("courses.mediaManager");
  const router = useRouter();
  const [kind, setKind] = useState<"video" | "document">("document");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [draftTitles, setDraftTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    setDraftTitles(Object.fromEntries(media.map((item) => [item.id, item.title])));
  }, [media]);

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function uploadMedia(formData: FormData) {
    setError(null);
    setSuccess(null);
    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error || t("uploadError"));
      return;
    }

    setSuccess(t("uploadSuccess"));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card tone="soft">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>{t("upload")}</CardTitle>
              <CardDescription className="max-w-2xl leading-6">
                {t("helper")}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {kind === "video" ? t("kind.video") : t("kind.document")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            action={(formData) => {
              formData.set("locale", locale);
              formData.set("courseId", courseId);
              formData.set("kind", kind);
              startTransition(() => {
                uploadMedia(formData);
              });
            }}
          >
            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_1fr_auto]">
              <div className="space-y-2 rounded-[1.35rem] border border-border/60 bg-background/70 p-4">
                <Label htmlFor="title">{t("titleLabel")}</Label>
                <Input id="title" name="title" required className="surface-subtle h-11 border-border/60 bg-background/80" />
              </div>
              <div className="space-y-2 rounded-[1.35rem] border border-border/60 bg-background/70 p-4">
                <Label htmlFor="kind">{t("kindLabel")}</Label>
                <Select
                  id="kind"
                  name="kindPicker"
                  value={kind}
                  onChange={(event) => setKind(event.target.value as "video" | "document")}
                >
                  <option value="document">{t("kind.document")}</option>
                  <option value="video">{t("kind.video")}</option>
                </Select>
              </div>
              <div className="space-y-2 rounded-[1.35rem] border border-border/60 bg-background/70 p-4">
                <Label htmlFor="file">{t("fileLabel")}</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  required
                  accept={kind === "video" ? "video/*" : ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.png,.jpg,.jpeg"}
                  className="surface-subtle h-11 border-border/60 bg-background/80 file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" variant="hero" className="h-11 w-full px-5" disabled={isPending}>
                  <UploadCloud className="h-4 w-4" />
                  {isPending ? t("uploading") : t("upload")}
                </Button>
              </div>
            </div>

            <div className="space-y-2 rounded-[1.35rem] border border-border/60 bg-background/70 p-4">
              <Label htmlFor="thumbnail">{t("thumbnailLabel")}</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                className="surface-subtle h-11 border-border/60 bg-background/80 file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary"
              />
            </div>

            {(error || success) ? (
              <div className="rounded-[1.35rem] border border-border/60 bg-background/70 px-4 py-3">
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                {success ? <p className="text-sm text-primary">{success}</p> : null}
              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {media.map((item) => (
          <Card key={item.id} tone="soft">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="surface-grid h-20 w-28 rounded-2xl border border-border/60 bg-background/70 bg-cover bg-center shadow-sm"
                  style={item.thumbnailUrl ? { backgroundImage: `url(${item.thumbnailUrl})` } : undefined}
                >
                  {!item.thumbnailUrl ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {item.kind === "video" ? (
                        <Film className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                      value={draftTitles[item.id] ?? item.title}
                      onChange={(event) =>
                        setDraftTitles((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }))
                      }
                      className="surface-subtle h-11 max-w-md border-border/60 bg-background/80"
                    />
                    <Button
                      type="button"
                      variant="nav"
                      className="border border-border/60 bg-background/82 px-5"
                      disabled={isPending || !draftTitles[item.id]?.trim() || draftTitles[item.id] === item.title}
                      onClick={() => {
                        startTransition(async () => {
                          setError(null);
                          setSuccess(null);
                          await updateCourseMediaTitleAction(
                            item.id,
                            locale,
                            draftTitles[item.id] ?? item.title
                          );
                          setSuccess(t("updated", { title: draftTitles[item.id] ?? item.title }));
                          router.refresh();
                        });
                      }}
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {t("save")}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="rounded-full px-3 py-1">{t(`kind.${item.kind}`)}</Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-1">{formatFileSize(item.sizeBytes)}</Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-1">{item.mimeType.split(" · ")[0]}</Badge>
                    <Badge variant="muted" className="rounded-full px-3 py-1">
                      {t("lessonNumber", {
                        number: media.findIndex((entry) => entry.id === item.id) + 1,
                      })}
                    </Badge>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.durationSeconds
                      ? t("approxMinutes", { count: Math.ceil(item.durationSeconds / 60) })
                      : t("privateAsset")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="nav"
                  className="border border-border/60 bg-background/72 px-5"
                  disabled={isPending || media.findIndex((entry) => entry.id === item.id) === 0}
                  onClick={() => {
                    startTransition(async () => {
                      setError(null);
                      setSuccess(null);
                      await reorderCourseMediaAction(item.id, locale, "up");
                      setSuccess(t("movedUp", { title: draftTitles[item.id] ?? item.title }));
                      router.refresh();
                    });
                  }}
                >
                  <ArrowUp className="h-4 w-4" />
                  {t("moveUp")}
                </Button>
                <Button
                  type="button"
                  variant="nav"
                  className="border border-border/60 bg-background/72 px-5"
                  disabled={
                    isPending || media.findIndex((entry) => entry.id === item.id) === media.length - 1
                  }
                  onClick={() => {
                    startTransition(async () => {
                      setError(null);
                      setSuccess(null);
                      await reorderCourseMediaAction(item.id, locale, "down");
                      setSuccess(t("movedDown", { title: draftTitles[item.id] ?? item.title }));
                      router.refresh();
                    });
                  }}
                >
                  <ArrowDown className="h-4 w-4" />
                  {t("moveDown")}
                </Button>
                <Button variant="nav" asChild className="border border-border/60 bg-background/82 px-5">
                  <a href={`/api/media/${item.id}`} target="_blank" rel="noreferrer">
                    {t("openAsset")}
                  </a>
                </Button>
                <form
                  action={() => {
                    startTransition(async () => {
                      setError(null);
                      setSuccess(null);
                      await deleteCourseMediaAction(item.id, locale);
                      setSuccess(t("removed", { title: item.title }));
                      router.refresh();
                    });
                  }}
                >
                  <Button
                    variant="destructive"
                    type="submit"
                    className="px-5"
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("delete")}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {!media.length ? (
          <Card tone="subtle" className="border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              {t("empty")}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
