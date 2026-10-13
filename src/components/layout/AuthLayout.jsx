import { Outlet } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  Calculator,
  Code2,
  GraduationCap,
  Lightbulb,
  Pencil,
} from 'lucide-react';
import PolsriLogo from '../ui/PolsriLogo';

const mobileDecorations = [
  { Icon: BookOpen, className: 'left-[8%] top-[16%] auth-mobile-float-1', tone: 'text-accent/70' },
  { Icon: Code2, className: 'right-[9%] top-[17%] auth-mobile-float-2', tone: 'text-white/65' },
  { Icon: Lightbulb, className: 'bottom-[13%] right-[11%] auth-mobile-float-3', tone: 'text-accent/65' },
  { Icon: GraduationCap, className: 'bottom-[14%] left-[12%] auth-mobile-float-4', tone: 'text-white/55' },
  { Icon: Pencil, className: 'left-[18%] top-[35%] auth-mobile-float-5', tone: 'text-accent/65' },
];

const desktopDecorations = [
  { Icon: GraduationCap, className: 'left-[6%] top-[20%] auth-desktop-float-1', tone: 'text-white/55' },
  { Icon: Pencil, className: 'right-[7%] top-[28%] auth-desktop-float-2', tone: 'text-accent/60' },
  { Icon: Calculator, className: 'left-[5%] top-[53%] auth-desktop-float-3', tone: 'text-white/60' },
  { Icon: BarChart3, className: 'right-[6%] top-[61%] auth-desktop-float-4', tone: 'text-accent/60' },
];

function renderFloatingIcon({ Icon, className, tone }, size = 24) {
  const isLightbulb = Icon === Lightbulb;

  return (
    <span
      key={className}
      aria-hidden="true"
      className={`auth-float pointer-events-none absolute z-[1] flex h-10 w-10 items-center justify-center ${className}`}
    >
      <Icon
        size={size}
        strokeWidth={1.7}
        className={`${tone} ${isLightbulb ? 'auth-flicker' : ''}`}
      />
    </span>
  );
}

function renderFloatingDot(className) {
  return (
    <span
      key={className}
      aria-hidden="true"
      className={`auth-float auth-dot pointer-events-none absolute z-[1] h-2 w-2 rounded-full bg-accent/20 ${className}`}
    />
  );
}

function AuthLayout({ children }) {
  return (
    <main className="min-h-screen overflow-hidden bg-background md:grid md:grid-cols-2">
      <section
        aria-label="Portal Pembelajaran Digital POLSRI"
        className="auth-noise relative isolate flex h-[40vh] min-h-[300px] max-h-[380px] flex-col items-center justify-center overflow-hidden bg-primary px-6 text-center text-white md:hidden"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 18% 12%, rgba(0, 86, 179, 0.95), transparent 52%), radial-gradient(ellipse at 82% 88%, rgba(0, 61, 130, 0.96), transparent 58%), linear-gradient(135deg, #0056B3 0%, #003D82 100%)',
        }}
      >
        <span aria-hidden="true" className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-accent/10 blur-[70px]" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" />
        {mobileDecorations.map((decoration) => renderFloatingIcon(decoration, 21))}
        {renderFloatingDot('left-[27%] bottom-[10%] auth-mobile-float-6')}
        {renderFloatingDot('right-[25%] top-[11%] auth-mobile-float-7')}
        <div className="relative z-10 flex flex-col items-center">
          <PolsriLogo size={58} className="mb-3 drop-shadow-sm" />
          <h2 className="text-lg font-bold leading-tight text-white">
            Portal Pembelajaran Digital POLSRI
          </h2>
          <p className="mt-2 text-xs font-semibold text-accent">
            Politeknik Negeri Sriwijaya • Palembang
          </p>
        </div>
      </section>

      <section
        className="auth-noise relative isolate hidden min-h-screen overflow-hidden bg-primary px-12 py-10 text-white md:flex md:flex-col"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 18% 12%, rgba(0, 86, 179, 0.95), transparent 52%), radial-gradient(ellipse at 82% 88%, rgba(0, 61, 130, 0.96), transparent 58%), linear-gradient(135deg, #0056B3 0%, #003D82 100%)',
        }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-24 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[100px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -right-24 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[110px]" />
        {desktopDecorations.map((decoration) => renderFloatingIcon(decoration, 25))}
        {renderFloatingDot('left-[16%] top-[39%] auth-desktop-float-5')}
        {renderFloatingDot('right-[18%] top-[43%] auth-desktop-float-6')}
        {renderFloatingDot('left-[24%] bottom-[16%] auth-desktop-float-7')}
        <div className="relative z-10 mx-auto flex w-full max-w-xl items-center gap-3">
          <PolsriLogo size={44} className="shrink-0" />
          <span className="text-xl font-bold tracking-tight">LearnEase</span>
        </div>

        <div className="relative z-10 mx-auto my-auto w-full max-w-xl py-12">
          <div className="relative mx-auto mb-12 flex h-64 max-w-md items-center justify-center">
            <div aria-hidden="true" className="absolute h-56 w-56 rounded-full bg-white/5" />
            <div aria-hidden="true" className="absolute h-44 w-72 border-2 border-white/75 [clip-path:polygon(0_35%,28%_35%,28%_15%,50%_0,72%_15%,72%_35%,100%_35%,100%_80%,0_80%)]" />
            <div className="relative mt-12 flex h-36 w-56 flex-col items-center justify-center rounded-xl border-2 border-white bg-primary-dark/70 shadow-xl">
              <div className="flex h-28 w-48 items-center justify-center rounded-md bg-blue-500/70 text-accent">
                <Code2 size={54} strokeWidth={1.5} aria-hidden="true" className="auth-float auth-desktop-float-10" />
              </div>
              <span aria-hidden="true" className="absolute -bottom-3 h-3 w-64 bg-white/80 [clip-path:polygon(0_0,100%_0,92%_100%,8%_100%)]" />
            </div>
            <span aria-hidden="true" className="auth-float auth-desktop-float-8 absolute left-0 top-24 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-accent">
              <BookOpen size={26} />
            </span>
            <span aria-hidden="true" className="absolute right-2 top-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-accent">
              <PolsriLogo size={28} />
            </span>
            <span aria-hidden="true" className="auth-float auth-desktop-float-9 absolute bottom-3 right-0 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-accent">
              <Lightbulb size={26} className="auth-flicker" />
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight">Portal Pembelajaran Digital POLSRI</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-white/75">
            Satu ruang untuk belajar, berkolaborasi, dan berkembang bersama Politeknik Negeri Sriwijaya.
          </p>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-2 text-sm text-white/75">
          <p>Terhubung dengan perjalanan akademik Anda</p>
          <p>Politeknik Negeri Sriwijaya <span aria-hidden="true">•</span> Palembang</p>
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
