import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pastes } from "@/lib/db/schema";
import { PasteWorkspace } from "@/components/PasteWorkspace";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Paste ${slug}`,
    description: "Lihat paste yang dibagikan lewat sx paste.",
    alternates: { canonical: `/${slug}` },
    // Konten paste adalah teks arbitrer milik user — jangan diindeks/di-follow mesin pencari.
    robots: { index: false, follow: false },
  };
}

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
