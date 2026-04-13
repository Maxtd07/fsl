import { Link } from 'react-router-dom'

const baseClasses =
  'inline-flex min-h-11 md:min-h-12 items-center justify-center rounded-full px-4 md:px-5 py-2.5 md:py-3 text-xs md:text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-base'

function ActionLink({ to, children, variant = 'primary' }) {
  const variants = {
    primary:
      'bg-text text-white shadow-[0_12px_28px_rgba(0,0,0,0.15)] hover:bg-text/92 focus-visible:ring-text/40',
    secondary:
      'border border-gray-300 bg-base text-text shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-gray-400 hover:bg-gray-100 hover:text-text focus-visible:ring-gray-400/40',
    admin:
      'border border-gray-400 bg-gray-200 text-text shadow-[0_12px_28px_rgba(0,0,0,0.10)] hover:border-gray-500 hover:bg-gray-300 focus-visible:ring-gray-400/40',
    light:
      'bg-base text-text shadow-[0_14px_32px_rgba(0,0,0,0.12)] hover:bg-white focus-visible:ring-gray-400/40',
    'light-outline':
      'border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/16 focus-visible:ring-white/40',
  }

  return (
    <Link className={`${baseClasses} ${variants[variant] ?? variants.primary}`} to={to}>
      {children}
    </Link>
  )
}

export default ActionLink
