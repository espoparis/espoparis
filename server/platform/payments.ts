export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentEvent = {
  provider: string;
  eventId: string;
  transactionId: string;
  userId: string;
  resourceId: string;
  status: PaymentStatus;
  occurredAt: Date;
};

export interface PaymentProvider {
  createCheckout(input: {
    userId: string;
    resourceId: string;
    amountMinor: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ checkoutUrl: string; transactionId: string }>;

  verifyWebhook(payload: string, signature: string): Promise<PaymentEvent>;
}
