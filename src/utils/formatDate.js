const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
});

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Asia/Jakarta',
});

export function formatDate(value, { includeTime = false, suffix = 'WIB' } = {}) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const formattedDate = dateFormatter.format(date).replace(/\./g, '');
  if (!includeTime) return formattedDate;

  const formattedTime = timeFormatter.format(date).replace(/\./g, '.');
  return `${formattedDate} • ${formattedTime} ${suffix}`;
}

export function isUpcomingDeadline(deadline, now = new Date()) {
  return deadline.status !== 'Selesai' && new Date(deadline.dueAt).getTime() >= now.getTime();
}