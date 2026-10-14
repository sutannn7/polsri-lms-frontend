import { Outlet } from 'react-router-dom';
import PolsriLogo from '../ui/PolsriLogo';

function AuthLayout({ children }) {
  return (
    <main className="min-h-screen overflow-hidden bg-background md:grid md:grid-cols-2">
      <section
        aria-label="Portal Pembelajaran Digital POLSRI"
        className="relative flex h-[40vh] min-h-[300px] max-h-[380px] flex-col items-center justify-center overflow-hidden bg-primary px-6 text-center text-white md:hidden"
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
        className="relative hidden min-h-screen flex-col overflow-hidden bg-primary px-12 py-10 text-white md:flex"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 18% 12%, rgba(0, 86, 179, 0.95), transparent 52%), radial-gradient(ellipse at 82% 88%, rgba(0, 61, 130, 0.96), transparent 58%), linear-gradient(135deg, #0056B3 0%, #003D82 100%)',
        }}
      >
        <div className="mx-auto flex w-full max-w-xl items-center gap-3">
          <PolsriLogo size={44} className="shrink-0" />
          <span className="text-xl font-bold">LearnEase</span>
        </div>

        <div className="mx-auto my-auto w-full max-w-xl py-12">
          <div
            role="img"
            aria-label="Slot untuk foto kampus Politeknik Negeri Sriwijaya"
            data-slot="campus-photo"
            className="mb-9 flex aspect-[16/7] w-full items-end bg-white/10 p-5"
          >
            <p className="text-sm text-white/75">Foto kampus Politeknik Negeri Sriwijaya</p>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Portal Pembelajaran Digital POLSRI
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-white/85">
            Masuk menggunakan akun akademik untuk membuka materi, tugas, dan jadwal perkuliahan.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-col gap-2 text-sm text-white/85">
          <p>Informasi pembelajaran terpusat untuk mahasiswa dan dosen.</p>
          <p>Bantuan akses tersedia melalui pengelola LMS POLSRI.</p>
          <p>Politeknik Negeri Sriwijaya • Palembang</p>
        </div>
      </section>

      <section className="relative z-10 -mt-12 flex items-start justify-center px-5 pb-8 sm:px-8 md:mt-0 md:min-h-screen md:items-center md:py-10">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ring-1 ring-black/5 sm:p-8 md:rounded-2xl md:p-9">
          {children ?? <Outlet />}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
