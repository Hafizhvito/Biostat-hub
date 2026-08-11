# Biostat Hub

Platform pembelajaran mandiri **Biostatistik & SPSS** — materi video, kuis interaktif, dan alat bantu statistik. Konten dikelola sepenuhnya lewat panel admin tanpa perlu deploy ulang.

## Fitur

| Area | Keterangan |
|------|------------|
| **Materi** | Topik video YouTube dengan filter level (dasar / menengah / lanjut) |
| **Kuis** | Soal pilihan ganda per video, dengan dukungan gambar |
| **Glosarium** | Kamus istilah biostatistik yang bisa dicari |
| **Unduhan** | File pendukung (PDF, template, panduan) |
| **Kalkulator** | Beberapa link kalkulator eksternal (atur dari admin) |
| **Wizard Uji** | Flowchart pemilihan uji statistik + zoom |
| **Tabel Ringkasan Uji** | Ringkasan uji statistik beserta gambar & pembahasan |
| **Admin** | CRUD konten, pengaturan beranda, upload file & gambar |

## Struktur Project

```
Biostat-Hub/
├── backend/    # Node.js + Express API  →  http://localhost:3001
├── frontend/   # Next.js               →  http://localhost:3000
└── docs/       # Panduan developer & deploy
```

## Prasyarat

- Node.js 20+
- npm

## Menjalankan di Lokal

Buka **dua terminal** — backend dulu, lalu frontend.

### 1. Backend (`backend/`)

```bash
cd backend
npm install
cp .env.example .env          # Windows: copy .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Backend berjalan di [http://localhost:3001](http://localhost:3001).

### 2. Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di [http://localhost:3000](http://localhost:3000).

> Frontend otomatis terhubung ke `http://localhost:3001/api`. Untuk environment lain, buat `.env.local` dengan `NEXT_PUBLIC_API_URL=<url-backend>/api`.

## Login Admin

Kredensial di `backend/.env`:

| Variabel | Keterangan |
|----------|------------|
| `ADMIN_USERNAME` | Username admin (default: `admin`) |
| `ADMIN_PASSWORD` | Password — **wajib diisi** sebelum `db:seed` |

Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Deploy

| Bagian | Rekomendasi |
|--------|-------------|
| Frontend | Vercel / Netlify — set `NEXT_PUBLIC_API_URL` |
| Backend | VPS / server Node.js — set `CORS_ORIGIN` ke domain frontend |

Panduan lengkap: [docs/PANDUAN-DEPLOY-VPS.md](docs/PANDUAN-DEPLOY-VPS.md)

## Dokumentasi

- [Panduan Developer](docs/PANDUAN-DEVELOPER.md) — arsitektur, struktur folder, API, dan penjelasan tiap file
- [Panduan Deploy VPS](docs/PANDUAN-DEPLOY-VPS.md) — step-by-step deployment
- [Domain & Onboarding](docs/PANDUAN-DOMAIN-VPS-ONBOARDING-KLIEN.md) — setup domain untuk klien non-IT

## Catatan

- Jangan commit file `.env` atau `.env.local`.
- Upload file disimpan di `backend/uploads/` (stat-tests, wizard, downloads).
