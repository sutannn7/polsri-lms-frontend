import { Outlet } from 'react-router-dom';
import PolsriLogo from '../ui/PolsriLogo';

const campusBackgroundStyle = {
  backgroundImage:
    'linear-gradient(rgba(0, 61, 130, 0.78), rgba(0, 61, 130, 0.84)), url("/images/kampus-polsri.webp")',
  backgroundPosition: 'center 35%',
  backgroundSize: 'cover',
};

function AuthLayout({ children }) {
  return (
    <main className="min-h-screen overflow-hidden bg-background md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <section
        aria-label="Portal Pembelajaran Digital POLSRI"
        className="relative flex h-[34vh] min-h-[250px] max-h-[340px] flex-col items-center justify-center overflow-hidden bg-primary bg-cover bg-[center_35%] px-6 text-center text-white md:hidden"
        style={campusBackgroundStyle}
      >
        <div className="flex flex-col items-center">
          <PolsriLogo size={58} className="mb-3" />
          <p className="text-lg font-bold leading-tight">LearnEase LMS POLSRI</p>
          <p className="mt-2 text-xs leading-5 text-white/80">
            Akses materi kuliah, tugas, dan jadwal akademik.
          </p>
          <p className="mt-1 text-xs leading-5 text-white/70">
            Bantuan akses tersedia melalui pengelola LMS POLSRI.
          </p>
        </div>
      </section>

      <section
        aria-label="Informasi LearnEase LMS POLSRI"
        className="relative hidden min-h-screen flex-col overflow-hidden bg-primary bg-cover bg-[center_35%] px-8 py-8 text-white md:flex lg:px-14 lg:py-12"
        style={campusBackgroundStyle}
      >
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
          <PolsriLogo size={44} className="shrink-0" />
          <span className="text-xl font-bold">LearnEase</span>
        </div>

        <div className="mx-auto my-auto w-full max-w-2xl py-12">
          <h1 className="max-w-[14ch] text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Portal Pembelajaran Digital POLSRI
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white">
            Masuk menggunakan akun akademik untuk membuka materi, tugas, dan jadwal perkuliahan.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 text-sm text-white">
          <p>Informasi pembelajaran terpusat untuk mahasiswa dan dosen.</p>
          <p>Bantuan akses tersedia melalui pengelola LMS POLSRI.</p>
          <p>Politeknik Negeri Sriwijaya • Palembang</p>
        </div>
      </section>

      <section className="relative z-10 -mt-8 flex items-start justify-center px-5 pb-10 sm:px-8 md:mt-0 md:min-h-screen md:items-center md:px-6 md:py-10 lg:px-10">
        <div className="w-full max-w-[460px] rounded-card border border-border bg-white p-6 shadow-card sm:p-8 lg:p-10">
          {children ?? <Outlet />}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
