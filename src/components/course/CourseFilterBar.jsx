import { ArrowDownWideNarrow, LayoutGrid, List, Search } from 'lucide-react';

// Latar surface-2; offset cincin fokus mengikuti latar yang sama
// agar cincin terlihat di kedua tema.
const fieldClass = 'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-surface-2 pr-9 pl-3 text-sm text-main transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2';
const selectShellClass = 'relative min-w-0';

function CourseFilterBar({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  statusCounts = { all: 0, active: 0, completed: 0 },
  sortValue,
  onSortChange,
  view,
  onViewChange,
}) {
  const viewButtonClass = (isActive) => `inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isActive ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-surface-2 text-secondary hover:text-primary'}`;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg bg-surface-2 px-3 text-secondary">
        <Search size={18} aria-hidden="true" className="shrink-0" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari mata kuliah atau dosen"
          aria-label="Cari mata kuliah atau dosen"
          className="min-w-0 w-full bg-transparent text-sm text-main placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
        />
      </label>
      <div className="grid grid-cols-2 gap-3 lg:flex lg:w-[400px]">
        <label className={selectShellClass}>
          <span className="sr-only">Status</span>
          <select
            aria-label="Status"
            value={statusValue}
            onChange={(event) => onStatusChange(event.target.value)}
            className={fieldClass}
          >
            <option value="all">Semua ({statusCounts.all})</option>
            <option value="active">Sedang dipelajari ({statusCounts.active})</option>
            <option value="completed">Selesai ({statusCounts.completed})</option>
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-3 top-4 border-x-4 border-t-4 border-x-transparent border-t-secondary" />
        </label>
        <label className={selectShellClass}>
          <span className="sr-only">Urutkan mata kuliah</span>
          <ArrowDownWideNarrow size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-secondary" />
          <select
            aria-label="Urutkan mata kuliah"
            value={sortValue}
            onChange={(event) => onSortChange(event.target.value)}
            className={`${fieldClass} pl-10`}
          >
            <option value="name-asc">Urutkan: Nama</option>
            <option value="name-desc">Urutkan: Nama (Z–A)</option>
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-3 top-4 border-x-4 border-t-4 border-x-transparent border-t-secondary" />
        </label>
      </div>
      <div role="group" aria-label="Tampilan daftar mata kuliah" className="flex shrink-0 gap-2">
        <button
          type="button"
          aria-label="Tampilan grid"
          aria-pressed={view === 'grid'}
          onClick={() => onViewChange('grid')}
          className={viewButtonClass(view === 'grid')}
        >
          <LayoutGrid size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Tampilan daftar"
          aria-pressed={view === 'list'}
          onClick={() => onViewChange('list')}
          className={viewButtonClass(view === 'list')}
        >
          <List size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default CourseFilterBar;
