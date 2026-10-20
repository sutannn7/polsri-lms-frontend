import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { slotLabel } from '../../utils/schedule';

function ContinueLearningCard({ course, progress, nextSlot }) {
  const schedule = slotLabel(nextSlot);

  return (
    <Card as="article" className="p-5">
      <h3 className="line-clamp-2 text-base font-bold leading-snug text-main">
        <Link
          to={`/mata-kuliah/${course.id}`}
          className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {course.name}
        </Link>
      </h3>
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className="text-secondary">Progres belajar</span>
        <span className={`font-semibold ${progress >= 100 ? 'text-success' : 'text-primary'}`}>{progress}%</span>
      </div>
      <ProgressBar
        className="mt-2"
        tone={progress >= 100 ? 'done' : 'progress'}
        label={`Progres ${course.name}`}
        value={progress}
      />
      <p className="mt-3 line-clamp-2 text-[13px] text-secondary">Berikutnya: {course.next}</p>
      {schedule ? <p className="mt-1 truncate text-[13px] text-secondary">{schedule}</p> : null}
      <Link
        to={`/mata-kuliah/${course.id}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Lanjutkan Belajar <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </Card>
  );
}

export default ContinueLearningCard;
