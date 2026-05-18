# Panduan Pengembangan Lokal - Antrian Kita

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi Antrian Kita di komputer lokal Anda.

## Prasyarat
- **Bun** (v1.0+) terinstal.
- **Docker** terinstal (untuk database lokal).
- Akun **Google Cloud Console** (untuk Google Auth).

## Langkah Instalasi

1. **Clone atau Unduh Source Code**
   Pastikan semua file (`app/`, `lib/`, `package.json`, dll) sudah ada di folder proyek Anda.

2. **Instal Dependensi**
   Buka terminal di root proyek dan jalankan:
   ```bash
   bun install
   ```

3. **Konfigurasi Environment Variables**
   Buat file bernama `.env.local` di root proyek dan isi sesuai contoh berikut:
   ```env
   # NextAuth
   AUTH_SECRET="buat-secret-acak-anda-disini"
   
   # Google OAuth (Dapatkan dari Google Cloud Console)
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   
   # Database (Opsional: Jika tidak diisi, API akan menggunakan dummy data)
   DATABASE_URL="postgresql://user:password@localhost:5432/antrian_db"
   
   # URL Aplikasi
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup Database**
   Anda bisa menggunakan Docker untuk menjalankan PostgreSQL secara lokal:
   ```bash
   bun run db:init
   ```
   Perintah ini akan:
   - Membuat file `.env.local` jika belum ada.
   - Menjalankan container PostgreSQL di Docker.
   - Menunggu database siap.
   - Melakukan sinkronisasi schema (`db:push`).

   Atau, jika Anda sudah memiliki PostgreSQL sendiri, pastikan `DATABASE_URL` di `.env.local` sudah benar, lalu jalankan:
   ```bash
   bun run db:push
   ```


5. **Jalankan Server Development**
   ```bash
   bun run dev
   ```
   Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

## Struktur Folder Penting
- `/app`: Rute halaman (Next.js App Router).
- `/lib`: Logika database, skema Drizzle, dan konfigurasi Auth.
- `/public`: Aset statis seperti logo atau ikon.

## Tips Pengembangan
- **Dummy Data**: Jika `DATABASE_URL` tidak diset, API di `/app/api/queue/route.ts` secara otomatis akan mengembalikan data simulasi agar Anda bisa fokus ke pengembangan Frontend (FE).
- **Styling**: Proyek ini menggunakan **Tailwind CSS v4**. Semua styling ada di dalam class HTML atau `globals.css`.
