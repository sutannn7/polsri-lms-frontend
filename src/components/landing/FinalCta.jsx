import { Link } from 'react-router-dom';

function FinalCta() {
  return (
    <section className="redesign-final-section" aria-labelledby="landing-final-title">
      <div className="redesign-container redesign-final" data-reveal>
        <div className="redesign-final-copy">
          <h2 id="landing-final-title">Mulai dari tenggat terdekat.</h2>
          <p>Masuk dengan akun akademik untuk melihat mata kuliah dan aktivitas yang tersedia.</p>
        </div>
        <Link className="redesign-final-link" to="/login">Masuk ke LearnEase</Link>
        <figure className="redesign-final-image">
          <img
            src="/images/kampus-polsri.webp"
            alt="Gedung Politeknik Negeri Sriwijaya"
            width="663"
            height="461"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}

export default FinalCta;
