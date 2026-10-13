import { ClipboardList, Download, FileText } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { formatDate } from '../../utils/formatDate';

function ActivityItem({ activity, index, onAction }) {
  const isAssignment = activity.type === 'assignment';
  const Icon = isAssignment ? ClipboardList : FileText;

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
              <Badge variant="danger">{activity.statusLabel}</Badge>
              <span className="text-xs text-secondary">
                Tenggat {formatDate(activity.dueAt, { includeTime: true })}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-secondary">
              {activity.format} <span aria-hidden="true">•</span> {activity.fileSize}
            </p>
          )}
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant={isAssignment ? 'primary' : 'outline'}
        className="shrink-0 self-start sm:self-center"
        icon={isAssignment ? undefined : <Download size={15} />}
        onClick={() => onAction?.(activity)}
      >
        {activity.action}
      </Button>
      {index ? <span className="sr-only">Aktivitas {index}</span> : null}
    </Card>
  );
}

export default ActivityItem;