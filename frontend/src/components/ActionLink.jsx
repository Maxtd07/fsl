import { Link } from 'react-router-dom'

function ActionLink({ to, children, variant = 'primary' }) {
  const variants = {
    primary:
      'rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] hover:bg-primary/90',
    secondary:
      'rounded-md border border-primary/20 bg-transparent px-5 py-3 text-sm font-semibold text-text hover:border-primary/40 hover:bg-primary/5 hover:text-primary',
    admin:
      'rounded-md border border-secondary/40 bg-secondary/15 px-5 py-3 text-sm font-semibold text-text hover:bg-secondary/25',
  }

  return (
    <Link
      className={`inline-flex items-center justify-center transition-colors hover:-translate-y-0.5 ${variants[variant]}`}
      to={to}
    >
      {children}
    </Link>
  )
}

export default ActionLink
