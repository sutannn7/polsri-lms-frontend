function Bezel({ className = '', children, ...props }) {
  return (
    <div className={`landing-shell ${className}`.trim()} {...props}>
      <div className="landing-core">{children}</div>
    </div>
  );
}

export default Bezel;
