import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDeadlineInfo } from '../../utils/formatDate';

function getRemainingParts(dueAt, now) {
  const dueTime = new Date(dueAt).getTime();
  if (!Number.isFinite(dueTime) || dueTime <= now) return null;
  const totalSeconds = Math.floor((dueTime - now) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const remainingSeconds = totalSeconds % 86400;
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

function useDeadlineCountdown(dueAt) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let timerId;
    const update = () => setNow(Date.now());
    const start = () => {
      window.clearInterval(timerId);
      update();
      if (document.visibilityState === 'visible') {
        timerId = window.setInterval(update, 1000);
      }
    };

    start();
    document.addEventListener('visibilitychange', start);
    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', start);
    };
  }, [dueAt]);

  return getRemainingParts(dueAt, now);
}

function CountdownCard({ deadlines, courses }) {
  const courseMap = useMemo(
    () => new Map(courses.map((course) => [course.id, course])),
    [courses],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDeadline = deadlines[activeIndex] ?? deadlines[0];
  const countdown = useDeadlineCountdown(activeDeadline?.dueAt);
  const deadlineInfo = activeDeadline ? getDeadlineInfo(activeDeadline) : null;

  useEffect(() => setActiveIndex(0), [deadlines]);

  function selectTab(index) {
    setActiveIndex(index);
    document.getElementById(`landing-deadline-tab-${index}`)?.focus();
  }

  function handleTabKeyDown(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? deadlines.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + deadlines.length) % deadlines.length;
    selectTab(nextIndex);
  }

  return (
    <div className="redesign-countdown-card" data-ui>
      {deadlines.length > 0 ? (
        <>
          <div className="redesign-course-tabs" role="tablist" aria-label="Pilih mata kuliah">
            {deadlines.map((deadline, index) => (
              <button
                type="button"
                role="tab"
                id={`landing-deadline-tab-${index}`}
                aria-selected={index === activeIndex}
                aria-controls="landing-countdown-panel"
                tabIndex={index === activeIndex ? 0 : -1}
                className={index === activeIndex ? 'is-active' : ''}
                key={deadline.id}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {deadline.courseName}
              </button>
            ))}
          </div>
          <div
            className="redesign-countdown-content"
            id="landing-countdown-panel"
            role="tabpanel"
            aria-labelledby={`landing-deadline-tab-${activeIndex}`}
            tabIndex={0}
          >
            <div className="redesign-countdown-text" key={activeDeadline.id}>
              <h2>Tenggat terdekat: {activeDeadline.title}</h2>
              {courseMap.get(activeDeadline.courseId)?.next ? (
                <p className="redesign-next-material">
                  Materi berikutnya: {courseMap.get(activeDeadline.courseId).next}
                </p>
              ) : null}
              <div
                className="redesign-timer"
                role="timer"
                aria-label={countdown
                  ? `${countdown.days} hari, ${countdown.hours} jam, ${countdown.minutes} menit, ${countdown.seconds} detik menuju pukul 23.59 WIB`
                  : 'Tenggat sudah lewat'}
              >
                {countdown ? (
                  <>
                    <span className="redesign-time-group" key={`day-${countdown.days}`}>
                      <strong className="redesign-digit">{countdown.days}</strong><small>hari</small>
                    </span>
                    <span className="redesign-time-group" key={`hour-${countdown.hours}`}>
                      <strong className="redesign-digit">{countdown.hours}</strong><small>jam</small>
                    </span>
                    <span className="redesign-time-group" key={`minute-${countdown.minutes}`}>
                      <strong className="redesign-digit">{countdown.minutes}</strong><small>menit</small>
                    </span>
                    <span className="redesign-time-group" key={`second-${countdown.seconds}`}>
                      <strong className="redesign-digit">{countdown.seconds}</strong><small>detik</small>
                    </span>
                  </>
                ) : <strong className="redesign-expired">Sudah lewat</strong>}
              </div>
              <div className="redesign-countdown-note">
                <span className={`redesign-status-dot ${deadlineInfo?.status === 'Mendesak' ? 'is-urgent' : ''}`} />
                <span>Batas pengumpulan pukul 23.59 WIB</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="redesign-countdown-empty">
          <h2>Tidak ada tenggat mendatang.</h2>
          <p>Tidak ada tenggat untuk ditampilkan.</p>
        </div>
      )}
    </div>
  );
}

function Hero({ deadlines, courses }) {
  return (
    <section className="redesign-hero" aria-labelledby="landing-title">
      <div className="redesign-container">
        <h1 id="landing-title" className="redesign-hero-title">
          <span className="redesign-hero-line"><span>Semua tugas kuliah,</span></span>
          {' '}
          <span className="redesign-hero-line"><span>satu layar.</span></span>
        </h1>
        <div className="redesign-hero-grid">
          <div className="redesign-hero-copy">
            <p className="redesign-hero-lead">
              LearnEase menampilkan tenggat terdekat, progres tiap mata kuliah, dan pengumuman kampus Politeknik Negeri Sriwijaya.
            </p>
            <div className="redesign-hero-actions">
              <Link to="/login" className="redesign-arrow-button">
                <span>Masuk dengan akun akademik</span>
                <span className="redesign-button-icon" aria-hidden="true"><ArrowDownRight size={20} /></span>
              </Link>
              <a className="redesign-text-link" href="#cara">
                Lihat cara kerjanya
              </a>
            </div>
          </div>
          <div className="redesign-hero-card" data-ui>
            <CountdownCard deadlines={deadlines.slice(0, 3)} courses={courses} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
