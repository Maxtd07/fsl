import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { Link } from 'react-router-dom'

const footerLinkClasses =
  'transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-dark'

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-dark via-dark to-dark/95 px-12 py-3 text-sm text-white/80 mt-12 border-t border-white/5">
      <div className="mx-auto max-w-full">
        <div className="mb-3 border-b border-white/10 pb-3 lg:px-4">
          <p className="text-xs font-bold uppercase tracking-wider text-white">Associazione per l'inclusione</p>
          <p className="mt-2 max-w-md leading-relaxed text-sm text-white/70">
            Sosteniamo persone con disabilita e famiglie con ascolto, orientamento, attivita inclusive e occasioni
            di partecipazione alla vita sociale.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 lg:px-4 lg:gap-x-12">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white">Social e Privacy</p>
            <div className="flex flex-col gap-2">
              <a className={`${footerLinkClasses} flex items-center gap-2`} href="#facebook">
                <FontAwesomeIcon icon={faFacebook} className="text-base" />
                <span>Facebook</span>
              </a>

              <a className={`${footerLinkClasses} flex items-center gap-2`} href="#instagram">
                <FontAwesomeIcon icon={faInstagram} className="text-base" />
                <span>Instagram</span>
              </a>
              <Link className={`${footerLinkClasses} text-sm`} to="/privacy">
                Privacy e GDPR
              </Link>
            </div>
          </div>

          <div className="text-right">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white">Contatti</p>
            <div className="flex flex-col items-end gap-2">
              <a className={`${footerLinkClasses} text-sm`} href="mailto:info@nomeassociazione.it">
                info@nomeassociazione.it
              </a>
              <a className={`${footerLinkClasses} text-sm`} href="tel:+390000000000">
                +39 000 000 0000
              </a>
            </div>
          </div>

          <div className="col-span-2 text-center text-sm text-white/60">Via Roma 123, Citta (PR) 00000</div>
        </div>

        <div className="mt-3 grid gap-2 border-t border-white/10 pt-3 text-xs text-white/50 lg:grid-cols-2 lg:px-4">
          <p>Copyright 2026 Associazione per l'inclusione. Tutti i diritti riservati.</p>
          <p className="text-left lg:text-right">Creato da Daniele Soldi e Max Ten Dam</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
