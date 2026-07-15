# Orchestrator — Otak Loop & Routing

Dokumen ini adalah "otak" orkestrasi harness: state machine antar-fase, aturan routing, cara membaca/menulis state, dan guardrail keselamatan.

## State machine

```
PLAN → ANALYZE → CODE → VAPT → REVIEW → (loop kembali ke PLAN, atau DONE)
```

- **PLAN**: pecah goal jadi task, tetapkan kriteria sukses → persona `planner.md`.
- **ANALYZE**: analisis codebase/requirement, identifikasi risiko/dependensi → persona `analyst.md`.
- **CODE**: implementasi task dari backlog → persona `coder.md`.
- **VAPT**: audit keamanan hasil implementasi → persona `vapt.md`.
- **REVIEW**: orchestrator (atau manusia) mengevaluasi apakah hasil fase VAPT/CODE memenuhi Definition of Done sebelum lanjut/loop.

## Aturan routing

- **Maju satu fase** hanya jika Definition of Done (DoD) fase saat ini terpenuhi, dievaluasi di `REVIEW`.
- **VAPT gagal (ditemukan severity High/Critical)** → routing kembali ke `CODE` dengan task perbaikan baru ditambahkan ke `backlog.md`, referensi ke entri terkait di `findings.md`.
- **ANALYZE menemukan risiko/dependensi baru yang mengubah rencana** → routing kembali ke `PLAN` untuk revisi task.
- **CODE menemukan requirement ambigu** → routing kembali ke `PLAN`, jangan menebak.
- **Backlog kosong dan VAPT bersih (tidak ada temuan open severity High/Critical)** → kondisi `DONE`.

## Cara membaca/menulis `state.md`

- Setiap agent **wajib** membaca `context/state.md` di awal sesi untuk tahu: `iterasi`, `fase`, `agent_aktif`, `task_aktif`.
- Setelah selesai kerja, agent **wajib** meng-update field tersebut sebelum mengakhiri sesi, termasuk `updated: <tanggal ISO>`.
- Jangan pernah membiarkan `state.md` dalam kondisi tidak konsisten (mis. `fase: CODE` tapi `task_aktif: none`) — selalu selesaikan update sebelum berhenti.

## Aturan handoff

- Sebelum menyerahkan pekerjaan ke agent/fase berikutnya, agent **wajib** mengisi salinan `templates/handoff.md` dan menyimpannya (misalnya ditempel di akhir `state.md` atau sebagai catatan di `decisions.md`/`findings.md` yang relevan).
- Handoff harus menyebutkan artefak yang diubah dan hal yang perlu diperhatikan agent berikutnya.

## Guardrail

- **Batas iterasi maksimum**: default **10 iterasi loop penuh** (`PLAN→...→REVIEW` dihitung 1 iterasi). Jika tercapai tanpa mencapai `DONE`, **berhenti dan minta konfirmasi manusia** — jangan lanjut otomatis.
- **Minta konfirmasi manusia** sebelum:
  - Mengubah/menghapus data atau infrastruktur di luar working directory.
  - Melakukan aksi yang sulit dibalik (force-push, reset --hard, dsb.) — mengikuti aturan keselamatan umum di luar harness ini.
  - Melewati (skip) fase `VAPT` untuk perubahan yang menyentuh input eksternal, auth, atau secrets.
- Jika temuan VAPT severity **Critical**, orchestrator **wajib berhenti** dan minta konfirmasi manusia sebelum lanjut ke fase apa pun.

## Ringkasan akhir iterasi

Di akhir tiap iterasi penuh, ringkas perubahan penting ke `context/CONTEXT.md` (bagian "Fakta penting") supaya sesi berikutnya tidak perlu membaca seluruh histori — hemat konteks.
