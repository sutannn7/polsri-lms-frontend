import Card from '../ui/Card';

// Tanggal pengumuman adalah string "YYYY-MM-DD" absolut, jadi formatnya
// langsung dari Intl tanpa util formatDate (yang menambah offset WIB).
const dateLabel = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function AnnouncementCard({ announcement }) {
  return (
    <Card as="article" className="p-5">
      <p className="text-[13px] font-semibold text-primary">{announcement.category}</p>
      <h3 className="mt-1 text-base font-bold text-main">{announcement.title}</h3>
      <p className="mt-1 text-[13px] text-secondary">{dateLabel.format(new Date(announcement.date))}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-secondary">{announcement.description}</p>
    </Card>
  );
}

export default AnnouncementCard;
