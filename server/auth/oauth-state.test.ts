import assert from "node:assert/strict";
import test from "node:test";
import { createOAuthStateBundle, sanitizeReturnTo } from "./oauth-state.ts";

test("PKCE bundle is random and has a SHA-256 challenge", () => {
  const a = createOAuthStateBundle();
  const b = createOAuthStateBundle();
  assert.notEqual(a.state, b.state);
  assert.notEqual(a.verifier, b.verifier);
  assert.ok(a.challenge.length >= 43);
});

test("return path sanitizer blocks external redirects", () => {
  assert.equal(sanitizeReturnTo("https://evil.example", "ar"), "/ar/student");
  assert.equal(sanitizeReturnTo("//evil.example", "fr"), "/fr/student");
  assert.equal(sanitizeReturnTo("/ar/admin", "ar"), "/ar/admin");
});
