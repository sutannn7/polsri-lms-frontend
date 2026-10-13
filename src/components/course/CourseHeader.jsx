import { BookOpenCheck, GraduationCap } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

function CourseHeader({ course, completedActivities, totalActivities }) {
  const hasActivityDetails = totalActivities > 0;

  return (
    <section className="overflow-hidden rounded-card border-l-4 border-accent bg-primary-dark text-white shadow-card">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:gap-8">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white/85">
            {course.id} <span aria-hidden="true">•</span> Semester {course.semester}{' '}
            <span aria-hidden="true">•</span> {course.credits} SKS
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
            {course.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            {course.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
            <p className="inline-flex items-center gap-2">
              <GraduationCap size={17} aria-hidden="true" />
              {course.lecturer}
            </p>
            <p className="inline-flex items-center gap-2">
              <BookOpenCheck size={16} aria-hidden="true" />
              Kelas {course.class} <span aria-hidden="true">•</span> Semester {course.semester}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/10 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-white">Progres belajar Anda</h2>
            <span className="text-3xl font-bold tabular-nums text-accent">{course.progress}%</span>
          </div>
          <ProgressBar
            value={course.progress}
            color="warning"
            label={`Progres belajar ${course.name}`}
            className="mt-3"
          />
          {hasActivityDetails ? (
            <p className="mt-3 text-xs font-medium text-white/80">
              {completedActivities} dari {totalActivities} aktivitas selesai
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default CourseHeader;