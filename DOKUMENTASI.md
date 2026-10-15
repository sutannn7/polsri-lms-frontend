# Dokumentasi Teknis LearnEase LMS POLSRI

## 1. Deskripsi Proyek

**LearnEase LMS POLSRI** adalah aplikasi antarmuka Learning Management System (LMS) untuk Politeknik Negeri Sriwijaya. Aplikasi ini ditujukan bagi mahasiswa untuk melihat informasi pembelajaran, progres mata kuliah, jadwal, pengumuman kampus, dan tenggat tugas.

Saat ini aplikasi merupakan prototipe sisi klien. Akun dan materi yang ditampilkan menggunakan data lokal, belum menggunakan backend atau basis data.

## 2. Teknologi yang Digunakan

Versi di bawah mengikuti rentang versi yang tercantum di `package.json`. Tanda `^` berarti pengelola paket dapat memilih pembaruan minor atau patch yang kompatibel saat memasang dependency. Versi Node.js tidak ditetapkan di `package.json`.

### Bahasa pemrograman

| Teknologi | Versi | Fungsi |
|---|---|---|
| JavaScript (ES Modules dan JSX) | Tidak ditetapkan di `package.json` | Digunakan untuk logika aplikasi, komponen React, dan tampilan. |
| JSON | — | Menyimpan data contoh pengguna, mata kuliah, pertemuan, pengumuman, dan tenggat. |

### Framework dan library utama

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| React | `^18.3.1` | Membuat antarmuka dari komponen yang dapat digunakan kembali. |
| React DOM | `^18.3.1` | Menampilkan komponen React ke halaman web. |
| Vite | `^6.0.7` | Menjalankan server pengembangan dan membangun aplikasi untuk produksi. |
| `@vitejs/plugin-react` | `^4.3.4` | Mengaktifkan dukungan React pada Vite. |

### Styling

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| Tailwind CSS | `^3.4.17` | Menyusun tampilan dengan kelas utility CSS. |
| Plus Jakarta Sans | Tidak tercantum sebagai paket | Satu keluarga font untuk antarmuka dan landing page; dimuat dari Google Fonts dengan `display=swap`. |

### Routing

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| React Router DOM | `^6.30.1` | Mengatur perpindahan halaman dan rute aplikasi tanpa pemuatan ulang penuh. |

### Ikon

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| `lucide-react` | `^0.468.0` | Menyediakan ikon SVG sebagai komponen React. |

### Tools pengembangan

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| PostCSS | `^8.4.49` | Memproses CSS; konfigurasi proyek menggunakannya bersama Tailwind. |
| Autoprefixer | `^10.4.20` | Menambahkan prefix CSS yang diperlukan agar aturan CSS lebih kompatibel dengan browser. |

ESLint tidak tercantum sebagai dependency atau script dalam `package.json` yang diperiksa. Proyek menggunakan konfigurasi Vite di `vite.config.js` dan konfigurasi PostCSS di `postcss.config.js`.

## 3. Struktur Folder Proyek

Pohon berikut berasal dari pemindaian file aktual di `src/`. Folder `src/assets/` juga tersedia, tetapi tidak memiliki file dalam hasil pemindaian.

```text
src/
├── App.jsx
├── main.jsx
├── assets/
├── components/
│   ├── course/
│   │   ├── ActivityItem.jsx
│   │   ├── CourseCard.jsx
│   │   ├── CourseFilterBar.jsx
│   │   ├── CourseHeader.jsx
│   │   ├── CourseSummaryBar.jsx
│   │   ├── LecturerCard.jsx
│   │   ├── MeetingAccordion.jsx
│   │   ├── NextDeadlineCard.jsx
│   │   └── QuizCard.jsx
│   ├── home/
│   │   ├── AnnouncementCard.jsx
│   │   ├── CalendarWidget.jsx
│   │   ├── ContinueLearningCard.jsx
│   │   ├── DeadlineList.jsx
│   │   └── WelcomeBanner.jsx
│   ├── layout/
│   │   ├── AuthLayout.jsx
│   │   ├── Breadcrumb.jsx
│   │   ├── Footer.jsx
│   │   ├── MainLayout.jsx
│   │   └── Navbar.jsx
│   ├── landing/
│   │   ├── CampusNews.jsx
│   │   ├── FeatureBento.jsx
│   │   ├── FinalCta.jsx
│   │   ├── Hero.jsx
│   │   ├── LandingFooter.jsx
│   │   ├── LandingNav.jsx
│   │   ├── PhonePreview.jsx
│   │   ├── Questions.jsx
│   │   ├── Steps.jsx
│   │   ├── WeekCalendar.jsx
│   │   └── WeekSchedule.jsx
│   └── ui/
│       ├── Accordion.jsx
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       ├── PolsriLogo.jsx
│       ├── ProgressBar.jsx
│       ├── StatCard.jsx
│       └── Tabs.jsx
├── context/
│   └── AuthContext.jsx
├── data/
│   ├── announcements.json
│   ├── courses.json
│   ├── deadlines.json
│   ├── meetings.json
│   └── user.json
├── hooks/
│   ├── useAuth.js
│   ├── useCourses.js
│   ├── useHomeData.js
│   ├── useCountUp.js
│   └── useReveal.js
├── pages/
│   ├── CourseDetailPage.jsx
│   ├── DashboardPage.jsx
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── MyCoursesPage.jsx
│   ├── NotFoundPage.jsx
│   └── SplashPage.jsx
├── routes/
│   ├── AppRouter.jsx
│   └── ProtectedRoute.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── courseService.js
│   └── homeService.js
├── styles/
│   ├── index.css
│   ├── landing.css
│   └── landing-redesign.css
└── utils/
    ├── courseStatus.js
    └── formatDate.js
```

Fungsi folder utama:

| Folder | Fungsi |
|---|---|
| `components/ui/` | Komponen antarmuka umum seperti tombol, input, kartu, badge, tab, dan progress bar. |
| `components/layout/` | Kerangka dan navigasi halaman, termasuk layout autentikasi dan layout utama. |
| `components/landing/` | Bagian landing publik, navigasi, ringkasan fitur, agenda pekan, pratinjau seluler, FAQ, langkah penggunaan, dan ajakan masuk. |
| `components/home/` | Komponen khusus Beranda, seperti kartu pengumuman, kalender, dan daftar tenggat. |
| `components/course/` | Komponen daftar mata kuliah dan detail aktivitas/pertemuan pembelajaran. |
| `pages/` | Komponen halaman yang dipasang pada rute aplikasi. |
| `routes/` | Pemetaan rute dan pemeriksaan akses untuk halaman yang memerlukan login. |
| `context/` | State autentikasi bersama yang dapat digunakan komponen aplikasi. |
| `data/` | File JSON statis yang menjadi sumber data prototipe. |
| `services/` | Fungsi akses data dan simulasi autentikasi. `api.js` saat ini kosong. |
| `hooks/` | Hook React untuk mengambil state autentikasi dan data layanan. |
| `utils/` | Fungsi bantu untuk status/progres mata kuliah dan format tanggal. |
| `styles/` | CSS global, impor Tailwind, font, style dasar, animasi, dan stylesheet khusus landing page. |

## 4. Halaman dan Routing

| Path | Halaman | Deskripsi | Perlindungan |
|---|---|---|---|
| `/` | Landing page | Halaman publik dengan ringkasan tenggat, progres, kalender, pengumuman, dan tautan masuk. Pengguna yang sudah login diarahkan ke Beranda. | Tidak |
| `/login` | Login | Form login prototipe. | Tidak |
| `/beranda` | Beranda | Ringkasan pembelajaran, pengumuman, kalender, tenggat, dan mata kuliah untuk dilanjutkan. | Ya |
| `/dasbor` | Dasbor | Statistik progres belajar, aktivitas tugas, dan rekomendasi fokus belajar. | Ya |
| `/mata-kuliah` | Mata Kuliah Saya | Ringkasan, pencarian, filter, pengurutan, dan daftar mata kuliah. | Ya |
| `/mata-kuliah/:id` | Detail Mata Kuliah | Informasi mata kuliah, pertemuan, aktivitas, dan sidebar pembelajaran. | Ya |
| `*` | Halaman tidak ditemukan | Pesan 404 dan tautan kembali ke Beranda. | Tidak |

Route yang dilindungi menggunakan `ProtectedRoute`; pengguna yang belum login diarahkan ke `/login`. Halaman-halaman utama yang dilindungi dirender di dalam `MainLayout`, sedangkan halaman login memakai `AuthLayout`.
Route `/` menampilkan landing page publik, dan mengarahkan pengguna yang sudah memiliki sesi aktif ke `/beranda`.

## 5. Alur Autentikasi

Autentikasi saat ini merupakan simulasi lokal:

1. Form login meminta NIP/NPM/NIK dan kata sandi. NIP/NPM/NIK harus terisi, sedangkan kata sandi minimal enam karakter.
2. `authService.js` menunggu sekitar 800 ms, lalu menganggap input yang memenuhi validasi sebagai login berhasil. Nilai ID tidak dicocokkan dengan akun tertentu.
3. Profil pengguna yang dikembalikan berasal dari `src/data/user.json`; saat ini datanya atas nama Rizky Pratama.
4. Status sesi sederhana disimpan di `localStorage` dengan kunci `learnease-session`. Saat aplikasi dimuat ulang, sesi tersebut digunakan untuk memulihkan status login.
5. Fungsi Keluar menghapus kunci sesi dan mengarahkan pengguna ke halaman login.

Login belum memverifikasi kredensial ke server, dan mekanisme ini **bukan autentikasi backend yang aman untuk penggunaan produksi**.

## 6. Sumber Data

Data halaman saat ini diimpor dari file JSON statis di `src/data/`, bukan diambil dari database atau API.

| File | Isi |
|---|---|
| `user.json` | Profil contoh pengguna: nama, inisial, program studi, semester, dan kelas. |
| `courses.json` | Enam mata kuliah MI2301–MI2306, termasuk nama dosen, SKS, progres, materi berikutnya, program studi, semester, kelas, dan warna cover. |
| `meetings.json` | Jadwal mingguan serta rincian pertemuan dan aktivitas untuk seluruh mata kuliah MI2301–MI2306. |
| `announcements.json` | Tiga pengumuman kampus: akademik, beasiswa, dan kegiatan, masing-masing dengan tanggal dan deskripsi. |
| `deadlines.json` | Empat tenggat dengan mata kuliah, tanggal/waktu, dan status; termasuk satu tenggat berstatus selesai. |

`courseService.js` dan `homeService.js` membaca data lokal tersebut. Hook `useCourses` dan `useHomeData` menyediakan data untuk halaman React. Struktur layanan memisahkan akses data dari tampilan, tetapi penggantian ke API nyata belum dilakukan.

## 7. Fitur yang Sudah Berfungsi

### Landing page

- Route `/` menampilkan halaman publik LearnEase sebelum pengguna masuk; sesi yang sudah aktif diarahkan ke Beranda.
- Menyediakan navigasi ke bagian fitur/cara masuk dan tombol menuju Login, termasuk menu seluler yang mendukung Escape dan fokus keyboard.
- Menampilkan tiga tenggat terdekat dari data lokal, dengan hitung mundur langsung ke pukul 23.59 WIB dan tab yang bisa dipilih dengan klik atau tombol panah keyboard.
- Menghitung status tenggat dari tanggal saat ini, rata-rata progres dan total SKS dari `courses.json`, serta menandai tanggal tugas di kalender bulan berjalan.
- Menyajikan agenda kelas/tenggat pekan berjalan, tiga pengumuman, ringkasan mata kuliah untuk layar kecil, panduan masuk, dan FAQ.
- Mendukung tema terang/gelap yang mengikuti preferensi perangkat dan dapat diubah manual; pilihan manual disimpan di `localStorage`.
- Animasi kemunculan, count-up, transisi tab, dan gerak saat gulir menghormati preferensi `prefers-reduced-motion`.
- Gambar pada landing page berupa fragmen antarmuka LearnEase berbasis HTML; tidak ada foto kampus atau video yang digunakan.

### Splash

- Halaman Splash masih ada sebagai komponen terpisah, tetapi tidak lagi dipasang pada route `/` setelah landing page publik ditambahkan.

### Login

- Memvalidasi kolom ID dan kata sandi, termasuk panjang minimal kata sandi enam karakter.
- Menyediakan toggle tampil/sembunyikan kata sandi.
- Menampilkan status proses saat login dan pesan validasi dalam bahasa Indonesia.
- Panel bantuan dapat dibuka dan ditutup.

### Beranda

- Menampilkan sapaan berdasarkan profil pengguna.
- Menghitung jumlah tenggat yang belum lewat, jumlah jadwal hari ini, dan jumlah mata kuliah dengan progres di bawah 100%.
- Menampilkan pengumuman, kalender bulan berjalan dengan tanggal hari ini ditandai, dan daftar tenggat.
- Menampilkan hingga tiga mata kuliah aktif dengan progres tertinggi untuk dilanjutkan.
- Tautan dari kartu mata kuliah membuka detail mata kuliah terkait; tautan daftar membuka `/mata-kuliah`.

### Mata Kuliah Saya

- Menampilkan ringkasan jumlah mata kuliah, total SKS, rata-rata progres, program studi, semester, dan kelas dari data pengguna/mata kuliah.
- Menyediakan pencarian berdasarkan kode, nama mata kuliah, atau nama dosen.
- Menyediakan tab Semua/Sedang dipelajari/Selesai dengan jumlah dinamis dan pengurutan nama A–Z/Z–A. Filter semester hanya tampil bila ada lebih dari satu semester.
- Pencarian dari Navbar membuka daftar mata kuliah dengan kata kunci pada parameter `q`.
- Dapat mengubah tampilan daftar antara grid dan list.
- Kartu mata kuliah menampilkan dosen, progres, materi berikutnya atau status selesai, dan tautan ke halaman detail.

### Detail Mata Kuliah

- Mengambil data mata kuliah berdasarkan `:id` dari `courses.json`.
- Menampilkan breadcrumb, informasi mata kuliah, progres, dan hitungan aktivitas jika rincian pertemuan tersedia.
- Menyediakan tab Materi pembelajaran, Tugas, dan Forum diskusi.
- Menampilkan rincian pertemuan, materi, tugas, dan kuis untuk keenam mata kuliah dalam accordion, beserta kartu informasi dosen dan tenggat.
- Jumlah aktivitas yang selesai pada data pertemuan diselaraskan dengan progres pada `courses.json`; empty state tetap tersedia bila data pertemuan tidak ada.

### Dasbor

- Menghitung rata-rata progres, total SKS, jumlah mata kuliah selesai, dan tugas belum selesai dari data yang tersedia.
- Menampilkan seluruh mata kuliah menurut progres tertinggi ke terendah; setiap entri dapat membuka detail mata kuliah.
- Menampilkan persentase tugas selesai dan belum selesai per mata kuliah, serta merekomendasikan mata kuliah aktif dengan progres terendah.
- Menampilkan progres pertemuan yang selesai dari total pertemuan MI2301 dan tautan menuju detailnya.

## 8. Keterbatasan Saat Ini

- Belum ada backend, database, atau permintaan data API; `src/services/api.js` masih berupa file kosong.
- Login hanya simulasi sisi klien. ID yang tidak kosong dan kata sandi minimal enam karakter diterima, tanpa pencocokan akun atau verifikasi server.
- Data progres dan status aktivitas tidak diperbarui melalui server atau penyimpanan permanen sebagai catatan belajar pengguna.
- Data pertemuan, materi, dan tugas merupakan data contoh statis; status aktivitas tidak tersimpan sebagai catatan belajar pengguna.
- Tombol Unduh, Kirim Tugas, dan Mulai Kuis merupakan elemen antarmuka; belum terhubung ke file materi, pengumpulan tugas, atau sistem kuis.
- Fitur pemulihan kata sandi, panduan penggunaan, dan pusat bantuan belum tersedia; kontrolnya ditandai nonaktif.
- Pencarian Navbar hanya mencari mata kuliah melalui kode, nama, dan dosen; pencarian materi dan notifikasi belum tersedia.
- Landing page menampilkan antarmuka dan data prototipe yang sama; tombol masuk mengarah ke form Login yang belum terhubung dengan autentikasi server.
- Landing page belum memakai foto kampus atau video; pencarian aset berlisensi tidak menemukan foto POLSRI yang sesuai, dan foto landmark Palembang tidak digunakan agar tidak terkesan sebagai foto kampus.
- Tenggat ditampilkan menggunakan data lokal dan label relatif tanggal dihitung dari tanggal/waktu perangkat.
- Rute halaman 404 bersifat publik; tombol kembali mengarah ke Beranda saat login dan ke Login bila belum login.

## 9. Menjalankan Proyek Secara Lokal

Pastikan Node.js dan npm sudah tersedia. Versi Node.js minimum tidak dinyatakan di `package.json`.

1. Buka terminal di direktori root proyek.
2. Pasang dependency:

   ```bash
   npm install
   ```

3. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

   Buka alamat lokal yang ditampilkan Vite di terminal.

4. Buat build produksi:

   ```bash
   npm run build
   ```

5. Untuk menjalankan pratinjau build lokal, tersedia script:

   ```bash
   npm run preview
   ```

Script yang tersedia pada `package.json` adalah `dev`, `build`, dan `preview`; tidak ada script `test` atau `lint` yang didefinisikan.
