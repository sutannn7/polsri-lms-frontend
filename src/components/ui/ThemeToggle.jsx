import { useTheme } from 'next-themes';
import { SunMoon } from 'lucide-react';

//next-themes tidak punya toggleTheme: toggle = setTheme ke lawan resolvedTheme.
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap';
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-secondary transition-colors hover:text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <SunMoon size={18} aria-hidden="true" />
    </button>
  );
}

export default ThemeToggle;
