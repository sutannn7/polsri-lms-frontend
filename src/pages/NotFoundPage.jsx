import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  const returnPath = isAuthenticated ? '/beranda' : '/login';

  return (
    <section className="mx-auto my-auto w-full max-w-xl rounded-card border border-border bg-white p-8 text-center shadow-card sm:p-10">
      <p className="text-sm font-bold text-primary">404</p>
      <h1 className="mt-2 text-2xl font-bold text-main sm:text-3xl">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-sm leading-6 text-secondary">
        Halaman yang Anda cari tidak tersedia atau alamatnya mungkin sudah berubah.
      </p>
      <Link
        to={returnPath}
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Kembali ke Beranda
      </Link>
    </section>
  );
}

export default NotFoundPage;