import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Masuk',
    description: 'Gunakan NIP, NPM, atau NIK dan kata sandi akun akademik.',
  },
  {
    title: 'Buka Beranda',
    description: 'Periksa progres mata kuliah, pengumuman, jadwal, dan tenggat.',
  },
  {
    title: 'Lanjutkan belajar',
    description: 'Buka materi dan aktivitas yang tersedia di setiap mata kuliah.',
  },
];

function Steps() {
  return (
    <section className="redesign-section redesign-steps-section" id="cara" aria-labelledby="redesign-steps-title">
      <div className="redesign-container">
        <header className="redesign-section-heading redesign-steps-heading" data-reveal>
          <h2 id="redesign-steps-title">Masuk dalam tiga langkah.</h2>
          <p>Informasi pembelajaran tersusun dalam alur yang bisa langsung diperiksa.</p>
        </header>
        <ol className="redesign-steps-list" data-reveal>
          {steps.map(({ title, description }, index) => (
            <li
              className="redesign-step-card"
              data-reveal
              style={{ '--reveal-delay': `${index * 80}ms` }}
              key={title}
            >
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        <p className="redesign-steps-link-wrap" data-reveal>
          <Link className="redesign-inline-link" to="/login">Buka halaman masuk</Link>
        </p>
      </div>
    </section>
  );
}

export default Steps;
