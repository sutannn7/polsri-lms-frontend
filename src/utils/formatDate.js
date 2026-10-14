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
  const dueTime = new Date(deadline.dueAt).getTime();
  return deadline.status !== 'Selesai'
    && !deadline.completed
    && deadline.statusLabel !== 'Terkirim'
    && Number.isFinite(dueTime)
    && dueTime >= now.getTime();
}

function jakartaDateNumber(value) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).formatToParts(value);
  const dateParts = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]));
  return Date.UTC(Number(dateParts.year), Number(dateParts.month) - 1, Number(dateParts.day));
}

export function getDeadlineInfo(deadline, now = new Date()) {
  const dueAt = deadline instanceof Date ? deadline : new Date(
    typeof deadline === 'string' ? deadline : deadline?.dueAt,
  );

  if (Number.isNaN(dueAt.getTime())) {
    return { label: 'Tanggal tidak tersedia', status: 'Akan Datang', daysRemaining: null };
  }

  if (deadline?.status === 'Selesai' || deadline?.completed || deadline?.statusLabel === 'Terkirim') {
    return { label: 'Selesai', status: 'Selesai', daysRemaining: null };
  }

  if (dueAt.getTime() < now.getTime()) {
    return { label: 'Terlambat', status: 'Terlambat', daysRemaining: -1 };
  }

  const daysRemaining = Math.round(
    (jakartaDateNumber(dueAt) - jakartaDateNumber(now)) / 86_400_000,
  );
  const label = daysRemaining === 0
    ? 'Hari ini'
    : daysRemaining === 1
      ? 'Besok'
      : `${daysRemaining} hari lagi`;

  return {
    label,
    status: daysRemaining <= 2 ? 'Mendesak' : 'Akan Datang',
    daysRemaining,
  };
}