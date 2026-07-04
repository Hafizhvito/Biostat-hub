# Estimasi Biaya Hosting — Biostat Hub

Dokumen ini untuk **klien** yang ingin memahami perkiraan biaya menjalankan website Biostat Hub setelah development selesai.

Biostat Hub adalah platform pembelajaran mandiri (video + kuis). Setelah dibuat, website perlu **domain** (alamat internet) dan **server** agar bisa diakses publik 24 jam.

---

## Ringkasan singkat

| Paket | Perkiraan per tahun | Untuk siapa |
|-------|---------------------|-------------|
| **Minimum layak** | **Rp 750 ribu – 1,2 juta** | Traffic kecil, mahasiswa terbatas |
| **Rekomendasi umum** | **Rp 1,2 – 2,5 juta** | Penggunaan rutin fakultas/kampus |
| **Lebih aman & longgar** | **Rp 2,5 – 4 juta** | Traffic lebih besar, cadangan lebih baik |

> **Catatan:** Angka di atas adalah **estimasi pasar** (2026), bukan invoice resmi dari provider. Harga bisa berubah tergantung promo, provider, dan spesifikasi yang dipilih.

**Yang tidak perlu dibayar terpisah:**
- Sertifikat HTTPS (gembok hijau di browser) — **gratis** via Let's Encrypt
- Database SQLite — **termasuk** di server, tidak ada biaya database bulanan
- Perubahan konten (materi, video, kuis) lewat admin — **tidak** perlu bayar deploy ulang

---

## Apa saja yang dibayar?

### 1. Nama domain (per tahun)

Domain = alamat website, contoh: `biostat.yarsi.ac.id` atau `biostathub.com`.

| Jenis domain | Perkiraan / tahun | Keterangan |
|--------------|-------------------|------------|
| `.com` | Rp 150.000 – 250.000 | Paling umum, mudah diingat |
| `.id` | Rp 200.000 – 350.000 | Identitas Indonesia |
| `.ac.id` | Rp 250.000 – 500.000+ | Untuk institusi pendidikan; biasanya perlu dokumen kampus |
| Subdomain kampus | **Gratis** (jika disediakan IT) | Mis. `biostat.yarsi.ac.id` dari domain induk YARSI |

**Estimasi domain:** **Rp 150.000 – 500.000 / tahun**

---

### 2. Server / VPS (per tahun)

Website Biostat Hub membutuhkan server kecil yang menyimpan:
- Halaman website (frontend)
- API & panel admin (backend)
- Database materi, video, dan kuis

Untuk skala pembelajaran mandiri fakultas, **VPS 1 GB RAM** sudah cukup.

| Jenis layanan | Perkiraan / bulan | Perkiraan / tahun |
|---------------|-------------------|-------------------|
| VPS 1 GB (provider lokal) | Rp 50.000 – 120.000 | **Rp 600.000 – 1.400.000** |
| VPS 1 GB (provider internasional) | Rp 65.000 – 100.000 | **Rp 800.000 – 1.200.000** |
| VPS 2 GB (lebih longgar) | Rp 100.000 – 200.000 | **Rp 1.200.000 – 2.400.000** |

Provider yang umum dipakai: Niagahoster, Dewaweb, DomaiNesia, Hetzner, Vultr, DigitalOcean, dan sejenisnya.

**Estimasi server:** **Rp 600.000 – 1.500.000 / tahun** (untuk kebutuhan normal)

---

## Total biaya tahunan (gabungan)

| Skenario | Domain | Server | **Total / tahun** |
|----------|--------|--------|-------------------|
| **Hemat** | `.com` promo | VPS 1 GB | **~Rp 750.000 – 1.000.000** |
| **Standar** (disarankan) | `.com` atau `.id` | VPS 1 GB stabil | **~Rp 1.200.000 – 2.000.000** |
| **Institusi** | `.ac.id` | VPS 1–2 GB | **~Rp 1.500.000 – 3.000.000** |
| **Longgar** | `.ac.id` | VPS 2 GB + backup ekstra | **~Rp 2.500.000 – 4.000.000** |

### Rekomendasi untuk Biostat Hub

Untuk penggunaan **pembelajaran mandiri di lingkungan fakultas** (bukan ribuan user bersamaan):

> **Budget realistis: Rp 1 – 2 juta per tahun**  
> (domain + server 1 GB, semua komponen di satu server)

---

## Dua cara menjalankan website

### Opsi A — Semua di satu VPS (paling umum)

```
Domain → VPS (website + API + database)
```

| Kelebihan | Kekurangan |
|-----------|------------|
| Satu tempat, mudah dikelola | Server harus cukup untuk frontend + backend |
| Biaya terprediksi | Perlu setup awal (sekali) |
| Cocok untuk skala kecil–menengah | |

**Biaya:** sesuai tabel total di atas.

---

### Opsi B — Website di Vercel + API di VPS

```
Domain → Vercel (halaman) + VPS kecil (API & database)
```

| Kelebihan | Kekurangan |
|-----------|------------|
| VPS bisa lebih kecil & murah | Dua platform untuk monitor |
| Build website di cloud Vercel | Konfigurasi sedikit lebih rumit |

| Komponen | Biaya |
|----------|--------|
| Vercel (tier gratis, traffic kecil) | **Gratis** |
| VPS kecil (hanya API) | **~Rp 600.000 – 1.000.000 / tahun** |
| Domain | **~Rp 150.000 – 350.000 / tahun** |
| **Total** | **~Rp 750.000 – 1.300.000 / tahun** |

---

## Apa yang **tidak** termasuk dalam biaya hosting?

Hal berikut **di luar** estimasi di atas (jika dibutuhkan):

| Item | Keterangan |
|------|------------|
| **Jasa development** | Pembuatan/penyesuaian fitur website (sudah terpisah dari hosting) |
| **Email domain** | Mis. `info@biostat.yarsi.ac.id` — layanan email terpisah |
| **Backup cloud eksternal** | Google Drive / S3 untuk cadangan database (opsional, murah) |
| **Domain premium** | Nama domain mahal di pasar sekunder |
| **Maintenance bulanan** | Jika disepakati retainer ke developer untuk update keamanan |

---

## Perbandingan dengan alternatif lain

| Solusi | Perkiraan biaya / tahun | Catatan |
|--------|-------------------------|---------|
| **Biostat Hub (VPS sendiri)** | **Rp 1 – 2 juta** | Konten & kuis dikelola sendiri lewat admin |
| LMS SaaS (Teachable, dll.) | Rp 5 – 50 juta+ | Langganan platform, kurang fleksibel |
| Hosting shared murah | Rp 300 – 800 rb | Sering tidak cocok untuk Node.js/Next.js |
| Server kampus internal | Gratis (jika ada) | Bergantung kebijakan IT YARSI |

Biostat Hub dengan VPS sendiri relatif **hemat** untuk kebutuhan pembelajaran mandiri yang spesifik (biostatistik + SPSS).

---

## Siapa yang membayar & mengurus?

Hal yang perlu disepakati dengan klien:

| Tanggung jawab | Opsi |
|----------------|------|
| **Pembelian domain** | Klien (atas nama fakultas/YARSI) atau developer atas nama klien |
| **Pembelian VPS** | Klien atau developer (invoice atas nama klien) |
| **Setup awal server** | Developer (sekali, bisa masuk paket project) |
| **Perpanjangan tahunan** | Klien (domain + VPS diperpanjang setiap tahun) |
| **Isi konten** | Klien lewat panel admin (materi, video, kuis) |

---

## Checklist biaya tahunan (untuk budgeting klien)

Gunakan ini saat mengajukan anggaran ke fakultas:

- [ ] Domain: Rp __________ / tahun  
- [ ] VPS / hosting: Rp __________ / tahun  
- [ ] SSL (HTTPS): **Rp 0** (gratis)  
- [ ] Backup opsional: Rp __________ / tahun (jika pakai cloud storage)  
- [ ] **Total estimasi:** Rp __________ / tahun  

**Contoh pengisian (standar):**

- Domain `.id`: Rp 250.000  
- VPS 1 GB: Rp 900.000  
- SSL: Rp 0  
- **Total: ~Rp 1.150.000 / tahun** (~Rp 96.000 / bulan)

---

## Pertanyaan yang sering ditanyakan klien

### Apakah biaya hosting sama dengan biaya membuat website?

**Tidak.** Development (membuat website) adalah biaya **sekali** di awal. Hosting adalah biaya **berulang setiap tahun** agar website tetap online.

### Apakah perlu bayar lagi kalau menambah materi atau video?

**Tidak**, selama kapasitas server masih cukup. Konten diubah lewat panel admin tanpa biaya deploy tambahan.

### Berapa lama kontrak hosting?

Domain dan VPS biasanya **per tahun**. Beberapa provider menawarkan bayar bulanan (sedikit lebih mahal totalnya).

### Apakah 1 GB RAM cukup?

**Ya**, untuk pembelajaran mandiri dengan pengguna tidak terlalu padat bersamaan. Jika nanti traffic meningkat drastis, bisa upgrade VPS (biaya naik sedikit).

### Apakah data aman?

Database disimpan di server. Disarankan **backup berkala** file database (termasuk dalam panduan teknis deploy). Backup ke storage terpisah opsional tapi disarankan.

---

## Dokumen terkait

- **Panduan deploy teknis (untuk developer/IT):** [PANDUAN-DEPLOY-VPS.md](PANDUAN-DEPLOY-VPS.md)  
- **Domain, VPS & onboarding klien:** [PANDUAN-DOMAIN-VPS-ONBOARDING-KLIEN.md](PANDUAN-DOMAIN-VPS-ONBOARDING-KLIEN.md)  
- **Panduan developer project:** [PANDUAN-DEVELOPER.md](PANDUAN-DEVELOPER.md)  
- **Pertanyaan untuk klien (konten & launch):** [DAFTAR-PERTANYAAN-KLIEN.md](DAFTAR-PERTANYAAN-KLIEN.md)

---

*Estimasi ini disusun berdasarkan kebutuhan teknis Biostat Hub per Juli 2026. Harga provider dapat berubah; konfirmasi harga terbaru di website provider sebelum pembelian.*
