import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import CampusNews from '../components/landing/CampusNews';
import FeatureBento from '../components/landing/FeatureBento';
import FinalCta from '../components/landing/FinalCta';
import Hero from '../components/landing/Hero';
import LandingFooter from '../components/landing/LandingFooter';
import LandingNav from '../components/landing/LandingNav';
import PhonePreview from '../components/landing/PhonePreview';
import Questions from '../components/landing/Questions';
import Steps from '../components/landing/Steps';
import WeekSchedule from '../components/landing/WeekSchedule';
import useAuth from '../hooks/useAuth';
import useCourses from '../hooks/useCourses';
import useHomeData from '../hooks/useHomeData';
import useReveal from '../hooks/useReveal';
import '../styles/landing-redesign.css';
import { getDeadlineInfo, isUpcomingDeadline } from '../utils/formatDate';

function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { courses } = useCourses();
  const { announcements, deadlines, meetings } = useHomeData();
  const revealRootRef = useReveal();
  const [isDark, setIsDark] = useState(() => {
    try {
      const preference = window.localStorage.getItem('learnease-landing-theme');
      if (preference === 'dark') return true;
      if (preference === 'light') return false;
    } catch {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      isDark ? '#0A1426' : '#F3F5F9',
    );
  }, [isDark]);

  const upcomingDeadlines = useMemo(
    () => deadlines
      .filter((deadline) => isUpcomingDeadline(deadline))
      .sort((first, second) => new Date(first.dueAt) - new Date(second.dueAt)),
    [deadlines],
  );
  const sortedCourses = useMemo(
    () => [...courses].sort(
      (first, second) => Number(second.progress) - Number(first.progress),
    ),
    [courses],
  );

  function toggleTheme() {
    setIsDark((dark) => {
      const nextTheme = !dark;
      try {
        window.localStorage.setItem('learnease-landing-theme', nextTheme ? 'dark' : 'light');
      } catch {
        // Theme selection still applies for this visit if storage is unavailable.
      }
      return nextTheme;
    });
  }

  if (isAuthenticated) return <Navigate to="/beranda" replace />;

  return (
    <div
      className="landing-redesign landing-root"
      data-theme={isDark ? 'dark' : 'light'}
      ref={revealRootRef}
    >
      <a className="redesign-skip-link" href="#landing-main">Lewati ke konten utama</a>
      <LandingNav isDark={isDark} onToggleTheme={toggleTheme} />
      <main id="landing-main" tabIndex={-1}>
        <Hero deadlines={upcomingDeadlines} courses={courses} />
        <section className="redesign-section redesign-deadline-section" aria-labelledby="deadline-title">
          <div className="redesign-container redesign-due-layout">
            <header className="redesign-section-heading" data-reveal>
              <h2 id="deadline-title">Tenggat paling dekat di atas.</h2>
              <p>Tugas yang jatuh tempo dalam dua hari diberi tanda mendesak. Semua tenggat memakai batas pengumpulan pukul 23.59 WIB.</p>
            </header>
            <div className="redesign-due-list" data-ui>
              {upcomingDeadlines.length ? upcomingDeadlines.map((deadline, index) => {
                const deadlineInfo = getDeadlineInfo(deadline);
                return (
                  <article
                    className="redesign-due-item"
                    key={deadline.id}
                    data-reveal
                    style={{ '--reveal-delay': `${index * 70}ms`, '--row-index': index }}
                  >
                    <div>
                      <h3>{deadline.title}</h3>
                      <p>{deadline.courseName}<span className={`redesign-due-status ${deadlineInfo.status === 'Mendesak' ? 'is-urgent' : ''}`}>
                        {deadlineInfo.status}
                      </span></p>
                    </div>
                    <time dateTime={deadline.dueAt}>
                      <strong>{new Intl.DateTimeFormat('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        timeZone: 'Asia/Jakarta',
                      }).format(new Date(deadline.dueAt)).replace(/\./g, '')}</strong>
                      <span>{new Intl.DateTimeFormat('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hourCycle: 'h23',
                        timeZone: 'Asia/Jakarta',
                      }).format(new Date(deadline.dueAt)).replace(':', '.') } WIB</span>
                    </time>
                  </article>
                );
              }) : <p className="redesign-empty">Tidak ada tenggat yang akan datang.</p>}
            </div>
          </div>
        </section>
        <FeatureBento courses={sortedCourses} />
        <WeekSchedule deadlines={deadlines} meetings={meetings} />
        <CampusNews announcements={announcements} />
        <PhonePreview
          announcements={announcements}
          courses={sortedCourses}
          deadlines={upcomingDeadlines}
        />
        <Steps />
        <Questions />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
