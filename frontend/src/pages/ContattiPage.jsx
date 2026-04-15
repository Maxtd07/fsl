import { useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { sendContactEmail } from '../lib/api.js'

const contactCards = [
  {
    label: 'Email',
    text: 'la_crisalide@yahoo.it',
  },
  {
    label: 'Telefono',
    text: '+39 347 917 7811',
  },
  {
    label: 'Sede',
    text: 'Via del Palo 10, Porto Sant\'Elpidio (FM) 63821',
  },
]

function ContattiPage() {
  const [formData, setFormData] = useState({ nome: '', email: '', messaggio: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      await sendContactEmail(formData)
      setMessage({ type: 'success', text: '✅ Messaggio inviato con successo! Ti contatteremo presto.' })
      setFormData({ nome: '', email: '', messaggio: '' })
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Errore nell\'invio del messaggio. Riprova più tardi.' })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Contatti"
        title="Mettiti in Contatto con il Nostro Team"
        description="Per informazioni, collaborazioni o partecipazione agli eventi, non esitare a contattarci. Saremo lieti di fornirti tutto il supporto necessario e guidarti nelle attività dell’associazione in modo chiaro e tempestivo."
        tone="neutral"
        actions={
          <>
            <ActionLink to="/eventi">Scopri eventi</ActionLink>
            <ActionLink to="/chi-siamo" variant="secondary">
              Leggi di piu
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {contactCards.map((card) => (
          <article
            key={card.label}
            className="rounded-[1.6rem] border-2 border-primary/20 bg-base p-4 md:p-5 lg:p-6 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              {card.label}
            </p>
            <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">{card.text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Scrivici"
            title="Contattaci per qualsiasi domanda"
            description="Compila il modulo qui sotto e ti contatteremo al più presto possibile."
          />

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Nome */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Nome *</span>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Il tuo nome"
                className="w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                required
              />
            </label>

            {/* Email */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Email *</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tua@email.com"
                className="w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                required
              />
            </label>

            {/* Messaggio */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Messaggio *</span>
              <textarea
                name="messaggio"
                value={formData.messaggio}
                onChange={handleInputChange}
                placeholder="Scrivi il tuo messaggio..."
                rows="4"
                className="w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                required
              ></textarea>
            </label>

            {/* Message feedback */}
            {message.text && (
              <div className={`rounded-lg border-2 p-4 ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50"
            >
              {isSubmitting ? 'Invio in corso...' : 'Invia messaggio'}
            </button>
          </form>
        </div>

        <PlaceholderImage alt="Contatti dettaglio" className="h-72 md:h-80 lg:h-full lg:min-h-96" />
      </section>
    </main>
  )
}

export default ContattiPage
