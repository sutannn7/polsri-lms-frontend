import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

function ContinueLearningCard({ course }) {
  return (
    <Card as="article" className="overflow-hidden border-l-4 border-l-accent">
      <Link
        to={`/mata-kuliah/${course.id}`}
        className="block bg-primary-soft px-5 py-4 transition-colors hover:bg-[#e3f0ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <p className="text-xs font-semibold text-primary-dark">{course.id} • Semester {course.semester}</p>
        <p className="mt-2 text-lg font-bold text-main">{course.name}</p>
        <p className="mt-1 text-sm text-secondary">{course.lecturer}</p>
      </Link>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-sm text-secondary">Progres belajar</span>
          <Badge variant="info">{course.progress}%</Badge>
        </div>
        <ProgressBar value={course.progress} label={`Progres ${course.name}`} />
        <Link
          to={`/mata-kuliah/${course.id}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Lanjutkan Belajar <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}

export default ContinueLearningCard;