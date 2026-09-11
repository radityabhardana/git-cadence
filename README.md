# ⚡ GitHub Activity Bot (Commitbot)

Bot commit otomatis berbasis **GitHub Actions** yang berjalan otomatis di cloud untuk menjaga grafik kontribusi GitHub kamu tetap aktif, hijau, dan terlihat natural tanpa perlu menyalakan laptop.

---

## ✨ Fitur Utama

- **100% Cloud-based**: Berjalan di server GitHub Actions gratis, PC/laptop tidak perlu menyala.
- **Pola Natural & Realistis**:
  - **Peluang Hari Kerja (Senin - Jumat)**: ~80% melakukan commit.
  - **Peluang Akhir Pekan (Sabtu - Minggu)**: ~45% melakukan commit (ada jeda santai agar tidak terlihat kaku).
  - **Jumlah Commit Acak**: Kadang 1, kadang 2, kadang 3 commit per sesi.
  - **Pesan Commit Variatif**: Menggunakan format conventional commit (`chore:`, `docs:`, `perf:`, `refactor:`, dll.).
- **Jadwal 4x Sehari**: Dijadwalkan otomatis pada menit-menit acak (~09:17, ~14:17, ~19:17, ~23:17 WIB).
- **Manual Trigger**: Bisa langsung dicoba kapan saja lewat tombol **Run workflow** di tab Actions GitHub.

---

## 🚀 Panduan Setup ke GitHub

### 1. Buat Repository Baru di GitHub
1. Buka [github.com/new](https://github.com/new).
2. Beri nama repository, misalnya `commitbot` atau `daily-pulse`.
3. Pilih **Public** atau **Private** (bebas).
4. Jangan centang *Add a README file*, lalu klik **Create repository**.

---

### 2. Push Code Ini ke GitHub
Buka terminal di folder `c:\projects\website\commitbot` lalu jalankan:

```bash
git init
git add .
git commit -m "feat: initial commitbot setup"
git branch -M main
git remote add origin https://github.com/USERNAME_KAMU/NAMA_REPO_KAMU.git
git push -u origin main
```
*(Ganti `USERNAME_KAMU` dan `NAMA_REPO_KAMU` dengan repository GitHub yang baru kamu buat).*

---

### 3. Aktifkan Izin Write di GitHub (PENTING ⚠️)
Agar bot diizinkan melakukan push commit ke repository:
1. Masuk ke halaman repository kamu di GitHub.
2. Klik tab **Settings** > **Actions** > **General**.
3. Gulir ke bawah ke bagian **Workflow permissions**.
4. Pilih **Read and write permissions**.
5. Klik tombol **Save**.

---

### 4. Jika Repository Kamu Private (Agar Kotak Hijau Muncul)
Secara default, GitHub hanya menampilkan kontribusi dari repository public:
1. Buka profil GitHub kamu (`https://github.com/USERNAME_KAMU`).
2. Di atas grid kontribusi hijau, klik dropdown **Contribution settings**.
3. Centang **Private contributions**.

---

## 🧪 Cara Test Manual

Kamu bisa langsung mengetes bot tanpa menunggu jadwal cron:
1. Buka tab **Actions** di repo GitHub kamu.
2. Klik workflow **Auto Commit Activity Pulse** di sidebar kiri.
3. Klik tombol **Run workflow** > klik **Run workflow (hijau)**.
4. Tunggu ~30 detik, bot akan selesai commit dan kotak kontribusi profilmu langsung bertambah!

---

## 💻 Menjalankan di Lokal (Opsional)

Jika ingin mencoba script secara lokal di komputer:
```bash
# Test dengan logika acak
node bot.js

# Paksa commit langsung
npm run force
```
