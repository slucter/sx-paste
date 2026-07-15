# Decisions Log (ADR Ringkas)

Format tiap entri:

```
# <judul> — <tanggal>
## Konteks
...
## Keputusan
...
## Konsekuensi
...
```

---

# Pilihan stack: Next.js + Neon + Drizzle + Tailwind + CodeMirror — 2026-07-15
## Konteks
Project "sx paste" butuh stack seringan mungkin, deploy ke Vercel, DB Neon, dengan kebutuhan: landing page, editor ala-IDE, mode share read-only, mode raw untuk CLI (wget/curl).
## Keputusan
- Next.js App Router: satu framework untuk frontend + API routes, native di Vercel, mendukung route dinamis `/[slug]` dan `/raw/[slug]` dengan mudah.
- Drizzle ORM (bukan Prisma): lebih ringan, tanpa generate step berat, cocok untuk schema simpel (1 tabel `pastes`).
- @neondatabase/serverless: driver HTTP/WebSocket resmi Neon, cocok untuk serverless/edge function di Vercel (tanpa connection pool tradisional yang mahal di serverless).
- Tailwind CSS: styling minimalis tanpa runtime overhead, gampang jaga konsistensi desain compact.
- CodeMirror 6: lebih ringan dari Monaco Editor untuk kebutuhan textarea ala-IDE (syntax highlight ringan, line numbers, monospace).
- nanoid untuk slug generator: random string pendek, URL-safe, collision-resistant untuk skala kecil-menengah.
## Konsekuensi
- Tidak ada framework ORM berat / query builder kompleks — schema dan query harus tetap simpel (1-2 tabel).
- Karena pakai Neon serverless driver, semua akses DB harus lewat API routes/server components, bukan client langsung.
- Perlu env var `DATABASE_URL` (Neon) di Vercel project settings — dicatat sebagai task deployment.

---

# Mekanisme otorisasi edit: edit token di localStorage — 2026-07-15
## Konteks
URL paste harus tetap sama saat diedit ulang, tapi tidak mau bikin sistem login penuh. User (owner project) memilih opsi "edit token di localStorage" saat ditanya lewat AskUserQuestion.
## Keputusan
- Saat paste pertama kali disimpan, server generate `edit_token` (random, disimpan di DB terhubung ke slug) dan dikembalikan ke client sekali saja.
- Client simpan `edit_token` di `localStorage` dengan key spesifik per-slug (mis. `sxpaste:edit:{slug}`).
- Untuk masuk mode edit, client kirim `edit_token` tersimpan ke API; server verifikasi cocok dengan yang di DB sebelum mengizinkan update konten.
- Tidak ada UI login/password — kalau localStorage kosong/beda browser, paste otomatis read-only (mode share).
## Konsekuensi
- Edit hanya bisa dari browser yang sama tempat paste dibuat (localStorage tidak sync antar-device/browser).
- Kalau localStorage di-clear, akses edit hilang permanen (tidak ada recovery) — perlu disebutkan di UI sebagai batasan yang disadari.
- Tidak butuh sistem auth/session kompleks, cocok untuk tool simpel ini.
