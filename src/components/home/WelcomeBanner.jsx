import { Link } from 'react-router-dom';

function WelcomeBanner({
  name,
  summary,
  courseHref,
  semesterLabel = 'SEMESTER GANJIL 2026/2027',
}) {
  return (
    <section className="overflow-hidden rounded-card bg-gradient-to-r from-primary to-primary-dark px-6 py-7 text-white shadow-card sm:px-8 sm:py-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/85">{semesterLabel}</p>
      <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
        Selamat Datang kembali, {name}!
      </h1>
      {courseHref ? (
        <Link to={courseHref} className="mt-3 inline-block rounded-sm text-sm text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-base">
          {summary}
        </Link>
      ) : (
        <p className="mt-3 text-sm text-white/90 sm:text-base">{summary}</p>
      )}
    </section>
  );
}

export default WelcomeBanner;