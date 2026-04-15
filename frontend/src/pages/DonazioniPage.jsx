import { useEffect, useRef, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { capturePayment, createDonation, createPayment } from '../lib/api.js'

const donationCards = [
  'Le donazioni sostengono laboratori inclusivi, attività educative e supporto alle famiglie.',
  'Ogni contributo aiuta l\'associazione a organizzare eventi, incontri e percorsi personalizzati.',
  'Il pagamento viene creato e catturato dal backend tramite API REST, con salvataggio finale nel database.',
]

const impactCards = [
  'Attività per l\'autonomia e la partecipazione sociale.',
  'Promemoria, comunicazioni e iniziative per la comunità.',
]

const paypalSdkCache = new Map()

function loadPayPalSdk(clientId) {
  if (window.paypal) {
    return Promise.resolve(window.paypal)
  }

  if (paypalSdkCache.has(clientId)) {
    return paypalSdkCache.get(clientId)
  }

  const promise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('#paypal-sdk-script')

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.paypal), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Impossibile caricare PayPal SDK')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.id = 'paypal-sdk-script'
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`
    script.async = true
    script.onload = () => resolve(window.paypal)
    script.onerror = () => reject(new Error('Impossibile caricare PayPal SDK'))
    document.body.appendChild(script)
  })

  paypalSdkCache.set(clientId, promise)
  return promise
}

function DonazioniPage() {
  const { isAuthenticated, user } = useAuth()
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID ?? ''
  const [donationAmount, setDonationAmount] = useState('25')
  const [donationForm, setDonationForm] = useState({
    nome: '',
    email: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const [paypalError, setPaypalError] = useState('')
  const paypalButtonRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      setDonationForm((current) => ({
        nome: current.nome || user.nome || '',
        email: current.email || user.email || '',
      }))
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    let disposed = false

    async function renderPayPalButton() {
      if (!paypalClientId || !paypalButtonRef.current) {
        return
      }

      try {
        const paypal = await loadPayPalSdk(paypalClientId)
        if (disposed || !paypalButtonRef.current) return

        paypalButtonRef.current.innerHTML = ''
        setPaypalError('')

        const buttons = paypal.Buttons({
          style: {
            shape: 'pill',
            layout: 'vertical',
            color: 'gold',
            label: 'paypal',
          },
          createOrder: async () => {
            const parsedAmount = Number(donationAmount)

            if (!donationForm.nome.trim() || !donationForm.email.trim()) {
              setMessage('Compila nome ed email prima di procedere.')
              throw new Error('Dati donatore incompleti')
            }

            if (!Number.isFinite(parsedAmount) || parsedAmount < 1) {
              setMessage('Inserisci un importo valido di almeno 1 euro.')
              throw new Error('Importo non valido')
            }

            const payment = await createPayment({
              nome: donationForm.nome.trim(),
              email: donationForm.email.trim(),
              importo: parsedAmount,
            })

            return payment.orderId
          },
          onApprove: async (data) => {
            setIsProcessing(true)
            setMessage('')

            try {
              const capturedPayment = await capturePayment(data.orderID)

              await createDonation({
                nome: donationForm.nome.trim(),
                email: donationForm.email.trim(),
                importo: Number(donationAmount),
                paypalOrderId: capturedPayment.orderId,
                payerId: capturedPayment.payerId,
                captureId: capturedPayment.captureId,
                paymentStatus: capturedPayment.status,
              })

              setMessage('Donazione completata con successo. Grazie per il tuo sostegno.')
              setDonationAmount('25')
              setDonationForm((current) => ({
                nome: isAuthenticated ? user?.nome ?? current.nome : '',
                email: isAuthenticated ? user?.email ?? current.email : '',
              }))
            } catch (err) {
              setMessage(err.message || 'Errore durante il completamento della donazione.')
            } finally {
              setIsProcessing(false)
            }
          },
          onError: (err) => {
            setPaypalError(err?.message || 'Errore nella transazione PayPal.')
            setIsProcessing(false)
          },
        })

        if (buttons.isEligible()) {
          await buttons.render(paypalButtonRef.current)
        }
      } catch (err) {
        if (!disposed) {
          setPaypalError(err.message || 'Errore durante l inizializzazione di PayPal.')
        }
      }
    }

    renderPayPalButton()

    return () => {
      disposed = true
      if (paypalButtonRef.current) {
        paypalButtonRef.current.innerHTML = ''
      }
    }
  }, [paypalClientId, donationAmount, donationForm.email, donationForm.nome, isAuthenticated, user])

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Donazioni"
        title="Sostieni le attività dell'associazione con una donazione sicura."
        description="Scegli il metodo che preferisci: online con PayPal, bonifico bancario, conto corrente postale o dona il tuo 5 per mille."
        tone="secondary"
        actions={
          <>
            <ActionLink to="/contatti">Richiedi dettagli</ActionLink>
            <ActionLink to="/privacy" variant="secondary">
              Privacy e trattamento dati
            </ActionLink>
          </>
        }
      />

      {/* METODI DI DONAZIONE ALTERNATIVI */}
      <section className="space-y-5 px-6 md:px-8">
        <SectionHeading
          eyebrow="Altri metodi di donazione"
          title="Scegli come sostenerci"
          description="Offriamo diverse modalità di donazione per adattarci alle tue preferenze."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 5x1000 */}
          <article className="rounded-lg border border-primary/20 bg-base px-6 py-8 shadow-md hover:shadow-lg transition">
            <h3 className="mb-4 text-lg font-bold text-text">Dona il 5 per mille</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Nella dichiarazione dei redditi, destina il 5 per mille a La Crisalide.</p>
              <p className="font-semibold text-primary">Codice Fiscale:</p>
              <p className="font-mono text-base tracking-wide bg-primary/8 p-3 rounded-lg">
                90034110446
              </p>
              <p className="text-xs text-text/60 pt-2">
                Non ti costa nulla e aiuti concretamente l'associazione.
              </p>
            </div>
          </article>

          {/* Conto Corrente Postale */}
          <article className="rounded-lg border border-secondary/20 bg-base px-6 py-8 shadow-md hover:shadow-lg transition">
            <h3 className="mb-4 text-lg font-bold text-text">Conto Corrente Postale</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Verso il conto corrente postale intestato a La Crisalide.</p>
              <p className="font-semibold text-secondary">Numero:</p>
              <p className="font-mono text-base tracking-wide bg-secondary/8 p-3 rounded-lg">
                34201830
              </p>
              <p className="text-xs text-text/60 pt-2">
                Disponibile negli uffici postali italiani.
              </p>
            </div>
          </article>

          {/* Bonifico Bancario */}
          <article className="rounded-lg border border-accent/20 bg-base px-6 py-8 shadow-md hover:shadow-lg transition">
            <h3 className="mb-4 text-lg font-bold text-text">Bonifico Bancario</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Effettua un bonifico diretto sul nostro IBAN.</p>
              <p className="font-semibold">IBAN:</p>
              <p className="font-mono text-base tracking-wide bg-accent/8 p-3 rounded-lg break-all">
                IT76 S076 0113 5000 0000 3420 1830
              </p>
              <p className="text-xs text-text/60 pt-2">
                Causale: "Donazione La Crisalide"
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Come funziona"
          title="Un flusso standard, chiaro e tracciabile."
          description="I dati del donatore vengono raccolti dal form e inviati correttamente al backend per creare e finalizzare il pagamento."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {donationCards.map((text, index) => (
            <article
              key={text}
              className="rounded-[1.6rem] border-2 border-primary/20 bg-base p-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">Step {index + 1}</p>
              <p className="text-sm leading-7 text-text/80">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Impatto"
            title="Ogni contributo diventa iniziative concrete."
            description="Le donazioni raccolte aiutano a sostenere eventi inclusivi, attivita educative, strumenti operativi e momenti di incontro per le famiglie."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {impactCards.map((text) => (
              <div
                key={text}
                className="rounded-lg border border-primary/20 bg-background p-4 shadow-sm"
              >
                <p className="text-sm leading-7 text-text/80">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <PlaceholderImage alt="Impatto donazioni" className="h-72 md:h-80 lg:h-full lg:min-h-96" />
      </section>

      <section className="mx-auto w-full max-w-2xl rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-text md:text-3xl">Fai una donazione</h2>

        <div className="space-y-5">
          <div>
            <label className="mb-3 block text-sm font-medium text-text">Importo (EUR)</label>
            <div className="mb-4 grid grid-cols-4 gap-2">
              {['10', '25', '50', '100'].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setDonationAmount(amount)}
                  className={`rounded-lg py-2 text-sm font-semibold transition ${
                    donationAmount === amount
                      ? 'bg-primary text-white'
                      : 'border-2 border-primary/20 text-primary hover:bg-primary/5'
                  }`}
                >
                  EUR {amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              step="0.01"
              value={donationAmount}
              onChange={(event) => setDonationAmount(event.target.value)}
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
              placeholder="Importo personalizzato"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">Nome</label>
            <input
              type="text"
              value={donationForm.nome}
              onChange={(event) => setDonationForm((current) => ({ ...current, nome: event.target.value }))}
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
              placeholder="Il tuo nome"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">Email</label>
            <input
              type="email"
              value={donationForm.email}
              onChange={(event) => setDonationForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
              placeholder="La tua email"
            />
          </div>

          {message && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {paypalError && (
            <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
              {paypalError}
            </div>
          )}

          {!paypalClientId ? (
            <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-text">
              Configura <span className="font-semibold">VITE_PAYPAL_CLIENT_ID</span> nel frontend per visualizzare il
              pulsante PayPal.
            </div>
          ) : (
            <div className="mt-6">
              <div ref={paypalButtonRef} className="paypal-button-container" style={{ minHeight: '80px' }} />
            </div>
          )}

          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-text/70 leading-relaxed">
            <p className="font-semibold text-primary mb-2">Protezione dei dati sensibili</p>
            <p>
              I tuoi dati personali (nome ed email) vengono utilizzati esclusivamente per elaborare la donazione e inviarti una ricevuta. Non vengono condivisi con terzi se non per le necessità del pagamento PayPal. Leggi la nostra <a href="/privacy" className="underline text-primary hover:text-primary/80">informativa sulla privacy</a> per ulteriori dettagli.
            </p>
          </div>

          <p className="text-center text-xs text-text/60">
            PayPal crea e cattura l'ordine dal backend. Lo stato della donazione viene salvato solo a pagamento completato.
          </p>
          {isProcessing && <p className="text-center text-xs font-semibold text-primary">Elaborazione pagamento...</p>}
        </div>
      </section>
    </main>
  )
}

export default DonazioniPage
