# Prompt dan bahan Copilot: Landing Page LearnEase

## Cara pakai
1. Salin file `learnease-landing.html` ke folder `design/` di repo (jadi `design/learnease-landing.html`). File ini adalah referensi visual dan perilaku, **bukan** untuk dipakai langsung.
2. Buka Copilot Chat (mode **Agent**), lalu tempel **Bagian 1: Prompt utama** di bawah.
3. Jika Copilot meminta data atau token, arahkan ke **Bagian 2: Bahan**. Tempel isinya jika perlu.
4. Setelah selesai, jalankan **Bagian 3: Prompt verifikasi**.

---

## Bagian 1: Prompt utama (tempel ke Copilot)

```
Kamu adalah senior frontend engineer. Proyek ini adalah LearnEase LMS POLSRI (React 18 + Vite 6 + Tailwind 3.4 + React Router 6 + lucide-react, data dari JSON lokal di src/data/).

TUGAS
Ubah file referensi design/learnease-landing.html menjadi landing page React yang terintegrasi dengan proyek. Baca file referensi itu sampai selesai (HTML, CSS, dan script di bagian bawah) sebelum menulis kode. Kesetiaan visual dan perilaku terhadap referensi adalah prioritas.

ATURAN UMUM
- Jangan menambah dependency baru. Jangan mengubah halaman yang sudah login (Beranda, Dasbor, Mata Kuliah, Detail) kecuali yang disebut di bawah.
- Semua teks UI dalam bahasa Indonesia. Gunakan bahan teks pada "Bagian 2" di file copilot-landing-prompt.md bila perlu.
- Jangan menyalin <style> mentah ke satu file besar. Pecah menjadi komponen React + Tailwind. CSS custom hanya untuk hal yang tidak bisa dengan Tailwind (variabel tema, keyframes, kalender, bar progres).
- Jangan menyentuh CSS global aplikasi. Semua variabel tema landing harus di-scope ke kelas `.landing-root` (buat src/styles/landing.css, impor dari LandingPage.jsx).
- Baca dulu file yang relevan: src/routes/AppRouter.jsx, src/pages/SplashPage.jsx, src/components/ui/PolsriLogo.jsx, src/context/AuthContext.jsx, src/hooks/useAuth.js, src/utils/formatDate.js, tailwind.config.js, src/styles/index.css, index.html, src/data/*.json.

STRUKTUR FILE YANG DIBUAT
src/pages/LandingPage.jsx
src/components/landing/LandingNav.jsx       (navbar pil melayang + menu overlay mobile)
src/components/landing/Hero.jsx             (hero + kartu mockup tenggat dan progres)
src/components/landing/FeatureBento.jsx     (bento 4 kartu: Tenggat, Progres, Kalender, Pengumuman)
src/components/landing/Steps.jsx            (3 langkah masuk)
src/components/landing/FinalCta.jsx
src/components/landing/LandingFooter.jsx
src/components/landing/Bezel.jsx            (komponen shell + core, prop: className, children)
src/components/landing/PillButton.jsx       (tombol dengan ikon dalam lingkaran, varian: primary | yellow | ghost, ukuran: md | sm)
src/hooks/useReveal.js                      (IntersectionObserver)
src/styles/landing.css

ROUTING
- Rute `/` sekarang SplashPage. Ganti menjadi LandingPage (publik).
- Jika pengguna sudah login (cek lewat useAuth), `/` mengarahkan ke `/beranda`.
- Semua tombol "Masuk" memakai <Link to="/login"> dari react-router-dom, bukan <a href>.
- Link anchor (#fitur, #mulai) di navbar: gunakan scrollIntoView({behavior:'smooth'}) dan tutup menu mobile setelah diklik.
- Biarkan file SplashPage.jsx tetap ada tetapi tidak dirutekan (jangan dihapus).
- Perbaiki NotFoundPage: tombol kembali ke /login jika belum login, ke /beranda jika sudah login.

DATA DINAMIS (jangan di-hardcode seperti di HTML referensi)
- Hero (kartu mockup) dan bento kartu "Tenggat": ambil 3 tenggat belum selesai terdekat dari src/data/deadlines.json via homeService atau useHomeData. Label tanggal: "Hari ini", "Besok", atau "15 Okt" dihitung dengan helper baru `relativeDay(date)` di src/utils/formatDate.js. Badge "Mendesak" jika <= 2 hari, selain itu "Akan datang".
- Bar progres: ambil 2 mata kuliah di Hero dan 3 mata kuliah di bento dari src/data/courses.json (urutkan progres tertinggi). Animasi bar memakai transform: scaleX.
- Kalender: bangkitkan bulan berjalan dari new Date() (awal pekan Senin, label Sen..Min), tandai hari ini, dan beri titik kuning pada tanggal yang punya tenggat dari deadlines.json. Tambahkan aria-label pada tanggal bertanda (contoh: "15 Oktober, tenggat: Membuat formulir interaktif").
- Pengumuman: ambil 3 pengumuman dari src/data/announcements.json. Warna tag per kategori: Akademik = biru, Beasiswa = kuning, Kegiatan = hijau.
- Jika data kosong, tampilkan empty state singkat, jangan merender kartu kosong.

TAMPILAN DAN PERILAKU (ikuti file referensi)
- Gaya "Soft Structuralism": latar abu-biru muda, kartu putih berlapis ganda (Bezel: outer shell p-1.5 rounded-[2rem] + inner core rounded-[calc(2rem-6px)] dengan inner highlight).
- Navbar: pil melayang di tengah atas (fixed), glass blur hanya di navbar dan overlay. Di bawah 768px tampilkan hamburger yang berubah jadi X; menu terbuka sebagai overlay layar penuh dengan link muncul bertahap (stagger).
- Tombol: pill dengan ikon panah di dalam lingkaran; saat hover lingkaran bergeser sedikit ke kanan-atas, saat active scale 0.98.
- Reveal saat scroll: fade-up + blur ringan (translateY 40px, blur 8px -> 0) lewat useReveal (IntersectionObserver, jangan pakai scroll listener). Dukung data-delay untuk stagger.
- Semua transisi memakai cubic-bezier(0.32, 0.72, 0, 1). Dilarang linear atau ease-in-out.
- Hanya animasikan transform dan opacity (filter blur hanya pada reveal awal).
- Respek prefers-reduced-motion: matikan animasi, tampilkan konten langsung.
- Dukung mode gelap lewat variabel CSS dan @media (prefers-color-scheme: dark) di dalam .landing-root.
- Responsif: di bawah 900px bento menjadi satu kolom; hilangkan rotasi kartu mockup dan offset vertikal Steps di bawah 960px/900px. Gunakan min-h-[100dvh], bukan h-screen.
- Gunakan komponen PolsriLogo yang sudah ada sebagai logo (ganti monogram "L" di referensi).
- Ikon: lucide-react dengan strokeWidth={1.25} dan ukuran 16-20, atau SVG inline. Jangan memakai stroke tebal default.

FONT
- Tambahkan Bricolage Grotesque (500, 600, 700) di index.html lewat Google Fonts (preconnect + display=swap), berdampingan dengan Plus Jakarta Sans yang sudah ada. Daftarkan sebagai `fontFamily.display` di tailwind.config.js. Jangan ubah font aplikasi lain.
- Jangan menambahkan letter-spacing negatif pada teks isi. Judul besar maksimal -0.01em.

AKSESIBILITAS
- Gunakan <header>, <nav>, <main>, <section aria-labelledby>, <footer>.
- Tombol hamburger: aria-label, aria-expanded, aria-controls. Tutup menu dengan tombol Esc. Kunci scroll body saat menu terbuka dan kembalikan saat ditutup (termasuk saat komponen unmount).
- Fokus terlihat (focus-visible ring) di semua elemen interaktif. Kontras teks minimal WCAG AA.

KRITERIA SELESAI
- `npm run build` berhasil tanpa warning baru.
- Visual landing di desktop (1440px) dan mobile (390px) sejajar dengan design/learnease-landing.html.
- Tidak ada angka atau tanggal yang di-hardcode untuk tenggat, kalender, dan progres.
- Pengguna belum login di `/` melihat landing; yang sudah login diarahkan ke /beranda.
- Di akhir, berikan ringkasan: file yang dibuat/diubah dan alasan, serta hal yang tidak bisa kamu lakukan.
```

---

## Bagian 2: Bahan

### 2.1 Token warna (scope ke `.landing-root`)

| Token | Terang | Gelap |
|---|---|---|
| `--bg` | `#EEF2F8` | `#050B16` |
| `--ink` | `#0A1A33` | `#EAF0FA` |
| `--mut` (teks sekunder) | `#52627A` | `#9AA9C0` |
| `--card` | `#FFFFFF` | `#0D1829` |
| `--shell` | `rgba(10,26,51,.05)` | `rgba(255,255,255,.045)` |
| `--hair` (garis tipis) | `rgba(10,26,51,.09)` | `rgba(255,255,255,.09)` |
| `--blue` (tombol, bar) | `#0B57B7` | `#0B57B7` |
| `--acc` (teks aksen) | `#0B57B7` | `#6FA6F5` |
| `--yel` | `#F5B800` | `#F5B800` |
| `--hi` (inner highlight) | `rgba(255,255,255,.9)` | `rgba(255,255,255,.08)` |
| `--track` (latar bar) | `rgba(10,26,51,.08)` | `rgba(255,255,255,.09)` |
| `--ov` (overlay/nav) | `rgba(238,242,248,.86)` | `rgba(5,11,22,.86)` |

Easing global: `cubic-bezier(0.32, 0.72, 0, 1)`.

### 2.2 Tambahan `tailwind.config.js`

```js
theme: {
  extend: {
    fontFamily: {
      display: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
    },
    transitionTimingFunction: {
      fluid: 'cubic-bezier(0.32, 0.72, 0, 1)',
    },
  },
},
```

### 2.3 Tag font untuk `index.html`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;600;700&display=swap" rel="stylesheet">
```

### 2.4 Teks (copy) final

| Bagian | Teks |
|---|---|
| Eyebrow hero | LMS Politeknik Negeri Sriwijaya |
| H1 | Tugas, jadwal, dan materi kuliah Anda di *satu tempat.* (kata "satu tempat." berwarna aksen) |
| Lead | LearnEase menampilkan tenggat terdekat, progres tiap mata kuliah, dan pengumuman kampus, tanpa perlu membuka banyak tab atau grup chat. |
| CTA utama | Masuk dengan akun akademik |
| CTA sekunder | Lihat fitur |
| Catatan | Gunakan NIP, NPM, atau NIK. Versi prototipe, data masih contoh. |
| Judul bagian fitur | Yang Anda butuhkan hari ini, langsung terlihat. |
| Sub fitur | Setiap halaman menjawab satu pertanyaan: apa yang harus saya kerjakan, dan sejauh mana saya sudah belajar. |
| Kartu 1 | **Tenggat diurutkan dari yang paling dekat.** Tugas yang jatuh tempo dalam dua hari diberi tanda mendesak, jadi tidak ada yang terlewat. |
| Kartu 2 | **Progres per mata kuliah.** Enam mata kuliah, 18 SKS, rata-rata progres terlihat dalam satu layar. (angka diambil dari data, bukan di-hardcode) |
| Kartu 3 | **Kalender perkuliahan.** Tanggal tenggat ditandai titik kuning. |
| Kartu 4 | **Kabar akademik dan beasiswa dalam satu daftar.** |
| Judul langkah | Tiga langkah, tanpa pelatihan. |
| Langkah 1 | **Masuk.** Isi NIP, NPM, atau NIK dan kata sandi akun akademik Anda. |
| Langkah 2 | **Buka Beranda.** Lihat tenggat terdekat, jadwal hari ini, dan pengumuman terbaru. |
| Langkah 3 | **Lanjutkan belajar.** Pilih mata kuliah, buka pertemuan berikutnya, dan pantau progres Anda. |
| CTA akhir | **Mulai dari tenggat yang paling dekat.** Masuk dengan akun akademik dan lihat apa yang perlu dikerjakan minggu ini. Tombol: Masuk ke LearnEase |
| Footer | © 2026 Politeknik Negeri Sriwijaya · Prototipe LearnEase LMS |

### 2.5 Peta bagian ke komponen

| Bagian di HTML referensi | Komponen React | Sumber data |
|---|---|---|
| `.nav` + `.ov` | `LandingNav` | none |
| `.hero` | `Hero` | `deadlines.json`, `courses.json` |
| `.bento .a` | `FeatureBento` (kartu tenggat) | `deadlines.json` |
| `.bento .b` | `FeatureBento` (kartu progres) | `courses.json` |
| `.bento .c` + `#cal` | `FeatureBento` (kalender) | `deadlines.json` + `new Date()` |
| `.bento .d` | `FeatureBento` (pengumuman) | `announcements.json` |
| `#mulai` | `Steps` | statis |
| `.fin` | `FinalCta` | statis |
| `footer` | `LandingFooter` | statis |

### 2.6 Hal yang sengaja dihindari (jangan ditambahkan Copilot)
- Ilustrasi laptop, ikon melayang (topi wisuda, bohlam, dll.), dan teks motivasional kosong.
- Gradasi ungu, glow berlebihan, atau bayangan gelap tebal.
- Font Inter/Roboto, stroke ikon tebal, dan transisi `linear`/`ease-in-out`.
- Angka palsu (jumlah pengguna, rating, testimoni) yang tidak ada di data.

---

## Bagian 3: Prompt verifikasi (tempel setelah Copilot selesai)

```
Periksa hasil landing page yang baru kamu buat terhadap daftar ini, lalu perbaiki yang belum terpenuhi. Laporkan hanya yang kamu ubah.

1. Tidak ada tenggat, tanggal, persentase progres, atau jumlah SKS yang di-hardcode di komponen landing.
2. Kalender: titik kuning hanya muncul pada tanggal yang punya tenggat di deadlines.json; hari ini ditandai; label aria ada.
3. Menu mobile: Esc menutup menu, scroll body terkunci saat terbuka dan kembali normal saat ditutup atau unmount, fokus tidak lolos ke belakang overlay.
4. Tidak ada scroll event listener; reveal memakai IntersectionObserver dan observer dibersihkan saat unmount.
5. prefers-reduced-motion: semua konten langsung terlihat, tidak ada animasi.
6. Mode gelap: kontras teks pada kartu, tag, dan tombol kuning tetap terbaca.
7. Di lebar 390px tidak ada scroll horizontal, tidak ada elemen yang saling menimpa, dan tombol punya area sentuh minimal 44px.
8. Pengguna yang sudah login membuka `/` diarahkan ke /beranda; NotFoundPage mengarah ke tujuan yang benar.
9. Jalankan `npm run build` dan pastikan tidak ada warning baru.
```
