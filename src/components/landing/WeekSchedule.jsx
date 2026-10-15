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

function getWeekDates() {
  const today = jakartaParts(new Date());
  const currentDate = new Date(Date.UTC(today.year, today.month - 1, today.day));
  const monday = new Date(currentDate);
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);
    return date;
  });
}

function WeekSchedule({ deadlines, meetings }) {
  const dates = getWeekDates();
  const today = jakartaParts(new Date());
  const activeDays = dates.map((date) => {
    const dateParts = jakartaParts(date);
    const schedule = meetings
      .filter((meeting) => Number(meeting.dayOfWeek) === date.getUTCDay())
      .sort((first, second) => first.startTime.localeCompare(second.startTime));
    const dayDeadlines = deadlines.filter((deadline) => {
      const due = jakartaParts(new Date(deadline.dueAt));
      return due.year === dateParts.year && due.month === dateParts.month && due.day === dateParts.day;
    });
    return { date, dateParts, schedule, deadlines: dayDeadlines };
  });
  const busyDays = activeDays.filter((day) => day.schedule.length || day.deadlines.length);
  const emptyDays = activeDays.filter((day) => !day.schedule.length && !day.deadlines.length);
  const scheduleCourseCount = new Set(meetings.map((meeting) => meeting.courseId)).size;
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
          <div className="redesign-agenda" data-ui aria-label="Jadwal dan tenggat pekan ini">
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
            {emptyDays.length ? (
              <p className="redesign-no-class">
                Tidak ada kelas: {emptyDays.map(({ date }) => date.getUTCDate()).join(', ')} {shortDate.format(emptyDays[0].date).split(' ').slice(1).join(' ')}
              </p>
            ) : null}
            <p className="redesign-schedule-note">
              Data contoh memuat jadwal untuk {scheduleCourseCount} mata kuliah.
            </p>
          </div>
          <WeekCalendar deadlines={deadlines} />
        </div>
      </div>
    </section>
  );
}

export default WeekSchedule;
