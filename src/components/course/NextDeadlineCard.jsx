import { CalendarClock } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatDate, getDeadlineInfo } from '../../utils/formatDate';

const statusVariants = {
  Mendesak: 'warning',
  'Akan Datang': 'info',
  Terlambat: 'danger',
  Selesai: 'success',
};

function NextDeadlineCard({ activity, onViewTasks, now = new Date() }) {
  const deadlineInfo = getDeadlineInfo(activity, now);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold text-main">Tenggat terdekat</h2>
        <Badge variant={statusVariants[deadlineInfo.status] ?? 'neutral'}>
          {deadlineInfo.label}
        </Badge>
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