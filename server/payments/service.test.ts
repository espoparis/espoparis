import assert from "node:assert/strict";
import test from "node:test";
import { applyPaymentWebhook } from "./service.ts";
import type { Purchase } from "./types.ts";

const base: Purchase = {
  id: "purchase-1",
  userId: "user-1",
  resourceKind: "course",
  resourceId: "course-1",
  amountMinor: 2500,
  currency: "EUR",
  provider: "future-provider",
  providerTransactionId: "txn-1",
  status: "pending",
  createdAt: new Date("2026-09-05T00:00:00Z"),
};

test("paid webhook creates a matching course entitlement", () => {
  const result = applyPaymentWebhook(base, { provider: "future-provider", eventId: "evt-1", transactionId: "txn-1", status: "paid", occurredAt: new Date("2026-09-05T01:00:00Z") });
  assert.equal(result.purchase.status, "paid");
  assert.equal(result.entitlement?.resourceId, "course-1");
  assert.equal(result.entitlement?.source, "purchase");
});

test("refund requests entitlement revocation", () => {
  const result = applyPaymentWebhook({ ...base, status: "paid" }, { provider: "future-provider", eventId: "evt-2", transactionId: "txn-1", status: "refunded", occurredAt: new Date("2026-09-06T01:00:00Z") });
  assert.equal(result.purchase.status, "refunded");
  assert.equal(result.revokeEntitlement, true);
});

test("mismatched transaction is rejected", () => {
  assert.throws(() => applyPaymentWebhook(base, { provider: "future-provider", eventId: "evt-x", transactionId: "wrong", status: "paid", occurredAt: new Date() }));
});
