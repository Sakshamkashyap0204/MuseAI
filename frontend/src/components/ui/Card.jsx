function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-[var(--color-surface-1)] border border-[var(--color-border)]
        rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]
        ${hover ? 'transition-all duration-200 hover:border-[var(--color-accent)]/30 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
