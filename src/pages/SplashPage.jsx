import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import PolsriLogo from '../components/ui/PolsriLogo';

const decorations = [
  { Icon: GraduationCap, position: 'left-[8%] top-[14%] splash-float-1', tone: 'text-white/45' },
  { Icon: BookOpen, position: 'right-[8%] bottom-[14%] splash-float-2', tone: 'text-accent/50' },
];

function FloatingIcon({ Icon, position, tone }) {
  return (
    <span
      aria-hidden="true"
      className={`splash-float pointer-events-none absolute z-[1] flex h-9 w-9 items-center justify-center sm:h-12 sm:w-12 ${position}`}
    >
      <Icon size={21} strokeWidth={1.7} className={tone} />
    </span>
  );
}

function SplashPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimeoutId = window.setTimeout(() => setIsExiting(true), 850);
    const redirectTimeoutId = window.setTimeout(() => {
      navigate(isAuthenticated ? '/beranda' : '/login', { replace: true });
    }, 1200);

    return () => {
      window.clearTimeout(exitTimeoutId);
      window.clearTimeout(redirectTimeoutId);
    };
  }, [isAuthenticated, navigate]);

  return (
    <main className={`splash-screen relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-6 py-12 text-center text-white ${isExiting ? 'splash-screen-exit' : ''}`}>
      <div
        aria-hidden="true"
        className="splash-mesh pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(0,86,179,0) 52%), radial-gradient(ellipse at 24% 78%, rgba(32,125,220,0.17) 0%, rgba(0,86,179,0) 42%), radial-gradient(ellipse at 82% 18%, rgba(0,61,130,0.2) 0%, rgba(0,86,179,0) 46%)',
        }}
      />
      <div aria-hidden="true" className="splash-glow splash-glow-one pointer-events-none absolute left-[16%] top-[18%] h-36 w-36 rounded-full bg-accent/10 blur-[60px] sm:h-72 sm:w-72 sm:blur-[96px]" />
      <div aria-hidden="true" className="splash-glow splash-glow-two pointer-events-none absolute bottom-[15%] right-[12%] h-32 w-32 rounded-full bg-accent/10 blur-[58px] sm:h-64 sm:w-64 sm:blur-[96px]" />
      {decorations.map((decoration) => (
        <FloatingIcon key={decoration.position} {...decoration} />
      ))}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <PolsriLogo size={172} className="splash-logo mb-8 drop-shadow-lg sm:mb-10" />
        <h1 className="splash-title max-w-full text-2xl font-bold leading-tight sm:text-4xl">
          Selamat Datang di Website LMS POLSRI
        </h1>
        <p className="splash-subtitle mt-4 max-w-full text-sm font-medium text-accent sm:text-lg">
          Portal Pembelajaran Digital Politeknik Negeri Sriwijaya
        </p>
        <p className="splash-loading mt-14 text-sm text-white/80">Memuat...</p>
        <div
          role="progressbar"
          aria-label="Memuat halaman"
          aria-valuemin={0}
          aria-valuemax={100}
          className="splash-progress mt-3 h-1.5 w-48 overflow-hidden rounded-full bg-white/20"
        >
          <span className="splash-progress-fill block h-full w-0 rounded-full bg-accent" />
        </div>
      </div>
    </main>
  );
}

export default SplashPage;
