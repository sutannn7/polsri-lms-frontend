// Murni, tanpa React/DOM. Semua perbandingan jam dilakukan di Asia/Jakarta (WIB).
const WEEKDAY_CODES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function jakartaNow(now) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type) => Number(parts.find((part) => part.type === type).value);
  return { hour: value('hour'), minute: value('minute') };
}

function jakartaWeekday(date) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    weekday: 'short',
  }).format(date);
  return WEEKDAY_CODES.indexOf(weekday);
}

function toMinutes(time) {
  const [hour, minute] = time.split('.').map(Number);
  return hour * 60 + (minute || 0);
}

export function getScheduleForDate(schedule, date) {
  const weekday = jakartaWeekday(date);
  return schedule
    .filter((meeting) => meeting.dayOfWeek === weekday)
    .slice()
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
}

export function getMeetingStatus(meeting, now) {
  const { hour, minute } = jakartaNow(now);
  const nowMinute = hour * 60 + minute;
  if (nowMinute < toMinutes(meeting.startTime)) return 'upcoming';
  if (nowMinute < toMinutes(meeting.endTime)) return 'live';
  return 'done';
}

export function formatTimeRange(meeting) {
  return `${meeting.startTime}–${meeting.endTime}`;
}

export function shortRoom(room) {
  return String(room)
    .replace(/^Gedung Manajemen Informatika\s*/, '')
    .replace('Lantai ', 'L')
    .replace(' - ', ' · ');
}

export function normalizeCourseName(name) {
  return String(name)
    .split(/\s+/)
    .map((word) =>
      word
        .split('.')
        .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
        .join('.'),
    )
    .join(' ');
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toAgendaEntry(meeting, now, statusOverride) {
  return {
    meeting,
    status: statusOverride ?? getMeetingStatus(meeting, now),
    timeLabel: formatTimeRange(meeting),
    roomLabel: shortRoom(meeting.room),
    courseLabel: normalizeCourseName(meeting.courseName),
    href: `/mata-kuliah/${slugify(meeting.courseId)}`,
  };
}

// Pertemuan pertama setelah `now`: sisa slot di hari yang sama, lalu hari
// berikutnya yang punya jadwal (maksimal satu putaran minggu), atau null.
function findNextMeeting(pool, now) {
  const { hour, minute } = jakartaNow(now);
  const nowMinute = hour * 60 + minute;
  const weekday = jakartaWeekday(now);
  const sorted = pool.slice().sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
  const laterToday = sorted.find(
    (meeting) => meeting.dayOfWeek === weekday && toMinutes(meeting.startTime) > nowMinute,
  );
  if (laterToday) return laterToday;
  for (let offset = 1; offset <= 7; offset += 1) {
    const day = (weekday + offset) % 7;
    const next = sorted.find((meeting) => meeting.dayOfWeek === day);
    if (next) return next;
  }
  return null;
}

// Slot berikutnya pada hari lain belum pernah terjadi, jadi statusnya selalu
// 'upcoming' — bandingkan jam per hari hanya berlaku untuk sesi hari yang sama.
export function buildAgenda(schedule, now) {
  const meetings = getScheduleForDate(schedule, now).map((meeting) => toAgendaEntry(meeting, now));
  const next = findNextMeeting(schedule, now);
  return {
    kind: meetings.length > 0 ? 'list' : 'empty',
    meetings,
    nextMeeting: next ? toAgendaEntry(next, now, 'upcoming') : null,
  };
}

export function getNextSlot(courseId, schedule, now) {
  const mine = schedule.filter((meeting) => meeting.courseId === courseId);
  const next = findNextMeeting(mine, now);
  return next ? toAgendaEntry(next, now, 'upcoming') : null;
}

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Label slot jadwal dari entri agenda: "Senin · 18.30–20.20 · L3 · Lab 8",
// satu mk bisa punya dua slot, jadi yang ditampilkan slot pertemuan berikutnya.
export function slotLabel(nextSlot) {
  if (!nextSlot) return null;
  return [NAMA_HARI[nextSlot.meeting.dayOfWeek], nextSlot.timeLabel, nextSlot.roomLabel]
    .filter(Boolean)
    .join(' · ');
}

// Kalimat slot tanpa tanda kurung, hari digabung dengan jam
// ("Kamis 18.30–19.50 · L3 · Lab 8") — untuk baris "Kelas berikutnya:",
// yang tak boleh menyarangkan kurung di dalam kurung.
export function slotSentence(nextSlot) {
  const label = slotLabel(nextSlot);
  return label ? label.replace(' · ', ' ') : null;
}
