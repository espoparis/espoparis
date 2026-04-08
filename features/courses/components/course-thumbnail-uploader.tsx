"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ImageIcon, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function CourseThumbnailUploader({
  courseId,
  thumbnailUrl,
}: {
  courseId: string;
  thumbnailUrl: string | null;
}) {
  const t = useTranslations("courses.thumbnail");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleUpload(file: File) {
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.set("courseId", courseId);
    formData.set("file", file);

    const response = await fetch("/api/uploads/course-thumbnail", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error || t("updateError"));
      return;
    }

    setSuccess(t("updated"));
    router.refresh();
  }

  async function handleRemove() {
    setError(null);
    setSuccess(null);

    const response = await fetch(`/api/uploads/course-thumbnail?courseId=${courseId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error || t("removeError"));
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setSuccess(t("removed"));
    router.refresh();
  }

  const activePreview = previewUrl ?? thumbnailUrl;

  return (
    <Card tone="strong" className="display-shadow">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription className="max-w-2xl leading-6">
              {t("helper")}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {activePreview ? t("replace") : t("upload")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="surface-subtle flex h-56 items-center justify-center rounded-[1.5rem] border border-border/60 bg-cover bg-center shadow-sm"
          style={activePreview ? { backgroundImage: `url(${activePreview})` } : undefined}
        >
          {!activePreview ? (
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-5 w-5" />
              {t("empty")}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }

                setPreviewUrl(URL.createObjectURL(file));

                startTransition(() => {
                  void handleUpload(file);
                });
                event.currentTarget.value = "";
              }}
            />
            <Button type="button" variant="hero" className="px-5" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
              {isPending ? t("uploading") : activePreview ? t("replace") : t("upload")}
            </Button>
          </label>

          {activePreview ? (
            <Button
              type="button"
              variant="nav"
              className="border border-border/60 bg-background/82 px-5"
              disabled={isPending}
              onClick={() => {
                startTransition(() => {
                  void handleRemove();
                });
              }}
            >
              <Trash2 className="h-4 w-4" />
              {t("remove")}
            </Button>
          ) : null}
        </div>

        {(error || success) ? (
          <div className="surface-subtle rounded-[1.35rem] border border-border/60 px-4 py-3">
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {success ? <p className="text-sm text-primary">{success}</p> : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
