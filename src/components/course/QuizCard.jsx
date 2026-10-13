import { CircleHelp, Clock3, ListChecks, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

function QuizCard({ activity, onAction }) {
  return (
    <Card className="border-primary/20 bg-primary-soft/40 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
            <CircleHelp size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-5 text-main">{activity.title}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} aria-hidden="true" /> {activity.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RotateCcw size={14} aria-hidden="true" /> Percobaan: {activity.attempts}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks size={14} aria-hidden="true" /> {activity.questionCount} Soal
              </span>
            </div>
            <p className="mt-3 text-sm leading-5 text-secondary">{activity.description}</p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0 self-start sm:self-center"
          onClick={() => onAction?.(activity)}
        >
          {activity.action}
        </Button>
      </div>
    </Card>
  );
}

export default QuizCard;