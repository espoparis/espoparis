import test from "node:test";
import assert from "node:assert/strict";
import { assertEnrollmentRepairPreconditions, canApplyEnrollmentRepair } from "./repair-policy.ts";

const cleanAudit = { auditToken: "abc123", canApply: true, blockers: [], proposals: [] };

test("repair policy allows only a clean audit", () => {
  assert.equal(canApplyEnrollmentRepair(cleanAudit), true);
  assert.equal(canApplyEnrollmentRepair({ ...cleanAudit, blockers: [{ type: "duplicate-email", message: "duplicate" }] }), false);
  assert.equal(canApplyEnrollmentRepair({ ...cleanAudit, canApply: false }), false);
});

test("repair policy requires the exact confirmation phrase", () => {
  assert.throws(() => assertEnrollmentRepairPreconditions({ confirmation: "repair", audit: cleanAudit, suppliedAuditToken: "abc123" }), /confirmation/i);
});

test("repair policy rejects a stale audit token", () => {
  assert.throws(() => assertEnrollmentRepairPreconditions({ confirmation: "APPLY-ENROLLMENT-REPAIR", audit: cleanAudit, suppliedAuditToken: "old" }), /stale/i);
  assert.equal(assertEnrollmentRepairPreconditions({ confirmation: "APPLY-ENROLLMENT-REPAIR", audit: cleanAudit, suppliedAuditToken: "abc123" }), true);
});
