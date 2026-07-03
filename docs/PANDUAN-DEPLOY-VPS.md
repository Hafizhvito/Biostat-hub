# Panduan Deploy — Biostat Hub ke VPS

Dokumen ini menjelaskan **langkah demi langkah** skenario deploy ketika kamu sudah punya hosting/VPS, berdasarkan struktur project saat ini:

```
Biostat-Hub/
├── backend/     → Express API (port 3001) + Prisma + SQLite
└── frontend/    → Next.js (port 3000)
```

---

## Ringkasan arsitektur production

### Opsi A — Semua di satu VPS (disarankan untuk proyek ini)

Cocok untuk skala kecil/freelance: 1 GB RAM sudah cukup.

```
Internet (HTTPS)
      │
      ▼
┌─────────────────────────────────────┐
│  VPS (Ubuntu)                       │
│                                     │
│  Nginx (:443)                       │
│    ├─ /        → Next.js (:3000)    │
│    └─ /api     → Express (:3001)    │
│                                     │
│  PM2 — menjaga proses tetap jalan   │
│  SQLite — file database di disk     │
└─────────────────────────────────────┘
```

**Domain contoh:** `https://biostat.yarsi.ac.id`  
**API:** `https://biostat.yarsi.ac.id/api` (satu domain, lebih simpel)

### Opsi B — Frontend Vercel + Backend VPS

- Frontend di **Vercel** (gratis tier biasanya cukup)
- Backend tetap di VPS
- `NEXT_PUBLIC_API_URL` mengarah ke `https://api.domain-kamu.com/api`
- `CORS_ORIGIN` di backend = URL Vercel frontend

Opsi B bagus kalau tidak mau build Next.js di VPS. **Langkah utama di bawah fokus Opsi A**; bagian akhir ada catatan singkat Opsi B.

---

## Sebelum mulai — yang perlu disiapkan

| Item | Contoh / catatan |
|------|------------------|
| VPS | Ubuntu 22.04 / 24.04, min. **1 GB RAM**, 1 vCPU |
| Domain | `biostat.yarsi.ac.id` (A record → IP VPS) |
| Akses SSH | user + key/password ke server |
| Repo | GitHub/GitLab (atau upload zip project) |
| Node.js | **v20+** di server |
| SSL | Gratis via **Let's Encrypt** (Certbot) |

Provider VPS yang umum: Niagahoster, Dewaweb, DigitalOcean, Vultr, Hetzner, dll. — prosedurnya sama.

---

## Tahap 1 — Siapkan server (sekali saja)

Login ke VPS via SSH:

```bash
ssh root@IP_VPS_KAMU
```

### 1.1 Update sistem & install paket dasar

```bash
apt update && apt upgrade -y
apt install -y curl git nginx ufw
```

### 1.2 Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v   # harus v20.x
npm -v
```

### 1.3 Install PM2 (process manager)

```bash
npm install -g pm2
```

PM2 menjaga backend & frontend tetap jalan setelah SSH ditutup / server reboot.

### 1.4 Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

## Tahap 2 — Upload project ke server

### 2.1 Buat user & folder (opsional tapi rapi)

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
mkdir -p ~/apps
cd ~/apps
```

### 2.2 Clone repository

```bash
git clone https://github.com/USERNAME/Biostat-Hub.git
cd Biostat-Hub
```

> Kalau belum pakai Git: upload zip project ke `~/apps/Biostat-Hub` lalu `unzip`.

---

## Tahap 3 — Setup backend (API)

```bash
cd ~/apps/Biostat-Hub/backend
npm install
```

### 3.1 Buat file `.env` production

```bash
cp .env.example .env
nano .env
```

Isi **production** (sesuaikan domain & password):

```env
DATABASE_URL="file:./prod.db"
JWT_SECRET="buat-string-panjang-random-minimal-32-karakter"
JWT_EXPIRES_IN="7d"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="PasswordKuatProduction2026!"
CORS_ORIGIN="https://biostat.yarsi.ac.id"
PORT=3001
```

**Penting:**
- `JWT_SECRET` — generate random (jangan pakai default `dev-secret-change-me`)
- `ADMIN_PASSWORD` — kuat, tidak sama dengan development
- `CORS_ORIGIN` — harus **persis** URL frontend production (pakai `https`, tanpa slash di akhir)

Generate secret contoh:

```bash
openssl rand -base64 32
```

### 3.2 Migrasi database & seed awal

```bash
npm run db:migrate
npm run db:seed
```

Ini membuat file `backend/prisma/prod.db` (SQLite) berisi tabel + akun admin + pengaturan beranda.

### 3.3 Tes backend manual

```bash
npm start
```

Di mesin lain / browser: `http://IP_VPS:3001/api/health` — harus merespons OK.  
Stop dengan `Ctrl+C`, lanjut ke PM2.

### 3.4 Jalankan backend dengan PM2

```bash
pm2 start src/server.js --name biostat-api
pm2 save
pm2 startup   # ikuti instruksi yang muncul (agar auto-start saat reboot)
```

---

## Tahap 4 — Setup frontend (Next.js)

```bash
cd ~/apps/Biostat-Hub/frontend
npm install
```

### 4.1 Buat `.env.local` production

```bash
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=https://biostat.yarsi.ac.id/api
```

> Variabel `NEXT_PUBLIC_*` **dibake saat build**. Kalau ganti URL API nanti, harus `npm run build` ulang.

### 4.2 Build & tes

```bash
npm run build
npm run start
```

Buka `http://IP_VPS:3000` — beranda harus tampil (API mungkin error kalau CORS/domain belum benar; itu normal sebelum Nginx+SSL).

Stop dengan `Ctrl+C`.

### 4.3 Jalankan frontend dengan PM2

```bash
pm2 start npm --name biostat-web -- start
pm2 save
pm2 status
```

Harus terlihat dua proses: `biostat-api` dan `biostat-web`.

---

## Tahap 5 — Nginx reverse proxy

Nginx menerima HTTPS dari internet dan meneruskan ke port internal 3000/3001.

### 5.1 Buat konfigurasi site

```bash
sudo nano /etc/nginx/sites-available/biostat-hub
```

```nginx
server {
    listen 80;
    server_name biostat.yarsi.ac.id;

    # API → Express
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend → Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan:

```bash
sudo ln -s /etc/nginx/sites-available/biostat-hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Sekarang `http://biostat.yarsi.ac.id` harus bisa diakses (belum HTTPS).

---

## Tahap 6 — SSL (HTTPS) dengan Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d biostat.yarsi.ac.id
```

Ikuti wizard (email, setuju terms). Certbot otomatis update config Nginx ke HTTPS.

Renewal otomatis biasanya sudah terpasang. Cek:

```bash
sudo certbot renew --dry-run
```

---

## Tahap 7 — Verifikasi setelah go-live

Checklist manual:

| # | Cek | Cara |
|---|-----|------|
| 1 | Beranda tampil | Buka `https://domain-kamu` |
| 2 | API sehat | `https://domain-kamu/api/health` |
| 3 | Hero text benar | Teks deskripsi dari database |
| 4 | Materi & video | Klik salah satu materi |
| 5 | Kuis | Kerjakan kuis sample |
| 6 | Admin login | `https://domain-kamu/admin/login` |
| 7 | CRUD admin | Tambah/edit materi → cek di beranda |
| 8 | HTTPS | Gembok hijau di browser |
| 9 | PM2 | `pm2 status` — keduanya `online` |

---

## Tahap 8 — Backup database (wajib untuk production)

Database = satu file SQLite: `backend/prisma/prod.db`

### Backup manual

```bash
cp ~/apps/Biostat-Hub/backend/prisma/prod.db \
   ~/backups/prod-$(date +%Y%m%d).db
```

### Backup otomatis (cron harian contoh)

```bash
mkdir -p ~/backups
crontab -e
```

Tambahkan:

```cron
0 2 * * * cp /home/deploy/apps/Biostat-Hub/backend/prisma/prod.db /home/deploy/backups/prod-$(date +\%Y\%m\%d).db
```

Simpan backup ke storage terpisah (Google Drive, S3, dll.) — jangan hanya di VPS yang sama.

---

## Tahap 9 — Update project setelah ada perubahan kode

```bash
cd ~/apps/Biostat-Hub
git pull

# Backend
cd backend
npm install
npm run db:migrate    # kalau ada migration baru
pm2 restart biostat-api

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart biostat-web
```

> **Konten** (materi, video, kuis, teks beranda) diubah lewat **admin panel** — tidak perlu deploy ulang.

---

## Troubleshooting umum

### Beranda kosong / error fetch

- Cek `NEXT_PUBLIC_API_URL` di `.env.local` sudah benar **sebelum** `npm run build`
- Rebuild frontend: `npm run build && pm2 restart biostat-web`

### CORS error di browser

- `CORS_ORIGIN` di `backend/.env` harus sama persis dengan URL frontend (`https://...`)
- Restart API: `pm2 restart biostat-api`

### Admin tidak bisa login

- Pastikan `npm run db:seed` sudah pernah dijalankan di server
- Cek `ADMIN_USERNAME` / `ADMIN_PASSWORD` di `.env`
- Atau reset password: `node scripts/reset-admin-password.js` (di folder `backend`)

### PM2 mati setelah reboot

```bash
pm2 save
pm2 startup
```

### Port 3000/3001 tidak boleh dibuka ke publik

Hanya Nginx (:443) yang menghadap internet. Port 3000/3001 cukup listen di `127.0.0.1` (default PM2 di server yang sama — sudah aman).

---

## Opsi B — Frontend Vercel + Backend VPS (ringkas)

1. Deploy backend di VPS seperti **Tahap 3** (tanpa Tahap 4–5 untuk frontend).
2. Nginx hanya proxy API, misalnya subdomain `api.biostat.yarsi.ac.id` → `:3001`.
3. Di Vercel, import repo folder `frontend/`:
   - Environment: `NEXT_PUBLIC_API_URL=https://api.biostat.yarsi.ac.id/api`
4. Backend `.env`: `CORS_ORIGIN=https://biostat.vercel.app` (atau domain custom Vercel).
5. Deploy frontend dari dashboard Vercel.

**Kelebihan:** build Next.js di cloud Vercel.  
**Kekurangan:** dua platform untuk monitor; CORS harus selalu sinkron.

---

## Checklist keamanan sebelum handover ke klien

- [ ] `JWT_SECRET` unik & panjang (bukan default dev)
- [ ] `ADMIN_PASSWORD` kuat (tidak `admin123`)
- [ ] HTTPS aktif
- [ ] `.env` tidak di-commit ke Git
- [ ] Backup `prod.db` terjadwal
- [ ] SSH pakai key, password root dinonaktifkan (opsional tapi disarankan)
- [ ] Kredensial admin hanya diberikan ke klien yang berwenang

---

## Estimasi biaya bulanan (referensi)

| Komponen | Perkiraan |
|----------|-----------|
| VPS 1 GB | Rp 50.000 – 150.000 / bulan |
| Domain `.ac.id` / `.id` | Rp 150.000 – 300.000 / tahun |
| SSL Let's Encrypt | Gratis |
| Vercel (opsi B) | Gratis tier untuk traffic kecil |

---

## Diagram alur pertama kali deploy

```
1. Beli VPS + domain
        ↓
2. SSH → install Node, Nginx, PM2
        ↓
3. Clone Biostat-Hub
        ↓
4. backend: .env → migrate → seed → PM2
        ↓
5. frontend: .env.local → build → PM2
        ↓
6. Nginx proxy / dan /api
        ↓
7. Certbot SSL
        ↓
8. Tes beranda + admin + backup
        ↓
9. Serahkan URL + kredensial admin ke klien
```

---

## File environment — ringkasan

### `backend/.env`

| Variabel | Production contoh |
|----------|-------------------|
| `DATABASE_URL` | `file:./prod.db` |
| `JWT_SECRET` | string random panjang |
| `JWT_EXPIRES_IN` | `7d` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | password kuat |
| `CORS_ORIGIN` | `https://biostat.yarsi.ac.id` |
| `PORT` | `3001` |

### `frontend/.env.local`

| Variabel | Production contoh |
|----------|-------------------|
| `NEXT_PUBLIC_API_URL` | `https://biostat.yarsi.ac.id/api` |

---

*Dokumen ini mengacu pada struktur project per Juli 2026. Jika ada perubahan arsitektur (mis. PostgreSQL, Docker), update panduan ini.*

**Estimasi biaya hosting untuk klien:** lihat [ESTIMASI-BIAYA-HOSTING.md](ESTIMASI-BIAYA-HOSTING.md).
