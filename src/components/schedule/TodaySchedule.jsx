import { Link } from 'react-router-dom';
import StatusChip from '../ui/StatusChip';
import useCourses from '../../hooks/useCourses';
import { slotSentence } from '../../utils/schedule';

function TodaySchedule({ agenda }) {
  const { courses } = useCourses();
  const dosenByCourseId = new Map(courses.map((course) => [course.id, course.lecturer]));

  return (
    <section aria-label="Jadwal hari ini" className="rounded-card border border-border bg-surface-2 p-5 shadow-card">
      <h2 className="sr-only">Jadwal hari ini</h2>
      {agenda.kind === 'list' ? (
        <ul className="divide-y divide-border">
          {agenda.meetings.map((entry) => (
            <li key={entry.meeting.id} className="py-3 first:pt-0 last:pb-0">
              <Link
                to={entry.href}
                className="grid gap-x-4 gap-y-1 rounded-lg sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
              >
                <span className="text-sm font-semibold text-main tabular-nums">{entry.timeLabel}</span>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold text-main">{entry.courseLabel}</p>
                  <p className="truncate text-sm text-secondary">
                    {[dosenByCourseId.get(entry.meeting.courseId), entry.roomLabel].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <StatusChip status={entry.status} className="justify-self-start sm:justify-self-end" />
              </Link>
              {entry.status === 'done' ? (
                <Link
                  to={entry.href}
                  className="mt-1 inline-block text-[13px] font-medium text-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
                >
                  Lanjut ke materi berikutnya
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-main">Tidak ada kelas hari ini</p>
          <p className="text-sm text-secondary">
            {agenda.nextMeeting
              ? `Kelas berikutnya: ${agenda.nextMeeting.courseLabel} · ${slotSentence(agenda.nextMeeting)}`
              : 'Kelas berikutnya: belum dijadwalkan'}
          </p>
        </div>
      )}
    </section>
  );
}

export default TodaySchedule;
