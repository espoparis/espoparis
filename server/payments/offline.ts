export type OfflinePaymentStatus = "requested" | "instructions-sent" | "proof-received" | "confirmed" | "rejected" | "cancelled";

export type OfflinePaymentRequest = {
  id: string;
  userId: string;
  resourceType: "course" | "program" | "other";
  resourceId: string;
  status: OfflinePaymentStatus;
  quotedAmountMinor?: number;
  currency?: string;
  requestedAt: Date;
  confirmedAt?: Date;
  confirmedByUserId?: string;
  externalReference?: string;
};

/** Access is never granted merely because a learner submitted proof. */
export function offlinePaymentCanGrantAccess(request: OfflinePaymentRequest) {
  return request.status === "confirmed" && Boolean(request.confirmedByUserId && request.confirmedAt);
}
