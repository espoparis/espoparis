import test from "node:test";
import assert from "node:assert/strict";
import { isCmsConfigured } from "./cms-repository.ts";

test("CMS is locked until production URL and secret are configured", () => {
  const oldUrl = process.env.CMS_API_URL;
  const oldSecret = process.env.CMS_API_SECRET;
  delete process.env.CMS_API_URL;
  delete process.env.CMS_API_SECRET;
  assert.equal(isCmsConfigured(), false);
  if (oldUrl === undefined) delete process.env.CMS_API_URL; else process.env.CMS_API_URL = oldUrl;
  if (oldSecret === undefined) delete process.env.CMS_API_SECRET; else process.env.CMS_API_SECRET = oldSecret;
});

test("CMS requires both URL and secret", () => {
  const oldUrl = process.env.CMS_API_URL;
  const oldSecret = process.env.CMS_API_SECRET;
  process.env.CMS_API_URL = "https://example.invalid/cms";
  delete process.env.CMS_API_SECRET;
  assert.equal(isCmsConfigured(), false);
  process.env.CMS_API_SECRET = "x".repeat(32);
  assert.equal(isCmsConfigured(), true);
  if (oldUrl === undefined) delete process.env.CMS_API_URL; else process.env.CMS_API_URL = oldUrl;
  if (oldSecret === undefined) delete process.env.CMS_API_SECRET; else process.env.CMS_API_SECRET = oldSecret;
});
