import assert from "node:assert/strict";
import test from "node:test";
import { createSessionToken, verifySessionToken } from "./session-token.ts";

const secret = "abcdefghijklmnopqrstuvwxyz0123456789-SESSION";
const now = new Date("2026-09-06T10:00:00Z");

test("session token round-trips and expires", () => {
  const token = createSessionToken({ sub: "g-1", email: "admin@espoparis.com", role: "admin", provider: "google-workspace" }, secret, { now, ttlSeconds: 60 });
  assert.equal(verifySessionToken(token, secret, new Date("2026-09-06T10:00:30Z"))?.email, "admin@espoparis.com");
  assert.equal(verifySessionToken(token, secret, new Date("2026-09-06T10:01:01Z")), null);
});

test("session token rejects tampering", () => {
  const token = createSessionToken({ sub: "g-1", email: "member@example.com", role: "member", provider: "google-workspace" }, secret, { now });
  const [body, sig] = token.split(".");
  assert.equal(verifySessionToken(`${body}x.${sig}`, secret, now), null);
});
