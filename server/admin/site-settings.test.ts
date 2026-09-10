import assert from "node:assert/strict";
import test from "node:test";
import { currentPublicSiteSettings, getUnverifiedPublicFields, validatePublicSiteSettings } from "./site-settings.ts";

test("confirmed public contact settings validate cleanly", () => {
  assert.deepEqual(validatePublicSiteSettings(currentPublicSiteSettings), []);
});

test("unconfirmed address, visiting hours and legal name stay explicitly unset", () => {
  assert.deepEqual(getUnverifiedPublicFields(currentPublicSiteSettings), ["publicAddress", "visitingHours", "legalPublicName"]);
});

test("invalid email is rejected", () => {
  const settings = { ...currentPublicSiteSettings, contactEmail: "not-an-email" };
  assert.equal(validatePublicSiteSettings(settings).some((issue) => issue.code === "invalid-email"), true);
});

test("required phone fields cannot be published empty", () => {
  const settings = { ...currentPublicSiteSettings, phoneEnglish: "" };
  assert.deepEqual(validatePublicSiteSettings(settings), [{ field: "phoneEnglish", code: "required" }]);
});
