import { NavLink } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-16 bg-text px-6 py-10 text-sm text-white/72 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.8fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            La Crisalide
          </p>
          <p className="mt-4 max-w-sm leading-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white">
            Link rapidi
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <NavLink className="hover:text-accent" to="/">
              Home
            </NavLink>
            <NavLink className="hover:text-accent" to="/eventi">
              Eventi
            </NavLink>
            <NavLink className="hover:text-accent" to="/galleria">
              Galleria
            </NavLink>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white">
            Contatti
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <NavLink className="hover:text-accent" to="/contatti">
              Contatti
            </NavLink>
            <a className="hover:text-accent" href="mailto:lorem@ipsum.it">
              lorem@ipsum.it
            </a>
            <a className="hover:text-accent" href="tel:+390000000000">
              +39 000 000 0000
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-5 text-xs text-white/50">
        <p>© 2026 Associazione La Crisalide. Tutti i diritti riservati.</p>
      </div>
    </footer>
  )
}

export default Footer
