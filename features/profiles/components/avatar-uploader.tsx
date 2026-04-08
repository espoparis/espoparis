"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AvatarUploader({
  imageUrl,
  fullName,
}: {
  imageUrl: string | null;
  fullName: string;
}) {
  const t = useTranslations("profile.avatar");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    formData.set("file", file);

    const response = await fetch("/api/uploads/avatar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error || t("uploadError"));
      return;
    }

    setSuccess(t("updated"));
    router.refresh();
  }

  async function handleRemove() {
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/uploads/avatar", {
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

  const activeImageUrl = previewUrl ?? imageUrl;

  return (
    <Card tone="strong" className="display-shadow">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription className="max-w-xl leading-6">
              {t("description")}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {activeImageUrl ? t("replace") : t("upload")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="surface-subtle flex flex-col gap-4 rounded-[1.5rem] border border-border/60 p-4 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 border border-border/60 bg-background">
            <AvatarImage src={activeImageUrl ?? undefined} alt={fullName} />
            <AvatarFallback>{initialsFromName(fullName)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <p className="font-medium leading-none">{fullName}</p>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("description")}
            </p>
          </div>
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
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              {isPending ? t("uploading") : activeImageUrl ? t("replace") : t("upload")}
            </Button>
          </label>
          {activeImageUrl ? (
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

        <p className="text-sm leading-6 text-muted-foreground">
          {t("helper")}
        </p>

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
