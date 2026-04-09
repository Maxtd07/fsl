import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/galleria', label: 'Galleria' },
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/donazioni', label: 'Donazioni' },
  { to: '/contatti', label: 'Contatti' },
]

function Navbar() {
  return (
    <nav className="flex flex-wrap gap-3" aria-label="Main navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `rounded-lg border px-4 py-2 text-sm transition-colors ${
              isActive
                ? 'border-slate-800 bg-slate-800 text-white'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navbar
