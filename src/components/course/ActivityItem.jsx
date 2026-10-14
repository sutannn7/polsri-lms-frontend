import { ClipboardList, Download, FileText } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { formatDate, getDeadlineInfo } from '../../utils/formatDate';

function ActivityItem({ activity, index, onAction }) {
  const isAssignment = activity.type === 'assignment';
  const isDiscussion = activity.type === 'discussion';
  const isCompleted = Boolean(activity.completed) || activity.statusLabel === 'Terkirim';
  const deadlineInfo = isAssignment ? getDeadlineInfo(activity) : null;
  const Icon = isAssignment ? ClipboardList : FileText;
  const actionLabel = activity.action ?? (isDiscussion ? 'Buka Diskusi' : 'Buka Materi');

  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Icon size={19} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold leading-5 text-main">{activity.title}</p>
          {isAssignment ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={isCompleted ? 'success' : deadlineInfo.status === 'Terlambat' ? 'danger' : 'warning'}>
                {isCompleted ? 'Terkirim' : deadlineInfo.status === 'Terlambat' ? 'Terlambat' : activity.statusLabel}
              </Badge>
              <span className="text-xs text-secondary">
                {isCompleted ? 'Tenggat' : `${deadlineInfo.label} • tenggat`} {formatDate(activity.dueAt, { includeTime: true })}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-secondary">
              {activity.format ?? (isDiscussion ? 'Forum diskusi' : 'Materi')}
              {activity.fileSize ? <> <span aria-hidden="true">•</span> {activity.fileSize}</> : null}
            </p>
          )}
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant={isAssignment ? 'primary' : 'outline'}
        className="shrink-0 self-start sm:self-center"
        icon={!isAssignment && !isDiscussion ? <Download size={15} /> : undefined}
        onClick={() => onAction?.(activity)}
      >
        {actionLabel}
      </Button>
      {index ? <span className="sr-only">Aktivitas {index}</span> : null}
    </Card>
  );
}

export default ActivityItem;