import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/server/auth/session";
import { authorizeDigitalAssetDelivery, parseDigitalAssetSelector, redeemDigitalAssetDelivery } from "@/server/digital/delivery";
import { googleDriveAssetTransport } from "@/server/digital/google-drive-transport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = Promise<{ resourceKind: string; resourceId: string; assetKind: string }>;

function safeDispositionFileName(value: string | undefined) {
  return value?.replace(/[\r\n"\\/]/g, "_").slice(0, 180);
}

function mayRenderInline(contentType: string) {
  const normalized = contentType.split(";", 1)[0].trim().toLowerCase();
  return normalized === "application/pdf"
    || normalized === "image/jpeg"
    || normalized === "image/png"
    || normalized === "image/webp"
    || normalized === "image/gif"
    || normalized.startsWith("audio/")
    || normalized.startsWith("video/");
}

export async function GET(request: NextRequest, context: { params: RouteParams }) {
  const params = await context.params;
  const attachmentValue = request.nextUrl.searchParams.get("attachmentIndex");
  const selector = parseDigitalAssetSelector({
    resourceKind: params.resourceKind,
    resourceId: params.resourceId,
    assetKind: params.assetKind,
    attachmentIndex: attachmentValue === null ? undefined : Number(attachmentValue),
  });
  if (!selector) return NextResponse.json({ error: "Digital asset not found." }, { status: 404 });

  try {
    const session = await getAuthSession();
    const authorization = await authorizeDigitalAssetDelivery(session, selector);
    const requestedRange = request.headers.get("range") ?? undefined;
    const transport = requestedRange && /^bytes=\d*-\d*$/.test(requestedRange)
      ? { readPrivateFile: (fileId: string) => googleDriveAssetTransport.readPrivateFile(fileId, { range: requestedRange }) }
      : googleDriveAssetTransport;
    const binary = await redeemDigitalAssetDelivery(authorization.token, session, transport);
    const headers = new Headers({
      "cache-control": "private, no-store, max-age=0",
      "content-type": binary.contentType,
      "x-content-type-options": "nosniff",
    });
    if (binary.contentLength !== undefined) headers.set("content-length", String(binary.contentLength));
    if (binary.contentRange) headers.set("content-range", binary.contentRange);
    if (binary.acceptRanges) headers.set("accept-ranges", binary.acceptRanges);
    const fileName = safeDispositionFileName(binary.fileName);
    const disposition = request.nextUrl.searchParams.get("download") === "1" || !mayRenderInline(binary.contentType) ? "attachment" : "inline";
    headers.set("content-disposition", `${disposition}${fileName ? `; filename="${fileName}"` : ""}`);
    const body = binary.body instanceof Uint8Array ? new Uint8Array(binary.body).buffer : binary.body;
    return new Response(body, { status: binary.status ?? 200, headers });
  } catch {
    return NextResponse.json({ error: "Digital asset is unavailable." }, {
      status: 404,
      headers: { "cache-control": "private, no-store, max-age=0" },
    });
  }
}
