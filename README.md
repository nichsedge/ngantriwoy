<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🚀 ANTRIAN KITA (ngantriwoy)

### *Sistem Antrean Cerdas, Elegan, dan Real-Time untuk UMKM Indonesia*

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-latest-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-black?style=for-the-badge&logo=bun)](https://bun.sh/)

</div>

---

## 🌟 Tentang Antrian Kita

**Antrian Kita** (atau repository **ngantriwoy**) adalah platform manajemen antrean *real-time* berbasis web yang dirancang khusus untuk memodernisasi operasional bisnis pelaku **UMKM di Indonesia** (seperti *Barbershop*, Salon, Rumah Makan, Klinik, dll). 

Dengan antarmuka yang sangat premium, minimalis, dan animasi mikro yang sangat mulus menggunakan **Motion (Framer Motion)**, sistem ini memecahkan masalah antrean fisik yang menumpuk. Pelanggan dapat memantau status antrean secara *live* melalui ponsel mereka sendiri dan bahkan menyimpannya ke WhatsApp tanpa perlu menunggu lama di lokasi.

---

## ✨ Fitur Utama

*   📱 **Kiosk Pengambil Tiket (Kiosk Mode)**: Halaman khusus tablet/HP di toko bagi pelanggan untuk mengambil tiket antrean secara mandiri dengan input catatan pesanan opsional.
*   👑 **Panel Pengelola Real-Time (Admin Live Control)**: Kontrol penuh bagi pemilik bisnis untuk memanggil antrean berikutnya, melompati (*skip*), menginput pelanggan *walk-in* secara manual, dan mereset antrean harian.
*   🖥️ **Layar Monitor Publik (Display Mode)**: Halaman monitor interaktif untuk dipajang di TV toko, menampilkan nomor yang sedang dilayani, sisa antrean, dan estimasi waktu tunggu secara *live*.
*   💬 **WhatsApp Share Integration**: Tombol cepat bagi pelanggan untuk langsung membagikan/menyimpan tiket antrean ke WhatsApp agar tidak lupa nomor antrean mereka.
*   🔒 **Secure Authentication**: Sistem login yang aman untuk pemilik toko menggunakan **NextAuth.js v5 Beta** dan integrasi **Google Login**.
*   ⚡ **Modern Stack & Performance**: Dibangun menggunakan **Next.js 15 App Router**, **React 19**, **Tailwind CSS v4**, **Drizzle ORM**, **PostgreSQL**, dan dijalankan dengan **Bun runtime** yang super cepat.

---

## 📐 Alur Sistem & Arsitektur

Berikut adalah gambaran bagaimana data antrean mengalir secara real-time antara Pelanggan, Kiosk Toko, Monitor Publik, dan Panel Pengelola Toko:

```mermaid
sequenceDiagram
    autonumber
    actor Pelanggan as Pelanggan (Customer)
    actor Admin as Admin Toko (Owner)
    participant Kiosk as Mesin Kiosk / HP Kiosk
    participant DB as PostgreSQL (Drizzle)
    participant Monitor as Layar Monitor Utama (Display)

    Pelanggan->>Kiosk: Ambil Tiket Antrean & Masukkan Catatan (Opsional)
    Kiosk->>DB: Simpan Tiket Baru (Status: WAITING)
    DB-->>Kiosk: Kembalikan Nomor Tiket & Opsi Kirim WA
    DB-->>Monitor: Sinkronisasi Sisa Antrean & Estimasi Waktu (Real-time)
    Admin->>DB: Klik "Panggil Antrean" (Next Queue)
    DB-->>Monitor: Mainkan Suara Panggilan & Update Layar Monitor (Live)
    Admin->>DB: Selesaikan Pelayanan (SERVED) / Lewati (SKIPPED)
```

---

## 🛠️ Panduan Memulai (Local Development)

### 📋 Prasyarat
Sebelum memulai, pastikan Anda telah menginstal software berikut di komputer Anda:
*   [Node.js](https://nodejs.org/) (atau direkomendasikan menggunakan [Bun](https://bun.sh/) untuk performa maksimal)
*   [Docker](https://www.docker.com/) (untuk menjalankan PostgreSQL container secara instan)
*   Google OAuth Client Credentials (jika ingin mengaktifkan Google Login)

---

### 🚀 Langkah Instalasi

1.  **Clone Repository**
    ```bash
    git clone https://github.com/nichsedge/ngantriwoy.git
    cd ngantriwoy
    ```

2.  **Siapkan Environment Variables**
    Salin file `.env.example` menjadi `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
    Buka `.env.local` dan lengkapi konfigurasi berikut:
    ```env
    APP_URL="http://localhost:3000"
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
    AUTH_SECRET="BUAT_SECRET_RANDOM_DISINI"
    AUTH_GOOGLE_ID="google-client-id-anda.apps.googleusercontent.com"
    AUTH_GOOGLE_SECRET="google-client-secret-anda"
    ```

3.  **Inisialisasi Database**
    Kami menyediakan skrip otomatis untuk menyalin *environment*, menjalankan container PostgreSQL di Docker, dan melakukan sinkronisasi schema menggunakan Drizzle ORM:
    ```bash
    # Berikan izin eksekusi jika diperlukan
    chmod +x scripts/init-db.sh
    
    # Jalankan inisialisasi database
    ./scripts/init-db.sh
    ```

4.  **Jalankan Aplikasi dalam Mode Development**
    Gunakan Bun atau npm untuk menjalankan dev server:
    ```bash
    # Menggunakan Bun (Sangat Direkomendasikan)
    bun run dev
    
    # Atau menggunakan npm
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk melihat aplikasi berjalan secara langsung.

---

## 📁 Struktur Direktori

```text
ngantriwoy/
├── app/                  # Next.js App Router (Layout & Pages)
│   ├── admin/            # Panel Kontrol Pengelola Toko
│   ├── api/              # Endpoint API (Shops, Tickets, Auth, dll.)
│   ├── display/          # Halaman Monitor Antrean Publik (TV Mode)
│   ├── login/            # Halaman Autentikasi Pengguna & Google OAuth
│   ├── s/                # Halaman Dinamis Toko (/s/[shopId])
│   ├── take/             # Kiosk Pengambil Tiket Mandiri
│   ├── globals.css       # Custom styling modern & Tailwind CSS v4 setup
│   └── page.tsx          # Halaman Landing utama (Antrian Kita)
├── lib/                  # Kode Utility, Koneksi DB, & Logika Utama
│   ├── auth.ts           # NextAuth.js Configuration (v5 Beta)
│   ├── db.ts             # Drizzle ORM Database Connection
│   ├── locales.ts        # Bahasa / Dictionary (Indonesia & Inggris)
│   ├── queue-service.ts  # Layanan & Logika Operasional Antrean
│   └── schema.ts         # Database Schema (Shops, Users, Tickets, dll.)
├── scripts/              # Helper Scripts (init-db.sh)
├── drizzle.config.ts     # Konfigurasi Drizzle ORM
├── next.config.ts        # Konfigurasi Next.js
├── tailwind.config.ts    # Konfigurasi Tailwind CSS v4
├── package.json          # File dependencies & script runner
└── Dockerfile            # Containerization file untuk deployment cepat
```

---

## 🔒 Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Silakan gunakan, modifikasi, dan distribusikan untuk membantu kemajuan UMKM di sekitar Anda!

---

<div align="center">
  <sub>Dibuat dengan ❤️ oleh <b>Nichsedge</b> untuk Indonesia yang bebas antrean berantakan.</sub>
</div>
