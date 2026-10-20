function CourseSummaryBar({ program, className, stats }) {
  return (
    <section aria-label="Ringkasan mata kuliah" className="rounded-card border border-border bg-surface-2 px-5 py-3">
      <p className="text-center text-sm font-medium text-secondary lg:text-left">
        {[program, `Kelas ${className}`, `${stats.totalCredits} SKS`, `${stats.totalCourses} mata kuliah`]
          .filter(Boolean)
          .join(' · ')}
      </p>
    </section>
  );
}

export default CourseSummaryBar;
