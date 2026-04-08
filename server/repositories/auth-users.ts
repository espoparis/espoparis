import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getAuthUserEmailById(userId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error) {
    throw new Error(error.message);
  }

  return data.user.email ?? null;
}

export async function listAuthUserEmailsByIds(userIds: string[]) {
  const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));

  if (!uniqueIds.length) {
    return new Map<string, string | null>();
  }

  const results = await Promise.all(
    uniqueIds.map(async (userId) => [userId, await getAuthUserEmailById(userId)] as const)
  );

  return new Map(results);
}
