# ⚡ GitHub Activity Bot (Commitbot)

Bot commit otomatis berbasis **GitHub Actions** yang berjalan otomatis di cloud untuk menjaga grafik kontribusi GitHub kamu tetap aktif, hijau, dan terlihat **100% natural, acak, dan anti-repetitif** tanpa perlu menyalakan laptop.

---

## ✨ Fitur & Pola Natural (v2.0)

- **Rentang Harian Dinamis (3 - 17 Commit)**:
  - Kebanyakan hari (~92%) menghasilkan commit acak antara **3 sampai 17 commit per hari**.
  - **Hari Santai / Minimal** (~3%): Kadang hanya ada **1 commit** dalam sehari.
  - **Hari Ringan** (~3%): Kadang hanya ada **2 commit** dalam sehari.
  - **Off-Day / Libur Alami** (~1.8%): Kadang **tidak ada commit sama sekali (0 commit)**, meniru pola developer sungguhan yang libur atau cuti.
- **Jadwal Tidak Robotik**:
  - Dijalankan 2x per jam (menit ke-18 dan ke-48) dengan 48 slot evaluasi.
  - Setiap slot memiliki probabilitas dinamis: kadang commit 1, kadang 2, dan sering kali melewati sesi (jeda santai) agar jam commit tidak tertebak.
  - **Jam Tidur Malam (02:00 - 06:59 WIB)**: 97% jeda tidur, 3% kemungkinan sesi malam (night-owl commit).
- **Pesan Commit Combinatorial & Anti-Repetitif**:
  - Menggabungkan puluhan scope, kata kerja, dan subjek teknis realistis (>300.000 kombinasi unik).
  - Dilengkapi sistem proteksi: **menolak mengulangi pesan yang pernah dipakai dalam 80 commit terakhir**.
  - Jeda waktu alami (2 - 5 detik) antar commit dalam batch yang sama agar timestamp Git tidak serentak di detik yang sama.

---

## 🚀 Panduan Setup ke GitHub

Repository ini terhubung ke:  
👉 **`https://github.com/radityabhardana/autocommit`**

### 1. Izin Write di GitHub (PENTING ⚠️)
Pastikan izin workflow sudah aktif:
1. Buka repo GitHub kamu.
2. Masuk ke **Settings** > **Actions** > **General**.
3. Di bagian **Workflow permissions**, pilih **Read and write permissions**.
4. Klik **Save**.

### 2. Tampilkan Kontribusi jika Repo Private
Jika repository di-set Private:
1. Buka halaman profil GitHub kamu.
2. Di atas grid kontribusi hijau, klik **Contribution settings**.
3. Centang **Private contributions**.

---

## 🧪 Perintah Lokal & CLI

Kamu bisa mengecek status dan mensimulasikan bot secara lokal:

```bash
# Cek status target dan sisa commit hari ini
npm run status
# atau: node bot.js --status

# Simulasi (dry-run) tanpa membuat commit nyata
npm run dry-run
# atau: node bot.js --dry-run

# Paksa commit langsung (1-3 commit) untuk tes
npm run force
# atau: node bot.js --force
```

---

## ⚙️ Trigger Manual di GitHub Actions

1. Buka tab **Actions** di repo GitHub.
2. Klik workflow **Auto Commit Activity Pulse**.
3. Klik tombol **Run workflow** (centang opsi force jika ingin bypass limit langsung).
