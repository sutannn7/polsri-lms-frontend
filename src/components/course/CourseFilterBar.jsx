import { ArrowDownWideNarrow, CalendarDays, Search } from 'lucide-react';

function CourseFilterBar({
  searchValue,
  onSearchChange,
  semesterValue,
  semesters = [],
  onSemesterChange,
  sortValue,
  onSortChange,
}) {
  const selectClass = 'h-11 w-full min-w-0 appearance-none rounded-lg border border-border bg-white px-3 pr-9 text-sm text-main outline-none transition-colors hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/15';
  const selectShellClass = 'relative min-w-0';
  const showSemesterFilter = semesters.length > 1;

  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${showSemesterFilter ? 'xl:grid-cols-[minmax(220px,1fr)_190px_200px]' : 'xl:grid-cols-[minmax(220px,1fr)_200px]'}`}>
      <label className="flex h-11 min-w-0 items-center gap-3 rounded-lg border border-border bg-white px-3 text-secondary transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
        <Search size={18} aria-hidden="true" className="shrink-0" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama mata kuliah atau dosen..."
          aria-label="Cari nama mata kuliah atau dosen"
          className="min-w-0 w-full border-0 bg-transparent text-sm text-main outline-none placeholder:text-secondary/80 focus:ring-0"
        />
      </label>
      {showSemesterFilter ? (
        <label className={selectShellClass}>
          <span className="sr-only">Semester</span>
          <CalendarDays size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-secondary" />
          <select
            aria-label="Filter semester"
            value={semesterValue}
            onChange={(event) => onSemesterChange(event.target.value)}
            className={`${selectClass} pl-10`}
          >
            <option value="all">Semua semester</option>
            {semesters.map((semester) => <option key={semester} value={String(semester)}>Semester {semester}</option>)}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-3 top-4 border-x-4 border-t-4 border-x-transparent border-t-secondary" />
        </label>
      ) : null}
      <label className={selectShellClass}>
        <span className="sr-only">Urutkan mata kuliah</span>
        <ArrowDownWideNarrow size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-secondary" />
        <select
          aria-label="Urutkan mata kuliah"
          value={sortValue}
          onChange={(event) => onSortChange(event.target.value)}
          className={`${selectClass} pl-10`}
        >
          <option value="name-asc">Urutkan: Nama</option>
          <option value="name-desc">Urutkan: Nama (Z–A)</option>
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute right-3 top-4 border-x-4 border-t-4 border-x-transparent border-t-secondary" />
      </label>
    </div>
  );
}

export default CourseFilterBar;