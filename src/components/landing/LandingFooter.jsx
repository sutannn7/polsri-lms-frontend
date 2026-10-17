function LandingFooter() {
  const brand = 'LearnEase';

  return (
    <footer className="redesign-footer">
      <div className="redesign-container redesign-footer-top">
        <p className="redesign-footer-brand" aria-label={brand}>
          {Array.from(brand, (letter, index) => (
            <span key={`${letter}-${index}`} aria-hidden="true" style={{ '--letter-index': index }}>{letter}</span>
          ))}
        </p>
        <p>Portal pembelajaran digital Politeknik Negeri Sriwijaya.</p>
      </div>
      <div className="redesign-container redesign-footer-bottom">
        <span>© {new Date().getFullYear()} Politeknik Negeri Sriwijaya</span>
        <span>Prototipe: data masih contoh.</span>
      </div>
    </footer>
  );
}

export default LandingFooter;
