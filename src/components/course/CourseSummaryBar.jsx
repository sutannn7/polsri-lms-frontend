import { BookOpen, GraduationCap } from 'lucide-react';

function CourseSummaryBar({ program, studentName, semester, className, stats }) {
  return (
    <section className="flex flex-col gap-6 rounded-card bg-primary-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
          <GraduationCap size={26} />
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-primary-dark">{program}</h2>
          <p className="mt-1 text-sm text-secondary">
            {[studentName, `Semester ${semester}`, `Kelas ${className}`].filter(Boolean).join(' • ')}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:flex sm:items-center sm:gap-8">
        <div>
          <p className="font-semibold text-primary-dark">{stats.totalCourses} mata kuliah</p>
        </div>
        <div>
          <p className="font-semibold text-primary-dark">{stats.totalCredits} SKS</p>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen size={16} aria-hidden="true" className="text-primary" />
          <p className="font-semibold text-primary-dark">{stats.averageProgress}% rata-rata progres</p>
        </div>
      </div>
    </section>
  );
}

export default CourseSummaryBar;