import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import PolsriLogo from '../ui/PolsriLogo';

const sections = [
  { label: 'Fitur', id: 'fitur' },
  { label: 'Pekan ini', id: 'pekan' },
  { label: 'Cara masuk', id: 'cara' },
  { label: 'Tanya jawab', id: 'faq' },
];

function LandingNav({ isDark, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const previousOverflow = useRef('');

  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top);
      if (visibleSections.length) setActiveSection(visibleSections[0].target.id);
    }, {
      rootMargin: '-82px 0px -55% 0px',
      threshold: 0,
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const getMenuItems = () => menuRef.current?.querySelectorAll('a[href], button:not([disabled])') ?? [];
    getMenuItems()[0]?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = [...getMenuItems()];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function closeAtDesktop(event) {
      if (!event.matches) return;
      setIsOpen(false);
      document.querySelector('.redesign-desktop-links a')?.focus();
    }

    const desktopQuery = window.matchMedia('(min-width: 900px)');
    desktopQuery.addEventListener('change', closeAtDesktop);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow.current;
      desktopQuery.removeEventListener('change', closeAtDesktop);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function followSection(event, id) {
    event.preventDefault();
    setIsOpen(false);
    buttonRef.current?.focus();
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    document.getElementById(id)?.scrollIntoView({ behavior });
  }

  return (
    <>
      <header className="redesign-nav-wrap">
        <nav className="redesign-nav" aria-label="Navigasi utama">
          <Link to="/" className="redesign-brand" aria-label="LearnEase, halaman utama">
            <PolsriLogo size={31} />
            <strong>LearnEase</strong>
          </Link>
          <div className="redesign-desktop-links">
            {sections.map(({ label, id }) => (
              <a
                href={`#${id}`}
                key={id}
                aria-current={activeSection === id ? 'location' : undefined}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="redesign-nav-actions">
            <button
              type="button"
              className="redesign-icon-button redesign-theme-button"
              onClick={onToggleTheme}
              aria-label={`Aktifkan tema ${isDark ? 'terang' : 'gelap'}`}
              aria-pressed={isDark}
            >
              <span key={isDark ? 'light' : 'dark'} className="redesign-theme-glyph" aria-hidden="true">
                {isDark ? <Sun size={19} /> : <Moon size={19} />}
              </span>
            </button>
            <Link to="/login" className="redesign-nav-login">
              Masuk
            </Link>
            <button
              ref={buttonRef}
              type="button"
              className="redesign-icon-button redesign-menu-button"
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isOpen}
              aria-controls="redesign-mobile-menu"
            >
              {isOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>
      <div
        ref={menuRef}
        id="redesign-mobile-menu"
        className={`redesign-mobile-overlay ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal={isOpen ? 'true' : undefined}
        aria-label="Menu navigasi"
        aria-hidden={!isOpen}
        inert={!isOpen ? '' : undefined}
      >
        <nav aria-label="Menu seluler">
          {sections.map(({ label, id }, index) => (
            <a
              href={`#${id}`}
              key={id}
              style={{ '--menu-delay': `${index * 60}ms` }}
              onClick={(event) => followSection(event, id)}
              aria-current={activeSection === id ? 'location' : undefined}
            >
              {label}<ArrowUpRight size={23} aria-hidden="true" />
            </a>
          ))}
          <Link to="/login" onClick={() => setIsOpen(false)}>
            Masuk ke LearnEase<ArrowUpRight size={23} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </>
  );
}

export default LandingNav;
