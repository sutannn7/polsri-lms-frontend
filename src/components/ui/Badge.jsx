const variantClasses = {
  info: 'bg-primary-soft text-primary-dark',
  warning: 'bg-warning-badge text-warning-text',
  danger: 'bg-danger-badge text-danger-text',
  success: 'bg-success-badge text-success-text',
  neutral: 'bg-neutral-badge text-neutral-text',
};

function Badge({ children, variant = 'neutral', className = '', ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-medium ${variantClasses[variant] ?? variantClasses.neutral} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
