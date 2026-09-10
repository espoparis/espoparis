import type { Entitlement } from "@/server/platform/types";
import type { PaymentWebhookInput, Purchase } from "./types";

export type PaymentApplyResult = {
  purchase: Purchase;
  entitlement?: Entitlement;
  revokeEntitlement: boolean;
};

export function applyPaymentWebhook(purchase: Purchase, event: PaymentWebhookInput): PaymentApplyResult {
  if (purchase.provider !== event.provider || purchase.providerTransactionId !== event.transactionId) {
    throw new Error("Payment event does not match the purchase transaction");
  }

  if (event.status === "paid") {
    const next: Purchase = { ...purchase, status: "paid", paidAt: event.occurredAt };
    return {
      purchase: next,
      entitlement: {
        userId: purchase.userId,
        resourceKind: purchase.resourceKind === "course" ? "course" : "book",
        resourceId: purchase.resourceId,
        source: "purchase",
      },
      revokeEntitlement: false,
    };
  }

  if (event.status === "refunded") {
    return {
      purchase: { ...purchase, status: "refunded", refundedAt: event.occurredAt },
      revokeEntitlement: true,
    };
  }

  return { purchase: { ...purchase, status: "failed" }, revokeEntitlement: false };
}
