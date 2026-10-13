import { ArrowRight } from 'lucide-react';

const variantClasses = {
  primary:
    'border-transparent bg-primary text-white hover:bg-primary-dark disabled:bg-primary/50',
  outline:
    'border-border bg-white text-main hover:border-primary hover:bg-primary-soft hover:text-primary disabled:bg-gray-100',
  success:
    'border-transparent bg-success text-white hover:bg-green-700 disabled:bg-success/50',
  ghost:
    'border-transparent bg-transparent text-primary hover:bg-primary-soft disabled:text-secondary',
};

const sizeClasses = {
  sm: 'min-h-9 px-3 text-xs',
  md: 'min-h-11 px-4 text-sm',
};

function Button({
  children,
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  rightArrow = false,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <Component
      {...(Component === 'button' ? { type, disabled } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variantClasses[variant] ?? variantClasses.primary} ${sizeClasses[size] ?? sizeClasses.md} ${className}`}
      {...props}
    >
      {icon ? <span aria-hidden="true" className="inline-flex">{icon}</span> : null}
      <span>{children}</span>
      {rightArrow ? <ArrowRight size={16} aria-hidden="true" /> : null}
    </Component>
  );
}

export default Button;
