# Panduan Developer — Riset Hub

Riset Hub adalah monorepo dengan frontend Next.js dan REST API Express. Data aplikasi disimpan di MySQL melalui Prisma, sedangkan file upload disimpan pada filesystem yang ditentukan oleh `UPLOAD_DIR`.

## Arsitektur

```text
Browser
├── frontend Next.js (:3000)
└── backend Express (:3001/api)
    ├── Prisma → MySQL
    └── UPLOAD_DIR → file unduhan dan gambar wizard
```

- Route publik dapat dibaca tanpa login.
- Route `/api/admin/*`, selain login, dilindungi JWT.
- Konten dikelola melalui panel admin tanpa deploy ulang.
- File unduhan hanya dikirim melalui endpoint download agar counter tercatat.
- Gambar wizard disajikan dari `/uploads/wizard`.

## Menjalankan project

Nyalakan MySQL Laragon terlebih dahulu, kemudian:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Konfigurasi lokal berada di `backend/.env` dan `frontend/.env.local`. Kedua file tersebut tidak boleh masuk Git.

## Struktur backend

- `src/server.js`: entry point server.
- `src/app.js`: middleware Express, rate limiter, static wizard, dan routes.
- `src/config/env.js`: environment serta validasi production.
- `src/lib/prisma.js`: singleton Prisma Client.
- `src/routes/public.js`: endpoint publik.
- `src/routes/admin.js`: login dan endpoint admin.
- `src/controllers/`: logika request publik/admin.
- `src/validators/`: validasi payload dengan Zod.
- `src/utils/upload.js`: lokasi, validasi, penamaan, dan penghapusan upload.
- `prisma/schema.prisma`: schema MySQL.
- `prisma/migrations/`: histori migration MySQL aktif.
- `prisma/seed.js`: akun admin dan pengaturan awal.

## Struktur frontend

- `src/app/`: halaman publik dan admin.
- `src/components/`: layout, editor, fitur, dan komponen UI.
- `src/lib/api.ts`: URL API serta wrapper `fetch`.
- `src/lib/auth.ts`: pengelolaan token admin di browser.
- `next.config.ts`: rewrite upload wizard dan security headers.

## Model utama

- `Section` dan `Video`: materi serta video YouTube.
- `Quiz`, `QuizQuestion`, dan `QuizOption`: kuis pilihan ganda.
- `AdminUser`: akun administrator.
- `SiteSettings`: teks beranda dan URL kalkulator.
- `Glossary`: istilah dan definisi.
- `Download`: metadata file unduhan dan counter.
- `WizardImage`: metadata gambar wizard.
- `CalculatorLink`: daftar kalkulator eksternal.

## Perintah database

Development, ketika schema berubah:

```bash
npx prisma migrate dev --name nama_perubahan
```

Production:

```bash
npx prisma migrate deploy
npx prisma generate
```

Jangan menjalankan `migrate reset` pada database production.

## Upload

Format unduhan yang didukung: PDF, Word, PowerPoint, Excel, CSV, TXT, JPG/JPEG, PNG, WebP, GIF, dan ZIP. Batas aplikasi adalah 100 MB; batas cPanel/web server dapat lebih kecil.

Pada production, gunakan path absolut di luar folder source bila memungkinkan:

```env
UPLOAD_DIR="/home/username/biostat-storage"
```

Folder upload harus writable, persisten setelah redeploy, dan masuk backup.

## Pemeriksaan

```bash
cd backend
npm test
npx prisma validate

cd ../frontend
npm run lint
npm run build
```

Health check backend tersedia di `/api/health`.

## Deployment Nimbus Plus

- Gunakan Node.js 20.9 atau lebih baru.
- Jalankan frontend dan backend sebagai aplikasi Node.js terpisah.
- Gunakan domain utama untuk frontend dan subdomain `api` untuk backend.
- Buat database/user MySQL melalui cPanel dan berikan privilege yang diperlukan.
- Simpan environment production hanya di cPanel atau file rahasia server.
- Jalankan `prisma migrate deploy`, seed satu kali, lalu uji login, CRUD, upload, download, restart, dan persistence.
- Aktifkan HTTPS, backup MySQL, dan backup `UPLOAD_DIR` sebelum go-live.
