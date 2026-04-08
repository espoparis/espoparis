"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormState } from "react-dom";
import { registerAction, type ActionState } from "@/features/auth/actions";
import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = {};

export function RegisterForm({ locale }: { locale: string }) {
  const t = useTranslations("auth.forms.register");
  const [role, setRole] = useState<"teacher" | "student">("teacher");
  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <Label htmlFor="role">{t("role")}</Label>
        <Select
          id="role"
          name="role"
          value={role}
          variant="default"
          size="lg"
          onChange={(event) => setRole(event.target.value as "teacher" | "student")}
        >
          <option value="teacher">{t("teacher")}</option>
          <option value="student">{t("student")}</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">{t("fullName")}</Label>
        <Input id="fullName" name="fullName" required size="lg" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required size="lg" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" name="password" type="password" required size="lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required size="lg" />
        </div>
      </div>
      {role === "student" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="primaryInterest">{t("primaryInterest")}</Label>
            <Input
              id="primaryInterest"
              name="primaryInterest"
              placeholder={t("primaryInterestPlaceholder")}
              required={role === "student"}
              size="lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hasTakenCourses">{t("hasTakenCourses")}</Label>
            <Select
              id="hasTakenCourses"
              name="hasTakenCourses"
              defaultValue="no"
              variant="default"
              size="lg"
            >
              <option value="no">{t("no")}</option>
              <option value="yes">{t("yes")}</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="previousCourses">{t("previousCourses")}</Label>
            <Textarea
              id="previousCourses"
              name="previousCourses"
              placeholder={t("previousCoursesPlaceholder")}
              size="lg"
            />
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-background/68 px-4 py-4 text-sm leading-6 text-muted-foreground">
          {t("teacherNotice")}
        </div>
      )}
      {state.error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive">
          {state.error}
        </div>
      ) : null}
      <SubmitButton className="w-full" variant="hero" size="lg" pendingLabel={t("pending")}>
        {t("submit")}
      </SubmitButton>
    </form>
  );
}
