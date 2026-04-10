import { Link } from 'react-router-dom'

const baseClasses =
  'inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base'

function ActionLink({ to, children, variant = 'primary' }) {
  const variants = {
    primary:
      'bg-text text-white shadow-[0_14px_30px_rgba(0,0,0,0.15)] hover:bg-text/92',
    secondary:
      'border border-gray-300 bg-base text-text shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-gray-400 hover:bg-gray-100 hover:text-text',
    admin:
      'border border-gray-400 bg-gray-200 text-text shadow-[0_12px_28px_rgba(0,0,0,0.10)] hover:border-gray-500 hover:bg-gray-300',
    light:
      'bg-base text-text shadow-[0_14px_32px_rgba(0,0,0,0.12)] hover:bg-white',
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
