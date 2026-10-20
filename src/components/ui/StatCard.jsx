import { Link } from 'react-router-dom';
import Card from './Card';

// Kartu angka dasbor tanpa ikon: label 13px, nilai 24px, detail opsional 13px.
// Dengan href seluruh kartu menjadi satu tautan menuju daftar yang ia jelaskan.
function StatCard({ label, value, detail, href, className = '' }) {
  const body = (
    <>
      <p className="text-[13px] text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-bold leading-7 text-main">{value}</p>
      {detail ? <p className="mt-1 text-[13px] text-secondary">{detail}</p> : null}
    </>
  );

  if (!href) {
    return (
      <Card data-stat-card className={`p-5 ${className}`}>
        {body}
      </Card>
    );
  }

  // Tautan ini (#...) pakai <a> asli agar browser men-scroll ke bagian tujuan;
  // Link react-router memang rute saja.
  const isAnchor = typeof href === 'string' && href.startsWith('#');

  return (
    <Card
      as={isAnchor ? 'a' : Link}
      {...(isAnchor ? { href } : { to: href })}
      data-stat-card
      className={`block p-5 transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {body}
    </Card>
  );
}

export default StatCard;
