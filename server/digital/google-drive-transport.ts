import type { DigitalAssetTransport, DigitalBinary } from "./delivery.ts";

export type DriveTransportConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const DRIVE_FILES_ENDPOINT = "https://www.googleapis.com/drive/v3/files";

export function getGoogleDriveTransportConfig(env: Record<string, string | undefined> = process.env): DriveTransportConfig | null {
  const clientId = env.DIGITAL_DRIVE_CLIENT_ID?.trim() ?? "";
  const clientSecret = env.DIGITAL_DRIVE_CLIENT_SECRET?.trim() ?? "";
  const refreshToken = env.DIGITAL_DRIVE_REFRESH_TOKEN?.trim() ?? "";
  return clientId && clientSecret && refreshToken ? { clientId, clientSecret, refreshToken } : null;
}

function safeFileName(value: string | null) {
  if (!value) return undefined;
  const match = /filename\*?=(?:UTF-8''|\")?([^";]+)/i.exec(value);
  if (!match?.[1]) return undefined;
  try {
    return decodeURIComponent(match[1].replace(/^"|"$/g, "")).replace(/[\r\n]/g, "");
  } catch {
    return match[1].replace(/^"|"$/g, "").replace(/[\r\n]/g, "");
  }
}

export class GoogleDriveAssetTransport implements DigitalAssetTransport {
  private readonly config: DriveTransportConfig | null;
  private readonly fetcher: typeof fetch;

  constructor(config: DriveTransportConfig | null = getGoogleDriveTransportConfig(), fetcher: typeof fetch = fetch) {
    this.config = config;
    this.fetcher = fetcher;
  }

  private async accessToken() {
    if (!this.config) throw new Error("Restricted digital asset transport is not configured.");
    const response = await this.fetcher(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.config.refreshToken,
        grant_type: "refresh_token",
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Restricted digital asset transport authentication failed.");
    const payload = await response.json() as GoogleTokenResponse;
    if (!payload.access_token) throw new Error("Restricted digital asset transport returned no access token.");
    return payload.access_token;
  }

  async readPrivateFile(fileId: string, options: { range?: string } = {}): Promise<DigitalBinary> {
    const normalizedFileId = fileId.trim();
    if (!normalizedFileId) throw new Error("Digital asset file reference is missing.");
    const token = await this.accessToken();
    const headers: Record<string, string> = { authorization: `Bearer ${token}` };
    if (options.range && /^bytes=\d*-\d*$/.test(options.range)) headers.range = options.range;
    const response = await this.fetcher(`${DRIVE_FILES_ENDPOINT}/${encodeURIComponent(normalizedFileId)}?alt=media&supportsAllDrives=true`, {
      headers,
      cache: "no-store",
      redirect: "follow",
    });
    if (!response.ok || !response.body) throw new Error("Restricted digital asset could not be read.");
    const length = Number(response.headers.get("content-length"));
    return {
      body: response.body,
      contentType: response.headers.get("content-type") || "application/octet-stream",
      contentLength: Number.isSafeInteger(length) && length >= 0 ? length : undefined,
      contentRange: response.headers.get("content-range") || undefined,
      acceptRanges: response.headers.get("accept-ranges") || undefined,
      status: response.status === 206 ? 206 : 200,
      fileName: safeFileName(response.headers.get("content-disposition")),
    };
  }
}

export const googleDriveAssetTransport = new GoogleDriveAssetTransport();
