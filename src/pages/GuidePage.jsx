// src/pages/GuidePage.jsx — halaman panduan pengguna, publik (di luar MainLayout).
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function GuideSection({ id, title, paragraphs }) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="rounded-card border border-border bg-surface-2 dark:shadow-card p-6 sm:p-8"
    >
      <h2 id={`${id}-heading`} className="text-xl font-bold text-main">
        {title}
      </h2>
      <div className="mt-3 space-y-3">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-6 text-secondary">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

const sections = [
  {
    id: 'cara-masuk',
    title: 'Cara masuk',
    paragraphs: [
      'Buka LearnEase di peramban Anda, lalu halaman masuk akan meminta NIP, NPH, atau NPM beserta kata sandi (minimal 6 karakter). Isi keduanya, kemudian pilih tombol Masuk.',
      'Selama sesi masih tersimpan di peramban, membuka LearnEase lagi akan langsung membawa Anda ke Beranda tanpa perlu memasukkan identitas ulang.',
    ],
  },
  {
    id: 'lupa-kata-sandi',
    title: 'Lupa kata sandi',
    paragraphs: [
      'Pemulihan kata sandi otomatis belum tersedia di LearnEase. Kontrol Lupa kata sandi di halaman masuk saat ini hanya menampilkan pemberitahuan bahwa fitur tersebut belum ada.',
      'Jika kata sandi Anda terlupakan, hubungi admin LMS POLSRI agar akun dapat diatur ulang.',
    ],
  },
  {
    id: 'memahami-beranda',
    title: 'Memahami Beranda',
    paragraphs: [
      'Beranda adalah pusat kegiatan harian Anda: jadwal kelas hari ini, tenggat yang paling dekat, dan pengumuman kampus tersusun di halaman ini.',
      'Setiap baris jadwal hari ini terhubung ke halaman mata kuliahnya, kartu Lanjutkan belajar menampung mata kuliah yang belum selesai Anda kerjakan, dan kalender di sisi kanan menampilkan agenda sebulan penuh.',
    ],
  },
  {
    id: 'mengikuti-kelas',
    title: 'Mengikuti kelas',
    paragraphs: [
      'Halaman Mata Kuliah Saya memuat daftar seluruh mata kuliah Anda. Gunakan pencarian untuk mencari berdasarkan nama mata kuliah atau dosen, saring berdasarkan status, urutkan daftarnya, lalu pilih tampilan kisi atau daftar.',
      'Di halaman setiap mata kuliah Anda menemukan jadwal kelas berikutnya, tingkat kemajuan belajar, serta daftar pertemuan yang memuat materi, ruang diskusi, dan kuis.',
    ],
  },
  {
    id: 'enrollment-key',
    title: 'Enrollment key',
    paragraphs: [
      'Fitur pendaftaran mandiri memakai kunci mata kuliah (enrollment key) belum tersedia di LearnEase.',
      'Sementara itu, daftar mata kuliah Anda ditetapkan oleh pihak LMS. Jika ada mata kuliah yang belum muncul di daftar, hubungi admin LMS POLSRI agar Anda didaftarkan.',
    ],
  },
  {
    id: 'kontak-bantuan',
    title: 'Kontak bantuan',
    paragraphs: [
      'Kendala yang tidak bisa Anda selesaikan sendiri — akun, kata sandi, atau mata kuliah yang tidak muncul — dibantu oleh admin LMS POLSRI.',
      'Hubungi admin melalui SIAKAD atau langsung ke unit administrasi kampus. LearnEase tidak menyediakan nomor telepon maupun surel bantuan; poin kontak resmi selalu diumumkan lewat kanal kampus.',
    ],
  },
];

function GuidePage() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo-polsri.png"
              alt="Logo Politeknik Negeri Sriwijaya"
              width="36"
              height="36"
            />
            <span className="font-display text-base font-semibold text-main">
              LearnEase
            </span>
          </div>
          <Link
            to={isAuthenticated ? '/beranda' : '/login'}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {isAuthenticated ? 'Kembali ke Beranda' : 'Kembali ke halaman masuk'}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-main">
          Panduan Penggunaan LearnEase
        </h1>
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <GuideSection key={section.id} {...section} />
          ))}
        </div>
      </main>

      <footer className="border-t border-border">
        <p className="mx-auto w-full max-w-3xl px-5 py-5 text-sm text-secondary sm:px-8">
          © {new Date().getFullYear()} Politeknik Negeri Sriwijaya
        </p>
      </footer>
    </div>
  );
}

export default GuidePage;
