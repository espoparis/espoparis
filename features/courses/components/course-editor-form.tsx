"use client";

import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import type { CourseCardData } from "@/lib/types/domain";
import { saveCourseAction, type CourseActionState } from "@/features/courses/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: CourseActionState = {};

type Props = {
  locale: string;
  course?: CourseCardData;
};

export function CourseEditorForm({ locale, course }: Props) {
  const t = useTranslations("courses.editor");
  const [state, formAction] = useFormState(saveCourseAction, initialState);
  return (
    <Card tone="strong" className="display-shadow">
      <CardHeader className="space-y-3">
        <p className="section-eyebrow">{course ? t("save") : t("create")}</p>
        <div className="space-y-2">
          <CardTitle>{t("titleLabel")}</CardTitle>
          <CardDescription className="leading-6">{t("descriptionLabel")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="locale" value={locale} />
          {course ? <input type="hidden" name="courseId" value={course.id} /> : null}
          <div className="surface-subtle space-y-2 p-4">
            <Label htmlFor="title">{t("titleLabel")}</Label>
            <Input id="title" name="title" defaultValue={course?.title} required />
          </div>
          <div className="surface-subtle space-y-2 p-4">
            <Label htmlFor="description">{t("descriptionLabel")}</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={course?.description}
              className="min-h-[180px]"
              required
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="surface-subtle space-y-2 p-4">
              <Label htmlFor="type">{t("typeLabel")}</Label>
              <Select
                id="type"
                name="type"
                defaultValue={course?.type ?? "diploma"}
              >
                <option value="diploma">{t("types.diploma")}</option>
                <option value="bachelors">{t("types.bachelors")}</option>
              </Select>
            </div>
            <div className="surface-subtle space-y-2 p-4">
              <Label htmlFor="level">{t("levelLabel")}</Label>
              <Select
                id="level"
                name="level"
                defaultValue={course?.level ?? "beginner"}
              >
                <option value="beginner">{t("levels.beginner")}</option>
                <option value="intermediate">{t("levels.intermediate")}</option>
                <option value="advanced">{t("levels.advanced")}</option>
              </Select>
            </div>
            <div className="surface-subtle space-y-2 p-4">
              <Label htmlFor="durationLabel">{t("durationLabel")}</Label>
              <Input
                id="durationLabel"
                name="durationLabel"
                defaultValue={course?.durationLabel ?? t("durationDefault")}
                required
              />
            </div>
            <div className="surface-subtle space-y-2 p-4">
              <Label htmlFor="status">{t("statusLabel")}</Label>
              <Select
                id="status"
                name="status"
                defaultValue={course?.status ?? "draft"}
              >
                <option value="draft">{t("statuses.draft")}</option>
                <option value="published">{t("statuses.published")}</option>
                <option value="archived">{t("statuses.archived")}</option>
              </Select>
            </div>
          </div>
          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <SubmitButton variant="hero" size="lg" pendingLabel={t("saving")}>
            {course ? t("save") : t("create")}
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
