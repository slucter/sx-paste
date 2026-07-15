import { sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Atomic fixed-window rate limiter backed by Postgres (single upsert statement,
 * so concurrent requests for the same key can't race past the limit).
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const rows = await db.execute<{ count: number; window_start: Date }>(sql`
    INSERT INTO sxpaste_rate_limits (key, window_start, count)
    VALUES (${key}, now(), 1)
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN sxpaste_rate_limits.window_start < now() - make_interval(secs => ${windowSeconds})
          THEN 1
        ELSE sxpaste_rate_limits.count + 1
      END,
      window_start = CASE
        WHEN sxpaste_rate_limits.window_start < now() - make_interval(secs => ${windowSeconds})
          THEN now()
        ELSE sxpaste_rate_limits.window_start
      END
    RETURNING count, window_start
  `);

  const row = rows.rows[0];
  const count = Number(row.count);
  const windowStart = new Date(row.window_start).getTime();
  const resetAt = windowStart + windowSeconds * 1000;
  const retryAfterSeconds = Math.max(0, Math.ceil((resetAt - Date.now()) / 1000));

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds,
  };
}
