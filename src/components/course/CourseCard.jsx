import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// "Senin · 18.30–20.20 · L3 · Lab 8" — satu mk bisa punya dua slot, jadi
// yang ditampilkan selalu slot pertemuan berikutnya, bukan slot tetap.
function scheduleLabel(nextSlot) {
  if (!nextSlot) return null;
  return [NAMA_HARI[nextSlot.meeting.dayOfWeek], nextSlot.timeLabel, nextSlot.roomLabel]
    .filter(Boolean)
    .join(' · ');
}

function CourseCard({
  course,
  progress,
  nextSlot = null,
  variant = 'grid',
}) {
  const isCompleted = progress >= 100;
  const schedule = scheduleLabel(nextSlot);

  return (
    <Card as="article" className="overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-2 px-5 py-3">
        <span className="text-[13px] font-semibold text-secondary">{course.credits} SKS</span>
        {schedule ? <span className="truncate text-[13px] text-secondary">{schedule}</span> : null}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-main">
          <Link
            to={`/mata-kuliah/${course.id}`}
            className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {course.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-secondary">{course.lecturer}</p>

        <div
          className={
            variant === 'list'
              ? 'mt-5 sm:flex sm:items-center sm:justify-between sm:gap-8'
              : ''
          }
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-secondary">Progres belajar</span>
              <span className={`font-semibold ${isCompleted ? 'text-success' : 'text-primary'}`}>
                {progress}%
              </span>
            </div>
            <ProgressBar
              className="mt-2"
              color={isCompleted ? 'success' : 'primary'}
              label={`Progres ${course.name}`}
              value={progress}
            />
            <p className="mt-3 line-clamp-2 text-[13px] text-secondary">
              {isCompleted ? 'Materi sudah selesai' : <>Berikutnya: {course.next}</>}
            </p>
          </div>
          <Button
            as={Link}
            to={`/mata-kuliah/${course.id}`}
            variant={isCompleted ? 'success' : 'primary'}
            className={variant === 'list' ? 'mt-4 w-full sm:mt-3 sm:w-auto' : 'mt-4 w-full'}
            rightArrow
          >
            Lanjutkan Belajar
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default CourseCard;
