import ProgressBar from '../ui/ProgressBar';
import { slotSentence } from '../../utils/schedule';

function CourseHeader({ course }) {
  const units = course.units ?? [];
  const completedUnits = units.filter((unit) => unit.status === 'completed').length;
  const nextClass = slotSentence(course.nextSlot);

  return (
    <section className="grid gap-6 rounded-card border border-border bg-surface-2 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center lg:gap-8">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-secondary">
          {course.program} <span aria-hidden="true">•</span> Semester {course.semester}{' '}
          <span aria-hidden="true">•</span> {course.credits} SKS <span aria-hidden="true">•</span> Kelas {course.class}
        </p>
        <h1 className="mt-3 line-clamp-2 text-2xl font-bold leading-tight text-main sm:text-3xl">
          {course.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">{course.description}</p>
        <p className="mt-3 text-sm text-main">Dosen: {course.lecturer}</p>
        <p className="mt-4 text-sm">
          <span className="font-semibold text-main">Kelas berikutnya:</span>{' '}
          <span className="text-secondary">{nextClass ?? 'Jadwal belum tersedia'}</span>
        </p>
      </div>

      <div className="rounded-card border border-border bg-background p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-main">Progres belajar</h2>
          <span className="text-3xl font-bold tabular-nums text-primary">{course.progress}%</span>
        </div>
        <ProgressBar
          value={course.progress}
          color="primary"
          label={`Progres belajar ${course.name}`}
          className="mt-3"
        />
        {units.length > 0 ? (
          <p className="mt-3 text-[13px] font-medium text-secondary">
            {completedUnits} dari {units.length} unit selesai
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default CourseHeader;
