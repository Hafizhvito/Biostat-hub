/**
 * Skrip sekali jalan: menambahkan header dokumentasi ke file sumber
 * jika belum ada. Jalankan dari folder backend: node scripts/add-file-docs.js
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const headers = {
  'backend/src/server.js': `/**
 * Entry point backend Biostat Hub.
 * Menjalankan server Express di port dari env (default 3001).
 */\n\n`,
  'backend/src/app.js': `/**
 * Konfigurasi aplikasi Express: CORS, parser JSON, mount route /api, error handler.
 */\n\n`,
  'backend/src/config/env.js': `/**
 * Memuat variabel lingkungan (.env): PORT, JWT_SECRET, CORS_ORIGIN, dll.
 */\n\n`,
  'backend/src/lib/prisma.js': `/**
 * Singleton Prisma Client — satu pintu akses ke database SQLite.
 */\n\n`,
  'backend/src/middleware/auth.js': `/**
 * Middleware requireAdmin: validasi JWT Bearer pada route /api/admin/*.
 */\n\n`,
  'backend/src/middleware/errorHandler.js': `/**
 * Penanganan error terpusat. Semua error API dikembalikan sebagai JSON { error: "..." }.
 * Gunakan createError(status, message) untuk error yang disengaja.
 */\n\n`,
  'backend/src/routes/index.js': `/**
 * Router utama API. Mount route publik (/) dan admin (/admin).
 * Health check: GET /api/health
 */\n\n`,
  'backend/src/routes/public.js': `/**
 * Route API publik — tidak perlu login.
 * Materi, video, kuis (baca + submit jawaban).
 */\n\n`,
  'backend/src/routes/admin.js': `/**
 * Route API admin. POST /login terbuka; sisanya dilindungi requireAdmin (JWT).
 */\n\n`,
  'backend/src/services/quizGrading.js': `/**
 * Logika penilaian kuis: bandingkan jawaban user vs opsi benar di database.
 * Diuji di tests/quizGrading.test.js
 */\n\n`,
  'backend/src/utils/youtube.js': `/**
 * Ekstrak video ID dari URL YouTube (watch, youtu.be, embed).
 */\n\n`,
  'backend/src/controllers/public/settingsController.js': `/**
 * API publik: baca teks hero beranda (judul + deskripsi).
 */\n\n`,
  'backend/src/controllers/public/sectionController.js': `/**
 * API publik: daftar materi & detail materi beserta videonya.
 */\n\n`,
  'backend/src/controllers/public/videoController.js': `/**
 * API publik: detail satu video + info materi induk + flag ada/tidak kuis.
 */\n\n`,
  'backend/src/controllers/public/quizController.js': `/**
 * API publik: ambil soal kuis (tanpa jawaban benar) & submit jawaban untuk grading.
 */\n\n`,
  'backend/src/controllers/admin/authController.js': `/**
 * Login admin: verifikasi username/password, kembalikan JWT.
 */\n\n`,
  'backend/src/controllers/admin/settingsController.js': `/**
 * Admin: baca & ubah pengaturan beranda (hero title/description).
 */\n\n`,
  'backend/src/controllers/admin/sectionController.js': `/**
 * Admin CRUD materi (section) + urutan naik/turun.
 * Hapus ditolak jika materi masih berisi video.
 */\n\n`,
  'backend/src/controllers/admin/videoController.js': `/**
 * Admin CRUD video YouTube per materi + urutan naik/turun dalam materi.
 */\n\n`,
  'backend/src/controllers/admin/quizController.js': `/**
 * Admin: kelola kuis per video (simpan/hapus seluruh soal sekaligus).
 * Termasuk image_url opsional per soal (link gambar eksternal).
 */\n\n`,
  'backend/src/validators/section.js': `/** Validasi Zod untuk create/update materi. */\n\n`,
  'backend/src/validators/video.js': `/** Validasi Zod untuk create/update video (+ URL YouTube valid). */\n\n`,
  'backend/src/validators/quiz.js': `/** Validasi Zod untuk simpan kuis (soal, opsi, tepat 1 jawaban benar). */\n\n`,
  'backend/src/validators/settings.js': `/** Validasi Zod untuk pengaturan beranda. */\n\n`,
  'backend/prisma/schema.prisma': `// Skema database Biostat Hub — lihat docs/PANDUAN-DEVELOPER.md\n\n`,
  'backend/prisma/seed.js': `/**
 * Seed awal: 1 akun admin + pengaturan beranda.
 * Tidak mengisi materi/video (diisi klien lewat admin).
 */\n\n`,
  'frontend/src/lib/api.ts': `/**
 * Klien HTTP ke backend. api() untuk publik, apiWithAuth() untuk route admin (JWT).
 */\n\n`,
  'frontend/src/lib/auth.ts': `/**
 * Simpan/baca/hapus token JWT admin di localStorage (key: biostat_admin_token).
 */\n\n`,
  'frontend/src/lib/youtube.ts': `/**
 * Ekstrak ID video YouTube — dipakai untuk embed player & thumbnail.
 */\n\n`,
  'frontend/src/lib/image.ts': `/**
 * Konversi link share Google Drive ke URL yang bisa dipakai tag <img>.
 * Lihat juga QuizQuestionImage untuk lightbox zoom.
 */\n\n`,
  'frontend/src/app/layout.tsx': `/** Layout global: header + footer untuk seluruh halaman publik. */\n\n`,
  'frontend/src/app/page.tsx': `/** Beranda: hero (dari API settings) + grid materi. Empty state jika belum ada materi. */\n\n`,
  'frontend/src/app/section/[id]/page.tsx': `/** Halaman daftar video dalam satu materi. */\n\n`,
  'frontend/src/app/video/[id]/page.tsx': `/** Halaman putar video YouTube + tombol ke kuis (jika ada). */\n\n`,
  'frontend/src/app/quiz/[videoId]/page.tsx': `/** Halaman kuis: form jawaban → submit → tampilkan skor. */\n\n`,
  'frontend/src/app/not-found.tsx': `/** Halaman 404 kustom. */\n\n`,
  'frontend/src/app/admin/layout.tsx': `/**
 * Layout route /admin/*: halaman login bebas; route lain wajib token JWT.
 */\n\n`,
  'frontend/src/app/admin/login/page.tsx': `/** Form login admin → simpan JWT → redirect ke Kelola Materi. */\n\n`,
  'frontend/src/app/admin/sections/page.tsx': `/** Admin: CRUD materi + urutan ↑↓ + link preview ke website. */\n\n`,
  'frontend/src/app/admin/videos/page.tsx': `/** Admin: CRUD video + filter per materi + urutan ↑↓. */\n\n`,
  'frontend/src/app/admin/quizzes/page.tsx': `/** Admin: editor kuis per video (soal, gambar opsional, 4 pilihan). */\n\n`,
  'frontend/src/app/admin/settings/page.tsx': `/** Admin: ubah judul & deskripsi hero beranda. */\n\n`,
  'frontend/src/components/layout/SiteHeader.tsx': `/** Header navigasi situs publik. */\n\n`,
  'frontend/src/components/layout/SiteFooter.tsx': `/** Footer situs publik. */\n\n`,
  'frontend/src/components/layout/AdminLayout.tsx': `/** Sidebar/menu admin: Materi, Video, Kuis, Pengaturan. */\n\n`,
  'frontend/src/components/home/HeroSection.tsx': `/** Blok hero beranda: judul, deskripsi, statistik jumlah materi/video. */\n\n`,
  'frontend/src/components/home/SectionGrid.tsx': `/** Grid kartu materi di beranda — klik menuju /section/[id]. */\n\n`,
  'frontend/src/components/section/VideoGrid.tsx': `/** Grid kartu video + thumbnail YouTube. */\n\n`,
  'frontend/src/components/video/YouTubePlayer.tsx': `/** Embed iframe YouTube responsif 16:9. */\n\n`,
  'frontend/src/components/quiz/QuizForm.tsx': `/** Form kuis: semua soal + radio button, submit sekali. */\n\n`,
  'frontend/src/components/quiz/QuizResult.tsx': `/** Tampilan hasil kuis setelah submit (skor + koreksi per soal). */\n\n`,
  'frontend/src/components/quiz/QuizQuestionImage.tsx': `/**
 * Gambar soal kuis: preview + klik buka lightbox dengan zoom in/out.
 * Mencoba beberapa format URL Google Drive; fallback link tab baru.
 */\n\n`,
  'frontend/src/components/admin/ReorderButtons.tsx': `/** Tombol ↑ ↓ untuk ubah urutan materi atau video di admin. */\n\n`,
  'frontend/src/components/ui/Button.tsx': `/** Tombol reusable (primary / secondary / danger). */\n\n`,
  'frontend/src/components/ui/Card.tsx': `/** Kartu konten dengan border halus. */\n\n`,
  'frontend/src/components/ui/Input.tsx': `/** Input teks + label + pesan error. */\n\n`,
  'frontend/src/components/ui/Textarea.tsx': `/** Textarea + label + pesan error. */\n\n`,
  'frontend/src/components/ui/Select.tsx': `/** Dropdown select + label. */\n\n`,
  'frontend/src/components/ui/EmptyState.tsx': `/** Pesan saat daftar kosong (materi, video, dll.). */\n\n`,
  'frontend/src/components/ui/ConfirmDialog.tsx': `/** Modal konfirmasi hapus (Bahasa Indonesia). */\n\n`,
};

for (const [relPath, header] of Object.entries(headers)) {
  const fullPath = join(root, relPath);
  if (!existsSync(fullPath)) {
    console.warn('SKIP (tidak ada):', relPath);
    continue;
  }
  const content = readFileSync(fullPath, 'utf8');
  if (content.startsWith('/**') || content.startsWith('// Skema')) {
    console.log('SKIP (sudah ada):', relPath);
    continue;
  }
  // Pertahankan "use client" di baris pertama jika ada
  if (content.startsWith('"use client"')) {
    writeFileSync(fullPath, `"use client";\n\n${header}${content.slice('"use client";'.length).trimStart()}`);
  } else {
    writeFileSync(fullPath, header + content);
  }
  console.log('OK:', relPath);
}

console.log('Selesai.');
