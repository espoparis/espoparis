import assert from "node:assert/strict";
import test from "node:test";
import type { AuthSession } from "../auth/types.ts";
import { authorizeDigitalAssetDelivery, parseDigitalAssetSelector, redeemDigitalAssetDelivery, verifyDigitalDeliveryToken } from "./delivery.ts";

const secret = "delivery-secret-that-is-at-least-32-characters";
const now = new Date("2026-09-10T12:00:00.000Z");
const selector = { resourceKind: "lesson" as const, resourceId: "lesson-1", assetKind: "video" as const };
const member: AuthSession = { authenticated: true, identity: { id: "user-1", email: "member@example.com", role: "member", provider: "google-workspace" } };
const student: AuthSession = { authenticated: true, identity: { id: "student-1", email: "student@example.com", role: "student", provider: "google-workspace" } };
const anonymous: AuthSession = { authenticated: false, identity: null };

function resolver(accessLevel: "public" | "registered-free" | "student-only" | "paid") {
  return async () => ({ selector, accessLevel, fileId: "private-drive-id" });
}

test("delivery tokens contain selectors but never Drive file ids", async () => {
  const result = await authorizeDigitalAssetDelivery(anonymous, selector, { resolveAsset: resolver("public"), secret, now });
  assert.equal(result.token.includes("private-drive-id"), false);
  assert.ok(verifyDigitalDeliveryToken(result.token, "public", secret, now));
});

test("registered and student-only assets enforce trusted session roles", async () => {
  await assert.rejects(() => authorizeDigitalAssetDelivery(anonymous, selector, { resolveAsset: resolver("registered-free"), secret, now }));
  await assert.rejects(() => authorizeDigitalAssetDelivery(member, selector, { resolveAsset: resolver("student-only"), secret, now }));
  await assert.doesNotReject(() => authorizeDigitalAssetDelivery(student, selector, { resolveAsset: resolver("student-only"), secret, now }));
});

test("paid delivery trusts only the server entitlement repository", async () => {
  const denied = { hasActiveEntitlement: async () => false };
  const allowed = { hasActiveEntitlement: async () => true };
  await assert.rejects(() => authorizeDigitalAssetDelivery(member, selector, { resolveAsset: resolver("paid"), entitlementRepository: denied, secret, now }));
  await assert.doesNotReject(() => authorizeDigitalAssetDelivery(member, selector, { resolveAsset: resolver("paid"), entitlementRepository: allowed, secret, now }));
});

test("redemption keeps Drive ids inside the server transport", async () => {
  const authorization = await authorizeDigitalAssetDelivery(student, selector, { resolveAsset: resolver("student-only"), secret, now });
  let received = "";
  const binary = await redeemDigitalAssetDelivery(authorization.token, student, {
    async readPrivateFile(fileId) { received = fileId; return { body: new Uint8Array([1]), contentType: "video/mp4" }; },
  }, { resolveAsset: resolver("student-only"), secret, now });
  assert.equal(received, "private-drive-id");
  assert.equal(binary.contentType, "video/mp4");
  await assert.rejects(() => redeemDigitalAssetDelivery(authorization.token, member, { async readPrivateFile() { throw new Error("must not run"); } }, { resolveAsset: resolver("student-only"), secret, now }));
});

test("redemption rechecks current access and paid entitlement", async () => {
  const authorization = await authorizeDigitalAssetDelivery(member, selector, {
    resolveAsset: resolver("paid"), entitlementRepository: { hasActiveEntitlement: async () => true }, secret, now,
  });
  const transport = { async readPrivateFile() { return { body: new Uint8Array([1]), contentType: "video/mp4" }; } };
  await assert.rejects(() => redeemDigitalAssetDelivery(authorization.token, member, transport, {
    resolveAsset: resolver("paid"), entitlementRepository: { hasActiveEntitlement: async () => false }, secret, now,
  }));
  await assert.rejects(() => redeemDigitalAssetDelivery(authorization.token, member, transport, {
    resolveAsset: resolver("student-only"), secret, now,
  }));
});

test("asset selectors are parsed as a closed, bounded contract", () => {
  assert.deepEqual(parseDigitalAssetSelector(selector), selector);
  assert.equal(parseDigitalAssetSelector(null), null);
  assert.equal(parseDigitalAssetSelector({ resourceKind: "book", resourceId: "b1", assetKind: "video" }), null);
  assert.equal(parseDigitalAssetSelector({ resourceKind: "lesson", resourceId: "l1", assetKind: "attachment", attachmentIndex: -1 }), null);
  assert.equal(parseDigitalAssetSelector({ resourceKind: "lesson", resourceId: " ", assetKind: "video" }), null);
});
