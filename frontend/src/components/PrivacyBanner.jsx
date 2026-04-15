import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const PRIVACY_CONSENT_KEY = 'privacy_consent_v1'

export function PrivacyBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const hasConsent = localStorage.getItem(PRIVACY_CONSENT_KEY)
    if (!hasConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleConsent = (accepted) => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, JSON.stringify({ accepted, date: new Date().toISOString() }))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border-2 border-primary/20 bg-base/95 shadow-2xl">
        <div className="space-y-4 p-6">
          <div>
            <h2 className="text-lg font-bold text-text">Privacy e Cookie</h2>
            <p className="mt-2 text-sm text-text/75">
              Utilizziamo i tuoi dati secondo il GDPR per fornirti servizi migliori. Accettando, consenti il trattamento dei dati personali come descritto nell'informativa.
            </p>
          </div>

          <div className="space-y-2 rounded-lg border border-primary/10 bg-primary/5 p-3">
            <p className="text-xs font-semibold text-text/80">Trattiamo:</p>
            <ul className="space-y-1 text-xs text-text/70">
              <li>• Email, nome e credenziali di accesso</li>
              <li>• Dati di iscrizione agli eventi</li>
              <li>• Informazioni di pagamento (solo tramite PayPal)</li>
              <li>• Cookie tecnici per la sessione</li>
            </ul>
          </div>

          <p className="text-xs text-text/60">
            Leggi la nostra{' '}
            <NavLink to="/privacy" className="font-semibold text-primary hover:underline">
              informativa privacy completa
            </NavLink>
            .
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleConsent(false)}
              className="flex-1 rounded-lg border border-text/20 py-2.5 text-xs font-semibold text-text/70 hover:bg-text/5"
            >
              Rifiuta
            </button>
            <button
              onClick={() => handleConsent(true)}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-base hover:bg-primary/90"
            >
              Accetto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
