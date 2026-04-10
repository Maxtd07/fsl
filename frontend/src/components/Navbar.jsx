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

function Navbar() {
  return (
    <div className="border-b border-primary/15 pb-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <NavLink
            to="/"
            className="inline-block text-xs font-semibold uppercase tracking-[0.22em] text-primary"
          >
            Associazione La Crisalide
          </NavLink>
          <p className="mt-2 text-sm leading-6 text-text/70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
          </p>
        </div>

        <ActionLink to="/admin/login" variant="admin">
          Admin login
        </ActionLink>
      </div>

      <nav className="flex flex-wrap gap-x-6 gap-y-3 border-t border-primary/10 pt-3" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `border-b-2 pb-2 text-sm font-medium leading-6 transition-colors ${
                isActive
                  ? 'border-secondary text-primary'
                  : 'border-transparent text-text/78 hover:border-accent/70 hover:text-text'
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
