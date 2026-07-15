import { NextRequest, NextResponse } from "next/server";
import { MAX_BODY_BYTES } from "@/lib/constants";

/** Rejects oversized bodies before they're buffered/parsed into memory. */
export function rejectIfTooLarge(req: NextRequest): NextResponse | null {
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }
  return null;
}

export function tooManyRequests(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests, please slow down" },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}
