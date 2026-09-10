import assert from "node:assert/strict";
import test from "node:test";
import { isDigitalPlatformConfigured } from "./repository.ts";

function withDigitalEnv(url: string | undefined, secret: string | undefined, assertion: () => void) {
  const previousUrl = process.env.DIGITAL_API_URL;
  const previousSecret = process.env.DIGITAL_API_SECRET;
  if (url === undefined) delete process.env.DIGITAL_API_URL; else process.env.DIGITAL_API_URL = url;
  if (secret === undefined) delete process.env.DIGITAL_API_SECRET; else process.env.DIGITAL_API_SECRET = secret;
  try {
    assertion();
  } finally {
    if (previousUrl === undefined) delete process.env.DIGITAL_API_URL; else process.env.DIGITAL_API_URL = previousUrl;
    if (previousSecret === undefined) delete process.env.DIGITAL_API_SECRET; else process.env.DIGITAL_API_SECRET = previousSecret;
  }
}

test("Digital API remains locked unless URL and strong secret are configured", () => {
  withDigitalEnv(undefined, undefined, () => assert.equal(isDigitalPlatformConfigured(), false));
  withDigitalEnv("https://script.google.com/macros/s/example/exec", undefined, () => assert.equal(isDigitalPlatformConfigured(), false));
  withDigitalEnv("https://script.google.com/macros/s/example/exec", "short", () => assert.equal(isDigitalPlatformConfigured(), false));
  withDigitalEnv("http://example.com/digital", "x".repeat(32), () => assert.equal(isDigitalPlatformConfigured(), false));
  withDigitalEnv("https://script.google.com/macros/s/example/exec", "x".repeat(32), () => assert.equal(isDigitalPlatformConfigured(), true));
});
