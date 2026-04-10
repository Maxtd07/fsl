import { Link } from 'react-router-dom'

const baseClasses =
  'inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 focus-visible:ring-offset-2 focus-visible:ring-offset-base'

function ActionLink({ to, children, variant = 'primary' }) {
  const variants = {
    primary:
      'bg-primary text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] hover:bg-primary/92',
    secondary:
      'border border-primary/18 bg-base text-text shadow-[0_12px_28px_rgba(76,130,169,0.08)] hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
    admin:
      'border border-secondary/35 bg-secondary/12 text-text shadow-[0_12px_28px_rgba(141,193,51,0.10)] hover:border-secondary/50 hover:bg-secondary/18',
    light:
      'bg-base text-primary shadow-[0_14px_32px_rgba(15,23,32,0.16)] hover:bg-white',
    'light-outline':
      'border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/16',
  }

  return (
    <Link className={`${baseClasses} ${variants[variant] ?? variants.primary}`} to={to}>
      {children}
    </Link>
  )
}

export default ActionLink
