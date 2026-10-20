import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Breadcrumb({ items = [], className = '' }) {
  return (
    <nav aria-label="Lokasi halaman" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? <ChevronRight size={15} aria-hidden="true" className="text-secondary" /> : null}
              {isCurrent || !item.href ? (
                <span aria-current={isCurrent ? 'page' : undefined} className={isCurrent ? 'font-medium text-main' : 'text-secondary'}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} className="rounded-sm text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
