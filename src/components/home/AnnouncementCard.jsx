import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { formatDate } from '../../utils/formatDate';

const categoryVariants = {
  Akademik: 'info',
  Beasiswa: 'warning',
  Kegiatan: 'neutral',
};

function AnnouncementCard({ announcement }) {
  return (
    <Card as="article" className="p-5">
      <Badge variant={categoryVariants[announcement.category] ?? 'neutral'}>
        {announcement.category}
      </Badge>
      <h3 className="mt-3 text-sm font-bold text-main">{announcement.title}</h3>
      <p className="mt-1 text-xs text-secondary">
        {formatDate(announcement.date)} • {announcement.category}
      </p>
      <p className="mt-3 text-sm leading-6 text-secondary">{announcement.description}</p>
    </Card>
  );
}

export default AnnouncementCard;