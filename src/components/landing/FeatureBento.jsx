import useCountUp from '../../hooks/useCountUp';

function AnimatedStat({ value, suffix = '', label }) {
  const { count, elementRef } = useCountUp(value);
  return (
    <div className="redesign-stat">
      <strong ref={elementRef} aria-label={`${value}${suffix}`}>{count}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

function FeatureBento({ courses }) {
  const credits = courses.reduce((sum, course) => sum + Number(course.credits || 0), 0);
  const average = courses.length
    ? Math.round(courses.reduce((sum, course) => sum + Number(course.progress || 0), 0) / courses.length)
    : 0;

  return (
    <section className="redesign-section redesign-progress-section" id="fitur" aria-labelledby="redesign-features-title">
      <div className="redesign-container">
        <header className="redesign-section-heading" data-reveal>
          <h2 id="redesign-features-title">Progres tiap mata kuliah.</h2>
          <p>Ringkasan dihitung dari enam mata kuliah yang tersedia pada data contoh.</p>
        </header>
        <div className="redesign-progress-content" data-ui>
          <div className="redesign-stats" data-reveal style={{ '--reveal-delay': '70ms' }}>
            <AnimatedStat value={average} suffix="%" label="Rata-rata progres" />
            <AnimatedStat value={credits} label="Total SKS" />
            <AnimatedStat value={courses.length} label="Mata kuliah" />
          </div>
          {courses.length ? (
            <div className="redesign-progress-list">
              {courses.map((course, index) => {
                const progress = Math.max(0, Math.min(100, Number(course.progress) || 0));
                return (
                  <div
                    className="redesign-progress-row"
                    key={course.id}
                    data-reveal
                    style={{ '--reveal-delay': `${index * 65}ms` }}
                  >
                    <div className="redesign-progress-label">
                      <span>{course.name}</span>
                      <strong>{progress}%</strong>
                    </div>
                    <div
                      className="redesign-progress-track"
                      role="progressbar"
                      aria-label={`Progres ${course.name}`}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <span
                        className="redesign-progress-fill"
                        aria-hidden="true"
                        style={{ '--progress': progress / 100 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="redesign-empty">Progres mata kuliah belum tersedia.</p>}
        </div>
      </div>
    </section>
  );
}

export default FeatureBento;
