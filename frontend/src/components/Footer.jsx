import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { Link } from "react-router-dom"

const footerLinkClasses =
  "transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-dark"

function Footer() {
  return (
    <footer className="mt-10 w-full bg-dark/80 px-5 py-8 text-sm text-white/80">
      <div className="mx-auto max-w-[80vw]">
        {/* Top Section */}
        <div className="mb-6 border-b border-white/10 pb-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-white">
            Associazione Disabili
          </p>
          <p className="mt-2 max-w-lg text-xs leading-relaxed text-white/70">
            Ascolto, inclusione e partecipazione: ogni persona conta, ogni famiglia merita sostegno.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 text-xs md:grid-cols-3">
          {/* Social */}
          <div>
            <p className="mb-2 font-semibold uppercase tracking-wide text-white">
              Social
            </p>
            <div className="flex flex-col gap-2">
              <a
                className={`${footerLinkClasses} flex items-center gap-2`}
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} />
                Facebook
              </a>
              <a
                className={`${footerLinkClasses} flex items-center gap-2`}
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
                Instagram
              </a>
            </div>
          </div>

          {/* Contacts */}
          <div className="text-right md:text-center">
            <p className="mb-2 font-semibold uppercase tracking-wide text-white">
              Contatti
            </p>
            <div className="flex flex-col gap-2">
              <a className={footerLinkClasses} href="mailto:example@mail.com">
                info@nomeassociazione.it
              </a>
              <a className={footerLinkClasses} href="tel:+390000000000">
                +39 000 000 000
              </a>
            </div>
          </div>

          {/* Info */}
          <div className="col-span-2 sm:col-span-1 text-left md:text-right">
            <p className="mb-2 font-semibold uppercase tracking-wide text-white">
              Info
            </p>
            <div className="flex flex-col gap-2">
              <Link className={footerLinkClasses} to="/privacy">
                Privacy Policy
              </Link>
              <p className="text-[11px]">
                Via Roma 123, Città (PR) 00000
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 text-[11px] text-white/50 sm:flex-row sm:justify-between">
          <p>© Associazione Disabili 2026</p>
          <p>Sviluppato da Max Ten Dam e Daniele Soldi</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
