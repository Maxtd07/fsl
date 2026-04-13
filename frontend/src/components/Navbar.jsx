import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ActionLink from './ActionLink.jsx'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/chi-siamo', label: 'Chi siamo' },
  { to: '/eventi', label: 'Eventi' },
  { to: '/galleria', label: 'Galleria' },
  { to: '/contatti', label: 'Contatti' },
  { to: '/donazioni', label: 'Donazioni' },
]

const navLinkClasses =
  'rounded-full border px-4 py-2 text-sm font-medium leading-6 transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-[1.75rem] border-2 border-gray-300 bg-base/90 px-5 py-5 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-sm md:px-6">
      <div className="mb-4 flex flex-col gap-4 md:mb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <div className="max-w-2xl">
            <NavLink
              to="/"
              className="inline-flex items-center gap-3 rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            >
              <span
                aria-hidden="true"
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border-2 border-gray-300 bg-gray-100"
              >
                <span className="absolute left-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-gray-500" />
                <span className="absolute right-2.5 top-3 h-2 w-2 rounded-full bg-gray-400" />
                <span className="absolute bottom-2.5 left-1/2 h-2.5 w-5 -translate-x-1/2 rounded-full bg-gray-300" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-text">
                  Associazione
                </span>
                <span className="mt-1 block text-lg font-semibold tracking-[-0.02em] text-text">
                  La Crisalide
                </span>
              </span>
            </NavLink>
            <p className="mt-2 text-xs md:text-sm leading-6 text-text/80 md:text-text/75">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-4 flex md:hidden flex-col gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded-lg p-2"
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-6 bg-text transition-transform origin-center ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 w-6 bg-text transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-text transition-transform origin-center ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        <div className="hidden md:block">
          <ActionLink to="/admin/login" variant="admin">
            Admin login
          </ActionLink>
        </div>
      </div>

      <nav
        className={`flex flex-col gap-2 border-t border-gray-200 pt-4 md:flex-wrap md:flex-row ${
          isOpen ? 'block' : 'hidden md:flex'
        }`}
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${navLinkClasses} ${
                isActive
                  ? 'border-gray-400 bg-gray-200 text-text'
                  : 'border-gray-200 text-text/75 hover:border-gray-300 hover:bg-gray-100 hover:text-text'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
        <div className="mt-2 md:hidden">
          <ActionLink to="/admin/login" variant="admin">
            Admin login
          </ActionLink>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
