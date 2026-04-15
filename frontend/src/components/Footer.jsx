import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

const footerLinkClasses =
  "transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-text";

function Footer() {
  return (
    <footer className="w-full bg-text px-6 py-12 mt-8 text-md text-white/80 md:px-8">
      <div className="mx-auto w-[90vw] max-w-[90vw]">
        {/* About Section */}
        <div className="mb-6 pb-6 border-b border-white/10 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92">
            La Crisalide
          </p>
          <p className="mt-4 max-w-md leading-6">
            la Crisalide non rimane sempre statica, si trasforma, si evolve,
            muta fino a diventare farfalla
          </p>
        </div>

        {/* Links Grid - 2 cols on mobile, 2 cols on desktop */}
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 grid-rows-2 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92 mb-4">
              Social
            </p>
            <div className="flex flex-col gap-2 text-top">
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
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/92 mb-4">
              Contatti
            </p>
            <div className="flex flex-col gap-2">
              <a
                className={footerLinkClasses}
                href="mailto:la_crisalide@yahoo.it"
              >
                la_crisalide@yahoo.it
              </a>
              <a className={footerLinkClasses} href="tel:+393479177811">
                +39 347 917 7811
              </a>
              <div className="text-xs text-white/85 mt-2"></div>
            </div>
          </div>
          <div className="text-center mb-0 col-span-2">
            Via del Palo 10 Porto Sant'Elpidio (FM) 63821
          </div>
        </div>
        {/* Copyright */}
        <div className="grid gap-8 grid-cols-2 mb-6 border-t border-white/10 lg:px-10">
          <div className=" pt-6 text-xs text-white/60">
            <p>
              Copyright 2026 Associazione La Crisalide. Tutti i diritti
              riservati.
            </p>
          </div>
          <div className="pt-6 text-xs text-white/60 text-right">
            <p>Creato da Daniele Soldi e Max Ten Dam</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
