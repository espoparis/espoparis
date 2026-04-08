import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApprovalStatus, AppRole } from "@/lib/types/database";
import type { SessionProfile } from "@/lib/types/domain";
import { listAuthUserEmailsByIds } from "@/server/repositories/auth-users";

export async function getProfileById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
}

export async function listProfiles() {
  const supabase = createSupabaseServerClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const profileIds = (profiles ?? []).map((profile) => profile.id);

  const { data: applications } = profileIds.length
    ? await supabase
        .from("student_applications")
        .select("*")
        .in("profile_id", profileIds)
    : { data: [] as Array<Record<string, never>> };

  const applicationMap = new Map(
    (applications ?? []).map((application: any) => [
      application.profile_id,
      application,
    ])
  );
  const emailMap = await listAuthUserEmailsByIds((profiles ?? []).map((profile) => profile.id));

  return (profiles ?? [])
    .map((profile) => ({
      ...profile,
      email: emailMap.get(profile.id) ?? null,
      application: applicationMap.get(profile.id) ?? null,
    }))
    .sort((a, b) => {
      if (a.approval_status === "pending" && b.approval_status !== "pending") {
        return -1;
      }

      if (a.approval_status !== "pending" && b.approval_status === "pending") {
        return 1;
      }

      const aSubmittedAt = a.application?.submitted_at ?? a.created_at;
      const bSubmittedAt = b.application?.submitted_at ?? b.created_at;
      return new Date(bSubmittedAt).getTime() - new Date(aSubmittedAt).getTime();
    });
}

export async function updateProfileApproval(
  profileId: string,
  approvalStatus: ApprovalStatus
) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ approval_status: approvalStatus })
    .eq("id", profileId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getProfileApprovalNotificationData(profileId: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, approval_status")
    .eq("id", profileId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateProfileRole(profileId: string, role: AppRole) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", profileId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateProfileContent(
  profileId: string,
  input: {
    fullName: string;
    bio: string;
  }
) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName,
      bio: input.bio,
    })
    .eq("id", profileId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateProfileAvatarPath(profileId: string, avatarPath: string | null) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_path: avatarPath })
    .eq("id", profileId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export function toSessionProfile(
  profile: Awaited<ReturnType<typeof getProfileById>>,
  email: string
): SessionProfile | null {
  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    email,
    role: profile.role,
    approvalStatus: profile.approval_status,
    fullName: profile.full_name,
    avatarPath: profile.avatar_path,
    bio: profile.bio,
  };
}
