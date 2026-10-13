import { ClipboardPenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { formatDate } from '../../utils/formatDate';

const statusVariants = {
  Mendesak: 'warning',
  'Akan Datang': 'info',
  Selesai: 'success',
};

function DeadlineList({ deadlines = [] }) {
  return (
    <Card className="p-5">
      <h2 className="mb-2 text-lg font-bold text-main">Deadlines</h2>
      <ul className="divide-y divide-border">
        {deadlines.map((deadline) => (
          <li key={deadline.id} className="flex items-start gap-3 py-4 first:pt-3 last:pb-0">
            <span aria-hidden="true" className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
              <ClipboardPenLine size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <Link to={`/mata-kuliah/${deadline.courseId}`} className="text-sm font-semibold text-main hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {deadline.title}
              </Link>
              <p className="mt-1 text-xs leading-5 text-secondary">
                {deadline.courseName} • {formatDate(deadline.dueAt, { includeTime: true })}
              </p>
            </div>
            <Badge variant={statusVariants[deadline.status] ?? 'neutral'} className="shrink-0">
              {deadline.status}
            </Badge>
          </li>
        ))}
        {deadlines.length === 0 ? (
          <li className="py-5 text-sm text-secondary">Tidak ada tugas mendatang.</li>
        ) : null}
      </ul>
    </Card>
  );
}

export default DeadlineList;