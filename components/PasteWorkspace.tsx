"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CodeArea } from "@/components/CodeArea";
import { getEditToken, subscribeEditToken } from "@/lib/storage";

export function PasteWorkspace({
  slug,
  initialContent,
}: {
  slug: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const editToken = useSyncExternalStore(
    subscribeEditToken,
    () => getEditToken(slug),
    () => null
  );

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/${slug}` : `/${slug}`;
  const rawUrl = typeof window !== "undefined" ? `${window.location.origin}/raw/${slug}` : `/raw/${slug}`;

  async function handleSave() {
    if (!editToken || saving) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/pastes/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, editToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menyimpan perubahan");
      }

      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — user can select the URL text manually.
    }
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="font-mono text-sm text-muted hover:text-foreground">
            ← sx paste
          </Link>

          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-red-500">{error}</span>}

            {editing ? (
              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
              >
                {saving ? "Menyimpan…" : "Save"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="rounded-md border border-border px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
                {editToken && (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-85"
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <CodeArea value={content} onChange={setContent} readOnly={!editing} />

        <p className="mt-4 font-mono text-xs text-muted">
          raw: <span className="text-foreground">{rawUrl}</span>
        </p>
      </div>
    </main>
  );
}
