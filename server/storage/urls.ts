import { requirePublicEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export function getPublicStorageUrl(
  bucket: "avatars" | "course-thumbnails",
  path: string | null
) {
  if (!path) {
    return null;
  }

  const env = requirePublicEnv();
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function createSignedCourseMediaUrl(path: string, expiresIn = 60) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from("course-media")
    .createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Unable to create a signed media URL.");
  }

  return data.signedUrl;
}
