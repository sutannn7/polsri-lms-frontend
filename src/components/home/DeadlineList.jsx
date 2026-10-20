import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import StatusChip from '../ui/StatusChip';
import { dueLabel, isOverdue } from '../../utils/due';

// Warna chip mengikuti satu bahasa status aplikasi:
// emas = mendesak/terlambat, netral (abu) = selesai/akan datang.
// Warna chip mengikuti satu bahasa status aplikasi:
// emas = mendesak/terlambat, netral (abu) = selesai/akan datang.
function chipStatus(deadline, now) {
  if (deadline.status === 'Selesai') return 'done';
  if (deadline.status === 'Mendesak' || isOverdue(deadline.dueAt, now)) return 'urgent';
  return 'upcoming';
}

function DeadlineList({ deadlines = [], now = new Date() }) {
  const sorted = [...deadlines].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
  );

  return (
    <Card className="p-5">
      <ul className="divide-y divide-border">
        {sorted.map((deadline) => {
          const done = deadline.status === 'Selesai';
          return (
            <li key={deadline.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <Link
                  to={`/mata-kuliah/${deadline.courseId}`}
                  className="line-clamp-2 text-sm font-semibold text-main hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {deadline.title}
                </Link>
                <p className="mt-1 truncate text-[13px] text-secondary">{deadline.courseName}</p>
              </div>
              <StatusChip status={chipStatus(deadline, now)}>
                {done ? 'Selesai' : dueLabel(deadline.dueAt, now)}
              </StatusChip>
            </li>
          );
        })}
        {sorted.length === 0 ? (
          <li className="py-3 text-sm text-secondary">Tidak ada tenggat.</li>
        ) : null}
      </ul>
    </Card>
  );
}

export default DeadlineList;
