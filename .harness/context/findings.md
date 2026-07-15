# Findings

## Analisis
- Scope T1–T8 cukup jelas dari awal (CRUD paste sederhana + 2 halaman), fase ANALYZE terpisah dilewati sesuai catatan di `orchestrator.md` (tidak ada ambiguitas requirement yang butuh riset tambahan).

## VAPT

### V1 — SQL Injection
**Lokasi**: semua akses DB (`lib/db`, `app/api/pastes/**`, `app/raw/[slug]`, `app/[slug]/page.tsx`)
**Severity**: — (aman)
**Status**: checked, tidak ada temuan
Semua query pakai Drizzle query builder (`db.select().where(eq(...))`) — parameterized, tidak ada raw SQL template literal dari input user. Grep konfirmasi tidak ada `sql\`...\`` yang menyisipkan variabel user langsung.

### V2 — XSS via konten paste
**Lokasi**: `components/CodeArea.tsx`, `components/PasteWorkspace.tsx`
**Severity**: — (aman)
**Status**: checked, tidak ada temuan
Konten paste dirender lewat CodeMirror (text buffer) dan JSX biasa — tidak ada `dangerouslySetInnerHTML`. React & CodeMirror otomatis escape teks sebagai text node, bukan HTML.

### V3 — Tidak ada rate limiting pada endpoint create/update
**Lokasi**: `app/api/pastes/route.ts` (POST), `app/api/pastes/[slug]/route.ts` (PUT)
**Severity**: Medium
**Status**: open
Tanpa rate limit, siapa pun bisa membuat paste dalam jumlah tak terbatas (spam/flood) atau brute-force mencoba banyak `editToken` pada satu slug (meski token 32 karakter dari alphabet 57 karakter → ruang kemungkinan sangat besar, brute force praktis tidak feasible, tapi flood create tetap mungkin membebani Neon/biaya).
**Rekomendasi**: tambahkan rate limiting sederhana (mis. berbasis IP, pakai Vercel Edge Middleware atau layanan seperti Upstash Ratelimit) sebelum trafik publik signifikan. Tidak blocking untuk MVP/personal use.

### V4 — Tidak ada mekanisme recovery jika localStorage hilang
**Lokasi**: `lib/storage.ts`, alur edit token
**Severity**: Low
**Status**: accepted (keputusan desain, lihat `decisions.md`)
Sesuai desain yang dipilih user (edit token di localStorage), kehilangan localStorage = kehilangan akses edit permanen. Sudah didokumentasikan sebagai konsekuensi yang disadari, bukan bug.

### V5 — `.env.local` berisi kredensial DB production/shared
**Lokasi**: `.env.local` (root)
**Severity**: — (aman, dengan catatan)
**Status**: checked
File berisi connection string Neon asli (dibagikan user langsung di chat). Sudah dipastikan **tidak ter-commit** ke git (`.gitignore` pattern `.env*` dengan pengecualian eksplisit hanya untuk `.env.example`, diverifikasi lewat `git status` sebelum commit pertama).
**Rekomendasi**: karena connection string sempat dikirim melalui chat biasa (bukan secret manager), pertimbangkan rotate password Neon (`neondb_owner`) setelah setup selesai, terutama karena DB ini dipakai lintas project lain.
