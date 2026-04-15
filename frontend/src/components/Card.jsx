/**
 * Reusable Card Component
 * - Elegant shadow, rounded corners, flexible layout
 * - Variants: default (white bg), minimal (no shadow), elevated (larger shadow)
 * - Support for header, body, footer sections with subtle dividers
 */

function Card({
  children,
  className = '',
  variant = 'default',
  header,
  footer,
  padding = true,
  interactive = false,
  ...props
}) {
  const variants = {
    default: 'bg-base border border-text/10 shadow-card rounded-lg',
    minimal: 'bg-base border border-text/5 rounded-lg',
    elevated: 'bg-base border border-text/5 shadow-lg rounded-lg',
  }

  const baseClasses = [
    variants[variant],
    padding && 'p-6',
    interactive && 'transition-all duration-200 hover:shadow-lg cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={baseClasses} {...props}>
      {header && <div className="mb-4 pb-4 border-b border-text/10">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-text/10">{footer}</div>}
    </div>
  )
}

export default Card
