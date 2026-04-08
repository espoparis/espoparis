"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { localizePath } from "@/lib/constants/app";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/env";
import { sendPendingRegistrationNotification } from "@/server/email/notifications";

export type ActionState = {
  error?: string;
  success?: string;
};

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured yet." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(localizePath(parsed.data.locale, "/dashboard"));
}

export async function registerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured yet." };
  }

  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
    primaryInterest: formData.get("primaryInterest"),
    previousCourses: formData.get("previousCourses"),
    hasTakenCourses: formData.get("hasTakenCourses"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${getSiteUrl()}${localizePath(parsed.data.locale, "/dashboard")}`,
      data: {
        full_name: parsed.data.fullName,
        role: parsed.data.role,
        primary_interest: parsed.data.primaryInterest,
        previous_courses: parsed.data.previousCourses ?? "",
        has_taken_courses: parsed.data.hasTakenCourses === "yes",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  try {
    await sendPendingRegistrationNotification({
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      locale: parsed.data.locale,
    });
  } catch (notificationError) {
    console.error("Failed to send registration notification", notificationError);
  }

  redirect(localizePath(parsed.data.locale, "/pending"));
}

export async function forgotPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured yet." };
  }

  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(
      localizePath(parsed.data.locale, "/auth/reset-password")
    )}`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset instructions have been sent to your inbox." };
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured yet." };
  }

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(localizePath(parsed.data.locale, "/dashboard"));
}

export async function signOutAction(locale: string) {
  if (isSupabaseConfigured()) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/");
  redirect(localizePath(locale, "/"));
}
