import { NextResponse } from "next/server";
import { getSessionContext } from "@/server/auth/session";
import { getProfileById, updateProfileAvatarPath } from "@/server/repositories/profiles";
import { buildAvatarPath, removeStorageObjects, uploadFileToStorage } from "@/server/storage/files";
import { isSupabaseConfigured } from "@/lib/env";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { profile } = await getSessionContext();

  if (!profile) {
    return NextResponse.json({ error: "You must be signed in to upload an avatar." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "An image file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Avatar uploads must be images." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Avatar images must be smaller than 5 MB." }, { status: 400 });
  }

  const currentProfile = await getProfileById(profile.id);
  const nextPath = buildAvatarPath(profile.id, file.name);

  try {
    await uploadFileToStorage("avatars", nextPath, file);
    await updateProfileAvatarPath(profile.id, nextPath);
    await removeStorageObjects([
      {
        bucket: "avatars",
        paths: [currentProfile?.avatar_path],
      },
    ]);
  } catch (error) {
    await removeStorageObjects([
      {
        bucket: "avatars",
        paths: [nextPath],
      },
    ]);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload avatar." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { profile } = await getSessionContext();

  if (!profile) {
    return NextResponse.json({ error: "You must be signed in to update an avatar." }, { status: 401 });
  }

  const currentProfile = await getProfileById(profile.id);

  try {
    await updateProfileAvatarPath(profile.id, null);
    await removeStorageObjects([
      {
        bucket: "avatars",
        paths: [currentProfile?.avatar_path],
      },
    ]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to remove avatar." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
