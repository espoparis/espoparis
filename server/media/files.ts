export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 1024 * 1024;
export type UploadPurpose = "cms-image" | "book-pdf" | "book-cover";
export function driveFileId(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^[A-Za-z0-9_-]{10,}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" || !["drive.google.com", "docs.google.com"].includes(url.hostname)) return "";
    const id = url.pathname.match(/\/d\/([A-Za-z0-9_-]+)/)?.[1] || url.searchParams.get("id") || "";
    return /^[A-Za-z0-9_-]{10,}$/.test(id) ? id : "";
  } catch { return ""; }
}
export function validImageReference(value?: string): boolean {
  return !value || /^\/api\/content-media\/[A-Za-z0-9_-]{10,}$/.test(value) || /^\/(?:faculty|images)\/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp)$/i.test(value);
}
export function validateUpload(bytes: Uint8Array, mime: string, purpose: UploadPurpose) {
  const image = purpose !== "book-pdf";
  if (!bytes.length || bytes.length > (image ? MAX_IMAGE_BYTES : MAX_UPLOAD_BYTES)) throw new Error("upload-size");
  const start = Array.from(bytes.slice(0, 12));
  const pdf = mime === "application/pdf" && String.fromCharCode(...start.slice(0, 5)) === "%PDF-";
  const jpeg = mime === "image/jpeg" && start[0] === 255 && start[1] === 216 && start[2] === 255;
  const png = mime === "image/png" && start.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10";
  const webp = mime === "image/webp" && String.fromCharCode(...start.slice(0,4)) === "RIFF" && String.fromCharCode(...start.slice(8,12)) === "WEBP";
  if (image ? !(jpeg || png || webp) : !pdf) throw new Error("upload-type");
}
