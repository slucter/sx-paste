import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <section className="w-full max-w-lg">
        <p className="mb-4 font-mono text-xs tracking-wide text-muted">
          $ sx-paste
        </p>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          sx paste
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted">
          Tempel teks, simpan, dan bagikan lewat satu link pendek. Tanpa akun,
          tanpa ribet. Butuh akses dari terminal? Setiap paste otomatis
          tersedia dalam mode <span className="font-mono text-foreground">raw</span> yang
          langsung terbaca oleh <span className="font-mono text-foreground">wget</span> atau{" "}
          <span className="font-mono text-foreground">curl</span> — tanpa parsing HTML.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/new"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-85"
          >
            Mulai paste
            <span aria-hidden>→</span>
          </Link>

          <span className="font-mono text-xs text-muted">
            curl domain/raw/&#123;id&#125;
          </span>
        </div>

        <ul className="mt-10 space-y-2 border-t border-border pt-6 text-sm text-muted">
          <li>· Link acak, singkat, siap dibagikan</li>
          <li>· Bisa diedit kembali dari browser yang sama</li>
          <li>· Mode raw untuk CLI, mode baca untuk manusia</li>
        </ul>
      </section>
    </main>
  );
}
