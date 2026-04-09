import { NavLink } from 'react-router-dom'

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
    <div className="border-b border-slate-200 pb-4">
      <NavLink
        to="/"
        className="mb-4 inline-block text-sm font-semibold tracking-[0.14em] text-slate-900 uppercase"
      >
        Associazione La Crisalide
      </NavLink>

      <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `text-sm leading-6 transition-colors ${
                isActive
                  ? 'text-slate-950 underline decoration-1 underline-offset-4'
                  : 'text-slate-600 hover:text-slate-900'
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
