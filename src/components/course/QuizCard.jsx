import { CircleHelp } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

function QuizCard({ activity, onAction }) {
  return (
    <Card className="bg-surface-2 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary">
            <CircleHelp size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-5 text-main">{activity.title}</p>
            <p className="mt-2 text-[13px] text-secondary">
              {activity.format ?? 'Kuis'}
              {activity.fileSize ? <> <span aria-hidden="true">•</span> {activity.fileSize}</> : null}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
          {activity.completed ? <Badge variant="success">Selesai</Badge> : null}
          <Button
            type="button"
            size="sm"
            variant={activity.completed ? 'outline' : 'primary'}
            onClick={() => onAction?.(activity)}
          >
            {activity.action}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default QuizCard;
