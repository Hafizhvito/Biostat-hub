# Panduan Domain, VPS & Onboarding Klien — Biostat Hub

Dokumen ini untuk **vendor/developer** yang menangani klien non-IT (mis. fakultas/kampus).

Isinya:
1. Referensi nama domain alternatif + tabel banding harga
2. Kenapa pakai VPS (bukan shared hosting)
3. Alur proyek setelah DP
4. Script Zoom & kalimat untuk klien
5. Cara mengajari klien beli domain + VPS
6. Data akses yang perlu dikirim ke vendor
7. Checklist serah terima

**Dokumen teknis deploy (setelah dapat akses VPS):** [PANDUAN-DEPLOY-VPS.md](PANDUAN-DEPLOY-VPS.md)  
**Estimasi biaya hosting:** [ESTIMASI-BIAYA-HOSTING.md](ESTIMASI-BIAYA-HOSTING.md)

---

## 1. Kenapa VPS, bukan shared hosting?

| | Shared hosting | VPS |
|---|---|---|
| Cocok untuk WordPress/PHP | Ya | Bisa, tapi overkill |
| Cocok untuk **Next.js + Express** (Biostat Hub) | **Tidak** / sangat terbatas | **Ya** |
| Bisa jalankan API + admin panel | Sulit | Ya |
| Akses SSH penuh | Jarang | Ya |
| Sesuai panduan deploy project ini | Tidak | Ya |

**Kalimat untuk klien:**

> Website ini bukan website biasa seperti WordPress. Ada dua bagian yang harus jalan terus di server: halaman website dan sistem admin/API. Karena itu kami rekomendasikan **VPS** — seperti “ruang server kecil khusus” untuk website ini. Shared hosting murah biasanya tidak mendukung teknologi yang kami pakai.

---

## 2. Referensi nama domain (alternatif “Biostat”)

Nama “biostat” sudah dipakai pihak lain. Pilih nama yang:
- jelas (mahasiswa langsung paham), atau
- unik (lebih gampang dapat domain kosong)

### 2.1 Kandidat nama — katalog

Centang / isi harga setelah cek di registrar (Niagahoster, DomaiNesia, Rumahweb, Cloudflare, dll.).

#### A. Deskriptif (paling jelas)

| No | Nama usulan | Contoh domain | Tersedia? | Harga th-1 | Harga renewal | Catatan |
|----|-------------|---------------|-----------|------------|---------------|---------|
| 1 | Statistik Penelitian | `statistikpenelitian.id` | ☐ | Rp | Rp | |
| 2 | Belajar Biostatistik | `belajar-biostatistik.id` | ☐ | Rp | Rp | |
| 3 | Portal Biostatistik | `portal-biostatistik.id` | ☐ | Rp | Rp | |
| 4 | Olah Data Penelitian | `olah-data-penelitian.id` | ☐ | Rp | Rp | |
| 5 | Statistik Kesehatan | `statistik-kesehatan.id` | ☐ | Rp | Rp | |

#### B. Institusional (nuansa resmi kampus)

| No | Nama usulan | Contoh domain | Tersedia? | Harga th-1 | Harga renewal | Catatan |
|----|-------------|---------------|-----------|------------|---------------|---------|
| 6 | Biostat FK YARSI | `biostat-fkyarsi.ac.id` | ☐ | Rp | Rp | Butuh dokumen institusi |
| 7 | Statistik FK YARSI | `statistik-fkyarsi.ac.id` | ☐ | Rp | Rp | Butuh dokumen institusi |
| 8 | Subdomain kampus | `biostat.yarsi.ac.id` | ☐ | Gratis? | — | Tanya IT kampus dulu |

#### C. Edukasi / portal

| No | Nama usulan | Contoh domain | Tersedia? | Harga th-1 | Harga renewal | Catatan |
|----|-------------|---------------|-----------|------------|---------------|---------|
| 9 | Stat Belajar | `statbelajar.id` | ☐ | Rp | Rp | Singkat |
| 10 | Ruang Statistik | `ruangstatistik.id` | ☐ | Rp | Rp | |
| 11 | SPSS Belajar | `spssbelajar.id` | ☐ | Rp | Rp | Fokus SPSS |
| 12 | Statistik Dokter | `statistikdokter.id` | ☐ | Rp | Rp | |

#### D. Branded (unik, peluang kosong lebih besar)

| No | Nama usulan | Contoh domain | Tersedia? | Harga th-1 | Harga renewal | Catatan |
|----|-------------|---------------|-----------|------------|---------------|---------|
| 13 | Biostatika | `biostatika.id` | ☐ | Rp | Rp | Varian ejaan |
| 14 | Stativa | `stativa.id` | ☐ | Rp | Rp | Perlu tagline di homepage |
| 15 | Medat Academy | `medatacademy.com` | ☐ | Rp | Rp | Bahasa campuran |
| 16 | Stat FK | `statfk.id` | ☐ | Rp | Rp | Sangat singkat |

### 2.2 Ekstensi domain — kisaran harga

| Ekstensi | Kisaran / tahun | Keterangan |
|----------|-----------------|------------|
| `.com` | Rp 150.000 – 250.000 | Paling umum |
| `.id` | Rp 200.000 – 350.000 | Identitas Indonesia |
| `.co.id` | Rp 250.000 – 400.000 | Alternatif `.id` |
| `.ac.id` | Rp 100.000 – 500.000+ | Institusi pendidikan; perlu verifikasi |
| Subdomain kampus | Gratis (jika ada) | Tanya IT YARSI |

> **Penting:** Cek **harga renewal** (tahun ke-2), bukan hanya promo tahun pertama.

### 2.3 Rekomendasi shortlist (mulai cek dari sini)

1. `statistikpenelitian.id`
2. `belajar-biostatistik.id`
3. `biostat-fkyarsi.ac.id` (jika institusi mau resmi)
4. `ruangstatistik.id`
5. `spssbelajar.id`

**Keputusan akhir (isi setelah meeting klien):**

| Item | Pilihan |
|------|---------|
| Nama brand di website | |
| Domain yang dibeli | |
| Registrar (tempat beli) | |
| Total biaya domain / tahun | Rp |

---

## 3. Estimasi VPS — tabel banding

Spesifikasi minimal yang cukup untuk Biostat Hub: **1 GB RAM, 1 vCPU, 20+ GB SSD, Ubuntu 22.04/24.04**.

| No | Provider | Paket | RAM | Harga / bulan | Harga / tahun | Dipilih? |
|----|----------|-------|-----|---------------|---------------|----------|
| 1 | Niagahoster | VPS | 1 GB | Rp | Rp | ☐ |
| 2 | Dewaweb | VPS | 1 GB | Rp | Rp | ☐ |
| 3 | DomaiNesia | VPS | 1 GB | Rp | Rp | ☐ |
| 4 | Hetzner | CX22 / setara | 2 GB | € | Rp | ☐ |
| 5 | DigitalOcean | Basic | 1 GB | $ | Rp | ☐ |
| 6 | Vultr | Cloud Compute | 1 GB | $ | Rp | ☐ |

**Total estimasi tahun pertama (domain + VPS):**

| Komponen | Biaya |
|----------|-------|
| Domain | Rp |
| VPS | Rp |
| SSL (HTTPS) | Rp 0 (gratis) |
| **Total** | **Rp** |

Lihat juga: [ESTIMASI-BIAYA-HOSTING.md](ESTIMASI-BIAYA-HOSTING.md)

---

## 4. Alur proyek setelah DP (gambaran untuk klien)

```
DP masuk
   ↓
Kick-off (Zoom) — kenalan scope & jadwal
   ↓
Development + demo versi uji (belum publik)
   ↓
Revisi sampai klien setuju
   ↓
Zoom panduan beli domain + VPS (klien beli atas nama institusi)
   ↓
Klien kirim akses sementara ke vendor
   ↓
Vendor setup & go-live
   ↓
Zoom training admin panel
   ↓
Serah terima resmi + pelunasan
   ↓
Klien kelola konten sendiri (materi, video, kuis)
```

**Timeline contoh (sesuaikan kontrak):**

| Minggu | Kegiatan | Yang aktif |
|--------|----------|------------|
| 0 | DP masuk, kick-off | Klien + Vendor |
| 1–3 | Development & demo | Vendor |
| 4 | Revisi | Klien + Vendor |
| 5 | Klien beli domain + VPS | Klien (dibimbing vendor) |
| 5–6 | Deploy go-live | Vendor |
| 6 | Training + serah terima + pelunasan | Klien + Vendor |

---

## 5. Script & kalimat untuk klien non-IT

### 5.1 Setelah DP diterima (WhatsApp / email)

```
Halo [Nama PIC],

Terima kasih, DP untuk proyek website pembelajaran biostatistik sudah kami terima.
Proyek resmi kami mulai hari ini.

Alur selanjutnya:
1. Kick-off singkat via Zoom (scope & jadwal)
2. Pengerjaan website + demo versi uji
3. Revisi sampai disetujui
4. Sesi panduan pembelian domain & VPS (atas nama institusi)
5. Go-live website
6. Training penggunaan panel admin
7. Serah terima resmi
8. Pelunasan setelah serah terima selesai

Mohon bantu siapkan:
- Nama PIC (penanggung jawab)
- Kontak email/WA PIC
- 3–5 opsi nama domain (kami kirimkan daftar usulan)

Estimasi go-live: [X minggu] sejak hari ini.

Terima kasih,
[Nama Vendor]
```

---

### 5.2 Undangan Zoom kick-off

```
Halo [Nama PIC],

Kami jadwalkan Zoom kick-off proyek:

📅 Tanggal: [....]
🕐 Waktu: [....]
🔗 Link: [....]

Agenda (±45 menit):
1. Konfirmasi fitur yang akan diserahkan
2. Timeline & tahap revisi
3. Siapa yang mengisi konten (materi, video, kuis)
4. Persiapan domain & hosting menjelang go-live
5. Tanya jawab

Mohon hadir PIC yang bisa mengambil keputusan (nama website, domain, dll.).

Terima kasih.
```

---

### 5.3 Menjelaskan domain & VPS (analogi sederhana)

**Domain:**
> Domain itu alamat website di internet. Misalnya seperti nama jalan untuk gedung kampus — orang ketik alamat itu di browser, mereka sampai ke website kita.

**VPS:**
> VPS itu “komputer kecil di internet” yang nyala 24 jam untuk menjalankan website. Isinya program website, panel admin, dan database materi/kuis.

**Kenapa tidak shared hosting murah:**
> Shared hosting biasanya untuk website sederhana (WordPress). Website ini punya sistem khusus (halaman + panel admin + API) yang butuh VPS.

**Akses sementara:**
> Setelah Bapak/Ibu beli VPS, kami perlu pinjam akses login **sementara** untuk pasang website — seperti pinjam kunci rumah saat renovasi. Setelah selesai, kunci kembali ke institusi dan kami sarankan ganti password.

---

### 5.4 Undangan Zoom — panduan beli domain & VPS

```
Halo [Nama PIC],

Website sudah mendekati tahap go-live. Kami perlu sesi Zoom singkat untuk memandu pembelian:

1. Domain (alamat website)
2. VPS (server)

📅 Tanggal: [....]
🕐 Waktu: [....] (estimasi 45–60 menit)
🔗 Link: [....]

Yang perlu disiapkan sebelum Zoom:
- Kartu/debit untuk pembayaran (atas nama institusi)
- Email institusi untuk registrasi akun
- 1–2 opsi nama domain (dari daftar yang sudah kami kirim)
- Tentukan password admin website (minimal 12 karakter, huruf+angka+simbol)

Catatan: Domain dan VPS sebaiknya dibeli atas nama [Nama Institusi], bukan atas nama vendor.

Terima kasih.
```

---

### 5.5 Minta akses setelah klien beli VPS

```
Halo [Nama PIC],

Terima kasih, domain dan VPS sudah aktif. Untuk lanjut instalasi website,
mohon kirim data berikut (via [email resmi / channel aman]):

DOMAIN
- Nama domain: ...........................

VPS (server)
- IP server: ...........................
- Username login: ...........................
- Password login: ...........................
- Panel VPS (jika ada): ...........................

ADMIN WEBSITE (akan kami buatkan)
- Username admin: ...........................
- Password admin: ...........................

Estimasi instalasi: [2–5 hari kerja] setelah data lengkap.

Catatan keamanan:
- Akses ini bersifat sementara untuk setup
- Setelah go-live, disarankan ganti password VPS & admin
- Akses vendor akan dicabut setelah serah terima (kecuali ada paket maintenance)

Terima kasih.
```

---

### 5.6 Setelah go-live & serah terima

```
Halo [Nama PIC],

Website sudah aktif dan siap digunakan.

🌐 Website: https://[domain]
🔐 Admin panel: https://[domain]/admin/login
👤 Username: [username]
🔑 Password: [dikirim terpisah / diberikan saat handover]

Langkah disarankan hari ini:
1. Login ke admin panel
2. Coba tambah/edit satu materi
3. Ganti password admin ke password baru milik institusi
4. Simpan kredensial di tempat aman (hanya PIC terkait)

Mulai sekarang, pengelolaan konten (materi, video, kuis, teks beranda)
bisa dilakukan langsung oleh tim klien tanpa bantuan developer.

Terima kasih atas kerja samanya.
```

---

## 6. Panduan mengajari klien beli domain (langkah Zoom)

> **Peran vendor:** pantau layar klien (screen share), jangan yang klik bayar atas nama sendiri kecuali disepakati.

### Checklist sebelum Zoom

- [ ] Sudah ada shortlist 3–5 nama domain
- [ ] Sudah pilih 1 registrar (mis. Niagahoster / DomaiNesia)
- [ ] Klien punya email institusi & metode bayar
- [ ] Tentukan ekstensi: `.id`, `.com`, atau `.ac.id`

### Langkah saat Zoom

| Step | Apa yang dikatakan ke klien | Apa yang dilakukan klien |
|------|----------------------------|--------------------------|
| 1 | “Kita cek dulu nama domain yang masih kosong.” | Buka situs registrar, cek ketersediaan |
| 2 | “Pilih yang paling mudah diingat dan masuk budget.” | Pilih domain + add to cart |
| 3 | “Daftar pakai email institusi, bukan email pribadi saya.” | Registrasi akun |
| 4 | “Isi data pemilik atas nama fakultas/universitas.” | Checkout & bayar |
| 5 | “Simpan username & password akun registrar ini.” | Catat login registrar |

**Kalimat penting:**

> Email dan akun registrar ini milik institusi. Jangan pakai email vendor, supaya tahun depan perpanjangan domain tetap di tangan kampus.

### Catatan `.ac.id`

- Perlu dokumen institusi pendidikan
- Proses verifikasi bisa beberapa hari
- Kalau urgent, sementara bisa pakai `.id` / `.com` dulu

### Catatan subdomain kampus (`biostat.yarsi.ac.id`)

Tanya IT kampus dulu:

> Apakah IT kampus bisa sediakan subdomain tanpa beli domain baru? Kalau bisa, ini opsi paling hemat.

---

## 7. Panduan mengajari klien beli VPS (langkah Zoom)

### Spesifikasi yang disarankan ke klien

| Item | Minimal |
|------|---------|
| RAM | 1 GB (2 GB lebih nyaman) |
| CPU | 1 vCPU |
| Storage | 20 GB SSD |
| OS | Ubuntu 22.04 atau 24.04 |
| Lokasi server | Singapore / Jakarta (latency lebih baik) |

### Langkah saat Zoom

| Step | Apa yang dikatakan ke klien | Apa yang dilakukan klien |
|------|----------------------------|--------------------------|
| 1 | “Pilih VPS, bukan shared hosting.” | Buka halaman VPS provider |
| 2 | “Paket 1 GB RAM sudah cukup untuk awal.” | Pilih paket |
| 3 | “OS pilih Ubuntu 22.04 atau 24.04.” | Pilih OS |
| 4 | “Catat IP server yang muncul setelah VPS aktif.” | Copy IP |
| 5 | “Catat username & password SSH/root.” | Simpan kredensial |
| 6 | “Kirimkan data ini ke kami untuk instalasi.” | Kirim ke vendor |

**Kalimat penting:**

> VPS ini seperti sewa komputer kecil di internet. Website akan kami pasang di komputer ini. Tagihan VPS perpanjangan setiap tahun menjadi tanggung jawab institusi.

---

## 8. Setelah klien kasih akses — apa yang vendor lakukan?

Ikuti panduan teknis: **[PANDUAN-DEPLOY-VPS.md](PANDUAN-DEPLOY-VPS.md)**

Ringkasan singkat (untuk vendor, bukan untuk klien):

1. SSH ke VPS
2. Install Node.js, Nginx, PM2, Certbot
3. Clone/upload project
4. Isi `backend/.env` (JWT_SECRET, ADMIN_PASSWORD, CORS_ORIGIN)
5. `npm run db:migrate` + `npm run db:seed`
6. Build frontend, jalankan PM2
7. Setting Nginx + HTTPS
8. Tes beranda, materi, kuis, login admin

**Estimasi waktu:** 2–5 hari kerja (tergantung DNS & ketersediaan klien).

---

## 9. Zoom training admin (±30–60 menit)

### Agenda

1. Login ke `/admin/login`
2. Kelola Materi — tambah, edit, urutkan
3. Kelola Video — tambah link YouTube, deskripsi
4. Kelola Kuis — buat judul kuis, soal, jawaban
5. Pengaturan Beranda — teks hero
6. Tanya jawab

### Kalimat pembuka training

> Hari ini kami ajarkan cara mengelola konten website tanpa coding. Setelah sesi ini, tim kampus bisa menambah materi, video, dan kuis sendiri lewat panel admin.

### Yang perlu ditekankan ke klien

| Bisa sendiri (tanpa developer) | Butuh bantuan teknis |
|-------------------------------|---------------------|
| Tambah/edit materi | Website tidak bisa dibuka sama sekali |
| Tambah/edit video | Error server setelah update besar |
| Buat/edit kuis | Pindah ke server baru |
| Ubah teks beranda | Lupa password admin → reset via server |
| | Backup & restore database |

---

## 10. Checklist serah terima (BAST)

**Tanggal:** _______________  
**Klien:** _______________  
**Vendor:** _______________

### A. Yang diserahkan ke klien

| No | Item | Nilai | ✓ |
|----|------|-------|---|
| 1 | URL website publik | | ☐ |
| 2 | URL admin (`/admin/login`) | | ☐ |
| 3 | Username admin | | ☐ |
| 4 | Password admin | | ☐ |
| 5 | Akun registrar domain | | ☐ |
| 6 | Akun VPS | | ☐ |
| 7 | Panduan singkat admin | | ☐ |

### B. Yang disarankan setelah serah terima

- [ ] Klien ganti password admin website
- [ ] Klien ganti password VPS
- [ ] Akses sementara vendor dihapus dari server
- [ ] Klien tunjuk PIC konten + PIC IT
- [ ] Pelunasan project dibayar

### C. Kepemilikan

| Aset | Pemilik |
|------|---------|
| Domain | Institusi klien |
| VPS | Institusi klien |
| Akun admin website | Institusi klien |
| Database (materi, kuis) | Institusi klien |
| Source code | Sesuai kontrak (biasanya klien setelah pelunasan) |

**Tanda tangan**

Klien: _______________________  
Vendor: _______________________

---

## 11. FAQ untuk klien (copy-paste)

**Q: Apakah kami harus kasih password hosting ke vendor?**  
A: Untuk setup awal, ya — sementara. Setelah website aktif, password diganti dan akses vendor dicabut.

**Q: Apakah vendor pegang akun kami selamanya?**  
A: Tidak. Setelah serah terima, semua akun milik institusi.

**Q: Siapa yang update materi dan kuis?**  
A: Tim klien lewat panel admin. Tidak perlu coding.

**Q: Apakah setiap update konten perlu bayar deploy lagi?**  
A: Tidak. Perubahan lewat admin langsung tampil.

**Q: Shared hosting boleh?**  
A: Tidak disarankan untuk website ini. Pakai VPS.

**Q: Kalau lupa password admin?**  
A: PIC IT bisa reset lewat server (ada panduan teknis), atau hubungi vendor jika masih ada paket maintenance.

**Q: Berapa budget tahunan?**  
A: Perkiraan Rp 1–2 juta/tahun (domain + VPS). Detail: [ESTIMASI-BIAYA-HOSTING.md](ESTIMASI-BIAYA-HOSTING.md)

---

## 12. Dokumen terkait

| Dokumen | Untuk siapa |
|---------|-------------|
| [PANDUAN-DEPLOY-VPS.md](PANDUAN-DEPLOY-VPS.md) | Vendor / IT — setup teknis |
| [ESTIMASI-BIAYA-HOSTING.md](ESTIMASI-BIAYA-HOSTING.md) | Klien — budgeting |
| [DAFTAR-PERTANYAAN-KLIEN.md](DAFTAR-PERTANYAAN-KLIEN.md) | Klien — kebutuhan konten |
| [PANDUAN-DEVELOPER.md](PANDUAN-DEVELOPER.md) | Developer — arsitektur project |

---

*Dokumen ini disusun untuk onboarding klien non-IT Biostat Hub. Perbarui harga domain/VPS di tabel setelah cek registrar terbaru.*
