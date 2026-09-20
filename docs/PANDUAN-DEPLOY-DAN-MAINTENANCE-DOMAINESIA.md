# Panduan Manual Deployment dan Maintenance Riset Hub di DomaiNesia

Dokumen ini adalah pegangan pemilik/developer Riset Hub apabila proses deployment dan maintenance perlu dilakukan tanpa bantuan AI. Target hosting saat dokumen dibuat adalah DomaiNesia Nimbus Plus dengan cPanel, dua aplikasi Node.js, dan MySQL.

> Jangan menulis password, token, atau secret asli di dokumen ini maupun GitHub. Simpan semuanya di password manager.

## 1. Gambaran sistem production

```text
Pengunjung
├── https://DOMAIN-UTAMA           → frontend Next.js
└── https://api.DOMAIN-UTAMA/api   → backend Express
                                      ├── MySQL cPanel
                                      └── folder upload persisten
```

Komponen yang perlu tersedia:

- Domain utama untuk frontend.
- Subdomain `api` untuk backend.
- Dua aplikasi Node.js di cPanel.
- Satu database MySQL beserta user database.
- SSL aktif untuk domain utama dan subdomain API.
- Folder penyimpanan upload di luar folder source bila memungkinkan.

## 2. Informasi yang harus dicatat sebelum mulai

Salin daftar berikut ke password manager, bukan ke repository:

```text
Domain utama               : ______________________________
Subdomain API              : api.__________________________
URL login MyDomaiNesia     : ______________________________
Username cPanel            : ______________________________
Password cPanel            : ______________________________
Username SSH/cPanel        : ______________________________
Nama database penuh        : ______________________________
User database penuh        : ______________________________
Password database          : ______________________________
Username admin Riset Hub   : ______________________________
Password admin Riset Hub   : ______________________________
Lokasi source backend      : ______________________________
Lokasi source frontend     : ______________________________
Lokasi folder upload       : ______________________________
Commit production aktif    : ______________________________
```

Nama database dan user di cPanel biasanya otomatis memiliki awalan username akun, misalnya `akun_biostat`. Gunakan nama lengkap yang ditampilkan cPanel.

## 3. Checklist sebelum deployment

Di komputer lokal, buka terminal pada folder project dan jalankan:

```powershell
git status

cd backend
npm install
npx prisma validate
npm test

cd ../frontend
npm install
npm run lint
npm run build
```

Deployment hanya dilanjutkan jika seluruh pemeriksaan berhasil dan `git status` tidak menunjukkan perubahan yang lupa di-commit.

Pastikan commit lokal sudah dikirim ke GitHub:

```powershell
git push origin master
git status --short --branch
```

Status yang diharapkan adalah `master...origin/master` tanpa daftar file di bawahnya.

## 4. Membuat subdomain API dan SSL

1. Masuk ke MyDomaiNesia lalu buka cPanel hosting.
2. Cari menu **Domains** atau **Subdomains**.
3. Buat subdomain `api` sehingga alamatnya menjadi `api.DOMAIN-UTAMA`.
4. Pastikan DNS subdomain mengarah ke server hosting. Jika DNS dikelola cPanel, record biasanya dibuat otomatis.
5. Buka **SSL/TLS Status** atau menu SSL yang tersedia.
6. Pastikan domain utama dan subdomain API memiliki SSL aktif.
7. Jangan memasang URL `http://` pada konfigurasi production; gunakan `https://`.

Propagasi DNS dapat membutuhkan waktu. Jangan melanjutkan pengujian akhir sebelum kedua alamat dapat dibuka melalui HTTPS.

## 5. Membuat database MySQL

1. Di cPanel, buka **Database Wizard** atau **MySQL Database Wizard**.
2. Buat database, misalnya `biostat_hub`.
3. Buat user database dengan password acak yang kuat.
4. Hubungkan user ke database.
5. Berikan **All Privileges** kepada user tersebut.
6. Catat nama database dan username lengkap yang ditampilkan cPanel.

Format koneksi yang akan dipakai backend:

```env
DATABASE_URL="mysql://USER_DATABASE:PASSWORD_DATABASE@localhost:3306/NAMA_DATABASE"
```

Jika password mengandung karakter khusus seperti `@`, `:`, `/`, `#`, atau `%`, lakukan URL encoding atau gunakan password kuat yang aman untuk URL. Jangan membuka akses remote MySQL jika tidak diperlukan.

## 6. Menempatkan source code di hosting

### Pilihan A — melalui Git

Gunakan pilihan ini jika repository dapat diakses dari hosting.

1. Buka **Terminal** cPanel atau koneksi SSH.
2. Masuk ke direktori khusus aplikasi, bukan `public_html` apabila cPanel mengizinkan.
3. Clone repository:

```bash
git clone https://github.com/Hafizhvito/Biostat-hub.git riset-hub
cd riset-hub
git checkout master
```

Jika repository dibuat private, gunakan metode autentikasi yang aman. Jangan menaruh personal access token di URL yang disimpan pada riwayat terminal.

### Pilihan B — melalui ZIP

1. Unduh source dari GitHub menggunakan **Download ZIP**.
2. Jangan menyertakan `.env`, `.env.local`, `node_modules`, `.next`, database lokal, atau file upload lokal.
3. Upload ZIP melalui **File Manager** cPanel.
4. Extract ke folder aplikasi khusus, misalnya `riset-hub`.

Struktur akhirnya harus tetap memiliki folder `backend` dan `frontend`.

## 7. Environment backend production

Buat environment backend lewat menu environment variables pada **Setup Node.js App**. Jika panel tidak menyediakan input environment, buat `backend/.env` melalui File Manager dengan permission yang ketat.

```env
NODE_ENV="production"
DATABASE_URL="mysql://USER_DATABASE:PASSWORD_DATABASE@localhost:3306/NAMA_DATABASE"
JWT_SECRET="SECRET_ACAK_MINIMAL_32_KARAKTER"
JWT_EXPIRES_IN="7d"
ADMIN_USERNAME="USERNAME_ADMIN_BARU"
ADMIN_PASSWORD="PASSWORD_ADMIN_KUAT"
CORS_ORIGIN="https://DOMAIN-UTAMA"
UPLOAD_DIR="/home/USERNAME_CPANEL/riset-hub-storage"
```

Catatan penting:

- `JWT_SECRET` tidak boleh memakai nilai contoh dari repository.
- `CORS_ORIGIN` tidak memakai garis miring di akhir.
- `UPLOAD_DIR` idealnya berada di luar folder source agar tidak hilang saat update.
- Pastikan folder upload dapat ditulis oleh aplikasi Node.js.
- Jangan commit file environment ke GitHub.

Untuk membuat secret acak dari komputer lokal dengan Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 8. Menyiapkan backend Node.js

Di **Setup Node.js App**, buat aplikasi backend dengan pedoman berikut:

```text
Node.js version     : 20 atau versi LTS lebih baru yang kompatibel
Application mode   : Production
Application root   : lokasi folder backend
Application URL    : https://api.DOMAIN-UTAMA
Startup file       : src/server.js
```

Gunakan tombol **Run NPM Install** atau aktifkan virtual environment yang diberikan cPanel lalu jalankan:

```bash
cd /LOKASI/RISET-HUB/backend
npm ci --omit=dev
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

`npm run db:seed` dijalankan pada pemasangan pertama untuk membuat akun admin dan pengaturan awal. Pada update biasa, jangan menjalankannya tanpa alasan yang jelas.

Setelah itu, **Restart App** dari cPanel. Jangan menjalankan `node src/server.js` secara permanen dari terminal karena aplikasi cPanel biasanya dikelola Passenger/Application Manager.

Uji backend:

```text
https://api.DOMAIN-UTAMA/api/health
```

Hasil yang diharapkan:

```json
{"status":"ok"}
```

## 9. Environment dan build frontend

Environment frontend:

```env
NEXT_PUBLIC_API_URL="https://api.DOMAIN-UTAMA/api"
```

Nilai `NEXT_PUBLIC_API_URL` ikut dimasukkan ke hasil build. Jika URL API berubah, frontend wajib dibangun ulang.

Di **Setup Node.js App**, aplikasi frontend direncanakan dengan pedoman:

```text
Node.js version     : sama dengan backend
Application mode   : Production
Application root   : lokasi folder frontend
Application URL    : https://DOMAIN-UTAMA
Startup file       : server.mjs
```

Lalu jalankan melalui virtual environment aplikasi frontend:

```bash
cd /LOKASI/RISET-HUB/frontend
npm ci
npm run build
```

Perintah runtime project saat ini adalah:

```bash
npm start
```

Startup file `server.mjs` menjalankan Next.js menggunakan `PORT` yang diberikan cPanel/Passenger.

Setelah konfigurasi benar, restart aplikasi frontend dan buka domain utama.

## 10. Checklist pengujian sebelum serah terima

Lakukan seluruh pengujian berikut melalui browser biasa dan mode incognito:

- Domain utama terbuka melalui HTTPS tanpa peringatan sertifikat.
- `/api/health` pada subdomain API mengembalikan `status: ok`.
- Beranda menampilkan materi dan email dukungan yang benar.
- Halaman materi serta video dapat dibuka.
- Thumbnail dan video YouTube tampil.
- Kuis dapat dikirim dan skor muncul.
- Pencarian berfungsi.
- Glosarium dan unduhan dapat dibuka.
- Admin dapat login.
- Admin dapat menambah, mengubah, mengurutkan, dan menghapus data percobaan.
- Admin dapat mengganti email dukungan.
- Upload file dan gambar wizard berhasil.
- File upload tetap tersedia setelah kedua aplikasi direstart.
- Tampilan diperiksa dari ponsel dan desktop.
- Tidak ada pesan error berulang pada log aplikasi cPanel.

## 11. Cara memperbarui website dari GitHub

Sebelum setiap update, buat backup database dan folder upload. Catat commit aktif:

```bash
cd /LOKASI/RISET-HUB
git rev-parse --short HEAD
```

Tarik perubahan:

```bash
git status
git pull --ff-only origin master
```

Jika backend berubah:

```bash
cd backend
npm ci --omit=dev
npx prisma generate
npx prisma migrate deploy
```

Kemudian restart aplikasi backend dari cPanel.

Jika frontend berubah:

```bash
cd ../frontend
npm ci
npm run build
```

Kemudian restart aplikasi frontend dari cPanel.

Ulangi checklist pengujian penting. Jangan menjalankan `prisma migrate reset`, menghapus folder upload, atau menimpa file environment.

## 12. Backup rutin

Minimal backup yang diperlukan:

1. Database MySQL.
2. Folder yang ditunjuk oleh `UPLOAD_DIR`.
3. Catatan environment dan akses di password manager.
4. Source code di GitHub.

Jadwal yang disarankan:

- Sebelum setiap deployment: database dan folder upload.
- Mingguan: database serta folder upload jika konten sering berubah.
- Bulanan: full backup cPanel.
- Setelah perubahan akses: perbarui catatan di password manager.

Di cPanel, gunakan **Backup Wizard**. Simpan salinan backup penting di luar hosting. Backup yang hanya berada di server yang sama tidak cukup untuk pemulihan bencana.

## 13. Rollback jika update bermasalah

Jangan langsung menghapus database atau source. Catat error dan commit bermasalah terlebih dahulu.

Untuk kembali ke commit sebelumnya dengan aman:

```bash
cd /LOKASI/RISET-HUB
git log --oneline -10
git checkout ID_COMMIT_SEBELUMNYA
```

Install dependency/build kembali sesuai bagian update, kemudian restart aplikasi. Setelah penyebab masalah ditemukan, kembalikan ke branch utama:

```bash
git checkout master
git pull --ff-only origin master
```

Rollback kode tidak otomatis membatalkan perubahan database. Jika migrasi mengubah atau menghapus data, pulihkan database dari backup. Jangan menjalankan perintah database destruktif tanpa backup terverifikasi.

## 14. Troubleshooting cepat

### Website menampilkan 500 atau halaman kosong

- Buka log aplikasi frontend dan backend di cPanel.
- Pastikan kedua aplikasi berstatus started.
- Pastikan build frontend berhasil.
- Pastikan environment production tidak kosong.
- Restart aplikasi setelah environment diubah.

### Backend health check gagal

- Periksa startup file backend: `src/server.js`.
- Periksa `NODE_ENV`, `JWT_SECRET`, dan log Passenger.
- Pastikan port menggunakan nilai dari environment cPanel; jangan memaksa port publik sendiri.

### Error tidak dapat terhubung ke database

- Periksa nama database dan user lengkap dengan prefix cPanel.
- Periksa password dan `DATABASE_URL`.
- Pastikan user database sudah dihubungkan dan mendapat privileges.
- Gunakan host database yang diberikan DomaiNesia; biasanya `localhost` untuk database pada akun hosting yang sama.

### Login admin gagal

- Pastikan seed pertama pernah dijalankan.
- Pastikan `ADMIN_USERNAME` dan `ADMIN_PASSWORD` benar.
- Untuk mengganti password melalui environment, gunakan script project:

```bash
cd /LOKASI/RISET-HUB/backend
ADMIN_PASSWORD='PASSWORD_BARU' node scripts/reset-admin-password.js
```

Hindari menaruh password langsung di riwayat terminal jika tersedia cara memasukkannya melalui environment panel.

### Upload gagal

- Periksa permission dan keberadaan `UPLOAD_DIR`.
- Periksa batas upload cPanel/reverse proxy; aplikasi menerima maksimal 100 MB, tetapi hosting dapat menetapkan batas lebih kecil.
- Periksa sisa disk hosting.

### Perubahan frontend tidak muncul

- Pastikan commit terbaru sudah ditarik.
- Jalankan `npm run build` lagi.
- Restart aplikasi frontend.
- Coba mode incognito atau bersihkan cache browser.

### CORS error di browser

- Pastikan `CORS_ORIGIN` sama persis dengan origin frontend production, termasuk `https://`.
- Jangan memakai `localhost` pada environment production.
- Restart backend setelah perubahan.

## 15. Tugas yang dapat dilakukan tanpa menyentuh kode

Gunakan panel admin untuk:

- Mengelola materi dan video.
- Mengelola kuis.
- Mengelola glosarium.
- Mengelola file unduhan.
- Mengelola wizard.
- Mengelola tautan kalkulator.
- Mengubah judul/deskripsi beranda.
- Mengubah email dukungan.

Perubahan konten melalui admin tidak membutuhkan `git pull`, build, atau restart aplikasi.

## 16. Larangan penting

- Jangan commit `.env`, `.env.local`, password, token, atau backup database.
- Jangan menjalankan `npx prisma migrate reset` di production.
- Jangan menghapus database atau folder upload untuk memperbaiki error biasa.
- Jangan menjalankan server Node kedua secara manual jika aplikasi sudah dikelola cPanel.
- Jangan update dependency langsung di production tanpa menguji build lokal.
- Jangan menganggap backup berhasil sebelum file hasil backup dapat ditemukan dan ukurannya masuk akal.

## 17. Referensi resmi DomaiNesia

- Node.js di cPanel: https://www.domainesia.com/panduan/cara-install-nodejs-di-hosting/
- Database MySQL cPanel: https://www.domainesia.com/panduan/panduan-membuat-database-mysql-di-cpanel/
- Membuat subdomain: https://www.domainesia.com/panduan/cara-membuat-subdomain-di-cpanel/
- Backup cPanel: https://www.domainesia.com/panduan/panduan-backup-website-melalui-cpanel/

## 18. Catatan deployment pertama

Isi bagian ini setelah deployment benar-benar selesai:

```text
Tanggal deployment        : ______________________________
Domain production         : ______________________________
Subdomain API             : ______________________________
Versi Node.js             : ______________________________
Commit yang dideploy      : ______________________________
Lokasi backend            : ______________________________
Lokasi frontend           : ______________________________
Lokasi UPLOAD_DIR         : ______________________________
Backup pertama dibuat     : Ya / Tidak
Health check berhasil     : Ya / Tidak
Login admin berhasil      : Ya / Tidak
Upload persistence diuji  : Ya / Tidak
Nama pelaksana            : ______________________________
```
