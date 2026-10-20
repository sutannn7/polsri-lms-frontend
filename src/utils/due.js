// Murni, tanpa React/DOM. Satu hari = 24 jam, dibulatkan ke bawah:
// sisa beberapa jam di hari tenggat tetap dihitung "Hari ini".
const DAY_MS = 24 * 60 * 60 * 1000;

export function daysUntil(dueAt, now) {
  return Math.floor((new Date(dueAt).getTime() - new Date(now).getTime()) / DAY_MS);
}

export function isOverdue(dueAt, now) {
  return new Date(dueAt).getTime() < new Date(now).getTime();
}

export function dueLabel(dueAt, now) {
  const days = daysUntil(dueAt, now);
  if (days < 0) return `Terlambat ${-days} hari`;
  if (days === 0) return 'Hari ini';
  if (days === 1) return 'Besok';
  return `${days} hari lagi`;
}
