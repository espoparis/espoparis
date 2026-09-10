export type PurchaseStatus = "created" | "pending" | "paid" | "failed" | "refunded" | "cancelled";

export type Purchase = {
  id: string;
  userId: string;
  resourceKind: "course" | "book";
  resourceId: string;
  amountMinor: number;
  currency: string;
  provider: string;
  providerTransactionId?: string;
  status: PurchaseStatus;
  createdAt: Date;
  paidAt?: Date;
  refundedAt?: Date;
};

export type PaymentWebhookInput = {
  provider: string;
  eventId: string;
  transactionId: string;
  status: "paid" | "failed" | "refunded";
  occurredAt: Date;
};
