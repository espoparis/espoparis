import assert from "node:assert/strict";
import test from "node:test";
import { getGoogleDriveTransportConfig, GoogleDriveAssetTransport } from "./google-drive-transport.ts";

test("Drive transport requires the complete server-only OAuth credential set", () => {
  assert.equal(getGoogleDriveTransportConfig({}), null);
  assert.equal(getGoogleDriveTransportConfig({ DIGITAL_DRIVE_CLIENT_ID: "id" }), null);
  assert.deepEqual(getGoogleDriveTransportConfig({
    DIGITAL_DRIVE_CLIENT_ID: " id ", DIGITAL_DRIVE_CLIENT_SECRET: " secret ", DIGITAL_DRIVE_REFRESH_TOKEN: " token ",
  }), { clientId: "id", clientSecret: "secret", refreshToken: "token" });
});

test("Drive transport exchanges the refresh token server-side and streams a byte range", async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.includes("oauth2.googleapis.com")) return Response.json({ access_token: "access-token" });
    return new Response(new Uint8Array([1, 2]), {
      status: 206,
      headers: { "content-type": "video/mp4", "content-length": "2", "content-range": "bytes 0-1/10", "accept-ranges": "bytes" },
    });
  }) as typeof fetch;
  const transport = new GoogleDriveAssetTransport({ clientId: "id", clientSecret: "secret", refreshToken: "refresh" }, fetcher);
  const binary = await transport.readPrivateFile("private-file-id", { range: "bytes=0-1" });
  assert.equal(binary.status, 206);
  assert.equal(binary.contentRange, "bytes 0-1/10");
  assert.equal(new Headers(calls[1].init?.headers).get("authorization"), "Bearer access-token");
  assert.equal(new Headers(calls[1].init?.headers).get("range"), "bytes=0-1");
  assert.equal(calls[0].url.includes("private-file-id"), false);
});
