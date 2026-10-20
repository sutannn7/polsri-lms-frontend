import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';

const weekdayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function CalendarWidget({ meetings = [], deadlines = [], now = new Date() }) {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth);
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay() + 6) % 7;
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const isCurrentMonth = visibleMonth.getFullYear() === now.getFullYear()
    && visibleMonth.getMonth() === now.getMonth();
  // Titik emas = hari itu ada agenda (kelas atau tenggat) pada bulan terlihat.
  const markedDays = new Map();

  function addDayLabel(day, label) {
    const labels = markedDays.get(day) ?? [];
    labels.push(label);
    markedDays.set(day, labels);
  }

  deadlines.forEach((deadline) => {
    const dueAt = new Date(deadline.dueAt);
    if (
      !Number.isNaN(dueAt.getTime())
      && dueAt.getFullYear() === visibleMonth.getFullYear()
      && dueAt.getMonth() === visibleMonth.getMonth()
    ) {
      addDayLabel(dueAt.getDate(), deadline.title);
    }
  });

  meetings.forEach((meeting) => {
    for (let day = 1; day <= daysInMonth; day += 1) {
      if (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day).getDay() === meeting.dayOfWeek) {
        addDayLabel(day, `Jadwal ${meeting.courseName} pukul ${meeting.startTime}`);
      }
    }
  });

  function changeMonth(offset) {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold capitalize text-main">{monthLabel}</h2>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Bulan sebelumnya"
            onClick={() => changeMonth(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-3 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Bulan berikutnya"
            onClick={() => changeMonth(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-3 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {weekdayLabels.map((day) => (
          <span key={day} className="pb-2 text-[13px] font-medium text-secondary">{day}</span>
        ))}
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} aria-hidden="true" />;
          const isToday = isCurrentMonth && day === now.getDate();
          const dayLabels = markedDays.get(day) ?? [];
          const hasEvents = dayLabels.length > 0;
          const eventDescription = dayLabels.join('; ');
          return (
            <span key={day} className="flex justify-center">
              <span
                aria-current={isToday ? 'date' : undefined}
                aria-label={`${day}${isToday ? ', hari ini' : ''}${hasEvents ? `, ${eventDescription}` : ''}`}
                title={hasEvents ? eventDescription : undefined}
                className={`relative flex h-9 w-9 items-center justify-center rounded-lg border text-[13px] transition-colors ${
                  isToday
                    ? 'border-accent font-semibold text-main ring-2 ring-accent'
                    : 'border-border text-main hover:bg-surface-2'
                }`}
              >
                {day}
                {hasEvents ? <span aria-hidden="true" className="absolute bottom-1 h-1 w-1 rounded-full bg-accent" /> : null}
              </span>
            </span>
          );
        })}
      </div>
    </Card>
  );
}

export default CalendarWidget;
