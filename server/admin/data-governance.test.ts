import assert from "node:assert/strict";
import test from "node:test";
import { auditEnrollmentRows, canImportRows, createAuditEvent } from "./data-governance.ts";

test("enrollment audit catches the currently known missing-name class of bug", () => {
  const issues = auditEnrollmentRows([{ rowNumber: 2, applicationId: "AIC-2026-001", email: "student@example.com", academicYear: "2026-2027", status: "accepted" }]);
  assert.ok(issues.some((issue) => issue.field === "fullName" && issue.code === "missing-required"));
  assert.equal(canImportRows([{ rowNumber: 2, applicationId: "AIC-2026-001", email: "student@example.com", academicYear: "2026-2027" }]), false);
});

test("duplicates are surfaced before central import", () => {
  const rows = [
    { rowNumber: 2, applicationId: "AIC-2026-001", fullName: "A", email: "a@example.com", academicYear: "2026-2027", status: "accepted" },
    { rowNumber: 3, applicationId: "AIC-2026-001", fullName: "B", email: "A@example.com", academicYear: "2026-2027", status: "active" },
  ];
  const issues = auditEnrollmentRows(rows);
  assert.ok(issues.some((issue) => issue.code === "duplicate-application-id"));
  assert.ok(issues.some((issue) => issue.code === "duplicate-email"));
});

test("audit events are attributable and deterministic for the same timestamp", () => {
  const occurredAt = new Date("2026-09-05T12:00:00Z");
  const a = createAuditEvent({ actorUserId: "admin-1", action: "publish-grade", entityType: "grade", entityId: "g-1", source: "admin", occurredAt });
  const b = createAuditEvent({ actorUserId: "admin-1", action: "publish-grade", entityType: "grade", entityId: "g-1", source: "admin", occurredAt });
  assert.equal(a.id, b.id);
  assert.equal(a.occurredAt.toISOString(), occurredAt.toISOString());
});
