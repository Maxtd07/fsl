import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { Link } from 'react-router-dom'

const footerLinkClasses =
  'transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-dark'

function Footer() {
  return (
    <footer className="mt-12 w-full bg-dark px-6 py-12 text-base text-white/80 md:px-8">
      <div className="mx-auto w-[90vw] max-w-[90vw]">
        <div className="mb-8 border-b border-white/10 pb-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-wider text-white">Associazione per l'inclusione</p>
          <p className="mt-3 max-w-md leading-relaxed text-sm text-white/70">
            Sosteniamo persone con disabilita e famiglie con ascolto, orientamento, attivita inclusive e occasioni
            di partecipazione alla vita sociale.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 lg:px-10">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Social e Privacy</p>
            <div className="flex flex-col gap-3">
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
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-white">Contatti</p>
            <div className="flex flex-col items-end gap-3">
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

        <div className="mt-8 grid gap-4 border-t border-white/10 pt-8 text-xs text-white/50 lg:grid-cols-2 lg:px-10">
          <p>Copyright 2026 Associazione per l'inclusione. Tutti i diritti riservati.</p>
          <p className="text-left lg:text-right">Creato da Daniele Soldi e Max Ten Dam</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
