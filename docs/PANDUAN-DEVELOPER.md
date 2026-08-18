# Panduan Developer — Riset Hub

Platform pembelajaran riset/SPSS.  
Monorepo: **Next.js (frontend)** + **Express + Prisma + SQLite (backend)**.

## Arsitektur singkat

```
Browser
   │
   ├─► localhost:3000  →  frontend/   (halaman publik + admin)
   │
   └─► localhost:3001  →  backend/    (REST API /api/...)
                              │
                              └─► SQLite (prisma/dev.db)
```

- **Publik:** tanpa login — baca materi, video, kerjakan kuis.
- **Admin:** JWT di `localStorage` — CRUD materi, video, kuis, teks beranda.
- **Konten:** 100% dari database; ubah lewat admin tanpa deploy ulang (kecuali ubah kode).

## Menjalankan project

Lihat [README.md](../README.md). Ringkas:

```bash
# Terminal 1
cd backend && npm run dev    # :3001

# Terminal 2
cd frontend && npm run dev   # :3000
```

Login admin: kredensial di `backend/.env` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).

---

## Struktur folder

### `backend/`

| Path | Fungsi |
|------|--------|
| `src/server.js` | Entry point — bind port & jalankan app |
| `src/app.js` | Konfigurasi Express (CORS, JSON, routes, error handler) |
| `src/config/env.js` | Variabel lingkungan (port, JWT, CORS) |
| `src/lib/prisma.js` | Instance Prisma Client (akses database) |
| `src/routes/index.js` | Router utama `/api` |
| `src/routes/public.js` | Route API **tanpa auth** |
| `src/routes/admin.js` | Route API **admin** (login + JWT) |
| `src/middleware/auth.js` | `requireAdmin` — validasi Bearer token |
| `src/middleware/errorHandler.js` | Response error JSON + helper `createError` |
| `src/controllers/public/*` | Logic baca data untuk pengunjung |
| `src/controllers/admin/*` | Logic CRUD untuk panel admin |
| `src/validators/*` | Validasi input (Zod) sebelum simpan |
| `src/services/quizGrading.js` | Hitung skor kuis (unit tested) |
| `src/utils/youtube.js` | Ekstrak ID video dari URL YouTube |
| `prisma/schema.prisma` | Skema database |
| `prisma/seed.js` | Data awal: akun admin + pengaturan beranda |
| `scripts/reset-admin-password.js` | Reset password admin manual |

### `frontend/`

| Path | Fungsi |
|------|--------|
| `src/app/page.tsx` | Beranda — hero + grid materi |
| `src/app/section/[id]/page.tsx` | Daftar video per materi |
| `src/app/video/[id]/page.tsx` | Pemutar YouTube + link kuis |
| `src/app/quiz/[videoId]/page.tsx` | Halaman kuis + hasil |
| `src/app/admin/*` | Panel admin (login, CRUD, pengaturan) |
| `src/lib/api.ts` | Wrapper `fetch` ke backend |
| `src/lib/auth.ts` | Simpan/baca JWT admin di localStorage |
| `src/lib/youtube.ts` | Parser URL YouTube (frontend) |
| `src/lib/image.ts` | Konversi link Google Drive → URL gambar |
| `src/components/layout/*` | Header, footer, layout admin |
| `src/components/ui/*` | Komponen form & tampilan dasar |
| `src/components/home/*` | Hero & grid materi |
| `src/components/quiz/*` | Form kuis, hasil, gambar + lightbox zoom |
| `src/components/admin/*` | Tombol urutan ↑↓ |

---

## Model database (inti)

| Model | Keterangan |
|-------|------------|
| `Section` | Materi/topik (nama, deskripsi, urutan) |
| `Video` | Video YouTube per materi |
| `Quiz` | Satu kuis per video (opsional) |
| `QuizQuestion` | Soal (+ `imageUrl` opsional, link eksternal) |
| `QuizOption` | Pilihan jawaban + flag `isCorrect` |
| `SiteSettings` | Judul & deskripsi hero beranda (1 baris) |
| `AdminUser` | Satu akun admin |

**Aturan bisnis penting:**
- Hapus materi ditolak jika masih ada video di dalamnya.
- Hapus video ikut hapus kuis terkait.
- `is_correct` tidak dikirim ke klien sebelum submit kuis.

---

## API endpoints

### Publik (`/api/...`)

| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/settings` | Teks hero beranda |
| GET | `/sections` | Semua materi + statistik |
| GET | `/sections/:id` | Detail materi + video |
| GET | `/videos/:id` | Detail video |
| GET | `/videos/:id/quiz` | Soal kuis (tanpa jawaban benar) |
| POST | `/videos/:id/quiz/submit` | Kirim jawaban → skor |

### Admin (`/api/admin/...`, header `Authorization: Bearer <token>`)

| Method | Path | Fungsi |
|--------|------|--------|
| POST | `/login` | Dapatkan JWT |
| GET/PUT | `/settings` | Pengaturan beranda |
| CRUD | `/sections` | Kelola materi |
| PATCH | `/sections/:id/reorder` | Urutan materi ↑↓ |
| CRUD | `/videos` | Kelola video |
| PATCH | `/videos/:id/reorder` | Urutan video ↑↓ |
| GET/PUT/DELETE | `/videos/:videoId/quiz` | Kelola kuis |

---

## Alur halaman publik

```
/  →  /section/[id]  →  /video/[id]  →  /quiz/[videoId]
```

Empty state ditangani di setiap level (0 materi, 0 video, tidak ada kuis).

---

## Gambar di soal kuis

- Admin paste **link eksternal** (Google Drive, ImgBB direct link, dll.).
- `lib/image.ts` mencoba beberapa format URL Drive.
- `QuizQuestionImage` menampilkan gambar + lightbox zoom (klik untuk perbesar).
- **ImgBB direct link** paling andal; Drive kadang tidak bisa di-embed.

---

## Deploy (rencana)

| Bagian | Hosting |
|--------|---------|
| Frontend | Vercel / Netlify — set `NEXT_PUBLIC_API_URL` |
| Backend | VPS — set `CORS_ORIGIN` ke domain frontend |

---

## Spesifikasi & rencana

- Desain: `docs/superpowers/specs/2026-06-30-biostat-hub-design.md`
- Rencana implementasi: `docs/superpowers/plans/2026-06-30-biostat-hub.md`

## Backlog (belum dibuat)

- Search di beranda (opsional, saat konten > ~20 video)
