import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pastes } from "@/lib/db/schema";
import { PasteWorkspace } from "@/components/PasteWorkspace";

export default async function PastePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [paste] = await db.select().from(pastes).where(eq(pastes.slug, slug));

  if (!paste) {
    notFound();
  }

  return <PasteWorkspace slug={paste.slug} initialContent={paste.content} />;
}
