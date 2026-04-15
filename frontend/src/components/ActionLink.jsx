import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * ActionLink Component - Link styled as button with 5 variants
 * - primary: Main CTA (primary color, shadow)
 * - secondary: Support/success (secondary color)
 * - accent: Highlight interaction (accent color)
 * - outline: Secondary action (border, no fill)
 * - ghost: Minimal action (text only, hover fills)
 */

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2'

function ActionLink({
  to,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs min-h-9',
    md: 'px-4 py-2.5 text-sm min-h-10',
    lg: 'px-6 py-3 text-base min-h-12',
  }

  const variants = {
    primary: 'bg-primary text-white shadow-md hover:bg-primary/90 active:bg-primary/80',
    secondary: 'bg-secondary text-white shadow-md hover:bg-secondary/90 active:bg-secondary/80',
    accent: 'bg-accent text-dark shadow-md hover:bg-accent/90 active:bg-accent/80',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10 active:bg-primary/15',
    // Legacy variants for backward compatibility
    'light-outline': 'border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/16',
    'light': 'bg-base text-text shadow-md hover:bg-base/90',
    surface: 'border border-primary/20 bg-background text-text hover:bg-background hover:border-primary/30',
    admin: 'border border-secondary/30 bg-secondary/8 text-secondary hover:border-secondary/50 hover:bg-secondary/12',
    dark: 'border border-accent/30 bg-accent/12 text-accent hover:bg-accent/16 hover:border-accent/50',
  }

  const classNames = [
    baseClasses,
    sizeClasses[size],
    variants[variant] ?? variants.primary,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link className={classNames} to={to} {...props}>
      {iconPosition === 'left' && icon && <FontAwesomeIcon icon={icon} />}
      <span>{children}</span>
      {iconPosition === 'right' && icon && <FontAwesomeIcon icon={icon} />}
    </Link>
  )
}

export default ActionLink

