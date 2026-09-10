import assert from "node:assert/strict";
import test from "node:test";
import { allowsCustomAmount, requiresAdministrationContact, requiresOnlineCheckout } from "./catalog.ts";

test("contact pricing routes to administration instead of checkout", () => {
  assert.equal(requiresAdministrationContact({ mode: "contact" }), true);
  assert.equal(requiresOnlineCheckout({ mode: "contact" }), false);
});

test("fixed price requires an amount before checkout is enabled", () => {
  assert.equal(requiresOnlineCheckout({ mode: "fixed", currency: "EUR", amountMinor: 4900 }), true);
  assert.equal(requiresOnlineCheckout({ mode: "fixed", currency: "EUR" }), false);
});

test("donation pricing supports a custom amount", () => {
  assert.equal(allowsCustomAmount({ mode: "donation" }), true);
});
