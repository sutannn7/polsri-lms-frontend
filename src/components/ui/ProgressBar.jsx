// Tone bermakna satu di seluruh aplikasi: biru = progres, hijau = selesai,
// abu (surface-3) = belum. Jalur bar surface-2 agar tone idle tetap terlihat.
const toneClasses = {
  progress: 'bg-primary',
  done: 'bg-success',
  idle: 'bg-surface-3',
};

function ProgressBar({
  value,
  tone = 'progress',
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
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${toneClasses[tone] ?? toneClasses.progress}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showValue ? <span className="mt-1 block text-right text-[13px] font-semibold text-secondary">{progress}%</span> : null}
    </div>
  );
}

export default ProgressBar;
