// Deliberately no `import "server-only"` here: this module holds no secrets and
// no privileged I/O, and omitting it keeps the logic unit-testable outside the
// Next bundler (which is what aliases that specifier). The secret-bearing
// modules — `server/email/resend.ts` and `server/email/contact.ts` — keep it.

type Bucket = {
  hits: number[];
};

/**
 * Process-local sliding window limiter.
 *
 * This is intentionally simple: the site has no datastore, so the counter lives
 * in memory and resets on cold start and is not shared between serverless
 * instances. It raises the cost of casual form abuse rather than guaranteeing a
 * global ceiling. Move this to a shared store (Redis, Upstash) if the contact
 * form ever becomes a meaningful spam target.
 */
const buckets = new Map<string, Bucket>();

const MAX_TRACKED_KEYS = 5_000;

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now: number = Date.now(),
): RateLimitResult {
  const cutoff = now - windowMs;
  const bucket = buckets.get(key) ?? { hits: [] };
  const hits = bucket.hits.filter((timestamp) => timestamp > cutoff);

  if (hits.length >= limit) {
    buckets.set(key, { hits });

    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000)),
    };
  }

  hits.push(now);
  buckets.set(key, { hits });

  // Opportunistic cleanup so a long-lived instance cannot grow unbounded.
  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [bucketKey, value] of buckets) {
      const live = value.hits.filter((timestamp) => timestamp > cutoff);

      if (live.length === 0) {
        buckets.delete(bucketKey);
      } else {
        buckets.set(bucketKey, { hits: live });
      }
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Exposed for tests so each case starts from a clean window. */
export function resetRateLimits() {
  buckets.clear();
}
