import { formatDate, getDeadlineInfo } from '../../utils/formatDate';

function PhonePreview({ deadlines, courses, announcements }) {
  const firstDeadline = deadlines[0];
  const nearestAnnouncement = [...announcements]
    .sort((first, second) => new Date(second.date) - new Date(first.date))[0];
  const deadlineInfo = firstDeadline ? getDeadlineInfo(firstDeadline) : null;
  const previewCourses = courses.slice(0, 3);

  return (
    <section className="redesign-section redesign-phone-section" aria-labelledby="redesign-phone-title">
      <div className="redesign-container redesign-phone-layout">
        <div className="redesign-phone-copy" data-reveal>
          <h2 id="redesign-phone-title">Dibuka dari HP, tetap lengkap.</h2>
          <p>Ringkasan belajar tetap bisa dipindai tanpa kehilangan informasi penting.</p>
          <ul className="redesign-phone-points">
            <li>Tenggat dan batas waktu pengumpulan.</li>
            <li>Progres seluruh mata kuliah.</li>
            <li>Pengumuman kampus terbaru.</li>
          </ul>
        </div>
        <div className="redesign-phone-stage" data-ui data-reveal style={{ '--reveal-delay': '90ms' }}>
          <div className="redesign-phone-top">
            <strong>LearnEase</strong>
            <time>{formatDate(new Date()).split(' ').slice(0, 2).join(' ')}</time>
          </div>
          <h3>Ringkasan belajar</h3>
          {firstDeadline ? (
            <article className="redesign-phone-deadline">
              <span>Tenggat terdekat · {deadlineInfo.label.toLowerCase()}</span>
              <strong>{firstDeadline.title}</strong>
              <p>{firstDeadline.courseName} · 23.59 WIB</p>
            </article>
          ) : <p className="redesign-phone-empty">Tidak ada tenggat mendatang.</p>}

          <div className="redesign-phone-course-list">
            <h4>Progres mata kuliah</h4>
            {previewCourses.map((course) => (
              <div className="redesign-phone-course" key={course.id}>
                <div><span>{course.name}</span><strong>{course.progress}%</strong></div>
                <span className="redesign-phone-track"><span style={{ '--progress': `${course.progress}%` }} /></span>
              </div>
            ))}
          </div>

          {nearestAnnouncement ? (
            <article className="redesign-phone-announcement">
              <span>Pengumuman terbaru · {nearestAnnouncement.category}</span>
              <strong>{nearestAnnouncement.title}</strong>
              <time dateTime={nearestAnnouncement.date}>{formatDate(`${nearestAnnouncement.date}T12:00:00+07:00`)}</time>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default PhonePreview;
