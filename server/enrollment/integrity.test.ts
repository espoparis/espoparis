import test from "node:test";
import assert from "node:assert/strict";
import { auditEnrollmentIntegrity, canAutoLinkAccount } from "./integrity.ts";

test("integrity audit catches missing names and unknown folders", () => {
  const result = auditEnrollmentIntegrity([{ rowNumber: 2, applicationId: "AIC-2026-0001", fullName: "", email: "a@example.com", status: "Pending Review", studentFolder: "AIC-2026-0001 - Unknown Student" }]);
  assert.equal(result.total, 1);
  assert.equal(result.healthy, 0);
  assert.ok(result.issues.some((i) => i.code === "missing-name"));
  assert.ok(result.issues.some((i) => i.code === "unknown-folder"));
});

test("integrity audit catches duplicate normalized email", () => {
  const result = auditEnrollmentIntegrity([
    { rowNumber: 2, applicationId: "AIC-2026-0001", fullName: "A", email: "A@EXAMPLE.COM", status: "Accepted", studentFolder: "folder-a" },
    { rowNumber: 3, applicationId: "AIC-2026-0002", fullName: "B", email: "a@example.com", status: "Accepted", studentFolder: "folder-b" },
  ]);
  assert.ok(result.issues.some((i) => i.code === "duplicate-email"));
});

test("account linking requires verified matching email and accepted or active status", () => {
  assert.equal(canAutoLinkAccount({ verifiedEmail: "Student@Example.com", recordEmail: "student@example.com", recordStatus: "Accepted", fullName: "Student Name" }), true);
  assert.equal(canAutoLinkAccount({ verifiedEmail: "student@example.com", recordEmail: "student@example.com", recordStatus: "Pending Review", fullName: "Student Name" }), false);
});
