import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { checkRateLimit, resetRateLimits } from "./rate-limit.ts";

const OPTIONS = { limit: 3, windowMs: 60_000 };

beforeEach(() => {
  resetRateLimits();
});

test("allows submissions up to the limit", () => {
  const now = 1_000_000;

  for (let attempt = 0; attempt < OPTIONS.limit; attempt += 1) {
    assert.equal(checkRateLimit("1.2.3.4", OPTIONS, now).allowed, true);
  }
});

test("blocks the submission past the limit", () => {
  const now = 1_000_000;

  for (let attempt = 0; attempt < OPTIONS.limit; attempt += 1) {
    checkRateLimit("1.2.3.4", OPTIONS, now);
  }

  const blocked = checkRateLimit("1.2.3.4", OPTIONS, now);

  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);
});

test("keys are independent, so one sender cannot block another", () => {
  const now = 1_000_000;

  for (let attempt = 0; attempt < OPTIONS.limit; attempt += 1) {
    checkRateLimit("1.2.3.4", OPTIONS, now);
  }

  assert.equal(checkRateLimit("1.2.3.4", OPTIONS, now).allowed, false);
  assert.equal(checkRateLimit("5.6.7.8", OPTIONS, now).allowed, true);
});

test("the window slides, so the sender recovers once it passes", () => {
  const now = 1_000_000;

  for (let attempt = 0; attempt < OPTIONS.limit; attempt += 1) {
    checkRateLimit("1.2.3.4", OPTIONS, now);
  }

  assert.equal(checkRateLimit("1.2.3.4", OPTIONS, now).allowed, false);
  assert.equal(
    checkRateLimit("1.2.3.4", OPTIONS, now + OPTIONS.windowMs + 1).allowed,
    true,
  );
});

test("reports a retry hint that shrinks as the window drains", () => {
  const now = 1_000_000;

  for (let attempt = 0; attempt < OPTIONS.limit; attempt += 1) {
    checkRateLimit("1.2.3.4", OPTIONS, now);
  }

  const immediately = checkRateLimit("1.2.3.4", OPTIONS, now).retryAfterSeconds;
  const later = checkRateLimit("1.2.3.4", OPTIONS, now + 30_000).retryAfterSeconds;

  assert.ok(later < immediately);
});
