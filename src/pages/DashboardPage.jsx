import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/ui/StatCard';
import StatusChip from '../components/ui/StatusChip';
import useCourses from '../hooks/useCourses';
import useHomeData from '../hooks/useHomeData';
import { getCourseStats } from '../utils/courseStatus';
import { chipStatus, dueLabel } from '../utils/due';

function DashboardPage() {
  const { courses } = useCourses();
  const { deadlines } = useHomeData();
  const now = new Date();

  const courseStats = getCourseStats(courses);
  const sortedCourses = [...courses].sort((a, b) => b.progress - a.progress);
  // Tugas terlambat tetap tampil — panel inilah tempatnya. Hanya yang selesai
  // dibuang; chipStatus menandai yang terlambat sebagai mendesak (emas).
  const unfinishedDeadlines = deadlines
    .filter((deadline) => deadline.status !== 'Selesai')
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  // Blok pertemuan memakai mata kuliah Perbankan: data pertemuannya paling
  // lengkap di meeting dan detail laman perbankan ikut diverifikasi.
  const meetingCourse = courses.find((course) => course.id === 'perbankan');
  const courseMeetings = meetingCourse ? meetingCourse.units : [];
  const completedMeetings = courseMeetings.filter(
    (meeting) => meeting.status === 'completed',
  ).length;
  const meetingPercent = courseMeetings.length
    ? Math.round((completedMeetings / courseMeetings.length) * 100)
    : 0;

  return (
    <div className="space-y-9">
      <header>
        <h1 className="font-display text-[32px] font-semibold leading-tight text-main">Dasbor</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">
          Pantau progres mata kuliah, aktivitas tugas, dan fokus belajar Anda.
        </p>
      </header>

      <section aria-label="Statistik belajar" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          href="/mata-kuliah"
          label="Rata-rata Progres"
          value={`${courseStats.averageProgress}%`}
        />
        <StatCard
          href="/mata-kuliah"
          label="Total SKS"
          value={`${courseStats.totalCredits} SKS`}
        />
        <StatCard
          href="/mata-kuliah"
          label="Mata Kuliah Selesai"
          value={`${courseStats.completedCourses} dari ${courseStats.totalCourses}`}
        />
        <StatCard
          href="#tugas-belum-selesai"
          label="Tugas Belum Selesai"
          value={`${unfinishedDeadlines.length} Tugas`}
        />
      </section>

      <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-2">
        <section aria-labelledby="progres-heading">
          <Card className="p-5 sm:p-6">
            <h2 id="progres-heading" className="text-lg font-bold text-main">Progres per Mata Kuliah</h2>
            <ul className="mt-3 divide-y divide-border">
              {sortedCourses.map((course) => {
                const isCompleted = course.progress >= 100;
                return (
                  <li key={course.id}>
                    <Link
                      to={`/mata-kuliah/${course.id}`}
                      className="block rounded-lg px-2 py-4 transition-colors duration-150 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <p className="text-[13px] font-medium text-secondary">{course.id}</p>
                      <p className="mt-0.5 font-semibold leading-5 text-main">{course.name}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <ProgressBar
                          value={course.progress}
                          tone={isCompleted ? 'done' : 'progress'}
                          label={`Progres ${course.name}`}
                        />
                        <span
                          className={`w-10 shrink-0 text-right text-sm font-semibold ${isCompleted ? 'text-success' : 'text-primary'}`}
                        >
                          {course.progress}%
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        </section>

        <section aria-labelledby="tugas-heading" id="tugas-belum-selesai" className="scroll-mt-24">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="tugas-heading" className="text-lg font-bold text-main">Tugas Belum Selesai</h2>
              <p className="text-[13px] text-secondary">
                {unfinishedDeadlines.length} tenggat aktif
              </p>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {unfinishedDeadlines.length === 0 ? (
                <li className="py-4 text-[13px] text-secondary">Semua tugas sudah selesai.</li>
              ) : (
                unfinishedDeadlines.map((deadline) => (
                  <li key={deadline.id} className="flex items-start justify-between gap-3 py-4 first:pt-4 last:pb-0">
                    <div className="min-w-0">
                      <Link
                        to={`/mata-kuliah/${deadline.courseId}`}
                        className="rounded-sm font-semibold text-main transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {deadline.title}
                      </Link>
                      <p className="mt-1 truncate text-[13px] text-secondary">{deadline.courseName}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <ProgressBar
                          value={0}
                          tone="idle"
                          label={`Tugas ${deadline.title} belum mulai`}
                        />
                        <span className="shrink-0 text-sm font-semibold text-secondary">
                          Belum mulai
                        </span>
                      </div>
                    </div>
                    <StatusChip status={chipStatus(deadline, now)}>
                      {dueLabel(deadline.dueAt, now)}
                    </StatusChip>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </section>
      </div>

      <section aria-labelledby="pertemuan-heading">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 id="pertemuan-heading" className="text-lg font-bold text-main">
                Progres Pertemuan {meetingCourse?.name ?? 'Mata Kuliah'}
              </h2>
              <p className="mt-2 text-sm text-secondary">
                {completedMeetings} dari {courseMeetings.length} pertemuan selesai
              </p>
              <div className="mt-3 flex items-center gap-3">
                <ProgressBar
                  value={meetingPercent}
                  tone="done"
                  label={`Progres pertemuan ${meetingCourse?.name ?? 'Mata Kuliah'}`}
                />
                <span className="w-10 shrink-0 text-right text-sm font-semibold text-success">
                  {meetingPercent}%
                </span>
              </div>
            </div>
            <Link
              to="/mata-kuliah/perbankan"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Lihat Detail Pertemuan
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default DashboardPage;
