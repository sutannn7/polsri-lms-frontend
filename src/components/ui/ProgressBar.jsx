const colorClasses = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-accent',
  danger: 'bg-danger',
};

function ProgressBar({
  value,
  color = 'primary',
  label = 'Progres',
  showValue = false,
  className = '',
}) {
  const progress = Math.min(100, Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0));

  return (
    <div className={`w-full ${className}`}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-3"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${colorClasses[color] ?? colorClasses.primary}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showValue ? <span className="mt-1 block text-right text-[13px] font-semibold text-secondary">{progress}%</span> : null}
    </div>
  );
}

export default ProgressBar;
