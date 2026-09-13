import test from "node:test";
import assert from "node:assert/strict";
import { signAppsScriptEnvelope, verifyAppsScriptEnvelope } from "./apps-script-client.ts";

const secret = "a-very-long-integration-secret-value-1234567890";

test("Apps Script integration signatures are deterministic and tamper evident", () => {
  const envelope = { action: "student.lookup", issuedAt: "2026-09-05T12:00:00.000Z", nonce: "nonce-1", data: { email: "student@example.com" }, actor: null };
  const signature = signAppsScriptEnvelope(envelope, secret);
  assert.equal(verifyAppsScriptEnvelope(envelope, signature, secret), true);
  assert.equal(verifyAppsScriptEnvelope({ ...envelope, data: { email: "other@example.com" } }, signature, secret), false);
});


test("Apps Script signature covers actor identity", () => {
  const envelope = { action: "admin.enrollment.audit", issuedAt: "2026-09-05T12:00:00.000Z", nonce: "nonce-2", data: {}, actor: { email: "admin@espoparis.com", role: "admin" } };
  const signature = signAppsScriptEnvelope(envelope, secret);
  assert.equal(verifyAppsScriptEnvelope(envelope, signature, secret), true);
  assert.equal(verifyAppsScriptEnvelope({ ...envelope, actor: { email: "other@espoparis.com", role: "admin" } }, signature, secret), false);
});

test("signature matches the actual JSON payload when optional fields are absent", () => {
  const secret = "test-only-secret-at-least-32-characters";
  const envelope = { action: "cms.item.save", issuedAt: "2026-09-13T00:00:00Z", nonce: "test", actor: null, data: { item: { title: "Title", coverImage: undefined, schedule: { publishAt: undefined }, values: [undefined, 1] } } };
  assert.equal(signAppsScriptEnvelope(envelope, secret), signAppsScriptEnvelope(JSON.parse(JSON.stringify(envelope)), secret));
});
