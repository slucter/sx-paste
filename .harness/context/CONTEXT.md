# CONTEXT — Ringkasan Project (Long-term Memory)

## Nama project
**sx paste**

## Tujuan
Web tool sederhana untuk paste/save teks (seperti pastebin). User paste teks → klik Save → dapat URL `domain/randomStringURI`. Mendukung mode raw (`text/plain`, gampang diakses via `wget`/`curl`). Setelah save, paste masuk ke mode share (read-only), tapi bisa balik ke mode edit dari browser yang sama tanpa URL berubah.

## Tech stack
- Bahasa: TypeScript
- Framework: **Next.js (App Router)** — file-based routing pas untuk `/[slug]` dan `/raw/[slug]`, API routes built-in, deploy native ke Vercel.
- Database: **Neon Postgres** (serverless Postgres) via driver `@neondatabase/serverless` + **Drizzle ORM** (ringan, type-safe, tanpa overhead heavy seperti Prisma).
- Styling: **Tailwind CSS** (utility-first, tanpa runtime CSS-in-JS, bundle kecil) + editor teks pakai **CodeMirror 6** (ringan dibanding Monaco) untuk tampilan ala-IDE.
- Deployment: **Vercel** (Edge/Node runtime sesuai kebutuhan route).
- Slug generator: `nanoid` (random string URL-safe, pendek).

## Fakta penting
- Mode edit diotorisasi via **edit token** yang disimpan di `localStorage` browser saat pertama kali save (bukan login/password). Lihat [decisions.md](decisions.md).
- URL paste **tidak berubah** saat diedit ulang — slug dibuat sekali di awal, update hanya mengubah konten.
- Mode raw diakses lewat route terpisah, mengembalikan `Content-Type: text/plain` agar mudah dibaca `wget`/`curl` tanpa parsing HTML.
- Landing page: 1 section minimalis (judul + deskripsi + CTA), tanpa gradient, compact tapi tetap menarik.

## Glosarium
- **slug**: random string unik di URL (`domain/{slug}`) sebagai identitas paste.
- **edit token**: secret yang disimpan di localStorage untuk otorisasi masuk mode edit pada paste yang sama.
- **raw mode**: representasi teks polos (`text/plain`) dari paste, di route `/raw/{slug}`.
