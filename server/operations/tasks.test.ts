import assert from "node:assert/strict";
import test from "node:test";
import { openTasksForRole, resolveTask, type OperationalTask } from "./tasks.ts";

const task: OperationalTask = {
  id: "t-1",
  kind: "review-grades",
  title: "Review Fiqh grades",
  status: "open",
  assigneeRole: "editor",
  entityId: "course-1",
  createdAt: "2026-09-05T12:00:00Z",
};

test("tasks are filtered by role and open state", () => {
  assert.equal(openTasksForRole([task, { ...task, id: "t-2", assigneeRole: "admin" }], "editor").length, 1);
});

test("resolved tasks are removed from active queue", () => {
  const resolved = resolveTask(task, "2026-09-05T14:00:00Z");
  assert.equal(resolved.status, "resolved");
  assert.equal(openTasksForRole([resolved], "editor").length, 0);
});
