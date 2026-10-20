# Dokumentasi Teknis LearnEase LMS POLSRI

## 1. Deskripsi Proyek

**LearnEase LMS POLSRI** adalah aplikasi antarmuka Learning Management System (LMS) untuk Politeknik Negeri Sriwijaya. Aplikasi ini ditujukan bagi mahasiswa untuk melihat informasi pembelajaran, progres mata kuliah, jadwal hari ini, pengumuman kampus, dan tenggat tugas.

Saat ini aplikasi merupakan prototipe sisi klien. Akun dan materi yang ditampilkan menggunakan data lokal, belum menggunakan backend atau basis data.

## 2. Teknologi yang Digunakan

Versi di bawah mengikuti rentang versi yang tercantum di `package.json`. Tanda `^` berarti pengelola paket dapat memilih pembaruan minor atau patch yang kompatibel saat memasang dependency. Versi Node.js tidak ditetapkan di `package.json`.

### Bahasa pemrograman

| Teknologi | Versi | Fungsi |
|---|---|---|
| JavaScript (ES Modules dan JSX) | Tidak ditetapkan di `package.json` | Digunakan untuk logika aplikasi, komponen React, dan tampilan. |
| JSON | — | Menyimpan data contoh pengguna, mata kuliah, jadwal, pertemuan, pengumuman, dan tenggat. |

### Framework dan library utama

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| React | `^18.3.1` | Membuat antarmuka dari komponen yang dapat digunakan kembali. |
| React DOM | `^18.3.1` | Menampilkan komponen React ke halaman web. |
| Vite | `^6.0.7` | Menjalankan server pengembangan dan membangun aplikasi untuk produksi. |
| `@vitejs/plugin-react` | `^4.3.4` | Mengaktifkan dukungan React pada Vite. |
| React Router DOM | `^6.30.1` | Mengatur perpindahan halaman dan rute aplikasi tanpa pemuatan ulang penuh. |
| `next-themes` | `^0.4.6` | Menyediakan mode terang/gelap: `ThemeProvider` membungkus aplikasi di `App.jsx` dan `ThemeToggle` di navbar berpindah tema. |

### Styling

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| Tailwind CSS | `^3.4.17` | Menyusun tampilan dengan kelas utility CSS; `darkMode: 'class'`. |
| Plus Jakarta Sans | Tidak tercantum sebagai paket | Satu keluarga font untuk antarmuka dan halaman login; dimuat dari Google Fonts dengan `display=swap`. |
| Bricolage Grotesque | Tidak tercantum sebagai paket | Font display untuk judul dan kutipan pada halaman login; dimuat dari Google Fonts dengan `display=swap`. |

### Ikon

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| `lucide-react` | `^0.468.0` | Menyediakan ikon SVG sebagai komponen React. |

### Animasi dan tema

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| `motion` | `^14.4.0` | Menggerakkan komponen `Notch` (navigasi seluler pada navbar). |
| `next-themes` | `^0.4.6` | Mengelola mode terang/gelap (lihat bagian "Tema terang/gelap" di bawah). |

### Tools pengembangan

| Teknologi | Versi di `package.json` | Fungsi |
|---|---:|---|
| PostCSS | `^8.4.49` | Memproses CSS; konfigurasi proyek menggunakannya bersama Tailwind. |
| Autoprefixer | `^10.4.20` | Menambahkan prefix CSS yang diperlukan agar aturan CSS lebih kompatibel dengan browser. |

ESLint tidak tercantum sebagai dependency atau script dalam `package.json` yang diperiksa. Proyek menggunakan konfigurasi Vite di `vite.config.js` dan konfigurasi PostCSS di `postcss.config.js`.

### Tema terang/gelap

- Tema dikelola `next-themes`: `ThemeProvider` di `App.jsx` memakai `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`, dan `disableTransitionOnChange` agar pergantian tema tidak menampilkan transisi berjalan.
- Tema aktif disimpan di `localStorage` (kunci `theme`); pelanggan yang membuka ulang aplikasi mendapatkan tema terakhir yang dipilih.
- Tombol pengalih tema (`ThemeToggle`) tersedia di navbar desktop dan navbar seluler pada halaman-halaman yang dilindungi.
- Seluruh warna bersumber dari CSS variables di `src/styles/tokens.css` yang mendefinisikan palet terang (`:root`) dan gelap (`html.dark`); `src/styles/index.css` mengimpor token tersebut dan menerapkannya ke `body`. `tailwind.config.js` memetakan setiap token menjadi kelas utility (mis. `bg-background`, `text-main`, `border-border`).
- Pergantian tema menghormati `prefers-reduced-motion: reduce`: aturan global di `src/styles/index.css` mematikan transisi dan animasi ketika pengguna meminta pengurangan gerakan.

## 3. Struktur Folder Proyek

Pohon berikut berasal dari pemindaian file aktual di `src/` (serta folder `tests/` dan `scripts/` di root).

```text
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── aceternity/
│   │   └── Notch.jsx
│   ├── course/
│   │   ├── ActivityItem.jsx
│   │   ├── CourseCard.jsx
│   │   ├── CourseFilterBar.jsx
│   │   ├── CourseHeader.jsx
│   │   ├── CourseSummaryBar.jsx
│   │   ├── LecturerCard.jsx
│   │   ├── MeetingAccordion.jsx
│   │   ├── MobileCourseTabs.jsx
│   │   ├── NextDeadlineCard.jsx
│   │   └── QuizCard.jsx
│   ├── home/
│   │   ├── AnnouncementCard.jsx
│   │   ├── CalendarWidget.jsx
│   │   ├── ContinueLearningCard.jsx
│   │   ├── DeadlineList.jsx
│   │   └── ContinueLearningCard.jsx
│   ├── layout/
│   │   ├── Breadcrumb.jsx
│   │   ├── Footer.jsx
│   │   ├── MainLayout.jsx
│   │   └── Navbar.jsx
│   ├── schedule/
│   │   └── TodaySchedule.jsx
│   └── ui/
│       ├── Accordion.jsx
│       ├── Badge.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── FlowCanvas.jsx
│       ├── PolsriLogo.jsx
│       ├── ProgressBar.jsx
│       ├── StatCard.jsx
│       ├── StatusChip.jsx
│       ├── Tabs.jsx
│       └── ThemeToggle.jsx
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
│   └── useHomeData.js
├── pages/
│   ├── CourseDetailPage.jsx
│   ├── DashboardPage.jsx
│   ├── GuidePage.jsx
│   ├── HomePage.jsx
│   ├── LoginPage.css
│   ├── LoginPage.jsx
│   ├── MyCoursesPage.jsx
│   └── NotFoundPage.jsx
├── routes/
│   ├── AppRouter.jsx
│   └── ProtectedRoute.jsx
├── services/
│   ├── authService.js
│   ├── courseService.js
│   └── homeService.js
├── styles/
│   ├── index.css
│   ├── notch.css
│   └── tokens.css
└── utils/
    ├── courseStatus.js
    ├── due.js
    ├── formatDate.js
    ├── progress.js
    └── schedule.js
tests/
├── due.test.js
├── progress.test.js
├── schedule.test.js
└── tokens.test.js
scripts/
└── verify-pages.mjs
```

Fungsi folder utama:

| Folder | Fungsi |
|---|---|
| `components/ui/` | Komponen antarmuka umum seperti tombol, kartu, badge, tab, progress bar, chip status (`StatusChip`), pengalih tema (`ThemeToggle`), dan latar partikel animasi halaman login (`FlowCanvas`). |
| `components/layout/` | Kerangka dan navigasi halaman aplikasi yang memerlukan login. |
| `components/home/` | Komponen khusus Beranda, seperti kartu pengumuman, kalender, dan daftar tenggat. |
| `components/schedule/` | Komponen jadwal: `TodaySchedule` menampilkan agenda kelas hari ini di Beranda. |
| `components/course/` | Komponen daftar mata kuliah dan detail aktivitas/pertemuan pembelajaran. |
| `components/aceternity/` | Komponen animasi pendukung: notch navigasi seluler pada navbar. |
| `pages/` | Komponen halaman yang dipasang pada rute aplikasi. |
| `routes/` | Pemetaan rute dan pemeriksaan akses untuk halaman yang memerlukan login. |
| `context/` | State autentikasi bersama yang dapat digunakan komponen aplikasi. |
| `data/` | File JSON statis yang menjadi sumber data prototipe. |
| `services/` | Fungsi akses data dan simulasi autentikasi. |
| `hooks/` | Hook React untuk mengambil state autentikasi dan data layanan. |
| `utils/` | Fungsi murni tanpa React/DOM: jadwal (`schedule.js`), progres dari aktivitas (`progress.js`), status/deadline tenggat (`due.js`), status mata kuliah (`courseStatus.js`), dan format tanggal (`formatDate.js`). |
| `styles/` | Token tema (`tokens.css`), CSS global (`index.css`), dan gaya komponen animasi (`notch.css`). |
| `tests/` | Pengujian unit fungsi murni dengan runner bawaan Node (`node --test`). |
| `scripts/` | `verify-pages.mjs`, pemeriksa halaman otomatis di Chrome headless (lihat bagian 9). |

## 4. Halaman dan Routing

| Path | Halaman | Deskripsi | Perlindungan |
|---|---|---|---|
| `/` | Pengalihan ke Login | Mengarahkan langsung ke `/login`; halaman Login meneruskan pengguna dengan sesi aktif ke `/beranda`. | Tidak |
| `/login` | Login | Form login prototipe dengan tema kosmik tersendiri serta tautan "Bantuan login" ke `/panduan`. | Tidak |
| `/panduan` | Panduan Penggunaan | Panduan publik untuk pengguna: cara masuk, lupa kata sandi, Beranda, mengikuti kelas, enrollment key, dan kontak bantuan. | Tidak |
| `/beranda` | Beranda | Ringkasan pembelajaran: agenda "Jadwal hari ini", pengumuman, kalender, tenggat, dan mata kuliah untuk dilanjutkan. | Ya |
| `/dasbor` | Dasbor | Statistik progres belajar, progres per mata kuliah, tugas belum selesai, dan progres belajar satu mata kuliah contoh. | Ya |
| `/mata-kuliah` | Mata Kuliah Saya | Ringkasan, pencarian, filter, pengurutan, dan daftar mata kuliah. | Ya |
| `/mata-kuliah/:id` | Detail Mata Kuliah | Informasi mata kuliah, jadwal kelas berikutnya, pertemuan, aktivitas, dan sidebar pembelajaran. | Ya |
| `*` | Halaman tidak ditemukan | Pesan 404 dan tautan kembali ke Beranda saat login, atau ke Login bila belum masuk. | Tidak |

Route yang dilindungi menggunakan `ProtectedRoute`; pengguna yang belum login diarahkan ke `/login`. Halaman-halaman utama yang dilindungi dirender di dalam `MainLayout`, sedangkan halaman login memakai layoutnya sendiri dengan `LoginPage.css` dan halaman panduan berdiri sendiri tanpa `MainLayout`.
Route `/` hanya mengalihkan ke `/login`; halaman Login yang mengarahkan pengguna dengan sesi aktif ke `/beranda`.

## 5. Alur Autentikasi

Autentikasi saat ini merupakan simulasi lokal:

1. Form login meminta identitas berbentuk **NIP, NPH atau NPM** (NIP/NPH untuk dosen/pegawai, NPM untuk mahasiswa) dan kata sandi. Identitas harus terisi, sedangkan kata sandi minimal enam karakter.
2. `authService.js` menunggu sekitar 700 ms, lalu menganggap input yang memenuhi validasi sebagai login berhasil. Nilai ID tidak dicocokkan dengan akun tertentu.
3. Profil pengguna yang dikembalikan berasal dari `src/data/user.json`; saat ini datanya atas nama Rizky Pratama, dengan ID sesi diambil dari identitas yang diketik.
4. Penanda sesi disimpan di `sessionStorage` dengan kunci `learnease_session`. Saat tab berpindah (event `pageshow`), status login dibaca ulang; membuka ulang LearnEase di tab yang sama tetap masuk ke Beranda.
5. Fungsi Keluar menghapus kunci sesi dan mengarahkan pengguna ke halaman login.

Login belum memverifikasi kredensial ke server, dan mekanisme ini **bukan autentikasi backend yang aman untuk penggunaan produksi**.

## 6. Sumber Data

Data halaman saat ini diimpor dari file JSON statis di `src/data/`, bukan diambil dari database atau API. Data mengikuti jadwal riil mahasiswa contoh.

| File | Isi |
|---|---|
| `user.json` | Profil contoh pengguna: Rizky Pratama, program Manajemen Informatika, semester 8, kelas DIPLOMA IV - 5MIM, total 21 SKS. |
| `courses.json` | Sebelas mata kuliah program DIPLOMA IV - 5MIM (total 21 SKS), masing-masing dengan dosen, SKS, deskripsi, materi berikutnya, program, semester, kelas, dan jumlah unit (`unitsCount`). |
| `meetings.json` | Satu daftar `schedule` berisi 13 pertemuan mingguan (kode hari, jam mulai–selesai WIB, ruangan) untuk seluruh mata kuliah, ditambah rincian unit per mata kuliah (30 unit) yang memuat aktivitas materi/diskusi/kuis dengan tanda `completed`. |
| `announcements.json` | Tiga pengumuman kampus: akademik, beasiswa, dan kegiatan, masing-masing dengan tanggal dan deskripsi. |
| `deadlines.json` | Empat tenggat pada satu daftar bersama yang dipakai oleh Beranda dan Dasbor; setiap entri memiliki `dueInDays` relatif terhadap hari ini dan status, sehingga data demo tidak pernah seluruhnya lewat. |

Progres mata kuliah **tidak disimpan di `courses.json`**: `progress.js` menghitungnya dari aktivitas yang bertanda `completed` pada unit di `meetings.json` (`computeCourseProgress`), dan `courseStatus.js` merangkumnya menjadi jumlah mata kuliah, SKS, mata kuliah aktif/selesai, serta rata-rata progres (`getCourseStats`, memakai `averageProgress`). Jadwal kelas berikutnya per mata kuliah dihitung oleh `schedule.js` (`getNextSlot`) dari daftar jadwal yang sama, dan warna/label chip tenggat diturunkan oleh `due.js` (`chipStatus`, `dueLabel`). `courseService.js` dan `homeService.js` membaca data lokal tersebut, dan hook `useCourses` serta `useHomeData` menyediakan data untuk halaman React.

## 7. Fitur yang Sudah Berfungsi

### Login

- Memvalidasi kolom identitas (NIP / NPH / NPM) dan kata sandi, termasuk panjang minimal kata sandi enam karakter.
- Menyediakan toggle tampil/sembunyikan kata sandi.
- Menampilkan status proses saat login dan pesan validasi dalam bahasa Indonesia.
- Tautan "Bantuan login" membuka halaman `/panduan`; kontrol "Lupa kata sandi" menampilkan pemberitahuan bahwa fitur tersebut belum ada.
- Latar halaman memakai satu permukaan penuh: gradien navy–emas digabung dengan lapisan partikel animasi (`FlowCanvas`, `src/components/ui/FlowCanvas.jsx`) yang mengalir dari tepi kiri dan kanan menuju titik tengah halaman, tepat di belakang logo.
- Lapisan partikel digambar di atas `<canvas>` 2D tanpa library tambahan; kurvanya digambar sekali ke kanvas luar lalu ditampilkan ulang tiap frame, sehingga tidak menggambar ulang jalur tiap frame.
- Di layar lebar, identitas kampus berada di kolom kiri dan form di kolom kanan; di bawah 901 px keduanya ditumpuk dan band atas menyatu dengan halaman form.
- Animasi partikel berhenti saat tab tidak terlihat, dan `prefers-reduced-motion: reduce` menampilkan satu bingkai statis.
- Halaman login memakai tema kosmik gelapnya sendiri dan tidak terpengaruh pengalih tema.

### Tema terang/gelap

- Tema bawaan adalah terang; pengalih tema di navbar (desktop dan seluler) berpindah ke gelap dan sebaliknya.
- Tema terakhir dipilih disimpan di `localStorage` dan bertahan setelah halaman dimuat ulang.
- Semua warna halaman dilindungi (`bg-background`, `text-main`, kartu, border) mengikuti token di `src/styles/tokens.css`, sehingga seluruh halaman setelah login berganti tema serentak.
- Pergantian tema diterapkan tanpa transisi CSS, dan mode `prefers-reduced-motion` tetap dihormati.

### Beranda

- Menampilkan sapaan berdasarkan profil pengguna, lengkap dengan tanggal hari ini (format Indonesia, zona WIB) dan ringkasan jadwal ("N kelas hari ini · berikutnya <hari> <jam> · <ruang>", atau "Tidak ada kelas hari ini"). Hari selalu disertakan agar kelas berikutnya tidak disangka hari ini.
- Menampilkan blok "Jadwal hari ini" (`TodaySchedule`): daftar pertemuan hari ini diurutkan dari jam, masing-masing dengan rentang waktu, nama mata kuliah, dosen, ruangan terpendek, chip status (`StatusChip`: Akan datang/Berlangsung/Selesai/Mendesak), dan tautan baris ke `/mata-kuliah/<id>`; pertemuan yang sudah selesai mendapat tautan lanjut ke materi berikutnya. Bila tidak ada kelas, blok menampilkan "Tidak ada kelas hari ini" beserta jadwal kelas berikutnya.
- Agenda dihitung oleh `schedule.js` (`buildAgenda`) dalam zona waktu Asia/Jakarta (WIB) dari daftar 13 pertemuan mingguan di `meetings.json`, dan disegarkan tiap menit agar status sesi yang mulai/berakhir ikut berubah.
- Menampilkan "Tenggat terdekat" (chip dan label relatif dari `due.js`) dan "Pengumuman Kampus".
- Menampilkan tiga mata kuliah aktif dengan progres tertinggi pada bagian "Lanjutkan belajar", masing-masing dengan jadwal kelas berikutnya (`getNextSlot`), ditautkan ke detail mata kuliahnya; tautan "Lihat semua mata kuliah" membuka `/mata-kuliah`.
- Kalender bulan berjalan (`CalendarWidget`) menandai tanggal hari ini serta titik-titik agenda deadline dan pertemuan.

### Mata Kuliah Saya

- Menampilkan ringkasan jumlah mata kuliah, total SKS, rata-rata progres, program studi, semester, dan kelas dari data pengguna/mata kuliah.
- Menyediakan pencarian berdasarkan nama mata kuliah atau nama dosen.
- Menyediakan pilihan status Semua/Sedang dipelajari/Selesai dengan jumlah dinamis serta pengurutan nama A–Z/Z–A. Tidak ada filter semester.
- Pencarian dari Navbar membuka daftar mata kuliah dengan kata kunci pada parameter `q`; kolom pencarian halaman memakai nilai itu dan menulis kembali perubahan kata kunci ke URL.
- Dapat mengubah tampilan daftar antara grid dan list.
- Kartu mata kuliah menampilkan dosen, progres (dari aktivitas selesai), jadwal kelas berikutnya atau status selesai, materi berikutnya, dan tautan ke halaman detail.

### Detail Mata Kuliah

- Mengambil data mata kuliah berdasarkan `:id` dari `courses.json` dan menyelaraskan unit/aktivitasnya dari `meetings.json`.
- Menampilkan breadcrumb, informasi mata kuliah, jadwal kelas berikutnya (`slotLabel`/`slotSentence` dari `schedule.js`), progres, dan hitungan aktivitas.
- Menyediakan tab Materi pembelajaran, Tugas, dan Forum diskusi.
- Menampilkan rincian unit (30 unit di seluruh mata kuliah) dalam accordion, beserta kartu informasi dosen dan tenggat.
- Jumlah aktivitas yang selesai menentukan progres pada kartu; empty state tetap tersedia bila unit tidak ada.

### Dasbor

- Menghitung rata-rata progres, total SKS, jumlah mata kuliah selesai, dan tugas belum selesai dari data yang tersedia.
- Menampilkan seluruh mata kuliah menurut progres tertinggi ke terendah; setiap entri menampilkan semester/SKS dan dapat membuka detail mata kuliah.
- Menampilkan tenggat dari daftar bersama dengan chip status `StatusChip` + `chipStatus`, lalu blok progres belajar mata kuliah Perbankan yang dihitung dari aktivitas selesai (angka yang sama dengan halaman detailnya).

### Panduan Penggunaan (`/panduan`)

- Halaman publik tanpa login yang menjelaskan cara masuk, lupa kata sandi, cara membaca Beranda (termasuk agenda jadwal hari ini), mengikuti kelas, enrollment key, dan kontak bantuan.
- Dibuka dari tautan "Bantuan login" pada halaman Login dan "Panduan Penggunaan" pada footer.

## 8. Keterbatasan Saat Ini

- Belum ada backend, database, atau permintaan data API; seluruh data berasal dari file JSON lokal.
- Login hanya simulasi sisi klien. Identitas (NIP/NPH/NPM) yang tidak kosong dan kata sandi minimal enam karakter diterima, tanpa pencocokan akun atau verifikasi server.
- Status progres diturunkan dari tanda `completed` pada data statis dan tidak diperbarui melalui server atau penyimpanan permanen sebagai catatan belajar pengguna.
- Data unit, materi, dan tugas merupakan data contoh statis; aktivitas tidak tersimpan sebagai catatan belajar pengguna.
- Tombol aksi aktivitas (Kerjakan/Tinjau Tugas, Buka Materi, Masuk Diskusi, Mulai Kuis) ditampilkan nonaktif dengan catatan "Belum tersedia"; belum terhubung ke file materi, pengumpulan tugas, atau sistem kuis.
- Fitur pemulihan kata sandi dan pusat bantuan belum tersedia; kontrolnya ditandai nonaktif ("Pusat bantuan" di footer).
- Pencarian Navbar meneruskan kata kunci ke pencarian halaman Mata Kuliah Saya (nama mata kuliah dan dosen); pencarian materi dan notifikasi belum tersedia.
- Tenggat ditampilkan menggunakan data lokal dengan tanggal relatif (`dueInDays`) dari hari ini; label relatif dihitung dari tanggal/waktu perangkat.
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

6. Jalankan pengujian unit fungsi murni (jadwal, progres, tenggat, token):

   ```bash
   npm test
   ```

7. Jalankan verifikasi halaman di Chrome headless (wajib build + preview di port 4173 terlebih dahulu):

   ```bash
   npm run verify -- --routes /login,/panduan,/beranda,/dasbor,/mata-kuliah --theme light,dark --out screenshots
   ```

   Opsi yang tersedia: `--routes` (daftar rute), `--theme` (`light`, `dark`, atau keduanya), `--width` (lebar emulasi, bawaan 1440), `--out` (folder screenshot), `--reduced-motion`, dan `--theme-switch`. Tiap rute×tema diperiksa untuk overflow horizontal, error console, request gagal, gambar rusak, teks di bawah 13px, fokus tanpa cincin, rute yang benar, dan tema yang benar berdasarkan screenshot. Screenshot ditulis ke folder `--out` (di-ignore `.gitignore`).

Script yang tersedia pada `package.json` adalah `dev`, `build`, `preview`, `test`, dan `verify`; tidak ada script `lint` yang didefinisikan.
