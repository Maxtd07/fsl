import { NavLink } from 'react-router-dom'

const footerLinkClasses =
  'transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-text'

function Footer() {
  return (
    <footer className="mt-16 overflow-hidden rounded-[2rem] border border-text/10 bg-text px-6 py-10 text-sm text-white/72 shadow-[0_24px_54px_rgba(15,23,32,0.16)] sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.8fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
            La Crisalide
          </p>
          <p className="mt-4 max-w-sm leading-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92">
            Link rapidi
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <NavLink className={footerLinkClasses} to="/">
              Home
            </NavLink>
            <NavLink className={footerLinkClasses} to="/eventi">
              Eventi
            </NavLink>
            <NavLink className={footerLinkClasses} to="/galleria">
              Galleria
            </NavLink>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92">
            Contatti
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <NavLink className={footerLinkClasses} to="/contatti">
              Contatti
            </NavLink>
            <a className={footerLinkClasses} href="mailto:lorem@ipsum.it">
              lorem@ipsum.it
            </a>
            <a className={footerLinkClasses} href="tel:+390000000000">
              +39 000 000 0000
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-5 text-xs text-white/50">
        <p>Copyright 2026 Associazione La Crisalide. Tutti i diritti riservati.</p>
      </div>
    </footer>
  )
}

export default Footer
