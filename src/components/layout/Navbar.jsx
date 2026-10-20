import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  X,
} from 'lucide-react';
import PolsriLogo from '../ui/PolsriLogo';
import ThemeToggle from '../ui/ThemeToggle';
import useAuth from '../../hooks/useAuth';

const navigationItems = [
  { label: 'Beranda', to: '/beranda', Icon: Home },
  { label: 'Dasbor', to: '/dasbor', Icon: LayoutDashboard },
  { label: 'Mata Kuliah Saya', to: '/mata-kuliah', Icon: BookOpen },
];

function Navbar({
  userName = '',
  userInitials = '',
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const initials = userInitials || userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  function handleLogout() {
    logout();
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  }

  function renderLogoutButton() {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-danger transition-colors hover:bg-danger-badge focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <LogOut size={17} aria-hidden="true" />
        Keluar
      </button>
    );
  }

  function handleSearch(event) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/mata-kuliah?q=${encodeURIComponent(query)}` : '/mata-kuliah');
    setIsMenuOpen(false);
  }

  function renderSearch() {
    return (
      <form
        role="search"
        onSubmit={handleSearch}
        className="flex h-11 w-full items-center gap-3 rounded-lg border border-border bg-background px-3 text-secondary transition-colors focus-within:border-primary lg:w-64"
      >
        <Search size={18} aria-hidden="true" className="shrink-0" />
        <input
          aria-label="Cari mata kuliah"
          placeholder="Cari materi atau mata kuliah"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="min-w-0 w-full border-0 bg-transparent text-sm text-main outline-none placeholder:text-secondary/80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-background"
        />
        <button
          type="submit"
          aria-label="Cari mata kuliah"
          className="sr-only"
        >
          Cari
        </button>
      </form>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex min-h-[72px] max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-0">
        <Link
          to="/beranda"
          aria-label="LearnEase - Beranda"
          className="flex shrink-0 items-center gap-2.5 rounded-md text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <PolsriLogo size={40} className="shrink-0" />
          <span className="text-xl font-bold">LearnEase</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden h-[72px] items-stretch gap-1 lg:flex">
          {navigationItems.map(({ label, to, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `relative inline-flex items-center gap-2 px-4 text-sm transition-colors hover:text-primary ${isActive ? 'font-semibold text-primary-dark' : 'text-secondary'}`}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                  {isActive ? <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] rounded-t bg-primary" /> : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-6 lg:flex">
          {renderSearch()}
          <ThemeToggle />
          <div className="relative">
            <button
              type="button"
              aria-label={userName ? `Menu profil ${userName}` : 'Menu profil'}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsProfileMenuOpen((open) => !open)}
              className="inline-flex max-w-52 shrink-0 items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 text-left transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-dark">
                {initials || '?'}
              </span>
              {userName ? <span className="truncate text-sm font-medium text-main">{userName}</span> : null}
              <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-secondary transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProfileMenuOpen ? (
              <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-background p-2 shadow-card">
                {renderLogoutButton()}
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:hidden">
          <ThemeToggle />
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={isMenuOpen}
          aria-controls="navigasi-seluler"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-main transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          {isMenuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen ? (
        <div id="navigasi-seluler" className="border-t border-border bg-background px-5 pb-4 pt-3 sm:px-8 lg:hidden">
          <nav aria-label="Navigasi seluler" className="mb-3 flex flex-col">
            {navigationItems.map(({ label, to, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-primary-soft ${isActive ? 'font-semibold text-primary' : 'text-secondary'}`}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
          {renderSearch()}
          <div className="mt-3 flex items-center border-t border-border pt-3">
            <div className="relative min-w-0">
              <button
                type="button"
                aria-label={userName ? `Menu profil ${userName}` : 'Menu profil'}
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsProfileMenuOpen((open) => !open)}
                className="inline-flex min-w-0 items-center gap-2 rounded-lg py-1 pr-2 text-left transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-dark">
                  {initials || '?'}
                </span>
                <span className="truncate text-sm font-medium text-main">{userName}</span>
                <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-secondary transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfileMenuOpen ? (
                <div role="menu" className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-background p-2 shadow-card">
                  {renderLogoutButton()}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
