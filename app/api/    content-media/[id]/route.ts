import { getAuthSession } from "@/server/auth/session";
import { canCms } from "@/server/content/cms";
import { readCmsImage } from "@/server/content/cms-repository";
import { validateUpload } from "@/server/media/files";
export const runtime = "nodejs";
export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  if (!/^[A-Za-z0-9_-]{10,}$/.test(id)) return new Response(null, { status: 404 });
  try {
    const session = await getAuthSession();
    const identity = session.authenticated && session.identity && canCms(session.identity.role, "content.edit") ? session.identity : undefined;
    const media = await readCmsImage(id, identity);
    const bytes = Buffer.from(media.base64, "base64");
    validateUpload(bytes, media.mime, "cms-image");
    return new Response(new Uint8Array(bytes), { headers: { "Content-Type": media.mime, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } }); }
}
