import { useEffect, useRef, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/useAuth.js'
import { capturePayment, createDonation, createPayment } from '../lib/api.js'

const donationCards = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
]

const impactCards = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
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
      existingScript.addEventListener('error', () => reject(new Error('Lorem ipsum dolor sit amet')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.id = 'paypal-sdk-script'
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`
    script.async = true
    script.onload = () => resolve(window.paypal)
    script.onerror = () => reject(new Error('Lorem ipsum dolor sit amet'))
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
    const container = paypalButtonRef.current

    async function renderPayPalButton() {
      if (!paypalClientId || !container) return

      try {
        const paypal = await loadPayPalSdk(paypalClientId)
        if (disposed || !container) return

        container.innerHTML = ''
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
              setMessage('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
              throw new Error('Invalid donor data')
            }

            if (!Number.isFinite(parsedAmount) || parsedAmount < 1) {
              setMessage('Lorem ipsum dolor sit amet, minimum value required.')
              throw new Error('Invalid amount')
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

              setMessage('Lorem ipsum dolor sit amet, donation completed successfully.')
              setDonationAmount('25')

              setDonationForm((current) => ({
                nome: isAuthenticated ? user?.nome ?? current.nome : '',
                email: isAuthenticated ? user?.email ?? current.email : '',
              }))
            } catch (err) {
              setMessage(err.message || 'Lorem ipsum error completing transaction.')
            } finally {
              setIsProcessing(false)
            }
          },

          onError: (err) => {
            setPaypalError(err?.message || 'Lorem ipsum PayPal transaction error.')
            setIsProcessing(false)
          },
        })

        if (buttons.isEligible()) {
          await buttons.render(container)
        }
      } catch (err) {
        if (!disposed) {
          setPaypalError(err.message || 'Lorem ipsum initialization error.')
        }
      }
    }

    renderPayPalButton()

    return () => {
      disposed = true
      if (container) container.innerHTML = ''
    }
  }, [paypalClientId, donationAmount, donationForm.email, donationForm.nome, isAuthenticated, user])

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Lorem ipsum"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        tone="secondary"
        actions={
          <>
            <ActionLink to="/contatti">Lorem ipsum</ActionLink>
            <ActionLink to="/privacy" variant="secondary">
              Lorem ipsum
            </ActionLink>
          </>
        }
      />

      {/* PAYMENT METHODS */}
      <section className="space-y-5 px-6 md:px-8">
        <SectionHeading
          title="Scegli come sostenerci"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-lg border border-primary/20 bg-base px-6 py-8 shadow-md">
            <h3 className="mb-4 text-lg font-bold text-text">Lorem ipsum 5x1000</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="font-semibold text-primary">Lorem ipsum codice fiscale:</p>
              <p className="font-mono text-base tracking-wide bg-primary/8 p-3 rounded-lg text-text">
                XXXX XXXX XXXX
              </p>
              <p className="text-xs text-text/60 pt-2">
                Lorem ipsum dolor sit amet, non cost information placeholder.
              </p>
            </div>
          </article>

          <article className="rounded-lg border border-secondary/20 bg-base px-6 py-8 shadow-md">
            <h3 className="mb-4 text-lg font-bold text-text">Lorem ipsum postale</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Lorem ipsum dolor sit amet consectetur.</p>
              <p className="font-semibold text-secondary">Lorem ipsum numero:</p>
              <p className="font-mono text-base tracking-wide bg-secondary/8 p-3 rounded-lg text-text">
                XXXXXXXX
              </p>
              <p className="text-xs text-text/60 pt-2">
                Lorem ipsum available in postal system.
              </p>
            </div>
          </article>

          <article className="rounded-lg border border-accent/20 bg-base px-6 py-8 shadow-md">
            <h3 className="mb-4 text-lg font-bold text-text">Lorem ipsum bonifico</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Lorem ipsum dolor sit amet transfer method.</p>
              <p className="font-semibold text-text">Lorem ipsum IBAN:</p>
              <p className="font-mono text-base tracking-wide bg-accent/8 p-3 rounded-lg break-all text-text">
                ITXX XXXX XXXX XXXX XXXX XXXX XXX
              </p>
              <p className="text-xs text-text/60 pt-2">
                Lorem ipsum causale placeholder text.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* STEPS */}
      <section className="space-y-5">
        <SectionHeading
          eyebrow="Lorem ipsum"
          title="Lorem ipsum flow"
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {donationCards.map((text, index) => (
            <article
              key={text}
              className="rounded-[1.6rem] border-2 border-primary/20 bg-base p-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Step {index + 1}
              </p>
              <p className="text-sm leading-7 text-text/80">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section className="grid gap-6 rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Lorem ipsum"
            title="Lorem ipsum impact"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
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

        <PlaceholderImage alt="Lorem ipsum impact" className="h-72 md:h-80 lg:h-full lg:min-h-96" />
      </section>

      {/* PAYPAL SECTION (kept, only text normalized) */}
      <section className="mx-auto w-full max-w-2xl rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-text md:text-3xl">
          Lorem ipsum donation
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-3 block text-sm font-medium text-text">
              Lorem ipsum amount (EUR)
            </label>

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
              onChange={(e) => setDonationAmount(e.target.value)}
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
              placeholder="Lorem ipsum custom amount"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">Lorem ipsum name</label>
            <input
              type="text"
              value={donationForm.nome}
              onChange={(e) =>
                setDonationForm((c) => ({ ...c, nome: e.target.value }))
              }
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
              placeholder="Lorem ipsum name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">Lorem ipsum email</label>
            <input
              type="email"
              value={donationForm.email}
              onChange={(e) =>
                setDonationForm((c) => ({ ...c, email: e.target.value }))
              }
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
              placeholder="Lorem ipsum email"
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
              Lorem ipsum configuration missing
            </div>
          ) : (
            <div className="mt-6">
              <div
                ref={paypalButtonRef}
                className="paypal-button-container"
                style={{ minHeight: '80px' }}
              />
            </div>
          )}

          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-text/70 leading-relaxed">
            <p className="font-semibold text-primary mb-2">Lorem ipsum privacy</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <p className="text-center text-xs text-text/60">
            Lorem ipsum PayPal backend processing note.
          </p>

          {isProcessing && (
            <p className="text-center text-xs font-semibold text-primary">
              Lorem ipsum processing payment...
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default DonazioniPage