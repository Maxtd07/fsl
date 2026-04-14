import { useEffect, useState, useRef } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { createDonation } from '../lib/api.js'

const donationCards = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
]

const impactCards = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
]

function DonazioniPage() {
  const [donationAmount, setDonationAmount] = useState('25')
  const [donationForm, setDonationForm] = useState({
    nome: '',
    email: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const paypalButtonRef = useRef(null)

  // Load PayPal script
  useEffect(() => {
    if (!document.querySelector('#paypal-script')) {
      const script = document.createElement('script')
      script.id = 'paypal-script'
      script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=EUR'
      script.async = true
      script.onload = () => {
        if (window.paypal) {
          renderPayPalButton()
        }
      }
      document.body.appendChild(script)
    } else if (window.paypal) {
      renderPayPalButton()
    }
  }, [donationAmount, donationForm])

  const renderPayPalButton = () => {
    if (!window.paypal || !paypalButtonRef.current) return

    // Clear previous buttons
    paypalButtonRef.current.innerHTML = ''

    window.paypal.Buttons({
      createOrder: async (data, actions) => {
        if (!donationForm.nome || !donationForm.email) {
          setMessage('❌ Compila nome ed email')
          return
        }

        return actions.order.create({
          purchase_units: [{
            amount: {
              value: donationAmount,
              currency_code: 'EUR'
            },
            description: `Donazione Franco Rossi - ${donationForm.nome}`
          }],
          payer: {
            name: { given_name: donationForm.nome },
            email_address: donationForm.email
          }
        })
      },
      onApprove: async (data, actions) => {
        setIsProcessing(true)
        try {
          const result = await actions.order.capture()
          
          // Save donation to backend
          await createDonation({
            nome: donationForm.nome,
            email: donationForm.email,
            importo: parseFloat(donationAmount),
            paypalId: result.id
          })

          setMessage('✅ Donazione completata con successo! Grazie mille 🙏')
          setDonationForm({ nome: '', email: '' })
          setDonationAmount('25')
          setTimeout(() => setMessage(''), 5000)
        } catch (err) {
          setMessage('❌ Errore nel salvataggio della donazione')
        } finally {
          setIsProcessing(false)
        }
      },
      onError: () => {
        setMessage('❌ Errore nella transazione PayPal')
        setIsProcessing(false)
      }
    }).render(paypalButtonRef.current)
  }

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Donazioni"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae."
        tone="secondary"
        actions={
          <>
            <ActionLink to="/contatti">Richiedi dettagli</ActionLink>
            <ActionLink to="/chi-siamo" variant="secondary">
              Scopri il progetto
            </ActionLink>
          </>
        }
      />

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Modalita"
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {donationCards.map((text, index) => (
            <article
              key={text}
              className="rounded-[1.6rem] border-2 border-primary/20 bg-base p-4 md:p-5 lg:p-6 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Opzione {index + 1}
              </p>
              <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Impatto"
            title="Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {impactCards.map((text) => (
              <div
                key={text}
                className="rounded-[1.4rem] border-2 border-primary/20 bg-background p-4 md:p-5 shadow-[0_6px_14px_rgba(0,0,0,0.06)]"
              >
                <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <PlaceholderImage alt="Impatto donazioni" className="h-72 md:h-80 lg:h-full lg:min-h-96" />
      </section>

      {/* Donation Form */}
      <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 text-center">Fai una Donazione</h2>

        <div className="space-y-5">
          {/* Donation Amount */}
          <div>
            <label className="block mb-3 text-sm font-medium text-text">Importo (€)</label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {['10', '25', '50', '100'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount)}
                  className={`rounded-lg py-2 text-sm font-semibold transition ${
                    donationAmount === amount
                      ? 'bg-primary text-white'
                      : 'border-2 border-primary/20 text-primary hover:bg-primary/5'
                  }`}
                >
                  €{amount}
                </button>
              ))}
            </div>
            <div>
              <input
                type="number"
                min="1"
                step="0.01"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full rounded-xl border-2 border-primary/20 bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-4 focus:ring-primary/12 transition"
                placeholder="Importo personalizzato"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-text">Nome</label>
            <input
              type="text"
              value={donationForm.nome}
              onChange={(e) => setDonationForm({ ...donationForm, nome: e.target.value })}
              className="w-full rounded-xl border-2 border-primary/20 bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-4 focus:ring-primary/12 transition"
              placeholder="Il tuo nome"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-text">Email</label>
            <input
              type="email"
              value={donationForm.email}
              onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })}
              className="w-full rounded-xl border-2 border-primary/20 bg-background px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-4 focus:ring-primary/12 transition"
              placeholder="La tua email"
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`rounded-lg border-2 px-4 py-3 text-sm font-medium ${
              message.includes('✅')
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-accent/30 bg-accent/10 text-accent'
            }`}>
              {message}
            </div>
          )}

          {/* PayPal Button */}
          <div className="mt-6">
            <div
              ref={paypalButtonRef}
              className="paypal-button-container"
              style={{ minHeight: '80px' }}
            />
          </div>

          <p className="text-xs text-text/60 text-center">
            Powered by PayPal • I tuoi dati sono al sicuro
          </p>
        </div>
      </section>
    </main>
  )
}

export default DonazioniPage
