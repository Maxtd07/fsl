import { NavLink } from 'react-router-dom'

const footerLinkClasses =
  'transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-text'

function Footer() {
  return (
    <footer className="w-full bg-text px-6 py-12 text-sm text-white/80 sm:px-8">
      <div className="mx-auto w-[90vw] max-w-[90vw]">
        {/* About Section */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92">
            La Crisalide
          </p>
          <p className="mt-4 max-w-sm leading-6">
            La crisalide rappresenta una fase di trasformazione profonda, crescita interiore e passaggio. È il periodo sospeso tra ciò che si era e ciò che si diventerà.
          </p>
        </div>

        {/* Links Grid - 2 cols on mobile, 3 cols on desktop */}
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-3 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92 mb-4">
              Social
            </p>
            <div className="flex flex-col gap-2">
              <a className={footerLinkClasses} href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a className={footerLinkClasses} href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92 mb-4">
              Link
            </p>
            <div className="flex flex-col gap-2">
              <NavLink className={footerLinkClasses} to="/">
                Home
              </NavLink>
              <NavLink className={footerLinkClasses} to="/chi-siamo">
                Chi Siamo
              </NavLink>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92 mb-4">
              Contatti
            </p>
            <div className="flex flex-col gap-2">
              <a className={footerLinkClasses} href="mailto:la_crisalide@yahoo.it">
                la_crisalide@yahoo.it
              </a>
              <a className={footerLinkClasses} href="tel:+393479177811">
                +39 347 917 7811
              </a>
              <div className="text-xs text-white/70 mt-2">
                Via del Palo 10<br />
                Porto Sant'Elpidio (FM) - 63821
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-xs text-white/50">
          <p>Copyright 2026 Associazione La Crisalide. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
