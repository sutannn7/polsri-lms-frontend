function Card({ as: Component = 'div', children, className = '', ...props }) {
  return (
    <Component
      className={`rounded-card border border-border bg-white shadow-card ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
