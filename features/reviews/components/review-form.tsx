"use client";

import { useTranslations } from "next-intl";
import { MessageSquareQuote, Star } from "lucide-react";
import { useFormState } from "react-dom";
import { submitReviewAction, type ReviewActionState } from "@/features/reviews/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: ReviewActionState = {};

export function ReviewForm({
  locale,
  courseId,
}: {
  locale: string;
  courseId: string;
}) {
  const t = useTranslations("reviews.form");
  const [state, formAction] = useFormState(submitReviewAction, initialState);

  return (
    <Card tone="strong" className="display-shadow overflow-hidden">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center gap-2 text-primary">
          <MessageSquareQuote className="h-4 w-4" />
          <p className="section-eyebrow">{t("submit")}</p>
        </div>
        <CardTitle className="text-[1.7rem] sm:text-[2rem]">{t("comment")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="form-stack">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="courseId" value={courseId} />

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="field-stack inset-panel">
              <Label htmlFor="rating" className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                {t("rating")}
              </Label>
              <Select
                id="rating"
                name="rating"
                defaultValue="5"
              >
                <option value="5">{t("options.five")}</option>
                <option value="4">{t("options.four")}</option>
                <option value="3">{t("options.three")}</option>
                <option value="2">{t("options.two")}</option>
                <option value="1">{t("options.one")}</option>
              </Select>
            </div>

            <div className="field-stack inset-panel">
              <Label htmlFor="comment">{t("comment")}</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder={t("placeholder")}
                className="min-h-32 rounded-xl"
              />
            </div>
          </div>

          {state.error ? (
            <div className="inset-panel border-destructive/20 bg-destructive/5 text-sm leading-6 text-destructive">
              {state.error}
            </div>
          ) : null}
          {state.success ? (
            <div className="inset-panel border-primary/20 bg-primary/5 text-sm leading-6 text-primary">
              {state.success}
            </div>
          ) : null}
          <SubmitButton variant="hero" size="lg" pendingLabel={t("pending")}>
            {t("submit")}
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
