import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnnouncementCard from '../components/home/AnnouncementCard';
import CalendarWidget from '../components/home/CalendarWidget';
import ContinueLearningCard from '../components/home/ContinueLearningCard';
import DeadlineList from '../components/home/DeadlineList';
import TodaySchedule from '../components/schedule/TodaySchedule';
import useAuth from '../hooks/useAuth';
import useCourses from '../hooks/useCourses';
import useHomeData from '../hooks/useHomeData';
import { getActiveCourses } from '../utils/courseStatus';
import { isUpcomingDeadline } from '../utils/formatDate';

const todayLabel = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
});

function HomePage() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { announcements, deadlines, meetings, agenda, nextMeeting } = useHomeData();
  const today = new Date();
  const upcomingDeadlines = deadlines.filter((deadline) => isUpcomingDeadline(deadline, today));
  const continueCourses = useMemo(
    () => getActiveCourses(courses).sort((a, b) => b.progress - a.progress).slice(0, 3),
    [courses],
  );
  const jadwalSummary = agenda.meetings.length > 0
    ? `${agenda.meetings.length} kelas hari ini${nextMeeting ? ` · berikutnya ${nextMeeting.meeting.startTime}` : ''}`
    : nextMeeting
      ? `Tidak ada kelas hari ini · kelas berikutnya ${nextMeeting.meeting.startTime}`
      : 'Tidak ada kelas hari ini';

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-semibold text-main">Selamat datang, {user?.name ?? 'Mahasiswa'}!</h1>
        <p className="text-sm text-secondary">
          {todayLabel.format(today)} · {jadwalSummary}
        </p>
      </header>

      <TodaySchedule agenda={agenda} />

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