"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CodeArea } from "@/components/CodeArea";
import { setEditToken } from "@/lib/storage";

export default function NewPastePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!content.trim() || saving) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menyimpan paste");
      }

      const data = (await res.json()) as { slug: string; editToken: string };
      setEditToken(data.slug, data.editToken);
      router.push(`/${data.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setSaving(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm text-muted hover:text-foreground">
            ← sx paste
          </Link>

          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-red-500">{error}</span>}
            <button
              onClick={handleSave}
              disabled={saving || !content.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {saving ? "Menyimpan…" : "Save & Share"}
            </button>
          </div>
        </div>

        <CodeArea
          value={content}
          onChange={setContent}
          placeholder="Tempel atau ketik teks di sini…"
        />
      </div>
    </main>
  );
}
