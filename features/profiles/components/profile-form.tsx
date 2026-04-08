"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { updateProfileAction, type ProfileActionState } from "@/features/profiles/actions";
import type { SessionProfile } from "@/lib/types/domain";
import { SubmitButton } from "@/components/shared/submit-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: ProfileActionState = {};

export function ProfileForm({
  locale,
  profile,
}: {
  locale: string;
  profile: SessionProfile;
}) {
  const t = useTranslations("profile.form");
  const [state, formAction] = useFormState(updateProfileAction, initialState);
  const bioLength = useMemo(() => profile.bio.length, [profile.bio]);

  return (
    <Card tone="strong" className="display-shadow">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription className="max-w-2xl leading-6">
              {t("description")}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Profile
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="locale" value={locale} />
          <div className="surface-subtle space-y-2 p-4">
            <Label htmlFor="fullName">{t("fullName")}</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={profile.fullName}
              required
              className="h-11 border-border/60 bg-background/90"
            />
          </div>
          <div className="surface-subtle space-y-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="bio">{t("shortBio")}</Label>
              <span className="rounded-full bg-muted px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {t("currentCount", { count: bioLength })}
              </span>
            </div>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio}
              className="min-h-[180px] border-border/60 bg-background/90"
              placeholder={t("placeholder")}
            />
            <p className="text-sm leading-6 text-muted-foreground">
              {t("helper")}
            </p>
          </div>
          {(state.error || state.success) ? (
            <div className="rounded-[1.35rem] border border-border/60 bg-background/70 px-4 py-3">
              {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
              {state.success ? <p className="text-sm text-primary">{state.success}</p> : null}
            </div>
          ) : null}
          <div className="flex justify-end">
            <SubmitButton variant="hero" size="lg" className="px-6" pendingLabel={t("saving")}>
              {t("save")}
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
