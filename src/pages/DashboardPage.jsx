import {
  BookOpenCheck,
  CheckCircle2,
  Focus,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/ui/StatCard';
import useCourses from '../hooks/useCourses';
import { getCourseStats } from '../utils/courseStatus';

function DashboardPage() {
  const { courses, getCourseMeetings } = useCourses();
  const courseStats = getCourseStats(courses);
  const sortedCourses = [...courses].sort(
    (a, b) => Number(b.progress) - Number(a.progress),
  );
  const taskStats = courses.map((course) => {
    const assignments = getCourseMeetings(course.id)
      .flatMap((meeting) => meeting.activities)
      .filter((activity) => activity.type === 'assignment');
    const completed = assignments.filter((activity) => activity.completed).length;
    return {
      course,
      completed,
      total: assignments.length,
      pending: assignments.length - completed,
      completedPercent: assignments.length ? Math.round((completed / assignments.length) * 100) : 0,
    };
  });
  const pendingTaskCount = taskStats.reduce((total, item) => total + item.pending, 0);
  const lowestProgressCourse = courses
    .filter((course) => Number(course.progress) < 100)
    .sort((a, b) => Number(a.progress) - Number(b.progress))[0];
  const courseMeetings = getCourseMeetings('MI2301');
  const completedMeetings = courseMeetings.filter(
    (meeting) => meeting.status === 'completed',
  ).length;

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-3xl font-bold text-main">Dasbor</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">
          Pantau progres mata kuliah, aktivitas tugas, dan fokus belajar Anda.
        </p>
      </header>

      <section aria-label="Statistik belajar" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<TrendingUp size={21} />}
          label="Rata-rata Progres"
          value={`${courseStats.averageProgress}%`}
        />
        <StatCard
          icon={<BookOpenCheck size={21} />}
          label="Total SKS"
          value={`${courseStats.totalCredits} SKS`}
        />
        <StatCard
          icon={<GraduationCap size={21} />}
          label="Mata Kuliah Selesai"
          value={`${courseStats.completedCourses} dari ${courseStats.totalCourses}`}
        />
        <StatCard
          icon={<CheckCircle2 size={21} />}
          label="Tugas Belum Selesai"
          value={`${pendingTaskCount} Tugas`}
        />
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-bold text-main">Progres per Mata Kuliah</h2>
          <ul className="mt-3 divide-y divide-border">
            {sortedCourses.map((course) => {
              const isCompleted = Number(course.progress) >= 100;

              return (
                <li key={course.id}>
                  <Link
                    to={`/mata-kuliah/${course.id}`}
                    className="block rounded-lg px-2 py-4 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-secondary">{course.id}</p>
                        <p className="mt-1 font-semibold leading-5 text-main">{course.name}</p>
                      </div>
                      <Badge variant={isCompleted ? 'success' : 'info'} className="shrink-0">
                        {isCompleted ? 'Selesai' : 'Berjalan'}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <ProgressBar
                        value={course.progress}
                        color={isCompleted ? 'success' : 'primary'}
                        label={`Progres ${course.name}`}
                      />
                      <span className={`w-10 shrink-0 text-right text-sm font-semibold ${isCompleted ? 'text-success' : 'text-primary'}`}>
                        {course.progress}%
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Focus size={19} aria-hidden="true" className="text-primary" />
            <h2 className="text-lg font-bold text-main">Ringkasan Aktivitas Tugas</h2>
          </div>
          <ul className="mt-2 divide-y divide-border">
            {taskStats.map(({ course, completed, total, pending, completedPercent }) => (
              <li key={course.id} className="py-3 first:pt-3 last:pb-0">
                <Link
                  to={`/mata-kuliah/${course.id}`}
                  className="font-semibold text-main hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {course.name}
                </Link>
                {total > 0 ? (
                  <>
                    <div
                      role="img"
                      aria-label={`${course.name}: ${completed} dari ${total} tugas selesai, ${pending} belum selesai`}
                      className="mt-2 flex h-2 overflow-hidden rounded-full bg-border"
                    >
                      <span className="shrink-0 bg-success transition-[width]" style={{ width: `${completedPercent}%` }} />
                      <span className="shrink-0 bg-border" style={{ width: `${100 - completedPercent}%` }} />
                    </div>
                    <div className="mt-1 flex justify-between gap-3 text-xs text-secondary">
                      <span>Selesai {completed} ({completedPercent}%)</span>
                      <span>Belum selesai {pending}</span>
                    </div>
                  </>
                ) : (
                  <p className="mt-1 text-xs text-secondary">Belum ada tugas pada data pertemuan.</p>
                )}
              </li>
            ))}
          </ul>
          {lowestProgressCourse ? (
            <div className="mt-5 rounded-lg bg-primary-soft p-4">
              <p className="text-xs font-semibold text-primary-dark">Mata kuliah dengan progres terendah</p>
              <Link
                to={`/mata-kuliah/${lowestProgressCourse.id}`}
                className="mt-1 inline-block font-semibold text-main hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {lowestProgressCourse.name}
              </Link>
              <p className="mt-1 text-sm text-secondary">
                Progres {lowestProgressCourse.progress}%. Jadikan mata kuliah ini fokus belajar berikutnya.
              </p>
            </div>
          ) : null}
        </Card>
      </div>

      <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={19} aria-hidden="true" className="text-success" />
            <h2 className="text-lg font-bold text-main">Progres Pertemuan MI2301</h2>
          </div>
          <p className="mt-2 text-sm text-secondary">
            {completedMeetings} dari {courseMeetings.length} pertemuan selesai
          </p>
          <p className="mt-1 text-xs text-secondary">
            Detail pertemuan baru tersedia untuk mata kuliah Pemrograman Web
          </p>
        </div>
        <Link
          to="/mata-kuliah/MI2301"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Lihat Detail Pertemuan
        </Link>
      </Card>
    </div>
  );
}

export default DashboardPage;