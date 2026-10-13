import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, Code2, GraduationCap, Lightbulb, Pencil } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import PolsriLogo from '../components/ui/PolsriLogo';

const desktopDecorations = [
  { Icon: GraduationCap, position: 'left-[13%] top-[17%] splash-float-1', tone: 'text-white/50' },
  { Icon: BookOpen, position: 'right-[14%] top-[25%] splash-float-2', tone: 'text-accent/60' },
  { Icon: Code2, position: 'left-[9%] bottom-[20%] splash-float-3', tone: 'text-accent/55' },
  { Icon: Lightbulb, position: 'right-[11%] bottom-[19%] splash-float-4', tone: 'text-white/55' },
  { Icon: Pencil, position: 'left-[27%] top-[12%] splash-float-5', tone: 'text-white/45' },
  { Icon: BarChart3, position: 'right-[26%] bottom-[11%] splash-float-6', tone: 'text-accent/50' },
];

const mobileDecorations = [
  { Icon: GraduationCap, position: 'left-[7%] top-[13%] splash-float-1', tone: 'text-white/45' },
  { Icon: BookOpen, position: 'right-[7%] top-[18%] splash-float-2', tone: 'text-accent/55' },
  { Icon: Code2, position: 'left-[7%] bottom-[13%] splash-float-3', tone: 'text-accent/50' },
  { Icon: Lightbulb, position: 'right-[7%] bottom-[12%] splash-float-4', tone: 'text-white/50' },
];

function FloatingIcon({ Icon, position, tone, small = false }) {
  return (
    <span
      aria-hidden="true"
      className={`splash-float pointer-events-none absolute z-[1] flex items-center justify-center ${small ? 'h-8 w-8' : 'h-12 w-12'} ${position}`}
    >
      <Icon size={small ? 19 : 27} strokeWidth={1.7} className={`${tone} ${Icon === Lightbulb ? 'splash-flicker' : ''}`} />
    </span>
  );
}

function FloatingDot({ position, className }) {
  return (
    <span
      aria-hidden="true"
      className={`splash-float splash-dot pointer-events-none absolute z-[1] h-2 w-2 rounded-full bg-accent/20 ${position} ${className}`}
    />
  );
}

function SplashPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimeoutId = window.setTimeout(() => {
      setIsExiting(true);
    }, 1900);
    const redirectTimeoutId = window.setTimeout(() => {
      navigate(isAuthenticated ? '/beranda' : '/login', { replace: true });
    }, 2300);

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
      {desktopDecorations.map((decoration) => (
        <span key={decoration.position} className="hidden sm:contents">
          <FloatingIcon {...decoration} />
        </span>
      ))}
      {mobileDecorations.map((decoration) => (
        <span key={decoration.position} className="sm:hidden">
          <FloatingIcon {...decoration} small />
        </span>
      ))}
      <FloatingDot position="left-[28%] bottom-[12%]" className="splash-float-7 hidden sm:block" />
      <FloatingDot position="right-[30%] top-[14%]" className="splash-float-8 hidden sm:block" />
      <FloatingDot position="left-[48%] top-[9%]" className="splash-float-7 sm:hidden" />
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
