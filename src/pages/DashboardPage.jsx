import {
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/ui/StatCard';
import useCourses from '../hooks/useCourses';
import useHomeData from '../hooks/useHomeData';
import { getCourseStats } from '../utils/courseStatus';
import { formatDate, isUpcomingDeadline } from '../utils/formatDate';

const deadlineVariants = {
  Mendesak: 'warning',
  'Akan Datang': 'info',
};

function DashboardPage() {
  const { courses, getCourseMeetings } = useCourses();
  const { deadlines } = useHomeData();
  const now = new Date();
  const courseStats = getCourseStats(courses);
  const sortedCourses = [...courses].sort(
    (a, b) => Number(b.progress) - Number(a.progress),
  );
  const upcomingDeadlines = deadlines
    .filter((deadline) => isUpcomingDeadline(deadline, now))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const courseMeetings = getCourseMeetings('MI2301');
  const completedMeetings = courseMeetings.filter(
    (meeting) => meeting.status === 'completed',
  ).length;

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-3xl font-bold text-main">Dasbor</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">
          Pantau progres belajar, mata kuliah, dan tenggat tugas Anda.
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
          icon={<CalendarClock size={21} />}
          label="Tugas Tertunda"
          value={`${upcomingDeadlines.length} Tugas`}
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
            <Clock3 size={19} aria-hidden="true" className="text-primary" />
            <h2 className="text-lg font-bold text-main">Tenggat Mendatang</h2>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {upcomingDeadlines.map((deadline) => (
              <li key={deadline.id} className="py-4 first:pt-3 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to={`/mata-kuliah/${deadline.courseId}`}
                      className="font-semibold leading-5 text-main hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {deadline.title}
                    </Link>
                    <p className="mt-1 text-xs leading-5 text-secondary">{deadline.courseName}</p>
                    <p className="mt-1 text-xs font-medium text-secondary">
                      {formatDate(deadline.dueAt, { includeTime: true })}
                    </p>
                  </div>
                  <Badge variant={deadlineVariants[deadline.status] ?? 'neutral'} className="shrink-0">
                    {deadline.status}
                  </Badge>
                </div>
              </li>
            ))}
            {upcomingDeadlines.length === 0 ? (
              <li className="py-5 text-sm text-secondary">Tidak ada tenggat mendatang.</li>
            ) : null}
          </ul>
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