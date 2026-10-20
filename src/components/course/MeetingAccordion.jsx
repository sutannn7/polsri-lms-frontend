import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import Accordion from '../ui/Accordion';
import ActivityItem from './ActivityItem';
import QuizCard from './QuizCard';

function MeetingAccordion({ unit, defaultOpen = false, onActivityAction }) {
  const completedCount = unit.activities.filter((activity) => activity.completed).length;
  const activityCount = unit.activities.length;
  const isCompleted = unit.status === 'completed';

  return (
    <Accordion
      defaultOpen={defaultOpen}
      className="shadow-card transition-shadow hover:shadow-md"
      title={
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-primary">
            {String(unit.number).padStart(2, '0')}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-main sm:text-base">
              {unit.title}
            </span>
            <span className="mt-1 block text-[13px] font-normal text-secondary">
              {completedCount}/{activityCount} aktivitas
            </span>
          </span>
          {isCompleted ? (
            <CheckCircle2 className="shrink-0 text-success" size={20} aria-label="Pertemuan selesai" />
          ) : unit.status === 'active' ? (
            <PlayCircle className="shrink-0 text-primary" size={20} aria-label="Pertemuan aktif" />
          ) : (
            <Circle className="shrink-0 text-secondary" size={20} aria-label="Belum dimulai" />
          )}
        </span>
      }
    >
      <div className="space-y-3">
        {unit.activities.map((activity, index) =>
          activity.type === 'quiz' ? (
            <QuizCard
              key={`${unit.number}-${activity.title}`}
              activity={activity}
              onAction={onActivityAction}
            />
          ) : (
            <ActivityItem
              key={`${unit.number}-${activity.title}`}
              activity={activity}
              index={index + 1}
              onAction={onActivityAction}
            />
          ),
        )}
      </div>
    </Accordion>
  );
}

export default MeetingAccordion;