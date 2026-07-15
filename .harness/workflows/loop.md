# Workflow: Loop Utama

Definisi eksplisit workflow loop yang dijalankan tiap kali user mengetik `start loop` atau `next`.

## Langkah

1. Baca `.harness/context/state.md` → tentukan fase & task aktif saat ini.
2. Jalankan agent sesuai fase (ambil persona terkait dari `.harness/personas/`):
   - `PLAN` → `personas/planner.md`
   - `ANALYZE` → `personas/analyst.md`
   - `CODE` → `personas/coder.md`
   - `VAPT` → `personas/vapt.md`
3. Agent menulis output ke `context/` yang relevan (`backlog.md`, `findings.md`, `decisions.md`) dan mengisi `templates/handoff.md`.
4. Orchestrator (lihat `.harness/orchestrator.md`) mengevaluasi: apakah Definition of Done fase ini terpenuhi?
   - **Lolos** → maju ke fase berikutnya sesuai state machine.
   - **Gagal** → balik ke fase sebelumnya yang relevan (lihat aturan routing di `orchestrator.md`), atau perbaiki di fase yang sama.
5. Update `context/state.md`: increment `iterasi` (bila satu siklus penuh selesai), update `fase`, `agent_aktif`, `task_aktif`, `updated`.
6. Ulangi langkah 1–5 sampai salah satu tercapai:
   - Backlog kosong (`## TODO` dan `## DOING` kosong) dan VAPT bersih → kondisi `DONE`.
   - Batas iterasi maksimum tercapai (default 10) → berhenti, minta konfirmasi manusia.
   - Temuan VAPT severity Critical → berhenti, minta konfirmasi manusia.
7. Di akhir tiap iterasi penuh, ringkas perubahan penting ke `context/CONTEXT.md` (bagian "Fakta penting") agar sesi berikutnya hemat konteks.

## Catatan
- `next` menjalankan satu langkah (satu fase) saja, lalu berhenti dan melapor ke user.
- `start loop` menjalankan langkah 1–6 berulang sampai kondisi berhenti tercapai, melapor ke user di tiap transisi fase penting.
