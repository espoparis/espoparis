"use server";
import { getAuthSession } from "@/server/auth/session";
import { canCms } from "@/server/content/cms";
import { uploadCmsImage } from "@/server/content/cms-repository";
import { canOpenAdminSection } from "@/server/auth/admin-policy";
import { callDigitalBridge } from "@/server/integrations/digital-bridge";
import { validateUpload, type UploadPurpose } from "@/server/media/files";

export async function uploadMediaAction(data: FormData): Promise<{ value?: string; error?: string }> {
  try {
    const session = await getAuthSession();
    const purpose = String(data.get("purpose")) as UploadPurpose;
    if (!["cms-image", "book-pdf", "book-cover"].includes(purpose)) return { error: "upload-type" };
    const allowed = purpose === "cms-image" ? session.identity && canCms(session.identity.role, "content.edit") : canOpenAdminSection(session, "digital-library").allowed;
    if (!session.authenticated || !session.identity || !allowed) return { error: "permission" };
    const file = data.get("file");
    if (!(file instanceof File)) return { error: "upload-type" };
    const bytes = new Uint8Array(await file.arrayBuffer());
    validateUpload(bytes, file.type, purpose);
    const input = { name: file.name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120), mime: file.type, base64: Buffer.from(bytes).toString("base64") };
    const result = purpose === "cms-image" ? await uploadCmsImage(session.identity, input)
      : await callDigitalBridge<typeof input & { purpose: string }, { id: string }>("digital.media.upload", { ...input, purpose }, session.identity);
    return { value: purpose === "cms-image" ? `/api/content-media/${result.id}` : result.id };
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return { error: ["upload-size", "upload-type"].includes(code) ? code : "upload-failed" };
  }
}
