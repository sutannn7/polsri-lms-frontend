import Card from '../ui/Card';

// Kategori + judul + tanggal "12 Okt 2026"; tanggal date-only ("2026-10-12")
// diparse UTC sehingga zona barat tidak menggeser tampilannya sehari.
const dateLabel = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
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
