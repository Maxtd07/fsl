import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/eventi', label: 'Eventi' },
  { to: '/galleria', label: 'Galleria' },
  { to: '/contatti', label: 'Contatti' },
  { to: '/donazioni', label: 'Donazioni' },
]

const navLinkClasses =
  'rounded-full border px-4 py-2.5 text-xs font-small leading-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base'
function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-b-[1.75rem] border-2 border-t-0 border-primary/20 bg-base/90 px-5 py-8 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:px-6">
      
      {/* Top row */}
      <div className="flex items-center justify-between">

        {/* Logo + title */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className="inline-flex items-center gap-3 rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
          >
            <span
              aria-hidden="true"
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/8"
            >
              <span className="absolute left-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-primary/50" />
              <span className="absolute right-2.5 top-3 h-2 w-2 rounded-full bg-secondary/50" />
              <span className="absolute bottom-2.5 left-1/2 h-2.5 w-5 -translate-x-1/2 rounded-full bg-accent/60" />
            </span>

            <span>
              <span className="block text-xl font-semibold tracking-[-0.02em] text-text">
                Associazione La Crisalide
              </span>
              <span className="block text-sm font-semibold uppercase text-text">
                Famiglie di Disabili
              </span>
            </span>
          </NavLink>
        </div>

        {/* Navigation (centered visually) */}
        <nav
          className={`hidden lg:flex items-center justify-center gap-3`}
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
                    ? 'border-primary bg-primary/10 text-text'
                    : 'border-primary/15 text-text/75 hover:border-primary/30 hover:bg-primary/8 hover:text-text'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex lg:hidden flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg p-2"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-text transition-transform origin-center ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-6 bg-text transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-text transition-transform origin-center ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <nav className="mt-6 flex flex-col gap-3 lg:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${navLinkClasses} text-center ${
                  isActive
                    ? 'border-primary bg-primary/10 text-text'
                    : 'border-primary/15 text-text/75'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}

export default Navbar