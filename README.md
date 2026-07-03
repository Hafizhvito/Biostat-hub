# Biostat Hub

Platform pembelajaran biostatistik & SPSS (video + kuis). Monorepo:
- `backend/` — Node.js + Express API (port `3001`)
- `frontend/` — Next.js (port `3000`)

**Dokumentasi untuk developer:** lihat [docs/PANDUAN-DEVELOPER.md](docs/PANDUAN-DEVELOPER.md) — arsitektur, struktur folder, API, dan penjelasan tiap file.

**Pertanyaan untuk klien (pengisian konten & launch):** [docs/DAFTAR-PERTANYAAN-KLIEN.md](docs/DAFTAR-PERTANYAAN-KLIEN.md)

**Estimasi biaya hosting (untuk klien):** [docs/ESTIMASI-BIAYA-HOSTING.md](docs/ESTIMASI-BIAYA-HOSTING.md)

## Prerequisites

- Node.js 20+ and npm

## Backend Setup (`backend`, port 3001)

```bash
cd backend
npm install
# macOS/Linux
cp .env.example .env
# Windows PowerShell
copy .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Backend runs at [http://localhost:3001](http://localhost:3001).

## Frontend Setup (`frontend`, port 3000)

```bash
cd frontend
npm install
# macOS/Linux
cp .env.local.example .env.local
# Windows PowerShell
copy .env.local.example .env.local
npm run dev
```

Frontend runs at [http://localhost:3000](http://localhost:3000).

## Default Admin Credentials

Default admin values come from your backend `.env`:
- Username: `ADMIN_USERNAME` (in `.env.example`, default is `admin`)
- Password: `ADMIN_PASSWORD` (set your own secure value in `.env`)

## Deployment Notes

- **Panduan lengkap VPS (step-by-step):** [docs/PANDUAN-DEPLOY-VPS.md](docs/PANDUAN-DEPLOY-VPS.md)
- Frontend: deploy to Vercel or Netlify
- Backend: deploy to a VPS (or any Node-capable server) and configure environment variables + database access

## Notes

- Do not commit `.env` or `.env.local` files.
