import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pastes } from "@/lib/db/schema";
import { generateSlug, generateEditToken } from "@/lib/slug";
import { MAX_CONTENT_LENGTH, CREATE_RATE_LIMIT } from "@/lib/constants";
import { rejectIfTooLarge, tooManyRequests } from "@/lib/request-guard";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const tooLarge = rejectIfTooLarge(req);
  if (tooLarge) return tooLarge;

  const ip = getClientIp(req);
  const rateLimit = await checkRateLimit(
    `create:${ip}`,
    CREATE_RATE_LIMIT.limit,
    CREATE_RATE_LIMIT.windowSeconds
  );
  if (!rateLimit.allowed) {
    return tooManyRequests(rateLimit.retryAfterSeconds);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const content = (body as { content?: unknown }).content;
  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Field 'content' is required" }, { status: 400 });
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `Content exceeds max length of ${MAX_CONTENT_LENGTH} characters` },
      { status: 413 }
    );
  }

  const slug = generateSlug();
  const editToken = generateEditToken();

  await db.insert(pastes).values({ slug, content, editToken });

  return NextResponse.json({ slug, editToken }, { status: 201 });
}
