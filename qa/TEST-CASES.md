# Test Case Riset Hub

Dokumen ini menjadi checklist regresi sebelum dan sesudah deployment. Jalankan pengujian otomatis terlebih dahulu, kemudian lakukan kasus manual yang menyentuh perubahan data melalui panel admin.

## Perintah pengujian otomatis

```powershell
cd backend
npm test

cd ..\frontend
npm run lint
npm run build

cd ..
node qa/live-smoke.mjs
```

## Prioritas

- P0: layanan tidak dapat digunakan, kehilangan data, atau celah keamanan langsung.
- P1: fungsi utama gagal atau konten yang disimpan berubah atau terpotong.
- P2: gangguan minor pada tampilan, pesan, atau kenyamanan penggunaan.

## Panel admin dan autentikasi

| ID | Prioritas | Kasus | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|---|
| ADM-01 | P0 | Login benar | Masukkan akun admin valid | Masuk ke panel dan menu admin tampil |
| ADM-02 | P1 | Login salah | Masukkan kata sandi salah | Pesan kesalahan tampil dan tidak ada token login |
| ADM-03 | P0 | API admin tanpa token | Buka endpoint admin tanpa Authorization | HTTP 401 |
| ADM-04 | P1 | Sesi kedaluwarsa | Gunakan token lama lalu buka halaman admin | Dialihkan ke login tanpa halaman rusak |
| ADM-05 | P1 | Pembatasan login | Kirim percobaan gagal berulang pada lingkungan uji | HTTP 429 setelah batas tercapai |
| ADM-06 | P2 | Logout | Pilih Keluar | Token lokal dihapus dan kembali ke login |

## Materi dan deskripsi panjang

| ID | Prioritas | Kasus | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|---|
| MAT-01 | P1 | Tambah materi | Isi judul dan deskripsi normal | Materi tersimpan dan muncul di beranda |
| MAT-02 | P1 | Deskripsi 10.000 karakter | Tempel teks panjang dengan beberapa paragraf | Seluruh isi tersimpan; halaman detail tidak terpotong |
| MAT-03 | P1 | Format rich text | Gunakan judul, bold, italic, daftar, tautan, dan gambar | Format tampil aman dan konsisten di halaman detail |
| MAT-04 | P1 | Hanya gambar | Simpan deskripsi berisi gambar tanpa teks | Gambar tetap tersimpan dan tampil |
| MAT-05 | P1 | Markup kosong | Simpan editor yang hanya berisi paragraf kosong | Disimpan sebagai kosong, bukan markup semu |
| MAT-06 | P2 | Ringkasan kartu | Gunakan deskripsi panjang | Kartu merangkum teks; halaman detail tetap lengkap |
| MAT-07 | P1 | Ubah materi | Ubah judul dan deskripsi | Perubahan bertahan setelah refresh |
| MAT-08 | P0 | Hapus materi berisi video | Coba hapus materi yang masih dipakai | Ditolak dengan pesan yang jelas; video tidak hilang |
| MAT-09 | P1 | Urutkan materi | Pindahkan naik dan turun | Urutan publik sama dengan panel admin |

## Video

| ID | Prioritas | Kasus | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|---|
| VID-01 | P1 | Format URL YouTube | Uji watch, youtu.be, embed, dan shorts | Semua format valid dapat diputar |
| VID-02 | P0 | URL domain palsu | Masukkan example.com dengan parameter v | Ditolak sebagai URL YouTube tidak valid |
| VID-03 | P1 | Video Unlisted | Tambahkan tautan Unlisted dengan embed aktif | Video tampil dan dapat diputar |
| VID-04 | P1 | Embed dinonaktifkan | Tambahkan video yang melarang embed | Pengguna mendapat fallback atau tautan YouTube |
| VID-05 | P1 | Deskripsi 10.000 karakter | Simpan rich text panjang | Tidak dipotong di database atau halaman video |
| VID-06 | P1 | Pindah materi | Ubah pilihan materi | Video pindah dan urutannya valid |
| VID-07 | P1 | Reorder batas | Tekan naik pada item pertama dan turun pada terakhir | Tidak error dan urutan tidak rusak |

## Kuis

| ID | Prioritas | Kasus | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|---|
| KUI-01 | P1 | Tepat satu jawaban benar | Buat soal dengan satu opsi benar | Kuis tersimpan |
| KUI-02 | P1 | Tanpa jawaban benar | Buat soal tanpa opsi benar | Validasi menolak |
| KUI-03 | P1 | Dua jawaban benar | Tandai dua opsi benar | Validasi menolak |
| KUI-04 | P1 | Jawaban belum lengkap | Kirim kuis dengan soal kosong | Hasil tidak dihitung dan pesan tampil |
| KUI-05 | P1 | Skor | Jawab campuran benar dan salah | Nilai dan pembahasan per soal akurat |
| KUI-06 | P2 | Gambar soal gagal | Gunakan URL gambar rusak | Teks soal tetap dapat digunakan |

## Glosarium pencarian dan data kosong

| ID | Prioritas | Kasus | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|---|
| GLO-01 | P1 | Definisi panjang | Simpan definisi dan contoh panjang | Seluruh teks tersimpan dan terbaca |
| GLO-02 | P2 | Huruf dan pencarian | Cari dengan huruf besar, kecil, spasi, dan simbol | Hasil konsisten tanpa error |
| GLO-03 | P2 | Tidak ada hasil | Cari istilah acak | Empty state tampil |
| SRH-01 | P1 | Pencarian global | Cari materi, video, dan glosarium | Link hasil menuju halaman yang benar |
| SRH-02 | P1 | Karakter khusus | Cari `chi square & uji` | Tidak ada error encoding atau server |
| EMP-01 | P1 | Koleksi kosong | Jalankan pada data kuis atau kalkulator kosong | Empty state tampil, bukan crash |

## Unduhan wizard dan kalkulator

| ID | Prioritas | Kasus | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|---|
| DWN-01 | P0 | Tipe file terlarang | Unggah file di luar tipe yang diizinkan | HTTP 415 dan file tidak tersimpan |
| DWN-02 | P1 | File terlalu besar | Unggah melebihi batas | HTTP 413 dengan pesan ukuran |
| DWN-03 | P1 | Unduh file | Unduh file valid | Nama, isi, dan penghitung unduhan benar |
| WIZ-01 | P1 | Gambar wizard valid | Unggah PNG atau JPG | Gambar tampil, zoom bekerja, unduhan berhasil |
| WIZ-02 | P1 | Pembahasan panjang | Simpan teks panjang | Tidak terpotong setelah refresh |
| WIZ-03 | P2 | Zoom batas | Tekan zoom keluar dan masuk berulang | Skala berhenti pada 0,5 dan 3 |
| CAL-01 | P0 | URL http atau https | Tambahkan URL valid | Tautan terbuka pada tab baru |
| CAL-02 | P0 | URL javascript atau data | Masukkan protokol berbahaya | Validasi menolak |
| CAL-03 | P2 | URL tujuan mati | Gunakan URL yang tidak merespons pada lingkungan uji | Situs utama tetap normal; admin dapat memperbaiki tautan |

## Tampilan responsif aksesibilitas dan ketahanan

| ID | Prioritas | Kasus | Langkah ringkas | Hasil yang diharapkan |
|---|---|---|---|---|
| UI-01 | P1 | Lebar 320 px | Periksa seluruh halaman utama | Tidak ada scroll horizontal atau tombol terpotong |
| UI-02 | P1 | Desktop 1366 px | Periksa seluruh halaman utama | Grid, menu, gambar, dan teks rapi |
| UI-03 | P2 | Keyboard | Navigasi tanpa mouse | Fokus terlihat dan seluruh kontrol dapat dipakai |
| UI-04 | P2 | Modal wizard | Buka dan tutup modal | Kontrol jelas; halaman dapat digunakan kembali |
| UI-05 | P1 | Teks sangat panjang tanpa spasi | Masukkan URL atau kata 300 karakter pada lingkungan uji | Konten membungkus dan tidak merusak layout |
| ERR-01 | P0 | API mati | Jalankan frontend uji tanpa backend | Error atau empty state tampil; halaman tidak blank |
| ERR-02 | P1 | Respons API bukan JSON | Simulasikan proxy mengembalikan HTML | Pesan umum tampil tanpa crash tidak tertangani |
| ERR-03 | P1 | Refresh halaman detail | Refresh section, video, dan quiz | Tidak 404 dan data kembali tampil |
| SEO-01 | P1 | Metadata | Periksa title, canonical, sitemap, robots | Nilai benar dan admin berstatus noindex |
| PERF-01 | P2 | Muat ulang berulang | Refresh beranda 10 kali | Tidak macet dan tidak ada error console berulang |

## Checklist rilis minimum

Sebuah rilis boleh diterapkan bila seluruh tes otomatis lulus, semua P0 dan P1 yang terdampak perubahan telah diuji, tidak ada migrasi database yang tertunda, build frontend berhasil, serta beranda, satu halaman materi, satu video, glosarium, wizard, unduhan, dan login admin sudah diperiksa pada website live.
