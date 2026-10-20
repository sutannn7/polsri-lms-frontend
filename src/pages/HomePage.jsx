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
import { computeCourseProgress } from '../utils/progress';
import { getNextSlot, slotSentence } from '../utils/schedule';

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
  const now = new Date();
  // Sertakan hari pada ringkasan agar slot setelah kelas terakhir hari ini
  // tidak terbaca sebagai jadwal hari ini.
  const nextSlot = slotSentence(nextMeeting);
  const jadwalSummary = agenda.meetings.length > 0
    ? `${agenda.meetings.length} kelas hari ini${nextSlot ? ` · berikutnya ${nextSlot}` : ''}`
    : nextSlot
      ? `Tidak ada kelas hari ini · kelas berikutnya ${nextSlot}`
      : 'Tidak ada kelas hari ini';
  const continueCourses = useMemo(
    () => courses
      .filter((course) => computeCourseProgress(course) < 100)
      .sort((a, b) => computeCourseProgress(b) - computeCourseProgress(a))
      .slice(0, 3),
    [courses],
  );

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-semibold text-main">Selamat datang, {user?.name ?? 'Mahasiswa'}!</h1>
        <p className="text-sm text-secondary">
          {todayLabel.format(now)} · {jadwalSummary}
        </p>
      </header>

      <TodaySchedule agenda={agenda} />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="deadlines-heading" className="space-y-4">
            <h2 id="deadlines-heading" className="text-xl font-bold text-main">Tenggat terdekat</h2>
            <DeadlineList deadlines={deadlines} now={now} />
          </section>

          <section aria-labelledby="announcements-heading" className="space-y-4">
            <h2 id="announcements-heading" className="text-xl font-bold text-main">Pengumuman Kampus</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-8">
          <section aria-labelledby="continue-learning-heading" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="continue-learning-heading" className="text-xl font-bold text-main">Lanjutkan belajar</h2>
              <Link to="/mata-kuliah" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Lihat semua mata kuliah <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="space-y-4">
              {continueCourses.map((course) => (
                <ContinueLearningCard
                  key={course.id}
                  course={course}
                  progress={computeCourseProgress(course)}
                  nextSlot={getNextSlot(course.id, meetings, now)}
                />
              ))}
            </div>
          </section>

          <CalendarWidget deadlines={deadlines} meetings={meetings} now={now} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
