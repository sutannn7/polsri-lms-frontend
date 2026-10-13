function PolsriLogo({ size = 64, className = '', label = 'Logo Politeknik Negeri Sriwijaya' }) {
  return (
    <img
      src="/logo-polsri.png"
      alt={label}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

export default PolsriLogo;
