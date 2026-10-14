import { useMemo } from 'react';
import { ArrowRight, BookOpenCheck, CalendarDays, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnnouncementCard from '../components/home/AnnouncementCard';
import CalendarWidget from '../components/home/CalendarWidget';
import ContinueLearningCard from '../components/home/ContinueLearningCard';
import DeadlineList from '../components/home/DeadlineList';
import WelcomeBanner from '../components/home/WelcomeBanner';
import StatCard from '../components/ui/StatCard';
import useAuth from '../hooks/useAuth';
import useCourses from '../hooks/useCourses';
import useHomeData from '../hooks/useHomeData';
import { getLastOpenedCourseId } from '../services/courseService';
import { getActiveCourses, getCourseStats } from '../utils/courseStatus';
import { getDeadlineInfo, isUpcomingDeadline } from '../utils/formatDate';

function HomePage() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { announcements, deadlines, meetings } = useHomeData();
  const today = new Date();
  const stats = getCourseStats(courses);
  const upcomingDeadlines = deadlines.filter((deadline) => isUpcomingDeadline(deadline, today));
  const closeDeadlines = upcomingDeadlines
    .filter((deadline) => getDeadlineInfo(deadline, today).status === 'Mendesak')
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  const todaysMeetings = meetings.filter((meeting) => meeting.dayOfWeek === today.getDay());
  const continueCourses = useMemo(
    () => getActiveCourses(courses).sort((a, b) => b.progress - a.progress).slice(0, 3),
    [courses],
  );
  const lastOpenedCourseId = getLastOpenedCourseId();
  const lastOpenedCourse = courses.find((course) => course.id === lastOpenedCourseId);
  const fallbackCourse = lastOpenedCourse ?? continueCourses[0];
  const nearestDeadline = closeDeadlines[0];
  const bannerSummary = nearestDeadline
    ? `Ada ${closeDeadlines.length} tugas yang jatuh tempo dalam waktu dekat. Tenggat terdekat ${getDeadlineInfo(nearestDeadline, today).label.toLowerCase()}: ${nearestDeadline.title}.`
    : lastOpenedCourse
      ? `Tidak ada tenggat dalam 2 hari ke depan. Mata kuliah terakhir dibuka: ${lastOpenedCourse.name}.`
      : `Tidak ada tenggat dalam 2 hari ke depan. Mulai pembelajaran dari ${fallbackCourse?.name ?? 'daftar mata kuliah Anda'}.`;
  const bannerCourseHref = nearestDeadline
    ? `/mata-kuliah/${nearestDeadline.courseId}`
    : fallbackCourse
      ? `/mata-kuliah/${fallbackCourse.id}`
      : undefined;

  return (
    <div className="space-y-8">
      <WelcomeBanner
        name={user?.name ?? 'Mahasiswa'}
        summary={bannerSummary}
        courseHref={bannerCourseHref}
      />

      <section aria-label="Ringkasan pembelajaran" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={<ClipboardList size={21} />}
          label="Tugas Terdekat"
          value={`${upcomingDeadlines.length} Tugas`}
        />
        <StatCard
          icon={<CalendarDays size={21} />}
          label="Jadwal Hari Ini"
          value={`${todaysMeetings.length} Kelas`}
        />
        <StatCard
          icon={<BookOpenCheck size={21} />}
          label="Mata Kuliah Aktif"
          value={`${stats.activeCourses} Mata Kuliah`}
        />
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="announcements-heading" className="space-y-4">
            <h2 id="announcements-heading" className="text-xl font-bold text-main">Pengumuman Kampus</h2>
            <div className="grid grid-cols-1 gap-4">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </section>

          <section aria-labelledby="continue-learning-heading" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="continue-learning-heading" className="text-xl font-bold text-main">Lanjutkan pembelajaran</h2>
              <Link to="/mata-kuliah" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Lihat semua mata kuliah <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {continueCourses.map((course) => (
                <ContinueLearningCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <CalendarWidget meetings={meetings} deadlines={deadlines} today={today} />
          <DeadlineList deadlines={upcomingDeadlines} />
        </aside>
      </div>
    </div>
  );
}

export default HomePage;