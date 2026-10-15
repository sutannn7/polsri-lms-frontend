const weekdays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function jakartaParts(value) {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(value);
  return Object.fromEntries(parts.map(({ type, value: partValue }) => [type, Number(partValue)]));
}

function WeekCalendar({ deadlines }) {
  const today = jakartaParts(new Date());
  const firstWeekday = (new Date(Date.UTC(today.year, today.month - 1, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(today.year, today.month, 0)).getUTCDate();
  const dayCells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  while (dayCells.length % 7) dayCells.push(null);
  const weeks = Array.from({ length: dayCells.length / 7 }, (_, index) => dayCells.slice(index * 7, (index + 1) * 7));
  const markedDays = new Map();

  deadlines.forEach((deadline) => {
    const due = jakartaParts(new Date(deadline.dueAt));
    if (due.year !== today.year || due.month !== today.month) return;
    const names = markedDays.get(due.day) ?? [];
    names.push(deadline.title);
    markedDays.set(due.day, names);
  });

  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(Date.UTC(today.year, today.month - 1, 1)));

  return (
    <div className="redesign-calendar" data-ui aria-label={`Kalender ${monthLabel}`}>
      <h3>{monthLabel}</h3>
      <table className="redesign-calendar-grid" data-reveal>
        <thead>
          <tr>{weekdays.map((day) => <th scope="col" key={day}>{day}</th>)}</tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={`week-${weekIndex}`}>
              {week.map((day, index) => {
                if (!day) return <td className="redesign-calendar-blank" aria-hidden="true" key={`empty-${weekIndex}-${index}`} />;
                const taskNames = markedDays.get(day) ?? [];
                const isToday = day === today.day;
                const month = String(today.month).padStart(2, '0');
                const dayNumber = String(day).padStart(2, '0');
                const fullDate = new Intl.DateTimeFormat('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  timeZone: 'Asia/Jakarta',
                }).format(new Date(Date.UTC(today.year, today.month - 1, day)));
                const label = [
                  fullDate,
                  isToday ? 'hari ini' : '',
                  ...taskNames.map((title) => `tenggat: ${title}`),
                ].filter(Boolean).join(', ');
                const cellIndex = weekIndex * 7 + index;

                return (
                  <td key={day}>
                    <time
                      className={`redesign-calendar-day ${isToday ? 'is-today' : ''} ${taskNames.length ? 'has-deadline' : ''}`}
                      dateTime={`${today.year}-${month}-${dayNumber}`}
                      aria-label={label}
                      aria-current={isToday ? 'date' : undefined}
                      title={taskNames.join(', ') || undefined}
                      style={{ '--cell-index': cellIndex }}
                    >
                      {day}
                      {taskNames.length ? <span className="redesign-calendar-dot" aria-hidden="true" /> : null}
                    </time>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="redesign-calendar-note">Titik kuning menandai tenggat tugas.</p>
    </div>
  );
}

export default WeekCalendar;
