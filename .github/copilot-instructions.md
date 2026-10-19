# Proyek: LearnEase LMS POLSRI

Website LMS (Learning Management System) untuk Politeknik Negeri Sriwijaya.
Seluruh teks antarmuka WAJIB berbahasa Indonesia. Nama kode, variabel, dan komponen memakai bahasa Inggris.

## Stack

- React 18 + Vite (JavaScript, bukan TypeScript)
- Tailwind CSS (utility classes, tanpa CSS terpisah kecuali index.css)
- React Router v6
- lucide-react untuk ikon
- motion untuk animasi pendukung (Notch, TracingBeam)
- Font: Plus Jakarta Sans (Google Fonts), weight 400/500/600/700

## Referensi desain

Desain ada di folder /design (Intro Splash.svg, Login.svg, Beranda.svg, Mata Kuliah Saya.svg, Detail Mata Kuliah.svg).
Ukuran artboard desktop 1440px. Ikuti desain setepat mungkin: layout, jarak, urutan elemen, dan teks.
Jangan mengubah teks atau menambah fitur yang tidak ada di desain.

## Design tokens (daftarkan di tailwind.config.js)

- primary: #0056B3
- primary-dark: #003D82
- primary-soft: #EDF5FF
- accent (kuning): #FFC107
- background halaman: #F8F9FA
- teks utama: #1F2937
- teks sekunder: #6B7280
- border: #E5E7EB
- success: #16A34A (badge: bg #DCFCE7, teks #166534)
- danger: #DC2626 (badge: bg #FEE2E2, teks #B91C1C)
- warning badge: bg #FFF8DF, teks #8A6100
  Gaya: card putih, border 1px #E5E7EB, radius 12px, shadow sangat halus. Kartu mata kuliah punya border kiri kuning (accent) 4px.

## Struktur folder (sudah ada, ikuti persis)

src/
assets/ gedung-polsri-hd.webp
components/
ui/ Button, Card, Badge, ProgressBar, StatCard, Tabs, Accordion, PolsriLogo
layout/ Navbar, Footer, Breadcrumb, MainLayout
home/ WelcomeBanner, AnnouncementCard, CalendarWidget, DeadlineList, ContinueLearningCard
course/ CourseCard, CourseFilterBar, CourseSummaryBar, CourseHeader, MeetingAccordion,
ActivityItem, QuizCard, NextDeadlineCard, LecturerCard, MobileCourseTabs
aceternity/ Notch, TracingBeam
pages/ LoginPage, HomePage, DashboardPage, MyCoursesPage, CourseDetailPage, NotFoundPage
routes/ AppRouter, ProtectedRoute
context/ AuthContext
data/ user.json, courses.json, meetings.json, announcements.json, deadlines.json
services/ authService.js, courseService.js, homeService.js
hooks/ useAuth.js, useCourses.js, useHomeData.js
utils/ formatDate.js, courseStatus.js
styles/ index.css, notch.css, tracing-beam.css

## Routing

/ (redirect ke /login)
/login (halaman Login)
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

- Kode MI2301 = Pemrograman Web (Dwi Lestari, S.Kom., M.Kom.). Halaman Detail Mata Kuliah memakai data mata kuliah yang sama, bukan judul lain.
- Kalender di Beranda harus dinamis (berdasarkan tanggal hari ini), bukan statis.
- "Mata kuliah aktif" = mata kuliah dengan progres di bawah 100%. Hitung dari data, jangan hardcode angka.
- Rata-rata progres dan total SKS dihitung dari courses.json.

## Skill tambahan

Jika folder /skills/ui-ux-pro-max tersedia, baca SKILL.md di dalamnya dan gunakan sebagai
referensi tambahan untuk komponen visual (spacing, warna, pola kartu), dengan design tokens
dan struktur proyek di instruksi ini tetap sebagai prioritas utama.
