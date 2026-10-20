import { MessageCircle } from 'lucide-react';
import Card from '../ui/Card';

function LecturerCard({ name, degree, onOpenForum }) {
  return (
    <Card className="p-5">
      <h2 className="font-bold text-main">Dosen Pengampu</h2>
      <div className="mt-4 flex items-center gap-3">
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-dark">
          {name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-main">{name}</p>
          {degree ? <p className="mt-1 text-sm text-secondary">{degree}</p> : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenForum}
        className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <MessageCircle size={16} aria-hidden="true" />
        Tanya melalui forum diskusi
      </button>
    </Card>
  );
}

export default LecturerCard;