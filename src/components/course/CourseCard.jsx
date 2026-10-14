import { Link } from 'react-router-dom';
import {
  BarChart3,
  Code2,
  Database,
  FileText,
  GitBranch,
  Network,
} from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

const courseIcons = {
  MI2301: Code2,
  MI2302: Database,
  MI2303: GitBranch,
  MI2304: FileText,
  MI2305: Network,
  MI2306: BarChart3,
};

function CourseCard({
  course,
  view = 'grid',
  contextSemester,
  contextProgram,
}) {
  const isCompleted = Number(course.progress) >= 100;
  const CourseIcon = courseIcons[course.id] ?? Code2;
  const showSemester = contextSemester != null
    && String(course.semester) !== String(contextSemester);
  const showProgram = contextProgram
    && course.program
    && course.program !== contextProgram;

  return (
    <Card
      as="article"
      className={`overflow-hidden border-l-4 border-l-accent ${view === 'list' ? 'sm:flex' : ''}`}
    >
      <Link
        to={`/mata-kuliah/${course.id}`}
        aria-label={`Buka ${course.name}`}
        className={`relative flex items-center justify-between gap-4 bg-primary-soft px-5 py-4 transition-colors hover:bg-[#e3f0ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${view === 'list' ? 'sm:w-64 sm:shrink-0' : 'min-h-[104px]'}`}
      >
        <div>
          <p className="text-sm font-semibold text-primary-dark">{course.id}</p>
          <p className="mt-2 text-xs text-secondary">
            {showSemester ? `Semester ${course.semester} • ` : ''}{course.credits} SKS
          </p>
        </div>
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm"
        >
          <CourseIcon size={23} strokeWidth={1.8} />
        </div>
        {isCompleted ? <Badge variant="success" className="absolute bottom-3 right-4">Selesai</Badge> : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        {showProgram ? (
          <Badge variant="info" className="mb-2 self-start">{course.program}</Badge>
        ) : null}
        <Link to={`/mata-kuliah/${course.id}`} className="rounded-sm text-lg font-bold leading-snug text-main hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {course.name}
        </Link>
        <p className="mt-1 text-sm text-secondary">{course.lecturer}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-sm text-secondary">Progres belajar</span>
          <span className={`text-sm font-semibold ${isCompleted ? 'text-success' : 'text-primary'}`}>{course.progress}%</span>
        </div>
        <ProgressBar value={course.progress} color={isCompleted ? 'success' : 'primary'} label={`Progres ${course.name}`} className="mt-2" />

        <p className="mt-4 min-h-5 text-sm text-secondary">
          {isCompleted ? 'Materi sudah selesai' : <>Berikutnya: {course.next}</>}
        </p>
        <Button
          as={Link}
          to={`/mata-kuliah/${course.id}`}
          variant={isCompleted ? 'success' : 'primary'}
          className="mt-5 w-full"
          rightArrow
        >
          {isCompleted ? 'Lihat Ringkasan' : 'Lanjutkan Belajar'}
        </Button>
      </div>
    </Card>
  );
}

export default CourseCard;