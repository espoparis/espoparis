import test from "node:test";
import assert from "node:assert/strict";
import { canCms, selectDailyReflection, validateSchedule } from "./cms.ts";

test("admin is the master content role", () => {
  assert.equal(canCms("admin", "content.delete"), true);
  assert.equal(canCms("admin", "settings.manage"), true);
  assert.equal(canCms("editor", "content.delete"), false);
  assert.equal(canCms("editor", "content.publish"), false);
});

test("editor can prepare and schedule content without final publish", () => {
  assert.equal(canCms("editor", "content.create"), true);
  assert.equal(canCms("editor", "content.schedule"), true);
  assert.equal(canCms("editor", "reflection.manage"), true);
});

test("schedule rejects invalid order", () => {
  assert.deepEqual(validateSchedule({ publishAt: "2026-09-10T10:00:00Z", unpublishAt: "2026-09-09T10:00:00Z" }), ["unpublish-before-publish"]);
});

test("occasion reflection overrides normal rotation through priority", () => {
  const at = new Date("2026-09-06T12:00:00Z");
  const picked = selectDailyReflection([
    { id: "normal", kind: "quran", arabicText: "x", sourceLabel: "source", priority: 10, approved: true },
    { id: "occasion", kind: "hadith", arabicText: "y", sourceLabel: "source", priority: 100, approved: true, activeFrom: "2026-09-06T00:00:00Z", activeUntil: "2026-09-06T23:59:59Z" },
  ], at);
  assert.equal(picked?.id, "occasion");
});

test("unapproved reflections never appear", () => {
  const picked = selectDailyReflection([{ id: "x", kind: "quran", arabicText: "x", sourceLabel: "source", priority: 999, approved: false }], new Date());
  assert.equal(picked, null);
});

import { canTransitionContent, validateCmsItem, validateDailyReflection } from "./cms.ts";

test("only admin can move content to published", () => {
  assert.equal(canTransitionContent("editor", "review", "published"), false);
  assert.equal(canTransitionContent("admin", "review", "published"), true);
});

test("editor can schedule reviewed content", () => {
  assert.equal(canTransitionContent("editor", "review", "scheduled"), true);
});

test("CMS item validation rejects unsafe publishing metadata", () => {
  const errors = validateCmsItem({
    id: "item-1",
    kind: "news",
    title: "Test",
    slug: "Bad Slug",
    status: "scheduled",
    authorEmail: "invalid",
    updatedAt: new Date().toISOString(),
  });
  assert.equal(errors.includes("invalid-slug"), true);
  assert.equal(errors.includes("invalid-author-email"), true);
  assert.equal(errors.includes("scheduled-without-publish-at"), true);
});

test("reflection validation requires Arabic source text and attribution", () => {
  assert.deepEqual(validateDailyReflection({ id: "r1", kind: "quran", arabicText: "", sourceLabel: "", priority: 10, approved: false }), ["missing-arabic-text", "missing-source"]);
});
