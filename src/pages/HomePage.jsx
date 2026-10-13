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
import { getActiveCourses, getCourseStats } from '../utils/courseStatus';
import { isUpcomingDeadline } from '../utils/formatDate';

function HomePage() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { announcements, deadlines, meetings } = useHomeData();
  const today = new Date();
  const stats = getCourseStats(courses);
  const upcomingDeadlines = deadlines.filter((deadline) => isUpcomingDeadline(deadline, today));
  const todaysMeetings = meetings.filter((meeting) => meeting.dayOfWeek === today.getDay());
  const continueCourses = useMemo(
    () => getActiveCourses(courses).sort((a, b) => b.progress - a.progress).slice(0, 3),
    [courses],
  );

  return (
    <div className="space-y-8">
      <WelcomeBanner name={user?.name ?? 'Mahasiswa'} />

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
          <CalendarWidget meetings={meetings} today={today} />
          <DeadlineList deadlines={deadlines} />
        </aside>
      </div>
    </div>
  );
}

export default HomePage;