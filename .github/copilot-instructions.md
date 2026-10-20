# Proyek: LearnEase LMS POLSRI

Website LMS (Learning Management System) untuk Politeknik Negeri Sriwijaya.
Seluruh teks antarmuka WAJIB berbahasa Indonesia. Nama kode, variabel, dan komponen memakai bahasa Inggris.

## Stack

- React 18 + Vite (JavaScript, bukan TypeScript)
- Tailwind CSS (utility classes, tanpa CSS terpisah kecuali index.css)
- React Router v6
- lucide-react untuk ikon
- next-themes untuk tema terang/gelap (default light, toggle di navbar, disimpan di localStorage)
- motion untuk animasi pendukung (Notch)
- Font: Plus Jakarta Sans (Google Fonts), weight 400/500/600/700

## Referensi desain

Desain ada di folder /design (Intro Splash.svg, Login.svg, Beranda.svg, Mata Kuliah Saya.svg, Detail Mata Kuliah.svg).
Ukuran artboard desktop 1440px. Ikuti desain setepat mungkin: layout, jarak, urutan elemen, dan teks.
Jangan mengubah teks atau menambah fitur yang tidak ada di desain.

## Design tokens (sumber: src/styles/tokens.css)

Palet terang dan gelap didefinisikan sebagai CSS variables di `src/styles/tokens.css`
(`:root` terang, `html.dark` gelap; `tailwind.config.js` memetakannya: primary,
primary-soft, on-primary, accent, background, surface-2, surface-3, main, secondary,
border, success, danger, warning/neutral badge, radius `card`, shadow `card`).

Aturan warna (wajib di components/ dan pages/):

- Semua warna lewat token di atas; JANGAN pakai kelas palet literal (`bg-white`, `gray-*`, dsb).
- Modifier opacity Tailwind (`/50`, `/70`, …) TIDAK bekerja dengan warna berbasis
  `var()` — jangan pakai. Untuk warna transparan dari token, pakai `color-mix()`
  sebagai arbitrary value, contohnya seperti di `src/components/ui/StatusChip.jsx`.
- Kartu: `rounded-card border border-border bg-background` (tema gelap menambah
  `dark:shadow-card` bila perlu delineation).

## Struktur folder (sudah ada, ikuti persis)

src/
components/
ui/ Button, Card, Badge, ProgressBar, StatCard, Tabs, Accordion, PolsriLogo, FlowCanvas, StatusChip, ThemeToggle
layout/ Navbar, Footer, Breadcrumb, MainLayout
home/ AnnouncementCard, CalendarWidget, DeadlineList, ContinueLearningCard
schedule/ TodaySchedule
course/ CourseCard, CourseFilterBar, CourseSummaryBar, CourseHeader, MeetingAccordion,
ActivityItem, QuizCard, NextDeadlineCard, LecturerCard, MobileCourseTabs
aceternity/ Notch
pages/ LoginPage, HomePage, DashboardPage, MyCoursesPage, CourseDetailPage, GuidePage, NotFoundPage
routes/ AppRouter, ProtectedRoute
context/ AuthContext
data/ user.json, courses.json, meetings.json, announcements.json, deadlines.json
services/ authService.js, courseService.js, homeService.js
hooks/ useAuth.js, useCourses.js, useHomeData.js
utils/ formatDate.js, courseStatus.js, schedule.js, progress.js, due.js
styles/ index.css, tokens.css, notch.css

tests/ due.test.js, progress.test.js, schedule.test.js, tokens.test.js (node --test)
scripts/ verify-pages.mjs (verifikasi halaman di Chrome headless, lihat bagian bawah)

## Routing

/ (redirect ke /login)
/login (halaman Login, bertaut "Bantuan login" ke /panduan)
/panduan (GuidePage, publik tanpa layout)
/beranda, /dasbor, /mata-kuliah, /mata-kuliah/:id (MainLayout, dilindungi ProtectedRoute)

- (NotFoundPage)

## Aturan kode

- Satu komponen per file, functional component, default export.
- Komponen di ui/ harus generik dan reusable (terima props, tanpa data hardcode).
- Data tidak boleh di-hardcode di komponen. Ambil dari src/data/\*.json lewat services/ dan hooks/.
- Jangan pernah pakai localStorage untuk hal selain token login/sesi sederhana.
- Semua tombol dan input harus punya state hover, focus, dan disabled.
- Gunakan elemen semantik dan atribut aksesibilitas (aria-label pada tombol ikon, label pada input).
- Layout harus responsif: desktop 1440 sebagai acuan, lalu tablet dan mobile
  (grid 3 kolom menjadi 2 lalu 1, navbar menjadi hamburger, sidebar kanan turun ke bawah konten).
- Kerjakan bertahap sesuai instruksi, jangan membuat file di luar struktur di atas.

## Konsistensi data (penting)

- Data mengikuti jadwal riil mahasiswa contoh: 11 mata kuliah DIPLOMA IV - 5MIM (21 SKS) di courses.json, 13 pertemuan mingguan di schedule pada meetings.json, dan tenggat di satu daftar deadlines.json yang dipakai bersama Beranda dan Dasbor. Halaman Detail Mata Kuliah memakai data mata kuliah yang sama, bukan judul lain.
- Progres mata kuliah dihitung dari aktivitas bertanda `completed` di meetings.json (via utils/progress.js), bukan angka yang disimpan di data.
- Jadwal hari ini dan slot kelas berikutnya dihitung oleh utils/schedule.js dalam zona Asia/Jakarta (WIB).
- Kalender di Beranda harus dinamis (berdasarkan tanggal hari ini), bukan statis.
- "Mata kuliah aktif" = mata kuliah dengan progres di bawah 100%. Hitung dari data, jangan hardcode angka.
- Rata-rata progres dan total SKS dihitung dari courses.json/meetings.json.

## Skill tambahan

Jika folder /skills/ui-ux-pro-max tersedia, baca SKILL.md di dalamnya dan gunakan sebagai
referensi tambahan untuk komponen visual (spacing, warna, pola kartu), dengan design tokens
dan struktur proyek di instruksi ini tetap sebagai prioritas utama.
