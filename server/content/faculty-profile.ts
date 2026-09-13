import { validImageReference } from "../media/files.ts";
export type FacultyProfile = {
  id: string; locale: "en" | "fr" | "ar" | "fa"; name: string; role: string;
  bio: string; languages: string; works: string[]; image?: string; approved: boolean;
};
export function validateFacultyProfile(profile: FacultyProfile) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(profile.id) && ["en","fr","ar","fa"].includes(profile.locale)
    && Boolean(profile.name.trim() && profile.role.trim() && profile.bio.trim())
    && Array.isArray(profile.works) && profile.works.every((x) => typeof x === "string")
    && validImageReference(profile.image);
}
