import assert from "node:assert/strict";
import test from "node:test";
import {
  countUnread,
  defaultNotificationPreference,
  markNotificationRead,
  selectDeliveryChannels,
  type AcademicNotification,
} from "./notifications.ts";

const base: AcademicNotification = {
  id: "n-1",
  recipientUserId: "u-1",
  kind: "grade-published",
  title: "Grade published",
  body: "Your result is now available.",
  channels: ["in-app", "email"],
  createdAt: "2026-09-05T12:00:00Z",
};

test("unread notifications are counted", () => {
  assert.equal(countUnread([base, { ...base, id: "n-2", readAt: "2026-09-05T13:00:00Z" }]), 1);
});

test("marking read is idempotent", () => {
  const first = markNotificationRead(base, "2026-09-05T13:00:00Z");
  const second = markNotificationRead(first, "2026-09-05T14:00:00Z");
  assert.equal(second.readAt, "2026-09-05T13:00:00Z");
});

test("delivery respects user preferences", () => {
  assert.deepEqual(
    selectDeliveryChannels(["in-app", "email"], { userId: "u-1", inApp: true, email: false }),
    ["in-app"],
  );
});

test("default notifications enable in-app and email", () => {
  assert.deepEqual(defaultNotificationPreference("u-1"), { userId: "u-1", inApp: true, email: true });
});
