import { NavLink } from 'react-router-dom'
import ActionLink from './ActionLink.jsx'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/eventi', label: 'Eventi' },
  { to: '/galleria', label: 'Galleria' },
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/donazioni', label: 'Donazioni' },
  { to: '/contatti', label: 'Contatti' },
]

const navLinkClasses =
  'rounded-full border px-4 py-2 text-sm font-medium leading-6 transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 focus-visible:ring-offset-2 focus-visible:ring-offset-base'

function Navbar() {
  return (
    <div className="rounded-[1.75rem] border border-primary/12 bg-base/90 px-5 py-5 shadow-[0_18px_40px_rgba(76,130,169,0.06)] backdrop-blur-sm sm:px-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <NavLink
            to="/"
            className="inline-flex items-center gap-3 rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            <span
              aria-hidden="true"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border border-primary/12 bg-primary/10"
            >
              <span className="absolute left-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="absolute right-2.5 top-3 h-2 w-2 rounded-full bg-secondary" />
              <span className="absolute bottom-2.5 left-1/2 h-2.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Associazione
              </span>
              <span className="mt-1 block text-lg font-semibold tracking-[-0.02em] text-text">
                La Crisalide
              </span>
            </span>
          </NavLink>
          <p className="mt-2 text-sm leading-6 text-text/70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
          </p>
        </div>

        <ActionLink to="/admin/login" variant="admin">
          Admin login
        </ActionLink>
      </div>

      <nav
        className="flex flex-wrap gap-2 border-t border-primary/10 pt-4"
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${navLinkClasses} ${
                isActive
                  ? 'border-primary/18 bg-primary/10 text-primary'
                  : 'border-transparent text-text/78 hover:border-primary/10 hover:bg-primary/5 hover:text-text'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Navbar
