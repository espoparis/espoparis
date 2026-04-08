import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { localizePath } from "@/lib/constants/app";
import type { SessionProfile } from "@/lib/types/domain";

type SessionContext = {
  user: User | null;
  profile: SessionProfile | null;
};

type AuthenticatedSession = {
  user: User;
  profile: SessionProfile;
};

export const getSessionContext = cache(
  async (): Promise<SessionContext> => {
    noStore();

    if (!isSupabaseConfigured()) {
      return { user: null, profile: null };
    }

    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, profile: null };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role, approval_status, full_name, avatar_path, bio")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      return { user, profile: null };
    }

    return {
      user,
      profile: {
        id: profile.id,
        email: user.email ?? "",
        role: profile.role,
        approvalStatus: profile.approval_status,
        fullName: profile.full_name,
        avatarPath: profile.avatar_path,
        bio: profile.bio,
      },
    };
  }
);

export async function requireUser(locale: string) {
  const context: SessionContext = await getSessionContext();

  if (!context.user || !context.profile) {
    redirect(localizePath(locale, "/auth/login"));
  }

  return context as AuthenticatedSession;
}

export async function requireApprovedRole(
  locale: string,
  role: SessionProfile["role"] | SessionProfile["role"][]
) {
  const context = await getSessionContext();

  if (!context.user || !context.profile) {
    redirect(localizePath(locale, "/auth/login"));
  }

  const authenticated = context as AuthenticatedSession;
  const roles = Array.isArray(role) ? role : [role];

  if (authenticated.profile.approvalStatus !== "approved") {
    redirect(localizePath(locale, "/pending"));
  }

  if (!roles.includes(authenticated.profile.role)) {
    redirect(localizePath(locale, "/unauthorized"));
  }

  return authenticated;
}

export async function requireAdmin(locale: string) {
  return requireApprovedRole(locale, "admin");
}
