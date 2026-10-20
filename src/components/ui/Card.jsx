function Card({ as: Component = 'div', children, className = '', ...props }) {
  return (
    <Component
      className={`rounded-card border border-border bg-background dark:shadow-card ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
