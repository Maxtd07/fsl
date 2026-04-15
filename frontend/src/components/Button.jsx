import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Reusable Button Component with 5 variants:
 * - primary: Main CTA, bg-primary, text-white
 * - secondary: Support, success states, bg-secondary, text-white
 * - accent: Highlight interactions, bg-accent, text-dark (use cautiously - contrast weak on white)
 * - outline: Secondary action, border-primary, text-primary
 * - ghost: Minimal action, text-primary, hover:bg-primary/10
 * 
 * Sizes: sm, md (default), lg
 * Icon support: left/right positioning with FontAwesome
 */

function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  // Base classes - always applied
  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'font-semibold rounded-lg transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
    fullWidth && 'w-full',
  ]
    .filter(Boolean)
    .join(' ')

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs min-h-9',
    md: 'px-4 py-2.5 text-sm min-h-10',
    lg: 'px-6 py-3 text-base min-h-12',
  }

  // Color variants
  const variantClasses = {
    primary:
      'bg-primary text-white shadow-md hover:bg-primary/90 active:bg-primary/80 disabled:bg-primary',
    secondary:
      'bg-secondary text-white shadow-md hover:bg-secondary/90 active:bg-secondary/80 disabled:bg-secondary',
    accent:
      'bg-accent text-dark shadow-md hover:bg-accent/90 active:bg-accent/80 disabled:bg-accent',
    outline:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10 active:bg-primary/15 bg-transparent',
  }

  const classNames = [baseClasses, sizeClasses[size], variantClasses[variant], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={classNames}
      {...props}
    >
      {iconPosition === 'left' && icon && !isLoading && <FontAwesomeIcon icon={icon} />}
      {isLoading && (
        <FontAwesomeIcon
          icon={icon || 'spinner'}
          className="animate-spin"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
      {iconPosition === 'right' && icon && !isLoading && <FontAwesomeIcon icon={icon} />}
    </button>
  )
}

export default Button
