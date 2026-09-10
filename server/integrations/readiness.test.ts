import test from "node:test";
import assert from "node:assert/strict";
import { getIntegrationReadiness } from "./readiness.ts";

test("integration readiness remains safely disabled without production credentials", () => {
  const readiness = getIntegrationReadiness({});
  assert.deepEqual(readiness, { enrollmentBridge: false, academicBridge: false, digitalBridge: false, digitalDelivery: false, googleOAuth: false, magicLink: false });
});

test("integration readiness only enables bridges with complete secrets", () => {
  const readiness = getIntegrationReadiness({
    ENROLLMENT_API_URL: "https://example.com/enrollment",
    ENROLLMENT_API_SECRET: "12345678901234567890123456789012",
  });
  assert.equal(readiness.enrollmentBridge, true);
  assert.equal(readiness.academicBridge, false);
  assert.equal(readiness.digitalBridge, false);
  assert.equal(readiness.digitalDelivery, false);
});

test("digital readiness requires an HTTPS URL and a 32-character secret", () => {
  assert.equal(getIntegrationReadiness({ DIGITAL_API_URL: "https://example.com/digital", DIGITAL_API_SECRET: "short" }).digitalBridge, false);
  assert.equal(getIntegrationReadiness({ DIGITAL_API_URL: "http://example.com/digital", DIGITAL_API_SECRET: "x".repeat(32) }).digitalBridge, false);
  assert.equal(getIntegrationReadiness({ DIGITAL_API_URL: "https://example.com/digital", DIGITAL_API_SECRET: "x".repeat(32) }).digitalBridge, true);
});

test("digital delivery remains locked without its separate strong secret", () => {
  assert.equal(getIntegrationReadiness({ DIGITAL_DELIVERY_SECRET: "short" }).digitalDelivery, false);
  assert.equal(getIntegrationReadiness({ DIGITAL_DELIVERY_SECRET: "x".repeat(32) }).digitalDelivery, false);
  assert.equal(getIntegrationReadiness({
    DIGITAL_API_URL: "https://example.com/digital",
    DIGITAL_API_SECRET: "b".repeat(32),
    DIGITAL_DELIVERY_SECRET: "d".repeat(32),
    DIGITAL_DRIVE_CLIENT_ID: "client-id",
    DIGITAL_DRIVE_CLIENT_SECRET: "client-secret",
    DIGITAL_DRIVE_REFRESH_TOKEN: "refresh-token",
  }).digitalDelivery, true);
});
