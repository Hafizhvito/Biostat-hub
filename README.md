# Riset Hub

Platform pembelajaran mandiri Biostatistik dan SPSS. Materi, video, kuis, glosarium, kalkulator, wizard uji, dan file unduhan dikelola melalui panel admin.

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Prisma, Zod, JWT
- Database: MySQL 8
- Penyimpanan file: filesystem melalui `UPLOAD_DIR`

## Struktur proyek

```text
Riset-Hub/
├── backend/    # REST API, Prisma, migration, upload
├── frontend/   # aplikasi publik dan panel admin
└── docs/       # panduan developer dan kebutuhan klien
```

## Prasyarat lokal

- Node.js 20.9 atau lebih baru
- npm
- MySQL 8 (development menggunakan MySQL dari Laragon)

## Setup lokal

1. Nyalakan MySQL Laragon dan buat database `biostat_hub`.
2. Siapkan backend:

```bash
cd backend
npm install
copy .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

3. Pada terminal lain, siapkan frontend:

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Frontend berjalan di `http://localhost:3000` dan API di `http://localhost:3001/api`.

## Environment

Backend (`backend/.env`):

```env
NODE_ENV="development"
DATABASE_URL="mysql://root@localhost:3306/biostat_hub"
JWT_SECRET="gunakan-string-random-yang-kuat"
JWT_EXPIRES_IN="7d"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="gunakan-password-yang-kuat"
CORS_ORIGIN="http://localhost:3000"
PORT=3001
UPLOAD_DIR="./uploads"
```

Frontend (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

File environment, database lokal, build output, dan hasil upload tidak boleh masuk Git.

## Pemeriksaan sebelum commit

```bash
cd backend
npm test
npx prisma validate

cd ../frontend
npm run lint
npm run build
```

## Production

Target deployment adalah DomaiNesia Nimbus Plus:

- Domain utama menjalankan frontend Next.js.
- Subdomain `api` menjalankan backend Express melalui Node.js App/Passenger.
- Database dibuat melalui MySQL Database Wizard cPanel.
- Gunakan `NODE_ENV="production"` dan secret production.
- Terapkan schema dengan `npx prisma migrate deploy`; jangan gunakan `migrate dev` atau `migrate reset` di production.
- Gunakan path `UPLOAD_DIR` yang persisten dan sertakan folder tersebut dalam backup.

## Dokumentasi

- [Panduan Developer](docs/PANDUAN-DEVELOPER.md)
- [Daftar Pertanyaan Klien](docs/DAFTAR-PERTANYAAN-KLIEN.md)
