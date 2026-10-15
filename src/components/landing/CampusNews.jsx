function CampusNews({ announcements }) {
  return (
    <section className="redesign-section redesign-news-section" aria-labelledby="redesign-news-title">
      <div className="redesign-container">
        <header className="redesign-section-heading" data-reveal>
          <h2 id="redesign-news-title">Kabar kampus, tanpa cari-cari.</h2>
        </header>
        <div className="redesign-news-list" data-ui>
          {announcements.map((announcement, index) => (
            <article
              key={announcement.id}
              data-reveal
              style={{ '--reveal-delay': `${index * 80}ms`, '--row-index': index }}
            >
              <time dateTime={announcement.date}>{new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'short',
                timeZone: 'Asia/Jakarta',
              }).format(new Date(`${announcement.date}T12:00:00+07:00`)).replace(/\./g, '')}</time>
              <div>
                <span>{announcement.category}</span>
                <h3>{announcement.title}</h3>
                <p>{announcement.description}</p>
              </div>
            </article>
          ))}
          {!announcements.length ? <p className="redesign-empty">Belum ada pengumuman.</p> : null}
        </div>
      </div>
    </section>
  );
}

export default CampusNews;
