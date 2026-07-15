import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pastes } from "@/lib/db/schema";
import { MAX_CONTENT_LENGTH, UPDATE_RATE_LIMIT } from "@/lib/constants";
import { rejectIfTooLarge, tooManyRequests } from "@/lib/request-guard";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const [paste] = await db.select().from(pastes).where(eq(pastes.slug, slug));

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    slug: paste.slug,
    content: paste.content,
    createdAt: paste.createdAt,
    updatedAt: paste.updatedAt,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const tooLarge = rejectIfTooLarge(req);
  if (tooLarge) return tooLarge;

  const ip = getClientIp(req);
  const rateLimit = await checkRateLimit(
    `update:${ip}`,
    UPDATE_RATE_LIMIT.limit,
    UPDATE_RATE_LIMIT.windowSeconds
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

  const { content, editToken } = body as { content?: unknown; editToken?: unknown };

  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Field 'content' is required" }, { status: 400 });
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `Content exceeds max length of ${MAX_CONTENT_LENGTH} characters` },
      { status: 413 }
    );
  }
  if (typeof editToken !== "string" || editToken.length === 0) {
    return NextResponse.json({ error: "Field 'editToken' is required" }, { status: 400 });
  }

  const [paste] = await db.select().from(pastes).where(eq(pastes.slug, slug));
  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (paste.editToken !== editToken) {
    return NextResponse.json({ error: "Invalid edit token" }, { status: 403 });
  }

  await db
    .update(pastes)
    .set({ content, updatedAt: new Date() })
    .where(eq(pastes.slug, slug));

  return NextResponse.json({ slug, ok: true });
}
