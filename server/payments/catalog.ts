export type PricingMode = "free" | "fixed" | "contact" | "donation";

export type PricingPolicy = {
  mode: PricingMode;
  currency?: string;
  amountMinor?: number;
  minimumDonationMinor?: number;
};

export function requiresOnlineCheckout(policy: PricingPolicy) {
  return policy.mode === "fixed" && typeof policy.amountMinor === "number";
}

export function requiresAdministrationContact(policy: PricingPolicy) {
  return policy.mode === "contact";
}

export function allowsCustomAmount(policy: PricingPolicy) {
  return policy.mode === "donation";
}
