import { Link } from 'react-router-dom';

function FinalCta() {
  return (
    <section className="redesign-final-section" aria-labelledby="landing-final-title">
      <div className="redesign-container redesign-final" data-reveal data-ui>
        <div>
          <h2 id="landing-final-title">Mulai dari tenggat terdekat.</h2>
          <p>Masuk dengan akun akademik untuk melihat mata kuliah dan aktivitas yang tersedia.</p>
        </div>
        <Link className="redesign-final-link" to="/login">Masuk ke LearnEase</Link>
      </div>
    </section>
  );
}

export default FinalCta;
