// Chip status: live/urgent sorotan amber dari token accent, done/upcoming netral.
// bg-*/15 tidak tersedia untuk warna berbasis var() di Tailwind, jadi latar
// sorotan dibangun dengan color-mix dari token accent yang sama. Teks sorotan
// memakai warning-text karena accent (#FFC107) tidak cukup kontras (1.42:1
// di tema terang); warning-text utuh di kedua tema.
const variantClasses = {
  live: 'text-warning-text bg-[color-mix(in_srgb,var(--accent)_15%,transparent)]',
  urgent: 'text-warning-text bg-[color-mix(in_srgb,var(--accent)_15%,transparent)]',
  done: 'text-secondary bg-surface-2',
  upcoming: 'text-secondary bg-surface-3',
};

const defaultLabels = {
  live: 'Berlangsung',
  done: 'Selesai',
  upcoming: 'Akan datang',
  urgent: 'Mendesak',
};

function StatusChip({ status, children, className = '' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-medium ${variantClasses[status] ?? variantClasses.upcoming} ${className}`}
    >
      {children ?? defaultLabels[status] ?? defaultLabels.upcoming}
    </span>
  );
}

export default StatusChip;
