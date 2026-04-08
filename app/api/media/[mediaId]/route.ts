import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSignedCourseMediaUrl } from "@/server/storage/urls";
import { isSupabaseConfigured } from "@/lib/env";

export async function GET(
  _request: Request,
  { params }: { params: { mediaId: string } }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const supabase = createSupabaseServerClient();
  const { data: media } = await supabase
    .from("course_media")
    .select("id, storage_path")
    .eq("id", params.mediaId)
    .maybeSingle();

  if (!media) {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }

  const signedUrl = await createSignedCourseMediaUrl(media.storage_path, 90);
  return NextResponse.redirect(signedUrl);
}
