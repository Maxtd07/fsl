import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Link } from 'react-router-dom'


const footerLinkClasses =
  'transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-text'

function Footer() {
  return (
    <footer className="mt-8 w-full bg-text px-6 py-12 text-md text-white/80 md:px-8">
      <div className="mx-auto w-[90vw] max-w-[90vw]">
        <div className="mb-6 border-b border-white/10 pb-6 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92">La Crisalide</p>
          <p className="mt-4 max-w-md leading-6">
            la Crisalide non rimane sempre statica, si trasforma, si evolve,
            muta fino a diventare farfalla

          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 lg:px-10">
          <div>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/92">Social</p>
            <div className="flex flex-col gap-2">
              <a
                className={`${footerLinkClasses} flex items-center gap-2`}
                href="https://www.facebook.com/lacrisalideassociazionefamigliedisabili/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="text-white text-xl"
                />
                <span>Facebook</span>
              </a>

              <a
                className={`${footerLinkClasses} flex items-center gap-2`}
                href="https://www.instagram.com/lacrisalide_associazione/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-white text-xl"
                />
                <span>Instagram</span>
              </a>
              <Link className={footerLinkClasses} to="/privacy">
                Privacy e GDPR
              </Link>
            </div>
          </div>

          <div className="text-right">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/92">Contatti</p>
            <div className="flex flex-col gap-2">
              <a className={footerLinkClasses} href="mailto:la_crisalide@yahoo.it">
                la_crisalide@yahoo.it
              </a>
              <a className={footerLinkClasses} href="tel:+393479177811">
                +39 347 917 7811
              </a>
            </div>
          </div>


          <div className="col-span-2 text-center text-sm text-white/80">
            Via del Palo 10, Porto Sant&apos;Elpidio (FM) 63821
          </div>
        </div>

        <div className="mt-6 grid gap-8 border-t border-white/10 pt-6 text-xs text-white/60 lg:grid-cols-2 lg:px-10">
          <p>Copyright 2026 Associazione La Crisalide. Tutti i diritti riservati.</p>
          <p className="text-left lg:text-right">Creato da Daniele Soldi e Max Ten Dam</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
