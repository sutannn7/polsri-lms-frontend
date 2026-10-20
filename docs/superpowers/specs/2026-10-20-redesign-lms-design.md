# Desain Redesign LearnEase LMS POLSRI

Tanggal: 2026-10-20
Status: draf untuk review — belum ada implementasi
Cakupan: halaman Beranda, Dasbor, Mata Kuliah Saya, Detail Mata Kuliah, plus mode terang/gelap

---

## 1. Mengapa redesign ini perlu

LMS yang dipakai mahasiswa POLSRI saat ini adalah **Moodle** di `lms1.polsri.ac.id` (tema Boost bawaan, hanya diberi skin "LMS POLSRI"). Bukti dari dokumentasi yang dipakai mahasiswa:

| Halaman | Isi | Masalah nyata |
|---|---|---|
| Login | Kotak putih polos di atas abu-abu: logo, dua input, tombol biru, lalu **dinding teks bantuan** (aturan daftar, enrollment key, reset password lewat SIAKAD) | Tidak ada identitas kampus, tidak ada konteks; bahkan ada baris berbahasa Jerman yang belum diterjemahkan |
| Home | "Hi, MUHAMMAD RIZKI! 👋" lalu **"Site news" = forum** | Beranda hanya thread pengumuman; tidak ada agenda, tenggat, atau progres |
| My courses | Grid kartu dengan **cover placeholder** Moodle | Nama mata kuliah berupa kode kapital (`2025 PRAKTIKUM PEMROGRAMAN MOBILE_YS`), progres ditulis "4% complete" |
| Dashboard | **Hanya satu blok Calendar** | Namanya dashboard, isinya kalender saja |
| Courses | Pohon kategori mentah | Di kaki halaman ada **bar debug Moodle** |

Jadi LearnEase bukan "skin Moodle yang lebih cantik". LearnEase harus jadi **produk belajar yang dipakai mahasiswa sendiri**: beranda yang langsung bisa ditindak, data yang jujur, dan tampilan yang tidak generik.

## 2. Tujuan, bukan-tujuan, dan anti-tujuan

**Tujuan**
1. Beranda bekerja optimal: **jadwal hari ini** sebagai elemen pertama, tiap baris bisa diklik ke mata kuliahnya.
2. Data prototipe memakai **jadwal nyata mahasiswa** (DIPLOMA IV - 5MIM), sehingga UI dirancang terhadap data asli yang berantakan, bukan data rapi.
3. Satu sistem warna & tipografi untuk 4 halaman, dengan **mode terang (default) dan mode gelap** yang bisa dipilih.
4. Menghapus pola "template AI" yang sekarang: hero gradien, baris kartu statistik ikon-bulat, blok warna kosong sebagai cover, bar progres tanpa makna warna.

**Bukan tujuan**
- Mengganti mesin LMS (Moodle) atau Wales. LearnEase tetap prototipe sisi klien dengan data lokal.
- Menambah fitur yang tidak ada kebutuhannya ( chatting, notification push, dsb).
- Mengubah alur autentikasi, validasi, atau nama field.

**Anti-tujuan (sukses justru berarti gagal bila terjadi)**
- Hasil akhir yang terlihat seperti "dashboard SaaS generik" (kartu-kartu sama, ikon kotak bulat, angka besar tanpa konteks).
- Dark mode yang hanya membalik warna tanpa menjaga hierarki dan kontras.
- UI yang hanya rapi untuk data mock; rusak begitu nama mata kuliah asli terpasang.

## 3. Batasan & keputusan yang sudah dikunci

| Keputusan | Nilai | Alasan |
|---|---|---|
| Tema | Terang sebagai default, gelap sebagai pilihan | Isinya teks panjang; portal resmi & Moodle terang |
| Mekanisme tema | `next-themes` + `darkMode: 'class'` di Tailwind, `defaultTheme="light"`, `enableSystem={false}` | Standar shadcn, handle class di `<html>` dan localStorage. Preferensi OS **tidak** dipakai: default selalu terang sesuai keputusan, pilihan pengguna yang berlaku setelahnya |
| Ikon toggle | `SunMoon` (bukan `Moon`/`Sun` seperti landing page) | Permintaan eksplisit agar berbeda dari landing |
| Login | Tetap gelap selalu, tidak ikut mode terang/gelap | Sudah jadi "gerbang" yang dirancang; CSS-nya scoped dan tidak memakai token aplikasi |
| Data | Jadwal & mata kuliah asli mahasiswa (lihat §5) | UI harus tahan nama panjang & kode campur |
| Bahasa | Indonesia, istilah UI mengikuti yang sudah dipakai | Tidak ada perubahan copy produk |
| Dependency | Hanya `next-themes` yang ditambah | Tidak ada library berat lain |

## 4. Sistem desain

### 4.1 Warna (token, bukan warna per kelas)

Semua warna aplikasi lewat variabel CSS; nilai gelap hanya menimpa variabelnya, sehingga komponen tidak perlu dua versi kelas.

| Token | Terang | Gelap | Dipakai untuk |
|---|---|---|---|
| `--surface` | `#FFFFFF` | `#0A1426` | latar halaman, kartu |
| `--surface-2` | `#F5F7FB` | `#101C33` | strip informasi, baris tabel, header kartu |
| `--surface-3` | `#EDF1F8` | `#16233D` | hover, state aktif |
| `--border` | `#E2E8F2` | `#1E2C48` | garis kartu & pemisah |
| `--text` | `#0F172A` | `#E9EFFA` | teks utama |
| `--text-muted` | `#5A6782` | `#9FB0CC` | teks sekunder |
| `--brand` | `#0B2A5B` (navy) | `#0B2A5B` | aksen utama: link, tombol utama |
| `--on-primary` | `#FFFFFF` | `#0A1426` | teks dan ikon DI ATAS permukaan brand (tombol utama, tab aktif) - selalu kontras >= 4,5:1 terhadap `--brand` |
| `--accent` | `#FFC107` (emas) | `#FFC107` | status berjalan, sorotan, logo |
| `--danger` | `#D64545` | `#FF9BA0` | tenggat mendesak, error |
| `--success` | `#1F9D6B` | `#4ADE9B` | selesai |

Badge status memakai pasangan warna sendiri (latar lembut + teks kuat), karena warna status utama tidak cukup kontras di atas kartu. Semuanya juga berupa token agar ikut berubah di mode gelap:

| Token | Terang | Gelap | Dipakai untuk |
|---|---|---|---|
| `--success-soft` / `--success-text` | `#DCFCE7` / `#166534` | `#123A2B` / `#7EE2B8` | badge "Selesai" |
| `--danger-soft` / `--danger-text` | `#FEE2E2` / `#B91C1C` | `#3A1D20` / `#FFB4B4` | badge "Mendesak", error |
| `--warning-soft` / `--warning-text` | `#FFF8DF` / `#8A6100` | `#3B3218` / `#F5D67A` | badge peringatan |
| `--neutral-soft` / `--neutral-text` | `#F3F4F6` / `#4B5563` | `#232B38` / `#C3CBD9` | badge netral |

Aturan warna yang dipaksakan: **warna selalu berarti sesuatu**. Hijau = selesai, emas = berjalan/mendesak, biru = progres, abu = belum. Tidak ada lagi bar progres hijau di satu kolom dan biru di kolom lain (kebocoran itu ada di Dasbor sekarang).

Catatan teknis: modifier opacity Tailwind (`bg-accent/15`) tidak bisa dipakai dengan token berbentuk `var(--x)` — Tailwind tidak dapat mengabadikan raw CSS variable. Untuk warna transparan gunakan `color-mix(in srgb, var(--token) N%, transparent)`.

### 4.2 Tipografi

| Peran | Family | Ukuran / weight | Catatan |
|---|---|---|---|
| Judul halaman (`h1`) | Bricolage Grotesque | 28–36px / 600 | Sentence case, tracking −0,02em |
| Judul bagian | Plus Jakarta Sans | 16–20px / 700 | Sentence case |
| Teks isi | Plus Jakarta Sans | 14–15px / 400 | |
| Label & metadata | Plus Jakarta Sans | 13px / 500 | **tidak boleh di bawah 13px**, tidak kapital + letterspacing |
| Angka besar | Plus Jakarta Sans | 22–28px / 700 | Hanya kalau angka itu punya aksi |

### 4.3 Bentuk, ruang, elevasi

- Radius: 12px (kartu), 8px (tombol & input), 999px (chip status saja).
- Jarak: kelipatan 4px; jarak antar-bagian 32–40px; jarak antar-kartu 16px.
- Elevasi: di terang, kartu tanpa bayangan — cukup garis 1px + `surface`; di gelap, garis lebih terang + bayangan sangat lembut. Tanpa bayangan di terang, kartu tidak terlihat "tertempel".
- Tanpa gradien dekoratif, tanpa emoji, tanpa ikon di dalam judul.

### 4.4 Gerak

- Satu jenis gerak: **masuk** (fade + naik 12px, 320ms, `ease-out`) dan **hover/press** (120–160ms).
- Semua gerakILEGAL dimatikan saat `prefers-reduced-motion: reduce`.
- Transisi halaman: tidak ada (langsung tampil) — supaya tidak menambah beban.

## 5. Data (mock baru, dari data asli)

### 5.1 Profil

`DIPLOMA IV - 5MIM` · Manajemen Informatika · 21 SKS aktif. Nama, initials, dan hari/tanggal tetap mengikuti data yang ada.

### 5.2 Jadwal (13 pertemuan, Senin–Sabtu)

| Hari | Jam | Mata Kuliah | SKS | Dosen | Ruangan |
|---|---|---|---|---|---|
| Senin | 18:30–20:20 | Prak. Keamanan Komputer | 1 | Ir. H. Sony Oktapiandi | Lantai 3 - Lab 8 (Keamanan Komputer) |
| Senin | 20:30–21:10 | Praktikum Rekayasa Web | 1 | Surahmat | Lantai 3 - Lab 8 (Keamanan Komputer) |
| Selasa | 18:30–20:30 | Manajemen Proyek Sistem Informasi | 1 | Ferizka Tiara Devani | Lantai 3 - Lab 3 (Jaringan Komputer) |
| Selasa | 20:30–21:10 | Praktikum Analisis Data | 1 | Trizuarah Armiani | Lantai 3 - Lab 3 (Jaringan Komputer) |
| Rabu | 18:30–19:50 | Etika Profesi | 2 | Dr. Indri Ariyanti | Lantai 2 - Teori 4 |
| Rabu | 19:50–21:10 | Sistem Informasi Industri | 2 | Andry Meylani | Lantai 2 - Teori 4 |
| Kamis | 18:30–19:50 | Praktikum Analisis Data | 1 | Trizuarah Armiani | Lantai 3 - Lab 5 (Pemrograman Web) |
| Kamis | 19:50–21:10 | Praktikum Rekayasa Web | 1 | Surahmat | Lantai 3 - Lab 5 (Pemrograman Web) |
| Jumat | 18:10–19:50 | Perbankan | 2 | Rizky Novrianty | Lantai 2 - Teori 5 |
| Jumat | 19:50–21:10 | Sistem Informasi Akuntansi | 2 | Dwi Hajriani Denta | Lantai 2 - Teori 5 |
| Sabtu | 07:00–09:00 | Metodologi Penelitian | 3 | Mardiana | Lantai 2 - Teori 5 |
| Sabtu | 09:30–11:30 | Manajemen Strategi | 3 | Putri Ramadhani | Lantai 2 - Teori 5 |
| Sabtu | 12:00–14:00 | Praktikum Pemrograman Visual | 1 | Dewi Irmawati Siregar | Lantai 3 - Lab 6 (Desktop) |

Total 21 SKS (cocok dengan footer "Total Kredit: 21 SKS").

**Aturan main data**
- Data lama (`MI2301`–`MI2306`, D-III) **diganti**, bukan digabung. Mock baru = 11 mata kuliah D-IV dengan 2–4 pertemuan (unit topik, bukan slot mingguan) + aktivitas (materi/diskusi/kuis) di dalamnya.
- **Kode mata kuliah tidak dikarang** (sumber aslinya tidak punya kode). URL memakai slug internal (`/mata-kuliah/perbankan`), dan yang ditampilkan ke mahasiswa adalah nama, SKS, dan jadwal — bukan kode rekaan.
- **Progres dihitung dari aktivitas yang sudah `completed`**, bukan angka yang disimpan terpisah, supaya angka di kartu, agenda, dan dasbor tidak pernah berbeda.
- **Tenggat = satu sumber data** dipakai bersama oleh Beranda ("Tenggat terdekat") dan Dasbor ("tugas belum selesai"); tidak ada dua daftar yang bisa berbeda isi. Tenggat memakai tanggal absolut (`dueAt`) yang dihitung relatif terhadap jam device.
- Jadwal mingguan (13 baris) terpisah dari daftar pertemuan per mata kuliah: yang pertama=jadwal, yang kedua=unit materi.

**Konsekuensi desain yang harus dipenuhi**
- Kelas berlangsung **malam (18.10–21.10)** dan Sabtu pagi → "hari ini" sering kosong di pagi; agenda harus menaruh kelas berikutnya, bukan layar kosong.
- **Nama ruangan panjang** → baris agenda memakai versi singkat ("L3 · Lab 8"), versi lengkap di detail.
- **Nama mata kuliah campur kapital** → UI menormalkan kapitalisasi tampilan, data mentah tetap apa adanya.
- `name` = bentuk ternormalisasi (title case) untuk tampilan, `nameRaw` = string asli dari jadwal kampus. Hanya satu mata kuliah yang sumbernya tidak title case: "Manajemen proyek sistem informasi".
- **11 mata kuliah, 21 SKS** → daftar mata kuliah padat; urutan & filter jadi penting. 2 mata kuliah muncul di dua hari berbeda (Praktikum Analisis Data, Praktikum Rekayasa Web) → kartu harus menampilkan jadwal berikutnya, bukan satu slot.
- `credits` per mata kuliah = total SKS dari seluruh slot jadwalnya (dua lab dua-slot masing-masing 2 SKS), sehingga totalnya 21 SKS.
- Data diperluas: tiap mata kuliah punya progres, materi berikutnya, dan daftar pertemuan/aktivitas (2–4 pertemuan, materi/-diskusi/kuis) supaya Detail MK tidak kosong.

## 6. Halaman

### 6.1 Beranda (`/beranda`)

Urutan dari atas:

1. **Sapaan ringkas** — satu baris: nama, tanggal, dan ringkasan hari ini ("2 kelas · berikutnya 18.30"). Angka-angka tidak lagi jadi 3 kartu besar; kalau ada angka, angka itu punya aksi (link).
2. **Jadwal hari ini** (blok utama, lebar penuh) — daftar timeline, satu baris per pertemuan:
   - kolom kiri: jam mulai–selesai (`18.30–20.20`)
   - tengah: nama mata kuliah (2 baris, clamp), nama dosen (1 baris, clamp)
   - kanan: ruang singkat + status
   - **status dihitung dari jam device**: *Berlangsung* (emas, dengan titik berdenyut) · *Selesai* (abu) · *Akan datang* (netral, dengan "dalam 2 jam")
   - baris yang sudah lewat **tidak hilang**: tetap tampil dengan status Selesai dan aksi "Lanjut ke materi berikutnya".
   - **seluruh baris bisa diklik** → `/mata-kuliah/:id` mata kuliah tersebut.
   - kondisi kosong: "Tidak ada kelas hari ini" + kelas berikutnya (hari & jam).
3. **Dua kolom di bawahnya**:
   - kiri (lebih lebar): **Tenggat terdekat** (daftar, tenggat mendesak ditandai) lalu **Pengumuman kampus** (daftar 3, dengan kategori sebagai label teks biasa).
   - kanan: **Lanjutkan belajar** (3 kartu mk dengan materi berikutnya + progres) lalu **Kalender** (bulan berjalan, hari ini ditandai, titik pada hari ada agenda).

Yang dihapus: hero gradien, 3 kartu statistik, blok cover kosong.

### 6.2 Dasbor (`/dasbor`)

- Judul + satu kalimat tujuan.
- **4 angka ringkas** (rata-rata progres, total SKS, mk selesai, tugas belum selesai) — sebagai baris angka tanpa ikon kotak bulat, masing-masing punya aksi ke daftar terkait.
- **Progres per mata kuliah** (kiri): daftar mk dengan bar progres + nilai persen, diklik ke detail.
- **Tugas &materials** (kanan): daftar materi/-diskusi/kuis yang belum selesai, diklik ke mata kuliahnya. Warna bar mengikuti §4.1 (biru = progres, hijau = selesai, abu = belum) — satu bahasa warna di seluruh aplikasi.

### 6.3 Mata Kuliah Saya (`/mata-kuliah`)

- Judul + baris konteks (program, kelas, total SKS, jumlah mk).
- **Strip profil** diganti ringkasan satu baris + filter, bukan kartu besar.
- Pencarian (nama mata kuliah atau dosen) + filter status (Semua / Sedang dipelajari / Selesai) + pengurutan + toggle grid/list — dipertahankan, tapi dengan gaya token baru. Placeholder search diperbaiki jadi "Cari mata kuliah atau dosen" (sekarang promise "materi atau mata kuliah" padahal materi tidak dicari).
- **Kartu mata kuliah** (grid 3 kolom di desktop, 1 di mobile):
  - kepala: SKS + jadwal berikutnya (bukan blok warna kosong, bukan kode rekaan)
  - nama mk (clamp 2 baris) + dosen
  - **jadwal berikutnya** ("Senin · 18.30 · L3 Lab 8") — penting karena satu mk punya 2 slot
  - bar progres + persen + materi berikutnya
  - aksi: "Lanjutkan Belajar"

### 6.4 Detail Mata Kuliah (`/mata-kuliah/:id`)

- Breadcrumb, nama mk, SKS, dosen, program/kelas.
- **Kelas berikutnya** (jadwal + ruang) sebagai blok kecil di samping judul.
- **Progres belajar** (bar + persen + jumlah pertemuan selesai).
- **Daftar pertemuan**: accordion per pertemuan (nomor, judul, status) berisi aktivitas (materi/diskusi/kuis) dengan format, ukuran berkas, dan aksi.
- Status pertemuan memakai chip yang bermakna (Selesai / Berjalan / Belum).

### 6.5 Halaman Panduan Pengguna (`/panduan`)

- Rute publik (bisa dibaca sebelum login), tautan dari tombol "Bantuan login" di halaman login dan dari footer.
- `<h1>Panduan Penggunaan LearnEase</h1>` lalu enam bagian ber-`<section aria-labelledby>` dengan `<h2>`: Cara masuk · Lupa kata sandi · Memahami Beranda · Mengikuti kelas · Enrollment key · Kontak bantuan.
- Isi diambil dari panduan Moodle yang dipakai POLSRI, ditulis ulang untuk LearnEase (bukan disalin): cara masuk memakai NIP/NPH/NPM, sesi tersimpan di perangkat; lupa kata sandi menjelaskan alur ke admin/SIAKAD dan menyatakan dengan jujur bahwa pemulihan otomatis belum tersedia; bagian lain menjelaskan fitur yang benar-benar ada (jadwal hari ini, tenggat, pengumuman, lanjutkan belajar, materi per pertemuan).
- Gaya: kelas token, tanpa kelas literal, ukuran teks ≥ 13px.

### 6.6 Navbar & chrome

- Navbar: logo, 3 item navigasi, pencarian, **tombol tema `SunMoon`**, menu pengguna. Di mobile: logo + tombol tema + menu (Notch) yang sudah ada.
- Letak tombol tema: sebelum menu pengguna, dengan `aria-label` yang menyebut aksi ("Ganti ke mode gelap").
- Footer stayed minimal: nama lisensi & tahun.

## 7. Komponen

**Baru**
- `ThemeToggle` — next-themes, ikon `SunMoon`, accessible.
- `TodaySchedule` — blok jadwal hari ini (agenda), termasuk status & empty state.
- `StatusChip` — chip status (Berlangsung/Selesai/Akan datang/Mendesak).
- `TokenLayer` — file CSS yang mendefinisikan token terang/gelap.

**Diperbarui (pola, bukan nama)**
- `WelcomeBanner` → jadi sapaan satu baris (§6.1.1).
- `StatCard` → jadi `StatStrip` (baris angka tanpa ikon kotak).
- `CourseCard` → kartu mk baru (§6.3).
- `AnnouncementCard` → baris pengumuman; kategori jadi label teks, bukan badge besar.
- `DeadlineList` → daftar tenggat dengan status yang konsisten.
- `CalendarWidget` → tetap, dengan gaya token baru + penanda hari ini yang sudah ada.
- `Badge`, `Button`, `Card`, `ProgressBar`, `Tabs`, `Accordion` → gaya token baru; ikon di dalam tombol tetap.

**Tidak dipakai / dihapus**
- Hero gradien, blok cover kosong, 3 kartu statistik ikon.
- `src/hooks/useCountUp.js` & `useReveal.js` (dari landing) — tidak ada; Reveal cukup dengan CSS.

## 8. Aturan responsif

| Lebar | Perilaku |
|---|---|
| ≥ 1024px | Beranda: agenda penuh; bawahnya 2 kolom (kiri 1,6fr / kanan 1fr). Mata Kuliah: grid 3 kolom. Detail: daftar pertemuan 2 kolom (pertemuan + ringkasan). |
| 768–1023px | Beranda: agenda penuh; bawahnya 1 kolom. Mata Kuliah: grid 2 kolom. |
| < 768px | Semua 1 kolom. Agenda jadi baris bertumpuk (jam → nama → ruang + status) dan tetap bisa diklik. Kartu mk 1 kolom. Navbar jadi logo + tema + menu. |

Target: tidak ada overflow horizontal di 360, 390, 768, 1024, 1366, 1440, 1920.

## 9. Aksesibilitas

- Semua elemen interaktif adalah `<button>`/`<a>` asli; agenda adalah `<ul>` dengan `<li>` berisi link.
- Fokus selalu terlihat (ring fokus 2px, offset 2px), tidak dihapus.
- Kontras teks minimal 4,5:1 di kedua tema; chip status tidak mengandalkan warna saja (ada teks + bentuk).
- Ikon dekoratif `aria-hidden`; tombol tema punya `aria-label` dinamis.
- `prefers-reduced-motion` mematikan semua transisi & masuk.

## 10. Verifikasi (wajib per halaman)

1. Screenshot mode terang & gelap di 1440×900 dan 390×844.
2. `npm run build` sukses; tidak ada error/warning console; tidak ada request gagal.
3. Tidak ada overflow horizontal di 360/390/768/1024/1366/1440/1920.
4. Navigasi keyboard: agenda bisa di-tab dan di-enter; toggle tema bisa di-operasi keyboard.
5. Mode gelap: toggle bertahan setelah reload (localStorage).
6. Audit desain per halaman: tidak boleh menambah temuan baru; targetnya 0 FAIL baru di luar komponen dekoratif. Alat bantu (skrip cek browser, audit) dijalankan dari luar repo — tidak ada dependency dev baru yang masuk ke `package.json`.

## 11. Urutan pengerjaan

1. Token warna/tipografi + `ThemeProvider` + `ThemeToggle` (fondasi, semua halaman ikut).
2. Data mock baru (jadwal, mata kuliah, profil) + service/hook yang menyajikannya.
3. Beranda (agenda hari ini dulu, lalu sisanya).
4. Mata Kuliah Saya + Detail Mata Kuliah.
5. Dasbor.
6. Rapor akhir: dua tema, semua breakpoint, audit, dokumentasi (`DOKUMENTASI.md` diperbarui).

Setiap langkah = satu commit, diverifikasi dengan §10 sebelum lanjut.

## 12. Yang sudah diputuskan saat review

- **Halaman Panduan Pengguna** (`/panduan`) dibuat sebagai rute publik, menggantikan tombol "Bantuan login" yang selama ini mati. Isinya mengikuti panduan Moodle POLSRI, ditulis ulang untuk LearnEase.
- **Enrollment key tidak dibuat** di tahap ini: itu fitur dosen/admin (membuat kunci self-enrollment) dan LearnEase belum punya pembuatan mk, enrollment, maupun peran dosen. Masuk daftar pekerjaan lanjutan bersama area Dosen/Admin.
- **Pohon course categories tidak dibuat**: di Moodle itu katalog seluruh mk di situs (ratusan, lintas program). Untuk portal mahasiswa cukup daftar 11 mk + filter. Kalau nanti melayani beberapa kelas/program, padanannya filter "Kelas/Program" di halaman Mata Kuliah — field `class` dan `program` sudah ada di data.

- **Nama menu**: "Mata Kuliah Saya" tetap (bahasa yang sudah dipakai mahasiswa).
- **Kalender di Beranda**: tetap ada di kolom kanan, dibangun ulang dengan token baru (ia satu-satunya cara melihat bulan penuh + tandai hari ini).
- **Label login**: "NIP / NPM / NIK" → **"NIP / NPH / NPM"** sesuai aturan pendaftaran resmi POLSRI (label, placeholder, pesan validasi, teks bantuan, paragraf pengantar). Tetap halaman gelap, hanya teksnya yang dikoreksi.
- **Tanggal demo**: tidak dipin. "Hari ini" memakai jam device sungguhan; hari tanpa kelas menampilkan kondisi kosong yang dirancang baik (bukan layar rusak), jadi prototipe tetap utuh kapan pun dibuka.
- **Kode mata kuliah**: tidak ditampilkan (data asli tidak punya); URL memakai slug.
