# commitbot

Script otomatisasi commit berbasis GitHub Actions. Dirancang untuk mensimulasikan pola commit acak berkala dengan interval dinamis, rotasi pesan commit, dan jadwal istirahat.

## Cara Kerja

- **Frekuensi Dinamis**: Jumlah commit bervariasi antara 1 hingga 17 commit per hari, termasuk kemungkinan jeda tanpa commit (off-day).
- **Jadwal Evaluasi**: Workflow berjalan melalui cron GitHub Actions pada menit ke-18 dan ke-48.
- **Jam Istirahat**: Membatasi aktivitas pada dini hari (02:00 - 07:00 WIB).
- **Pesan Commit**: Menggunakan generator pesan konvensional acak dan mencegah duplikasi pesan yang baru saja digunakan.

## Setup

### 1. Izin Workflow GitHub
Workflow membutuhkan izin push ke repository:
1. Buka repository di GitHub, lalu masuk ke **Settings** > **Actions** > **General**.
2. Pada bagian **Workflow permissions**, pilih **Read and write permissions**.
3. Klik **Save**.

### 2. Tampilkan Kontribusi (Repository Private)
Jika repository disetel private:
1. Buka profil GitHub kamu.
2. Di atas grafik kontribusi, buka menu dropdown **Contribution settings**.
3. Centang **Private contributions**.

## Perintah Lokal

Script dapat diuji secara lokal menggunakan Node.js:

```bash
# Cek kuota dan target commit hari ini
node bot.js --status

# Simulasi evaluasi tanpa membuat commit (dry-run)
node bot.js --dry-run

# Buat commit langsung saat ini (bypass jadwal/limit)
node bot.js --force
```

## Kontrol Workflow

- **Jalankan manual**: Buka tab **Actions** > pilih **Auto Commit Activity Pulse** > klik **Run workflow**.
- **Matikan bot**: Buka tab **Actions** > pilih **Auto Commit Activity Pulse** di sidebar kiri > klik menu titik tiga (`...`) di kanan atas > pilih **Disable workflow**.
