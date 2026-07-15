# `.harness/` — Cara Kerja

Folder ini berisi seluruh "otak" dari harness agentic project ini: persona, orkestrasi, workflow, dan context persistence. Root project hanya berisi pointer (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) yang mengarahkan agent ke sini.

## Filosofi

- **Tool-agnostic**: semua instruksi ditulis sebagai markdown biasa, bisa dibaca dan diikuti oleh agent/IDE apa pun.
- **Stateful lewat file**: tidak ada state tersembunyi di memori tool. Semua state loop, keputusan, backlog, dan temuan ditulis ke `context/*.md`.
- **Persona per fase**: setiap fase (`PLAN`, `ANALYZE`, `CODE`, `VAPT`) punya persona sendiri di `personas/` dengan role, input, output, dan Definition of Done yang eksplisit.
- **Handoff eksplisit**: agent tidak boleh diam-diam pindah fase. Setiap serah-terima diisi lewat `templates/handoff.md`.

## Struktur

```
.harness/
├── README.md          # file ini
├── orchestrator.md     # state machine & aturan routing
├── personas/           # satu file per peran agent
├── workflows/          # definisi loop end-to-end
├── context/            # long-term memory & state (dibaca/ditulis tiap sesi)
└── templates/          # template handoff antar-agent
```

## Alur singkat

1. Agent masuk → baca `AGENTS.md` di root → diarahkan ke sini.
2. Baca `orchestrator.md` untuk memahami state machine.
3. Baca `context/state.md` untuk tahu posisi saat ini.
4. Jalankan sesuai `workflows/loop.md`.

Lihat `orchestrator.md` untuk detail lengkap.
