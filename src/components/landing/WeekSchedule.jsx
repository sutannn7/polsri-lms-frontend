import WeekCalendar from './WeekCalendar';

const weekdayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function jakartaParts(value) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(value);
  return Object.fromEntries(parts.map(({ type, value: partValue }) => [type, Number(partValue)]));
}

function getWeekDates(today) {
  const currentDate = new Date(Date.UTC(today.year, today.month - 1, today.day));
  const monday = new Date(currentDate);
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);
    return date;
  });
}

function getNextClassDay(meetings, todayDate) {
  if (!meetings.length) return null;

  const currentWeekday = todayDate.getUTCDay();
  const nextMeeting = meetings
    .map((meeting) => {
      const weekday = Number(meeting.dayOfWeek);
      const daysUntil = (weekday - currentWeekday + 7) % 7 || 7;
      return { meeting, daysUntil };
    })
    .sort((first, second) => (
      first.daysUntil - second.daysUntil
      || first.meeting.startTime.localeCompare(second.meeting.startTime)
    ))[0];
  const date = new Date(todayDate);
  date.setUTCDate(date.getUTCDate() + nextMeeting.daysUntil);

  return {
    date,
    label: `${weekdayNames[date.getUTCDay()]}, ${new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      timeZone: 'Asia/Jakarta',
    }).format(date).replace(/\./g, '')}`,
  };
}

function WeekSchedule({ deadlines, meetings }) {
  const today = jakartaParts(new Date());
  const todayDate = new Date(Date.UTC(today.year, today.month - 1, today.day));
  const dates = getWeekDates(today).filter((date) => date >= todayDate);
  const activeDays = dates.map((date) => {
    const dateParts = jakartaParts(date);
    const schedule = meetings
      .filter((meeting) => Number(meeting.dayOfWeek) === date.getUTCDay())
      .sort((first, second) => first.startTime.localeCompare(second.startTime));
    const dayDeadlines = deadlines.filter((deadline) => {
      if (deadline.status === 'Selesai' || deadline.completed || deadline.statusLabel === 'Terkirim') {
        return false;
      }
      const due = jakartaParts(new Date(deadline.dueAt));
      return due.year === dateParts.year
        && due.month === dateParts.month
        && due.day === dateParts.day
        && new Date(deadline.dueAt).getTime() >= Date.now();
    });
    return { date, dateParts, schedule, deadlines: dayDeadlines };
  });
  const busyDays = activeDays.filter((day) => day.schedule.length || day.deadlines.length);
  const todaySchedule = activeDays.find((day) => day.dateParts.day === today.day);
  const nextClassDay = todaySchedule?.schedule.length
    ? null
    : getNextClassDay(meetings, todayDate);
  const shortDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Jakarta',
  });

  return (
    <section className="redesign-section redesign-week-section" id="pekan" aria-labelledby="redesign-week-title">
      <div className="redesign-container">
        <header className="redesign-section-heading redesign-week-heading" data-reveal>
          <h2 id="redesign-week-title">Pekan ini, hari demi hari.</h2>
          <p>Jadwal kelas dan tenggat tugas untuk pekan yang sedang berjalan.</p>
        </header>
        <div className="redesign-week-layout">
          <div className="redesign-agenda" data-ui>
            {!todaySchedule?.schedule.length ? (
              <p className="redesign-no-class">
                Tidak ada kelas hari ini.
                {nextClassDay ? ` Kelas berikutnya: ${nextClassDay.label}.` : ' Jadwal kelas berikutnya belum tersedia.'}
              </p>
            ) : null}
            {busyDays.length ? busyDays.map(({ date, dateParts, schedule, deadlines: dayDeadlines }, index) => {
              const isToday = dateParts.year === today.year
                && dateParts.month === today.month
                && dateParts.day === today.day;
              return (
                <article
                  className={`redesign-agenda-day ${isToday ? 'is-today' : ''}`}
                  key={date.toISOString()}
                  data-reveal
                  style={{ '--reveal-delay': `${index * 80}ms` }}
                >
                  <time dateTime={date.toISOString()}>
                    <span>{weekdayNames[date.getUTCDay()]}</span>
                    <strong>{shortDate.format(date).replace(/\./g, '')}</strong>
                  </time>
                  <div>
                    {schedule.map((meeting) => (
                      <p className="redesign-agenda-entry" key={meeting.id}>
                        <time>{meeting.startTime}–{meeting.endTime}</time>
                        <strong>{meeting.courseName}</strong>
                        <span>{meeting.room}</span>
                      </p>
                    ))}
                    {dayDeadlines.map((deadline) => (
                      <p className="redesign-agenda-entry is-deadline" key={deadline.id}>
                        <time>23.59 WIB</time>
                        <strong>Tenggat tugas</strong>
                        <span>{deadline.title}</span>
                      </p>
                    ))}
                  </div>
                </article>
              );
            }) : <p className="redesign-empty">Tidak ada jadwal atau tenggat pada pekan ini.</p>}
          </div>
          <WeekCalendar deadlines={deadlines} />
        </div>
      </div>
    </section>
  );
}

export default WeekSchedule;
