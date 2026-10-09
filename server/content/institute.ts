export type InstituteRecord = {
  id: string;
  locale: "en" | "fr" | "ar" | "fa";
  country: string;
  institute: string;
  details: string[];
  order: number;
  approved: boolean;
};
export function validateInstitute(value: InstituteRecord): boolean {
  return Boolean(value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.id)
    && ["en", "fr", "ar", "fa"].includes(value.locale)
    && typeof value.country === "string" && value.country.trim()
    && typeof value.institute === "string" && value.institute.trim()
    && Array.isArray(value.details) && value.details.length > 0
    && value.details.every(x => typeof x === "string" && x.trim())
    && Number.isSafeInteger(value.order) && value.order >= 0
    && typeof value.approved === "boolean");
}
