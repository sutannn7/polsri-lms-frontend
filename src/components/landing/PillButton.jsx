import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const variantClasses = {
  primary: 'landing-pill-primary',
  yellow: 'landing-pill-yellow',
  ghost: 'landing-pill-ghost',
};

const sizeClasses = {
  md: 'landing-pill-md',
  sm: 'landing-pill-sm',
};

function PillButton({
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `landing-pill ${variantClasses[variant] ?? variantClasses.primary} ${sizeClasses[size] ?? sizeClasses.md} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      {variant !== 'ghost' ? (
        <span aria-hidden="true" className="landing-pill-icon">
          <ArrowUpRight size={size === 'sm' ? 16 : 19} strokeWidth={1.5} />
        </span>
      ) : null}
    </>
  );

  if (to) {
    return <Link to={to} className={classes} onClick={onClick} {...props}>{content}</Link>;
  }

  return (
    <a href={href} className={classes} onClick={onClick} {...props}>
      {content}
    </a>
  );
}

export default PillButton;
