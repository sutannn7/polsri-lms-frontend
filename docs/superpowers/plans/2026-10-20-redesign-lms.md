# Redesign Halaman LMS LearnEase + Mode Terang/Gelap — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti 4 halaman aplikasi (Beranda, Dasbor, Mata Kuliah Saya, Detail Mata Kuliah) dengan desain berbasis token warna, data jadwal nyata mahasiswa, dan mode terang/gelap yang bisa dipilih.

**Architecture:** Warna dan tipografi dialirkan lewat CSS variable (`:root` + `.dark`) yang dipetakan ke kelas Tailwind yang sudah ada (`bg-background`, `text-main`, `text-secondary`, `border-border`, `bg-primary`, …), sehingga satu kelas otomatis berlaku di kedua tema tanpa varian `dark:` per komponen. Logika murni (jadwal hari ini, status pertemuan, progres, tenggat) dipisah ke `src/utils/*.js` dan diuji dengan `node --test`; komponen hanya menampilkan. Verifikasi visual memakai skrip `scripts/verify-pages.mjs` (Chrome DevTools Protocol, tanpa dependency).

**Tech Stack:** Vite 6, React 18 (JavaScript/JSX), Tailwind CSS 3.4, `next-themes` (satu-satunya dependency baru), `lucide-react`, `motion` (dipakai Notch & TracingBeam), Node ≥ 18 (`node --test`).

**Spec:** `docs/superpowers/specs/2026-10-20-redesign-lms-design.md`

## Global Constraints

- Halaman login **tidak dirombak**; yang berubah hanya teks label: "NIP / NPM / NIK" → "NIP / NPH / NPM" (label, placeholder, pesan validasi, teks bantuan, paragraf pengantar). `LoginPage.css` tetap scoped dan tetap gelap.
- Dependency baru **hanya** `next-themes`. Tidak ada test runner, linter, atau browser-automation library yang ditambahkan.
- Semua warna lewat token CSS. Di `src/components/**` dan `src/pages/**` tidak boleh ada kelas literal `bg-white`, `text-slate-*`, `border-slate-*`, `bg-gray-*`, dan sejenisnya — hanya kelas token.
- Modifier opacity Tailwind (mis. `bg-accent/15`, `text-primary/70`) **tidak bekerja** dengan token berbentuk `var(--x)` — Tailwind tidak bisa mengabadikan raw CSS variable. Untuk warna transparan gunakan `color-mix(in srgb, var(--token) N%, transparent)`.
- `defaultTheme="light"`, `enableSystem={false}` pada `ThemeProvider`. Ikon toggle: `SunMoon` dari `lucide-react` (bukan `Moon`/`Sun`).
- Bahasa antarmuka Indonesia; tidak menambah copy baru berbahasa Inggris.
- Aksesibilitas: fokus selalu terlihat (ring 2px, offset 2px), kontras teks ≥ 4,5:1 di kedua tema, ikon dekoratif `aria-hidden`, komponen interaktif berupa `<button>`/`<a>` asli.
- Tipografi: judul halaman `h1` memakai Bricolage Grotesque weight 600, sentence case, 28–36px; judul bagian 15–16px; **tidak ada teks di bawah 13px** (kelas `text-xs`/12px tidak boleh dipakai di halaman aplikasi).
- Bentuk: radius 12px (kartu) dan 8px (tombol/input); jarak antar-bagian 32–40px; di mode terang kartu memakai garis 1px tanpa bayangan, di mode gelap garis lebih terang + bayangan sangat lembut. Tanpa gradien dekoratif, tanpa emoji, tanpa ikon di dalam judul.
- Gerak: hanya gerak masuk (fade + naik 12px, 320ms) dan hover/press (120–160ms); `prefers-reduced-motion: reduce` mematikan semuanya; tidak ada transisi antar-halaman.
- Tanggal demo tidak dipin: "hari ini" memakai jam device sungguhan, dan hari tanpa kelas menampilkan kondisi kosong yang dirancang baik.
- `prefers-reduced-motion: reduce` mematikan semua transisi dan animasi masuk.
- Data mock wajib persis mengikuti §5 dokumen spec: 13 baris jadwal (Senin–Sabtu), 11 mata kuliah, 21 SKS, kelas `DIPLOMA IV - 5MIM` / Manajemen Informatika.
- Angka (progres, jumlah tugas) dihitung dari data, tidak disimpan terpisah, supaya tidak bisa berbeda antar halaman.
- Node.js ≥ 18 diperlukan untuk `npm test` (`node --test`).
## Review Focus

1. **Hari tanpa kelas** (Minggu, atau hari yang tidak ada di jadwal) → blok agenda harus menampilkan kondisi kosong yang informatif ("Tidak ada kelas hari ini" + kelas berikutnya), bukan daftar kosong.Diuji di Task 3 (`buildAgenda` untuk hari Minggu → `kind: 'empty'`) dan Task 4 (verify).
2. **Sesi yang sedang berjalan** (sekarang di antara jam mulai dan jam selesai) → status "Berlangsung", dan barisnya tetap bisa diklik. Diuji di Task 3 (`getMeetingStatus`).
3. **Sesi yang sudah lewat** → tidak boleh hilang dari agenda; tetap tampil dengan status "Selesai" + aksi lanjutan. Diuji di Task 3 (`buildAgenda` menyertakan sesi lewat).
4. **Nama mata kuliah & ruang yang sangat panjang** (mis. "Gedung Manajemen Informatika Lantai 3 - Lab 8 (Keamanan Komputer)") → tidak boleh menimpa isi atau memotong lebih dari 2 baris; ruang ditampilkan versi singkat dengan versi penuh tersedia. Diuji di Task 3 (`shortRoom`) dan diperiksa visual di Task 4.
5. **Satu mata kuliah muncul di dua hari** (Praktikum Analisis Data, Praktikum Rekayasa Web) → kartu mata kuliah harus menampilkan slot jadwal berikutnya yang benar, bukan yang pertama diurutkan. Diuji di Task 3 (`getNextSlot`).

---

### Task 1: Lapisan token tema + alat verifikasi

**Files:**
- Create: `src/styles/tokens.css`
- Create: `scripts/verify-pages.mjs`
- Create: `tests/tokens.test.js`
- Modify: `tailwind.config.js` (tambah `darkMode: 'class'`, arahkan warna semantik ke CSS variable)
- Modify: `src/styles/index.css` (impor tokens, ambil latar & teks halaman dari token)
- Modify: `package.json` (tambah script `test` dan `verify`)

**Interfaces:**
- Consumes: — (fondasi)
- Produces:
  - CSS variable yang tersedia di `:root` dan `.dark`: `--surface`, `--surface-2`, `--surface-3`, `--border`, `--text`, `--text-muted`, `--brand`, `--brand-soft`, `--accent`, `--danger`, `--success`, plus pasangan badge: `--success-soft`, `--success-text`, `--danger-soft`, `--danger-text`, `--warning-soft`, `--warning-text`, `--neutral-soft`, `--neutral-text` (nilai persis di spec §4.1).
  - Kelas Tailwind yang memetakan ke variable itu: `bg-background` (surface), `bg-surface-2`, `bg-surface-3`, `text-main` (text), `text-secondary` (text-muted), `border-border`, `bg-primary` (brand), `bg-primary-soft` (brand-soft), `text-primary`, `text-accent`, `bg-accent`, `text-danger`, `text-success`, `border-danger`, `border-success`.
  - `npm test` → menjalankan `node --test "tests/**/*.test.js"` (bentuk glob; `node --test tests/` gagal di Node 22 Windows).
  - `npm run verify -- --routes /beranda,/dasbor --theme light,dark --out <folder>` → memeriksa tiap rute: tanpa overflow horizontal, tanpa error console, tanpa request gagal, tema yang diminta aktif di `document.documentElement.classList`, dan menulis screenshot ke `<folder>/<theme>-<rute>.png`. Exit 0 bila semua lolos.

- [ ] **Step 1: Tulis test yang gagal**

Buat `tests/tokens.test.js` (pakai `node:test` + `node:assert/strict`): baca `src/styles/tokens.css` sebagai teks, dan assert bahwa tiap nama variable dari daftar di atas muncul **minimal sekali di dalam blok `:root`** dan **minimal sekali di dalam blok `.dark`**. Tambahkan assert kedua: `tailwind.config.js` memuat `darkMode: 'class'`.

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `npm test`
Expected: FAIL — `ENOENT` untuk `src/styles/tokens.css` (file belum ada).

- [ ] **Step 3: Buat `src/styles/tokens.css`**

Isi: blok `:root` dengan nilai terang dari §4.1 spec (`--surface: #FFFFFF`, `--surface-2: #F5F7FB`, `--surface-3: #EDF1F8`, `--border: #E2E8F2`, `--text: #0F172A`, `--text-muted: #5A6782`, `--brand: #0B2A5B`, `--brand-soft: #E8EEF9`, `--accent: #FFC107`, `--danger: #D64545`, `--success: #1F9D6B`, `--success-soft: #DCFCE7`, `--success-text: #166534`, `--danger-soft: #FEE2E2`, `--danger-text: #B91C1C`, `--warning-soft: #FFF8DF`, `--warning-text: #8A6100`, `--neutral-soft: #F3F4F6`, `--neutral-text: #4B5563`) dan blok `.dark` dengan nilai gelap (`--surface: #0A1426`, `--surface-2: #101C33`, `--surface-3: #16233D`, `--border: #1E2C48`, `--text: #E9EFFA`, `--text-muted: #9FB0CC`, `--brand: #4C8DF6`, `--brand-soft: #16233D`, `--accent: #FFC107`, `--danger: #FF9BA0`, `--success: #4ADE9B`, `--success-soft: #123A2B`, `--success-text: #7EE2B8`, `--danger-soft: #3A1D20`, `--danger-text: #FFB4B4`, `--warning-soft: #3B3218`, `--warning-text: #F5D67A`, `--neutral-soft: #232B38`, `--neutral-text: #C3CBD9`). Tambahkan komentar singkat per token.

- [ ] **Step 4: Arahkan Tailwind ke variable**

Di `tailwind.config.js`, set `darkMode: 'class'` **di level atas config** (bukan di dalam `theme` — Tailwind 3 mengabaikannya di sana), dan ganti nilai warna semantik menjadi `var(--...)`: `background` → `var(--surface)`, `main` → `var(--text)`, `secondary` → `var(--text-muted)`, `border` → `var(--border)`, `primary` → `var(--brand)`, `primary-dark` → `var(--brand)`, `primary-soft` → `var(--brand-soft)`, `accent` → `var(--accent)`, `danger` → `var(--danger)`, `success` → `var(--success)`. Tambahkan key baru `surface-2` → `var(--surface-2)` dan `surface-3` → `var(--surface-3)`. Ganti `fontFamily.display` dari Plus Jakarta Sans menjadi `'Bricolage Grotesque'`.

- [ ] **Step 5: Hubungkan token ke halaman**

Di `src/styles/index.css`: tambahkan `@import './tokens.css';` di paling atas, lalu ubah `body` agar memakai `background: var(--surface)` dan `color: var(--text)` (ganti literal yang ada).

- [ ] **Step 6: Jalankan test, pastikan lulus**

Run: `npm test`
Expected: PASS (semua assert).

- [ ] **Step 7: Buat `scripts/verify-pages.mjs`**

Skrip tanpa dependency: pakai `child_process.spawn` untuk menjalankan Chrome headless dengan `--remote-debugging-port=<port> --headless=new --user-data-dir=<temp>`, ambil WebSocket URL dari `http://127.0.0.1:<port>/json/version` (Node 22 punya `WebSocket` global), lalu pakai CDP untuk: membuat tab, `Page.navigate` ke tiap rute, menunggu `Page.loadEventFired`, evaluates JS untuk (a) `document.documentElement.scrollWidth - document.documentElement.clientWidth` ≤ 1, (b) tidak ada error console (dengarkan `Runtime.consoleAPICalled` dengan type `error`), (c) `document.documentElement.classList` memuat tema yang diminta, (d) `document.querySelectorAll('img')` semuanya `complete && naturalWidth > 0`; lalu `Page.captureScreenshot` ke file PNG. Login dilakukan sekali di awal: navigasi ke `/login`, isi `#u` = `1234567890` dan `#p` = `rahasia123`, submit, tunggu sampai `location.pathname === '/beranda'`. Parse argumen CLI: `--routes` (daftar dipisah koma), `--theme` (`light`/`dark`/`light,dark`), `--out` (folder output, default `screenshots/`), `--base` (default `http://localhost:4173`), `--width` (viewport, default 1440), `--reduced-motion` (emulasi `prefers-reduced-motion: reduce` via `Emulation.setEmulatedMedia`). Tambahkan dua assert per rute: (a) tidak ada elemen di dalam `<main>` dengan computed `font-size` di bawah 13px, (b) tidak ada elemen fokus-able yang memakai `outline-none` tanpa kelas `focus-visible:ring`. Exit code 0 bila semua rute lolos, 1 bila ada yang gagal, dan cetak ringkasan per rute.

- [ ] **Step 8: Jalankan build dan alat verifikasi**

Run: `npm run build` → Expected: sukses.
Run: `npm run preview -- --port 4173 --strictPort` di terminal terpisah, lalu `npm run verify -- --routes /login --theme light --out screenshots` → Expected: exit 0 dan `screenshots/light-login.png` terbentuk.

- [ ] **Step 9: Commit**

```bash
git add src/styles/tokens.css src/styles/index.css tailwind.config.js scripts/verify-pages.mjs tests/tokens.test.js package.json
git commit -m "feat: lapisan token tema terang/gelap dan alat verifikasi halaman"
```

---

### Task 2: Mode gelap (next-themes + ThemeToggle)

**Files:**
- Create: `src/components/ui/ThemeToggle.jsx`
- Modify: `package.json` (tambah `next-themes`)
- Modify: `src/App.jsx` (bungkus dengan `ThemeProvider`)
- Modify: `src/components/layout/Navbar.jsx` (pasang toggle)
- Modify: `scripts/verify-pages.mjs` (tambah mode `--theme-switch`)

**Interfaces:**
- Consumes: kelas token dari Task 1, `ThemeProvider` dari `next-themes`.
- Produces:
  - `ThemeToggle` — komponen tanpa props. Memakai `useTheme()` dari `next-themes`; merender satu `<button type="button">` dengan ikon `SunMoon` (size 18) dari `lucide-react`, `aria-label` dinamis: "Ganti ke mode gelap" saat terang, "Ganti ke mode terang" saat gelap, dan `title` yang sama. Nilai `resolvedTheme` dibaca saat render, jadi label langsung sesuai.
  - `App.jsx` memakai `<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>` di luar `<AppRouter />`.
  - `npm run verify -- --theme-switch` → mode tambahan: klik tombol toggle, lalu assert `document.documentElement.classList.contains('dark')` (atau `light`), `localStorage.getItem('theme')` sesuai, dan `document.body` computed background berubah antara tema.

- [ ] **Step 1: Tambahkan cek yang gagal**

Di `scripts/verify-pages.mjs`, tambahkan flag `--theme-switch`: setelah halaman siap, cari `button[aria-label^="Ganti ke mode"]`; bila tidak ada → catat "tombol tema tidak ditemukan" dan gagalkan rute itu. Bila ada, klik, tunggu 400 ms, lalu assert `document.documentElement.classList` berubah dan `localStorage.getItem('theme')` sama dengan tema setelah klik.

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npm run verify -- --routes /beranda --theme-switch`
Expected: FAIL — "tombol tema tidak ditemukan".

- [ ] **Step 3: Pasang `next-themes` dan `ThemeProvider`**

Run: `npm install next-themes`
Lalu di `src/App.jsx`, bungkus isi dengan `<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>`.

- [ ] **Step 4: Buat `ThemeToggle`**

Buat `src/components/ui/ThemeToggle.jsx`: `useTheme()` → `resolvedTheme`; tombol dengan ikon `SunMoon`, `aria-label` dan `title` dinamis sesuai tema, `className` memakai kelas token (`text-secondary hover:text-main focus-visible:ring-2 focus-visible:ring-primary`), `onClick` memanggil `toggleTheme()`.

- [ ] **Step 5: Pasang di navbar**

Di `src/components/layout/Navbar.jsx`, letakkan `<ThemeToggle />` tepat sebelum menu pengguna (desktop) dan di baris atas versi mobile. Ganti kelas literal navbar (15 kelas warna) dengan kelas token.

- [ ] **Step 6: Jalankan verify, pastikan lulus**

Run: `npm run verify -- --routes /beranda --theme light,dark --theme-switch --out screenshots`
Expected: PASS; ada `screenshots/light-beranda.png` dan `screenshots/dark-beranda.png`, dan Assertions!

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/App.jsx src/components/ui/ThemeToggle.jsx src/components/layout/Navbar.jsx scripts/verify-pages.mjs
git commit -m "feat: mode gelap dengan next-themes dan tombol SunMoon"
```

---

### Task 3: Data baru + logika murni (jadwal, progres, tenggat)

**Files:**
- Replace: `src/data/courses.json`, `src/data/meetings.json`, `src/data/deadlines.json`, `src/data/user.json`
- Keep: `src/data/announcements.json` (3 pengumuman, isi tetap)
- Create: `src/utils/schedule.js`, `src/utils/progress.js`, `src/utils/due.js`
- Create: `tests/schedule.test.js`, `tests/progress.test.js`, `tests/due.test.js`

**Interfaces:**
- Consumes: — (data murni)
- Produces (nama & tanda tangan persis):
  - `src/utils/schedule.js`
    - `getScheduleForDate(schedule, date)` → array pertemuan pada `date.getDay()` (0 = Minggu), terurut mulai dari `startTime`.
    - `getMeetingStatus(meeting, now)` → `'live'` | `'done'` | `'upcoming'`. `live` bila `now` di dalam rentang[start, selesai); `done` bila `now` ≥ selesai; selain itu `upcoming`. Bandingkan jam dalam **Asia/Jakarta** (`WIB`).
    - `formatTimeRange(meeting)` → `"18.30–20.20"` (pakai en-dash, titik sesuai sumber).
    - `shortRoom(room)` → contoh: `"Gedung Manajemen Informatika Lantai 3 - Lab 8 (Keamanan Komputer)"` → `"L3 · Lab 8 (Keamanan Komputer)"` (buang awalan "Gedung Manajemen Informatika", "Lantai " → "L").
    - `normalizeCourseName(name)` → kapitalisasi title-case dengan akronim yang dipertahankan (`Sistem Informasi`, `Sistem Informasi Akuntansi`): `"Manajemen proyek sistem informasi"` → `"Manajemen Proyek Sistem Informasi"`, `"Prak. Keamanan Komputer"` → `"Prak. Keamanan Komputer"` (tidak diperluas).
    - `buildAgenda(schedule, now)` → `{ kind: 'list' | 'empty', meetings: [{ meeting, status, timeLabel, roomLabel, courseLabel, href }], nextMeeting }`. `href` = `/mata-kuliah/<slug>`. Sesi yang sudah lewat **tetap termasuk** dalam `meetings`. `nextMeeting` = pertemuan berikutnya setelah `now` (di hari yang sama, kalau tidak ada maka hari berikutnya yang punya jadwal) atau `null`.
    - `getNextSlot(courseId, schedule, now)` → pertemuan berikutnya untuk satu mata kuliah (atau `null`).
  - `src/utils/progress.js`
    - `computeCourseProgress(course)` → persen 0–100 dihitung dari aktivitas: `completed / total * 100`, dibulatkan; `0` bila tidak ada aktivitas.
    - `averageProgress(courses)` → rata-rata (1 desimal).
  - `src/utils/due.js`
    - `daysUntil(dueAt, now)` → bilangan bulat hari (negatif = lewat).
    - `isOverdue(dueAt, now)` → boolean.
    - `dueLabel(dueAt, now)` → `"Hari ini"` | `"Besok"` | `"3 hari lagi"` | `"Terlambat 2 hari"`.
  - Bentuk data (dipakai Task 4–7):
    - `src/data/meetings.json` → `{ schedule: [ { id, courseId, courseName, dayOfWeek, startTime, endTime, room } × 13 ], courses: { <courseId>: [ { number, title, status, activities: [ { title, type, format, fileSize, action, completed } ] } ] } }` — `schedule` persis 13 baris dari §5.2 spec; `courses` memuat unit-unit untuk 11 mata kuliah.
    - `src/data/courses.json` → array 11 mata kuliah: `{ id (slug, mis. "perbankan"), name, nameRaw, lecturer, credits, program, semester, class, next, description, unitsCount }`. `nameRaw` menyimpan nama asli dari sumber; `name` boleh sudah dinormalisasi.
    - `src/data/deadlines.json` → array 4 tenggat: `{ id, title, courseId, courseName, dueInDays, status }` (`status` ∈ `Mendesak` | `Akan Datang` | `Selesai`).
    - `src/data/user.json` → `{ name, initials, program, class, semester, totalCredits }` dengan `class: "DIPLOMA IV - 5MIM"`, `program: "Manajemen Informatika"`, `totalCredits: 21`.

- [ ] **Step 1: Tulis test yang gagal**

`tests/schedule.test.js` (node:test), dengan data contoh miniature (2 pertemuan) dan jam acuan tetap:
- `getScheduleForDate([{ dayOfWeek: 1 }], new Date('2026-10-19T10:00:00+07:00'))` → 1 elemen; `dayOfWeek: 0` (Minggu) → 0 elemen.
- `getMeetingStatus({ startTime: '18.30', endTime: '20.20' }, new Date('2026-10-20T19:00:00+07:00'))` → `'live'`; jam 21:30 → `'done'`; jam 17:00 → `'upcoming'`.
- `formatTimeRange({ startTime: '18.30', endTime: '20.20' })` → `'18.30–20.20'`.
- `shortRoom('Gedung Manajemen Informatika Lantai 3 - Lab 8 (Keamanan Komputer)')` → `'L3 · Lab 8 (Keamanan Komputer)'`.
- `normalizeCourseName('Manajemen proyek sistem informasi')` → `'Manajemen Proyek Sistem Informasi'`.
- `buildAgenda([pertemuan 18.30–20.20], now 19.00)` → `kind: 'list'` dan `meetings.length === 1` dengan `status: 'live'`; `buildAgenda(schedule, now = hari Minggu 10.00)` → `kind: 'empty'` dan `nextMeeting` berisi pertemuan hari Senin berikutnya.
- `buildAgenda` dengan 1 pertemuan yang sudah selesai (now 21:30) → `kind: 'list'`, `meetings.length === 1`, status `'done'`.
- `getNextSlot` untuk mata kuliah dengan dua slot (Selasa & Kamis) → mengembalikan slot Kamis bila now = Rabu.

`tests/progress.test.js`:
- `computeCourseProgress({ units: [{ activities: [{ completed: true }, { completed: false }] }] })` → 50; tanpa aktivitas → 0; semua selesai → 100.
- `averageProgress([{ units: [...] }, ...])` → rata-rata yang benar.

`tests/due.test.js`:
- `daysUntil('2026-10-21T23:59:00+07:00', new Date('2026-10-20T08:00:00+07:00'))` → 1; `isOverdue` untuk tanggal yang lewat → true; `dueLabel` → `'Besok'`, `'Hari ini'`, `'3 hari lagi'`, `'Terlambat 2 hari'`.

- [ ] **Step 2: Jalankan test, pastikan gagal**

Run: `npm test`
Expected: FAIL — modul `src/utils/schedule.js` belum ada (`ERR_MODULE_NOT_FOUND`).

- [ ] **Step 3: Tulis `src/utils/schedule.js`**

Isi: `getScheduleForDate`, `getMeetingStatus`, `formatTimeRange`, `shortRoom`, `normalizeCourseName`, `buildAgenda`, `getNextSlot`. Helper internal: `jakartaNow(now)` (ambil bagian jam/menit WIB dari `Intl.DateTimeFormat` dengan `timeZone: 'Asia/Jakarta'`), `toMinutes('18.30')` (titik → menit sejak tengah malam), `slugify(name)`.

- [ ] **Step 4: Tulis `src/utils/progress.js` dan `src/utils/due.js`**

`progress.js`: `computeCourseProgress(course)` menjumlahkan aktivitas dari `course.units` (setiap unit punya `activities`), `averageProgress(courses)`.
`due.js`: `daysUntil`, `isOverdue`, `dueLabel` (satu hari = 24 jam, dibulatkan ke bawah untuk "hari ini").

- [ ] **Step 5: Tulis data baru**

`src/data/meetings.json`: 13 baris `schedule` persis seperti tabel §5.2 spec (id, courseId, courseName, dayOfWeek 0=Minggu, startTime, endTime, room). `courses`: untuk 11 mata kuliah, 2–4 unit (unit = topik) dengan `activities` (materi/diskusi/kuis, sebagian `completed: true`).
`src/data/courses.json`: 11 mata kuliah dengan slug `id`, `name` (sudah ternormalisasi), `nameRaw` (asli), `lecturer`, `credits`, `program`, `semester`, `class`, `next` (judul materi berikutnya), `description`, `unitsCount` (jumlah unit dari meetings.json).
`src/data/deadlines.json`: 4 tenggat yang menunjuk mata kuliah baru; `dueInDays` 1, 3, 6, dan -2 (sudah lewat).
`src/data/user.json`: `{ name: "Rizky Pratama", initials: "RP", program: "Manajemen Informatika", class: "DIPLOMA IV - 5MIM", semester: 8, totalCredits: 21 }`.

- [ ] **Step 6: Jalankan test, pastikan lulus**

Run: `npm test`
Expected: PASS — semua test schedule/progress/due hijau.

- [ ] **Step 7: Commit**

```bash
git add src/data src/utils tests
git commit -m "feat: data jadwal nyata mahasiswa + utilitas jadwal, progres, tenggat"
```

---

### Task 4: Beranda — sapaan + blok Jadwal Hari Ini

**Files:**
- Create: `src/components/schedule/TodaySchedule.jsx`
- Create: `src/components/ui/StatusChip.jsx`
- Modify: `src/hooks/useHomeData.js`
- Modify: `src/services/homeService.js`
- Modify: `src/pages/HomePage.jsx`
- Delete: `src/components/home/WelcomeBanner.jsx`

**Interfaces:**
- Consumes: `buildAgenda`, `getScheduleForDate`, `getNextSlot` (Task 3); `useAuth` (user); token kelas (Task 1).
- Produces:
  - `useHomeData()` mengembalikan `{ announcements, deadlines, meetings, agenda, nextMeeting }` di mana `agenda` = hasil `buildAgenda(meetings, new Date())` dan `nextMeeting` = pertemuan berikutnya lintas hari.
  - `TodaySchedule({ agenda })` — `<section aria-label="Jadwal hari ini">`; untuk `agenda.kind === 'list'` merender `<ul>` berisi `<li>` per pertemuan, tiap baris pembungkus `<Link to={meeting.href}>` dengan isi: jam (`timeLabel`), nama mk (`courseLabel`), dosen, ruang (`roomLabel`), dan `<StatusChip status={meeting.status} />`; untuk `kind === 'empty'` merender "Tidak ada kelas hari ini" + "Kelas berikutnya: <nama> (<hari>, <jam>)" memakai `agenda.nextMeeting`.
  - `StatusChip({ status, children })` — `status` ∈ `'live' | 'done' | 'upcoming' | 'urgent'`; label bawaan: live → "Berlangsung", done → "Selesai", upcoming → "Akan datang", urgent → "Mendesak". Warna: live/urgent → teks `text-accent` + latar `bg-accent/15`; done → `text-secondary` + `bg-surface-3`; upcoming → `text-secondary` + `bg-surface-2`. `children` opsional untuk override label.

- [ ] **Step 1: Tambahkan cek verify yang gagal**

Di `scripts/verify-pages.mjs`, tambahkan untuk rute `/beranda`: assert `section[aria-label="Jadwal hari ini"]` ada, jumlah `<li>` di dalamnya sama dengan jumlah pertemuan pada hari ini (dihitung dari `src/data/meetings.json` yang di-import skrip dengan `with { type: 'json' }`, memakai `getDay()` lokal), dan setiap `<li>` memuat satu `<a href^="/mata-kuliah/"]>`.

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npm run verify -- --routes /beranda`
Expected: FAIL — section "Jadwal hari ini" tidak ditemukan.

- [ ] **Step 3: Buat `StatusChip`**

Buat `src/components/ui/StatusChip.jsx` sesuai antarmuka di atas; `aria-label` tidak perlu (label sudah berupa teks).

- [ ] **Step 4: Buat `TodaySchedule`**

Buat `src/components/schedule/TodaySchedule.jsx`: `<section aria-label="Jadwal hari ini">` dengan `<h2 className="sr-only">Jadwal hari ini</h2>`; daftar memakai `<ul className="divide-y divide-border">`; tiap `<li>` berisi `<Link>` dengan grid: jam (waktu tetap, tabular-nums), nama mk (font-semibold, `line-clamp-2`), dosen (`text-secondary`, `truncate`), ruang (`text-secondary`, `truncate`), dan chip status. Baris yang `status === 'done'` menampilkan tambahan teks "Lanjut ke materi berikutnya" (tautan kedua ke `href` yang sama). Kondisi kosong menampilkan dua paragraf sepertiInterfaces di atas.

- [ ] **Step 5: Sambungkan data**

Di `src/services/homeService.js`, tambahkan `getTodayAgenda(now)` yang memanggil `buildAgenda(getMeetings(), now)` dan `getNextMeeting(now)` yang memakai `getNextSlot` untuk seluruh mata kuliah lalu memilih yang paling awal. Di `src/hooks/useHomeData.js`, tambahkan `agenda` dan `nextMeeting` ke objek yang dikembalikan.

- [ ] **Step 6: Susun ulang Beranda**

Di `src/pages/HomePage.jsx`: ganti `<WelcomeBanner>` dengan satu baris sapaan (nama, tanggal berbahasa Indonesia, dan ringkasan "N kelas hari ini · berikutnya 18.30"); hapus blok `<StatCard>` (tiga kartu angka); ganti dengan `<TodaySchedule agenda={agenda} />` sebagai elemen pertama setelah sapaan. Hapus import `WelcomeBanner` dan `StatCard` dari halaman ini. Ganti kelas literal yang tersisa dengan kelas token.

- [ ] **Step 7: Hapus `WelcomeBanner.jsx`**

Hapus `src/components/home/WelcomeBanner.jsx` (digantikan baris sapaan) dan import-nya di seluruh repo.

- [ ] **Step 8: Jalankan test dan verify, pastikan lulus**

Run: `npm test` → Expected: PASS.
Run: `npm run verify -- --routes /beranda --theme light,dark --out screenshots` → Expected: PASS; `screenshots/light-beranda.png` & `screenshots/dark-beranda.png` terbentuk, agenda menampilkan baris sesuai hari.

- [ ] **Step 9: Commit**

```bash
git add src/components/schedule src/components/ui/StatusChip.jsx src/components/home src/hooks/useHomeData.js src/services/homeService.js src/pages/HomePage.jsx scripts/verify-pages.mjs
git commit -m "feat: beranda menampilkan jadwal hari ini yang bisa diklik"
```

---

### Task 5: Beranda bagian bawah — tenggat, pengumuman, lanjutkan belajar, kalender

**Files:**
- Modify: `src/components/home/DeadlineList.jsx`
- Modify: `src/components/home/AnnouncementCard.jsx`
- Modify: `src/components/home/ContinueLearningCard.jsx`
- Modify: `src/components/home/CalendarWidget.jsx`
- Modify: `src/components/course/CourseCard.jsx`
- Modify: `src/components/ui/Card.jsx`, `src/components/ui/Badge.jsx`, `src/components/ui/Button.jsx`
- Modify: `src/pages/HomePage.jsx`

**Interfaces:**
- Consumes: `computeCourseProgress`, `averageProgress`, `dueLabel`, `isOverdue` (Task 3); `getNextSlot` (Task 3).
- Produces (tanda tangan baru):
  - `DeadlineList({ deadlines, now })` — daftar tenggat; tiap baris: judul, nama mk, `dueLabel` sebagai chip status (`Mendesak` → status `'urgent'`, `Selesai` → `'done'`, selain itu `'upcoming'`), dan tautan ke `/mata-kuliah/<courseId>`.
  - `AnnouncementCard({ announcement })` — kategori jadi label teks kecil (bukan badge besar), judul, tanggal format Indonesia ("12 Okt 2026"), isi 2 baris (`line-clamp-2`).
  - `ContinueLearningCard({ course, progress, nextSlot })` — nama mk (`line-clamp-2`), progres + persen, materi berikutnya (`course.next`), dan jadwal berikutnya ("Senin · 18.30 · L3 · Lab 8") bila `nextSlot` ada.
  - `CourseCard({ course, progress, nextSlot, variant })` — `variant` ∈ `'grid' | 'list'`; kepala berisi SKS + jadwal berikutnya, nama mk 2 baris, dosen, bar progres + persen, materi berikutnya, dan aksi "Lanjutkan Belajar".
  - `CalendarWidget({ meetings, deadlines, now })` — kalender bulan berjalan; tandai hari ini dan hari yang ada jadwal; titik consenting.

- [ ] **Step 1: Tambahkan cek verify yang gagal**

Di `scripts/verify-pages.mjs`, untuk rute `/beranda` tambahkan assert: heading "Pengumuman Kampus" ada, heading "Tenggat terdekat" ada, dan tidak ada elemen dengan kelas literal `bg-white`/`text-slate-` di dalam `<main>` (cek lewat `document.querySelectorAll('[class*="bg-white"],[class*="slate-"]')`).

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npm run verify -- --routes /beranda`
Expected: FAIL — heading "Tenggat terdekat" belum ada.

- [ ] **Step 3: Tulis ulang `DeadlineList` dan `AnnouncementCard`**

`DeadlineList({ deadlines, now })`: tiap baris menampilkan judul, nama mk, chip `dueLabel` (status `'urgent'` untuk "Mendesak", `'done'` untuk "Selesai", selain itu `'upcoming'`), dan tautan `Link` ke `/mata-kuliah/<courseId>`. `AnnouncementCard({ announcement })`: kategori jadi label teks kecil (bukan badge), judul, tanggal format Indonesia ("12 Okt 2026"), isi 2 baris (`line-clamp-2`). Keduanya: kelas literal → token.

- [ ] **Step 4: Tulis ulang `ContinueLearningCard` dan `CourseCard`**

`ContinueLearningCard({ course, progress, nextSlot })`: nama mk `line-clamp-2`, bar progres + persen, materi berikutnya (`course.next`), dan jadwal berikutnya ("Senin · 18.30 · L3 · Lab 8") bila `nextSlot` ada. `CourseCard({ course, progress, nextSlot, variant })` dengan `variant` ∈ `'grid' | 'list'`: kepala berisi SKS + jadwal berikutnya, nama mk 2 baris, dosen, bar progres + persen, materi berikutnya, aksi "Lanjutkan Belajar". Keduanya: kelas literal → token, tanpa ikon di dalam judul.

- [ ] **Step 5: Susun ulang tata letak Beranda**

Di `src/pages/HomePage.jsx`: setelah blok agenda, susun dua kolom — kiri (`: 1,6fr`) "Tenggat terdekat" lalu "Pengumuman Kampus"; kanan (`: 1fr`) "Lanjutkan belajar" (3 kartu) lalu "Kalender". Gunakan `grid` responsif: 1 kolom di bawah 1024px. Hapus blok kartu statistik sepenuhnya.

- [ ] **Step 6: Perbarui kalender**

Di `src/components/home/CalendarWidget.jsx`: ganti warna literal dengan token; tandai hari yang punya jadwal (dari `meetings`) dengan titik emas; hari ini dengan ringkas accent.

- [ ] **Step 7: Jalankan verify + build, pastikan lulus**

Run: `npm run verify -- --routes /beranda --theme light,dark --out screenshots` → Expected: PASS.
Run: `npm run build` → Expected: sukses.

- [ ] **Step 8: Commit**

```bash
git add src/components/home src/components/course/CourseCard.jsx src/components/ui src/pages/HomePage.jsx scripts/verify-pages.mjs
git commit -m "feat: rapikan bagian bawah beranda dan kartu mata kuliah"
```

---

### Task 6: Mata Kuliah Saya + Detail Mata Kuliah

**Files:**
- Modify: `src/pages/MyCoursesPage.jsx`
- Modify: `src/pages/CourseDetailPage.jsx`
- Modify: `src/components/course/CourseFilterBar.jsx`
- Modify: `src/components/course/CourseHeader.jsx`
- Modify: `src/components/course/CourseSummaryBar.jsx`
- Modify: `src/components/course/MeetingAccordion.jsx`
- Modify: `src/components/course/ActivityItem.jsx`
- Modify: `src/components/course/QuizCard.jsx`
- Modify: `src/components/course/LecturerCard.jsx`
- Modify: `src/components/course/MobileCourseTabs.jsx`
- Modify: `src/components/course/NextDeadlineCard.jsx`
- Modify: `src/components/ui/Tabs.jsx`, `src/components/ui/Accordion.jsx`, `src/components/ui/ProgressBar.jsx`
- Modify: `src/services/courseService.js`, `src/hooks/useCourses.js`

**Interfaces:**
- Consumes: `computeCourseProgress`, `getNextSlot`, `getCourseMeetings` (Task 3).
- Produces:
  - `useCourses()` → `{ courses }` dengan `courses` sudah membawa `progress` (hasil `computeCourseProgress`) dan `nextSlot` (hasil `getNextSlot`).
  - `courseService.getCourses()` mengembalikan objek `{ ...course, progress, nextSlot }`.
  - `MyCoursesPage` — konteks satu baris (program · kelas · total SKS · jumlah mk), filter bar (pencarian, status, urutan, toggle grid/list), lalu grid kartu (`CourseCard variant="grid"`) atau daftar (`variant="list"`). Placeholder pencarian: "Cari mata kuliah atau dosen".
  - `CourseDetailPage` — breadcrumb, nama mk, SKS, dosen, program/kelas; blok "Kelas berikutnya" (hari, jam, ruang singkat); bar progres + persen + jumlah unit selesai; daftar unit `MeetingAccordion` (nomor, judul, status) berisi `ActivityItem` (materi/diskusi/kuis: judul, format, ukuran berkas, aksi) dan `QuizCard`.

- [ ] **Step 1: Tambahkan cek verify yang gagal**

Di `scripts/verify-pages.mjs`, untuk `/mata-kuliah`: assert ada 11 kartu (elemen dengan `data-course-card`), ada input pencarian dengan placeholder "Cari mata kuliah atau dosen", dan tidak ada kelas literal. Untuk `/mata-kuliah/perbankan`: assert heading "Perbankan" ada, blok "Kelas berikutnya" ada, dan ada daftar unit.

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npm run verify -- --routes /mata-kuliah`
Expected: FAIL — placeholder lama "Cari nama mata kuliah atau dosen..." masih ada / jumlah kartu tidak 11.

- [ ] **Step 3: Perbarui layer data**

Di `src/services/courseService.js`: `getCourses()` memetakan `computeCourseProgress` dan `getNextSlot` ke tiap course; `getCourseById(id)` tetap. Di `src/hooks/useCourses.js`, expose `courses` yang sudah enriched.

- [ ] **Step 4: Tulis ulang `MyCoursesPage`**

Satu baris konteks; bar filter tanpa kartu statistik; grid 3 kolom (≥1024px), 2 kolom (≥768px), 1 kolom di bawahnya; kartu memakai `CourseCard` baru (kepala = SKS + jadwal berikutnya, nama 2 baris, progres, materi berikutnya). Tambahkan `data-course-card` pada tiap kartu untuk pengecekan.

- [ ] **Step 5: Tulis ulang `CourseDetailPage`**

Gunakan `getCourseUnits` (nama baru di `courseService`: `getCourseUnits(courseId)` mengembalikan array unit dari `meetings.json.courses`) + `computeCourseProgress`; blok "Kelas berikutnya" memakai `getNextSlot`; daftar unit memakai `MeetingAccordion` dengan status dari unit (`completed`/`active`/`upcoming`).

- [ ] **Step 6: Rapikan komponen navigasi & header**

`CourseFilterBar` (pencarian, filter status, urutan), `CourseHeader` (judul + meta mk), `CourseSummaryBar` (konteks program/kelas/SKS), `MobileCourseTabs` (tab navigasi seluler): ganti kelas literal dengan token, hapus blok warna kosong, dan pastikan nama panjang ter-clamp 2 baris.

- [ ] **Step 7: Rapikan komponen unit & aktivitas**

`MeetingAccordion` (unit + status), `ActivityItem` (materi/diskusi/kuis: judul, format, ukuran berkas, aksi), `QuizCard`, `LecturerCard`, `NextDeadlineCard`, serta `Tabs`, `Accordion`, `ProgressBar`: ganti kelas literal dengan token, dan pastikan label minimal 13px. **Jangan memakai prop `tone` pada `ProgressBar` di task ini** — prop itu baru diperkenalkan di Task 7; di sini pakai API `ProgressBar` yang ada.

- [ ] **Step 8: Jalankan verify + test, pastikan lulus**

Run: `npm run verify -- --routes /mata-kuliah,/mata-kuliah/perbankan --theme light,dark --out screenshots` → Expected: PASS.
Run: `npm test` → Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/pages/MyCoursesPage.jsx src/pages/CourseDetailPage.jsx src/components/course src/components/ui src/services/courseService.js src/hooks/useCourses.js scripts/verify-pages.mjs
git commit -m "feat: daftar dan detail mata kuliah dengan jadwal berikutnya"
```

---

### Task 7: Dasbor

**Files:**
- Modify: `src/pages/DashboardPage.jsx`
- Modify: `src/components/ui/StatCard.jsx`
- Modify: `src/components/ui/ProgressBar.jsx`
- Modify: `src/components/course/ActivityItem.jsx`, `src/components/course/NextDeadlineCard.jsx`

**Interfaces:**
- Consumes: `computeCourseProgress`, `averageProgress`, `dueLabel` (Task 3).
- Produces:
  - `StatCard({ label, value, detail, href })` — tanpa ikon; seluruhnya berupa tautan bila `href` diisi (pakai `Link`), label 13px `text-secondary`, nilai 22–28px `text-main`, `detail` opsional 13px.
  - `ProgressBar({ value, tone })` — `tone` ∈ `'progress' | 'done' | 'idle'` → warna `bg-primary`, `bg-success`, `bg-surface-3`; tinggi 6px, radius penuh, selalu accompanied angka persen di sebelahnya.
  - `DashboardPage` — judul + satu kalimat; baris 4 angka (`StatCard`) dengan tautan ke daftar terkait; dua kolom: kiri "Progres per Mata Kuliah" (daftar mk + `ProgressBar tone="progress"`), kanan "Tugas Belum Selesai" (daftar dari `deadlines` yang belum lewat, memakai `dueLabel` + `ProgressBar tone="idle"`), dan blok "Progres Pertemuan" memakai `tone="done"`.

- [ ] **Step 1: Tambahkan cek verify yang gagal**

Di `scripts/verify-pages.mjs`, untuk `/dasbor`: assert ada 4 elemen statistik, tidak ada ikon di dalam kartu statistik (tidak ada `svg` di dalam elemen statistik), dan semua bar progres memakai kelas `bg-primary`/`bg-success`/`bg-surface-3` (bukan warna acak).

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npm run verify -- --routes /dasbor`
Expected: FAIL — kartu statistik masih memuat ikon.

- [ ] **Step 3: Tulis ulang `StatCard`**

Hapus blok ikon; terima `href` dan jadi `Link` bila ada; nilai 22–28px; label 13px.

- [ ] **Step 4: Perbaiki semantik warna `ProgressBar`**

Tambahkan prop `tone` dengan tiga nilai di atas (`'progress' | 'done' | 'idle'` → `bg-primary`, `bg-success`, `bg-surface-3`); `ProgressBar` lama yang memakai warna hijau/merah acak dibersihkan. **Semua pemakaian `ProgressBar` di repo diperbarui untuk menyebut `tone` secara eksplisit** — termasuk yang dibuat di Task 5 dan Task 6, yang sebelumnya memakai API lama.

- [ ] **Step 5: Tulis ulang `DashboardPage`**

Gunakan `StatCard` tanpa ikon; kolom kiri daftar mk terurut progres dengan `ProgressBar tone="progress"`; kolom kanan daftar tugas belum selesai dengan `dueLabel` dan `ProgressBar tone="idle"`; blok pertemuan memakai `tone="done"`. Semua kelas literal diganti token.

- [ ] **Step 6: Jalankan verify + build, pastikan lulus**

Run: `npm run verify -- --routes /dasbor --theme light,dark --out screenshots` → Expected: PASS.
Run: `npm run build` → Expected: sukses.

- [ ] **Step 7: Commit**

```bash
git add src/pages/DashboardPage.jsx src/components/ui src/components/course scripts/verify-pages.mjs
git commit -m "feat: dasbor dengan angka yang bisa diklik dan warna progres bermakna"
```

---

### Task 8: Halaman Panduan Pengguna

**Files:**
- Create: `src/pages/GuidePage.jsx`
- Modify: `src/routes/AppRouter.jsx`
- Modify: `src/pages/LoginPage.jsx` (tombol "Bantuan login" menjadi tautan ke `/panduan`)
- Modify: `src/components/layout/Footer.jsx` (tambah tautan "Panduan Penggunaan")
- Modify: `scripts/verify-pages.mjs`

**Interfaces:**
- Consumes: kelas token (Task 1), `Link` dari `react-router-dom`.
- Produces:
  - Rute publik `/panduan` → `<GuidePage />`, didaftarkan **sebelum** blok rute terlindungi.
  - `GuidePage` merender `<h1>Panduan Penggunaan LearnEase</h1>` lalu enam `<section aria-labelledby="…-heading">` dengan `<h2>` berurutan: "Cara masuk", "Lupa kata sandi", "Memahami Beranda", "Mengikuti kelas", "Enrollment key", "Kontak bantuan". Tiap section memuat 1–3 paragraf berbahasa Indonesia yang merujuk fitur yang benar-benar ada di LearnEase (jadwal hari ini, tenggat, pengumuman, lanjutkan belajar, materi per pertemuan) dan menyatakan dengan jujur bahwa pemulihan kata sandi otomatis belum tersedia.
  - Tombol "Bantuan login" di `src/pages/LoginPage.jsx` (kontrol mati) menjadi `<Link to="/panduan">Bantuan login</Link>`; `src/components/layout/Footer.jsx` mendapat tautan "Panduan Penggunaan".

- [ ] **Step 1: Tambahkan cek verify yang gagal**

Di `scripts/verify-pages.mjs`, untuk rute `/panduan`: assert ada `<h1>` yang teksnya memuat "Panduan Penggunaan", ada 6 `<h2>` dengan urutan teks "Cara masuk", "Lupa kata sandi", "Memahami Beranda", "Mengikuti kelas", "Enrollment key", "Kontak bantuan", dan tidak ada kelas literal di dalam `<main>`.

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `npm run verify -- --routes /panduan`
Expected: FAIL — rute belum ada (halaman 404).

- [ ] **Step 3: Buat `src/pages/GuidePage.jsx`**

Render `<main>` berisi `<h1>` + enam `<section>` di atas. Gunakan kelas token (`text-main`, `text-secondary`, `bg-background`, `border-border`), ukuran teks ≥ 13px, tanpa kelas literal.

- [ ] **Step 4: Daftarkan rute**

Di `src/routes/AppRouter.jsx`, tambahkan `<Route path="/panduan" element={<GuidePage />} />` **sebelum** `<Route element={<ProtectedRoute />}>` (rute publik).

- [ ] **Step 5: Hubungkan dari login & footer**

Di `src/pages/LoginPage.jsx`, ganti kontrol tombol "Bantuan login" menjadi `<Link to="/panduan">` dengan gaya tautan yang sama seperti "Lupa kata sandi?". Di `src/components/layout/Footer.jsx`, tambahkan tautan "Panduan Penggunaan" ke `/panduan`.

- [ ] **Step 6: Jalankan verify + build, pastikan lulus**

Run: `npm run verify -- --routes /panduan,/login --theme light,dark --out screenshots` → Expected: PASS.
Run: `npm run build` → Expected: sukses.

- [ ] **Step 7: Commit**

```bash
git add src/pages/GuidePage.jsx src/routes/AppRouter.jsx src/pages/LoginPage.jsx src/components/layout/Footer.jsx scripts/verify-pages.mjs
git commit -m "feat: halaman panduan pengguna publik"
```

---

### Task 9: Rapor akhir — dua tema, semua breakpoint, dokumentasi

**Files:**
- Modify: `DOKUMENTASI.md`
- Modify: `.github/copilot-instructions.md`
- Modify: `src/pages/LoginPage.jsx` (hanya teks label "NIP / NPH / NPM")
- Modify: `src/pages/NotFoundPage.jsx` (kelas literal → token)
- Create: `screenshots/` (hasil verify, di-commit? tidak — tambahkan ke `.gitignore`)

**Interfaces:**
- Consumes: semuanya dari Task 1–7.
- Produces: repo dengan 4 halaman + login yang lolos semua kriteria §10 spec, dan dokumentasi yang menyebut mode terang/gelap, jadwal hari ini, dan data baru.

- [ ] **Step 1: Koreksi teks label login**

Di `src/pages/LoginPage.jsx`, ganti kemunculan "NIP / NPM / NIK" menjadi "NIP / NPH / NPM" (label kolom, placeholder, pesan validasi, paragraf pengantar). Jangan sentuh struktur atau validasi.

- [ ] **Step 2: Rapikan `NotFoundPage`**

Ganti kelas literal dengan token.

- [ ] **Step 3: Jalankan verify penuh**

Run: `npm run build` → Expected: sukses.
Run: `npm run preview -- --port 4173 --strictPort` di terminal terpisah.
Run: `npm run verify -- --routes /login,/beranda,/dasbor,/mata-kuliah,/mata-kuliah/perbankan,/panduan --theme light,dark --out screenshots` → Expected: PASS untuk semua rute di kedua tema; tidak ada overflow horizontal di 390 (device emulation dikembalikan oleh skrip) maupun 1440.

- [ ] **Step 4: Uji checklist §10**

Jalankan `npm run verify -- --routes /beranda,/mata-kuliah --reduced-motion` → Expected: PASS dan tidak ada transisi berjalan.
Jalankan `npm run verify` juga pada lebar 360, 768, 1024, 1920 (flag `--width`) dan periksa: agenda tampil sesuai hari, baris bisa diklik ke `/mata-kuliah/<slug>`, mode gelap bertahan setelah reload, dan tidak ada teks di bawah 13px.

- [ ] **Step 5: Update dokumentasi**

Di `DOKUMENTASI.md`: tambahkan `next-themes` di tabel teknologi (bagian Animasi), jelaskan mode terang/gelap di bagian Login, jelaskan blok "Jadwal hari ini" + sumber data barunya, dan perbarui daftar file (`src/components/schedule/`, `src/utils/schedule.js`, `src/utils/progress.js`, `src/utils/due.js`, `scripts/verify-pages.mjs`, `tests/`). Di `.github/copilot-instructions.md`: tambahkan `next-themes`, `schedule/`, `utils/schedule.js`, dan aturan "warna hanya lewat token".

- [ ] **Step 6: Commit**

```bash
git add DOKUMENTASI.md .github/copilot-instructions.md src/pages/LoginPage.jsx src/pages/NotFoundPage.jsx .gitignore
git commit -m "docs: perbarui dokumentasi untuk redesign dan mode terang/gelap"
```

---

## Ringkasan dependensi antar-task

- Task 1 menghasilkan token + `npm test` + `npm run verify` → dipakai semua task berikutnya.
- Task 2 menghasilkan `ThemeProvider` + `ThemeToggle` → dipakai Task 4–8.
- Task 3 menghasilkan data + utilitas murni → dipakai Task 4–7.
- Task 4 (agenda) memakai utilitas Task 3; Task 5–7 memakai komponen yang dirapikan di Task 5.
- Task 8 (panduan pengguna) memakai kelas token + `Link`; tidak butuh utilitas baru.
- Task 9 bergantung pada semua task sebelumnya.
