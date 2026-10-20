import { ClipboardList, Download, FileText } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { formatDate, getDeadlineInfo } from '../../utils/formatDate';

function ActivityItem({ activity, index }) {
  const isAssignment = activity.type === 'assignment';
  const isDiscussion = activity.type === 'discussion';
  const isCompleted = Boolean(activity.completed) || activity.statusLabel === 'Terkirim';
  const deadlineInfo = isAssignment ? getDeadlineInfo(activity) : null;
  const Icon = isAssignment ? ClipboardList : FileText;
  const actionLabel = activity.action
    ?? (isAssignment ? 'Kerjakan Tugas' : isDiscussion ? 'Buka Diskusi' : 'Buka Materi');
  const statusBadge = isAssignment
    ? (isCompleted
      ? { label: 'Terkirim', variant: 'success' }
      : deadlineInfo.status === 'Terlambat'
        ? { label: 'Terlambat', variant: 'danger' }
        : deadlineInfo.status === 'Mendesak'
          ? { label: 'Mendesak', variant: 'warning' }
          : deadlineInfo.status === 'Selesai'
            ? { label: 'Selesai', variant: 'success' }
            : { label: 'Akan Datang', variant: 'info' })
    : null;

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
              <Badge variant={statusBadge.variant}>
                {statusBadge.label}
              </Badge>
              <span className="text-[13px] text-secondary">
                {isCompleted ? 'Tenggat' : `${deadlineInfo.label}, tenggat`} {formatDate(activity.dueAt, { includeTime: true })}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-[13px] text-secondary">
              {activity.format ?? (isDiscussion ? 'Forum diskusi' : 'Materi')}
              {activity.fileSize ? <> <span aria-hidden="true">•</span> {activity.fileSize}</> : null}
            </p>
          )}
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant={isAssignment
          ? (deadlineInfo.status === 'Selesai' ? 'outline' : 'primary')
          : 'outline'}
        className="shrink-0 self-start sm:self-center"
        icon={!isAssignment && !isDiscussion ? <Download size={15} /> : undefined}
        disabled
        aria-disabled="true"
        title="Belum tersedia"
      >
        {actionLabel}
        <span className="sr-only"> (belum tersedia)</span>
      </Button>
      {index ? <span className="sr-only">Aktivitas {index}</span> : null}
    </Card>
  );
}

export default ActivityItem;