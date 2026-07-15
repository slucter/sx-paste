# Backlog

## TODO

### T9 — Deployment ke Vercel + Neon
Konfigurasi env var (`DATABASE_URL`), `vercel.json` bila perlu, pastikan build production sukses, deploy, verifikasi end-to-end di URL production (termasuk `/raw/{slug}`).
**Kriteria sukses**: aplikasi live di Vercel, create/view/edit/raw paste berfungsi di production.
**Depends on**: T2–T8

## DOING
- (kosong)

## DONE
- T1 — Scaffold project Next.js (App Router, TS, Tailwind) — `npm run dev` jalan OK.
- T2 — Neon + Drizzle schema `sxpaste_pastes` (prefix `sxpaste_` sesuai arahan user karena 1 DB Neon dipakai lintas project), migration diterapkan, insert/select terverifikasi.
- T3 — `POST /api/pastes` — create paste, generate slug + editToken, tervalidasi via curl.
- T4 — `GET /api/pastes/[slug]` (JSON) + `GET /raw/[slug]` (text/plain) — raw mode terverifikasi via curl, cocok untuk wget/curl.
- T5 — `PUT /api/pastes/[slug]` — update dengan editToken, slug tetap sama; ditolak (403) bila token salah/kosong — terverifikasi via curl.
- T6 — Landing page `/` minimalis (judul, deskripsi, CTA "Mulai paste", tanpa gradient) — SSR terverifikasi via curl.
- T7 — Halaman `/new` pakai CodeMirror 6 (`components/CodeArea.tsx`) ala-IDE, Save → POST create → simpan editToken ke localStorage → redirect ke `/{slug}`.
- T8 — Halaman `/{slug}` (`components/PasteWorkspace.tsx`) read-only default, tombol Edit hanya muncul jika editToken untuk slug ada di localStorage (via `useSyncExternalStore`), Save saat edit → PUT, slug tidak berubah. Lint (`react-hooks/set-state-in-effect`) & type-check & production build semua bersih.
  - **Catatan**: interaksi visual CodeMirror & toggle edit/view di browser sungguhan **belum divalidasi manual** — tidak ada tool browser di sesi ini. Sudah diverifikasi lewat: SSR HTML curl, `tsc --noEmit`, `next build`, dan end-to-end API test (create→view→raw→edit→raw). User disarankan cek manual di browser sebelum deploy production.
