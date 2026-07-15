# AGENTS.md — Entry Point

> Sebelum melakukan tugas apa pun di repo ini, baca file ini sampai habis, lalu baca [`.harness/orchestrator.md`](.harness/orchestrator.md).

## Apa ini?

Ini adalah **harness agentic** tool-agnostic untuk project ini. Harness ini dirancang supaya IDE atau agentic AI apa pun (Claude Code, Cursor, dsb.) bisa menjalankan alur kerja yang sama, dengan "kecerdasan" (persona, orkestrasi, workflow) disimpan sebagai file `.md` biasa — bukan fitur eksklusif satu tool. Semua state dan keputusan penting dipersist ke `.harness/context/` supaya konteks tidak hilang antar-sesi maupun antar-tool.

## Peta folder `.harness/`

| File/Folder | Kapan dibaca |
|---|---|
| [`orchestrator.md`](.harness/orchestrator.md) | Selalu, setelah file ini — mendefinisikan state machine & routing antar-agent |
| [`personas/planner.md`](.harness/personas/planner.md) | Saat fase `PLAN` |
| [`personas/analyst.md`](.harness/personas/analyst.md) | Saat fase `ANALYZE` |
| [`personas/coder.md`](.harness/personas/coder.md) | Saat fase `CODE` |
| [`personas/vapt.md`](.harness/personas/vapt.md) | Saat fase `VAPT` |
| [`workflows/loop.md`](.harness/workflows/loop.md) | Saat menjalankan loop utama (`start loop`, `next`) |
| [`context/CONTEXT.md`](.harness/context/CONTEXT.md) | Selalu — memuat konteks project (long-term memory) |
| [`context/state.md`](.harness/context/state.md) | Selalu — cek fase & task aktif saat ini |
| [`context/decisions.md`](.harness/context/decisions.md) | Saat butuh riwayat keputusan arsitektural |
| [`context/backlog.md`](.harness/context/backlog.md) | Saat fase `PLAN`/`CODE` — daftar task |
| [`context/findings.md`](.harness/context/findings.md) | Saat fase `ANALYZE`/`VAPT` |
| [`templates/handoff.md`](.harness/templates/handoff.md) | Setiap kali serah-terima antar-agent |

## Aturan wajib untuk semua agent

1. Baca [`.harness/context/state.md`](.harness/context/state.md) untuk tahu sedang di fase mana.
2. Baca [`.harness/context/CONTEXT.md`](.harness/context/CONTEXT.md) untuk memuat konteks project.
3. Ambil peran sesuai fase dari `.harness/personas/`.
4. Setelah kerja, **update** `state.md`, `backlog.md`, dan `decisions.md`/`findings.md` yang relevan.
5. Isi [`templates/handoff.md`](.harness/templates/handoff.md) sebelum menyerahkan pekerjaan ke agent berikutnya.

## Perintah pemicu (natural language)

- `start loop` — mulai/lanjutkan workflow loop dari state saat ini.
- `next` — jalankan satu langkah/fase berikutnya.
- `plan <fitur>` — masuk fase PLAN untuk fitur tertentu.
- `analyze` — masuk fase ANALYZE.
- `code` — masuk fase CODE, kerjakan task teratas di backlog.
- `vapt` — masuk fase VAPT, audit keamanan.
- `status` — laporkan isi `state.md` dan ringkasan backlog tanpa mengubah apa pun.

## Catatan

Harness ini baru berupa kerangka (scaffold). Belum ada kode aplikasi, tech stack, atau goal yang ditetapkan. Isi [`context/CONTEXT.md`](.harness/context/CONTEXT.md) atau ketik `plan <fitur>` untuk mulai.
