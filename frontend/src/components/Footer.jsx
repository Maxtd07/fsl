import { NavLink } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-600">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>Associazione La Crisalide. Tutti i diritti riservati.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <NavLink className="hover:text-slate-900" to="/">
            Home
          </NavLink>
          <NavLink className="hover:text-slate-900" to="/contatti">
            Contatti
          </NavLink>
          <a className="hover:text-slate-900" href="mailto:info@lacrisalide.it">
            info@lacrisalide.it
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
