import { Link } from 'react-router-dom'

const baseClasses =
  'inline-flex min-h-11 md:min-h-12 items-center justify-center rounded-full px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-base'

function ActionLink({ to, children, variant = 'primary' }) {
  const variants = {
    primary:
      'bg-primary text-white shadow-[0_12px_28px_rgba(76,130,169,0.22)] hover:bg-primary/92 focus-visible:ring-primary/40',
    secondary:
      'border border-primary/30 bg-primary/8 text-primary shadow-[0_12px_28px_rgba(76,130,169,0.08)] hover:border-primary/50 hover:bg-primary/12 focus-visible:ring-primary/40',
    admin:
      'border border-secondary/30 bg-secondary/8 text-secondary shadow-[0_12px_28px_rgba(141,193,51,0.10)] hover:border-secondary/50 hover:bg-secondary/12 focus-visible:ring-secondary/40',
    light:
      'bg-base text-text shadow-[0_14px_32px_rgba(0,0,0,0.12)] hover:bg-base focus-visible:ring-primary/40',
    'light-outline':
      'border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/16 focus-visible:ring-white/40',
    surface:
      'border border-primary/20 bg-background text-text shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:bg-background hover:border-primary/30 focus-visible:ring-primary/40',
    dark:
      'border border-accent/30 bg-accent/12 text-accent shadow-[0_12px_28px_rgba(253,196,155,0.12)] hover:bg-accent/16 hover:border-accent/50 focus-visible:ring-accent/40',
  }

  return (
    <Link className={`${baseClasses} ${variants[variant] ?? variants.primary}`} to={to}>
      {children}
    </Link>
  )
}

export default ActionLink
