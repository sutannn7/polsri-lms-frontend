import { ArrowRight, CalendarClock } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { formatDate } from '../../utils/formatDate';

function NextDeadlineCard({ activity, onViewTasks }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold text-main">Tenggat terdekat</h2>
        <span className="rounded-full bg-warning-badge px-2.5 py-1 text-xs font-semibold text-warning-text">
          2 hari lagi
        </span>
      </div>
      <p className="mt-4 font-semibold leading-5 text-main">{activity.title}</p>
      <p className="mt-2 flex items-center gap-2 text-sm text-secondary">
        <CalendarClock size={16} aria-hidden="true" />
        {formatDate(activity.dueAt, { includeTime: true })}
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-5 w-full"
        rightArrow
        onClick={onViewTasks}
      >
        Lihat Tugas
      </Button>
    </Card>
  );
}

export default NextDeadlineCard;