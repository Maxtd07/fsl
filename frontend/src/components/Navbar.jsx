import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/eventi', label: 'Eventi' },
  { to: '/galleria', label: 'Galleria' },
  { to: '/contatti', label: 'Contatti' },
  { to: '/donazioni', label: 'Donazioni' },
]

const navLinkClasses =
  'rounded-2xl border-2 px-4 py-2.5 text-xs font-small leading-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, isAdmin, logout, user } = useAuth()

  return (
    <div className="rounded-b-[1.75rem] border-2 border-t-0 border-primary/20 bg-base/90 px-5 py-8 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:px-6">
      <div className="flex items-center justify-between gap-4">
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

        <nav className="hidden items-center justify-center gap-3 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${navLinkClasses} ${
                  isActive
                    ? 'border-primary bg-primary/10 text-text'
                    : 'border-primary/20 text-text/75 hover:border-primary/30 hover:bg-primary/8 hover:text-text'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <NavLink
                to="/accedi"
                className="rounded-2xl border border-secondary/30 bg-secondary/10 px-4 py-2.5 text-xs font-semibold text-secondary"
              >
                {user?.nome}
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  className="rounded-2xl border border-primary/20 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5"
                >
                  Dashboard
                </NavLink>
              )}
              <button
                type="button"
                onClick={logout}
                className="rounded-2xl border border-accent/30 px-4 py-2.5 text-xs font-semibold text-text hover:bg-accent/10"
              >
                Esci
              </button>
            </>
          ) : (
            <NavLink
              to="/accedi"
              className="rounded-2xl border border-secondary/30 bg-secondary/10 px-4 py-2.5 text-xs font-semibold text-secondary hover:bg-secondary/15"
            >
              Accedi
            </NavLink>
          )}
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 lg:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-text transition-transform origin-center ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-0.5 w-6 bg-text transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-text transition-transform origin-center ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

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
                  isActive ? 'border-primary bg-primary/10 text-text' : 'border-primary/15 text-text/75'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <NavLink
                to="/accedi"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-center text-xs font-semibold text-secondary"
              >
                {user?.nome}
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl border border-primary/20 px-4 py-3 text-center text-xs font-semibold text-primary"
                >
                  Dashboard admin
                </NavLink>
              )}
              <button
                type="button"
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="rounded-2xl border border-accent/30 px-4 py-3 text-xs font-semibold text-text"
              >
                Esci
              </button>
            </>
          ) : (
            <NavLink
              to="/accedi"
              onClick={() => setIsOpen(false)}
              className="rounded-2xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-center text-xs font-semibold text-secondary"
            >
              Accedi
            </NavLink>
          )}
        </nav>
      )}
    </div>
  )
}

export default Navbar
