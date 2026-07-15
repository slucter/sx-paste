import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pastes } from "@/lib/db/schema";
import { generateSlug, generateEditToken } from "@/lib/slug";
import { MAX_CONTENT_LENGTH } from "@/lib/constants";

export async function POST(req: NextRequest) {
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
