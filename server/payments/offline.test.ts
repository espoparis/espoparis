import assert from "node:assert/strict";
import test from "node:test";
import { offlinePaymentCanGrantAccess } from "./offline.ts";

const base = { id: "p1", userId: "u1", resourceType: "course" as const, resourceId: "c1", requestedAt: new Date() };

test("offline payment proof alone cannot unlock access", () => {
  assert.equal(offlinePaymentCanGrantAccess({ ...base, status: "proof-received" }), false);
});

test("confirmed offline payment requires an administrator and timestamp", () => {
  assert.equal(offlinePaymentCanGrantAccess({ ...base, status: "confirmed" }), false);
  assert.equal(offlinePaymentCanGrantAccess({ ...base, status: "confirmed", confirmedAt: new Date(), confirmedByUserId: "admin-1" }), true);
});
