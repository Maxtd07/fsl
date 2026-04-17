import { useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import picture from '../assets/contattaciimage.jpeg'
import SectionHeading from '../components/SectionHeading.jsx'
import { sendContactEmail } from '../lib/api.js'

const initialFormState = {
  nome: '',
  email: '',
  messaggio: '',
}

const contactCards = [
  {
    label: 'Modulo online',
    text: 'Scrivici direttamente da questa pagina per chiedere informazioni su squadra, eventi, sostegno o collaborazioni.',
  },
  {
    label: 'Telefono',
    text: '+39 340 983 8158',
  },
  {
    label: 'Indirizzo',
    text: 'Via Carpenette 5, 63844 Grottazzolina (FM)',
  },
]

const contactFields = [
  {
    label: 'Nome *',
    name: 'nome',
    type: 'text',
    placeholder: 'Inserisci il tuo nome',
  },
  {
    label: 'Email *',
    name: 'email',
    type: 'email',
    placeholder: 'tua@email.com',
  },
]

const fieldClassName =
  'w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12'

const submitButtonClassName =
  'inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50'

function FeedbackMessage({ message }) {
  if (!message.text) return null

  const colorClassName =
    message.type === 'success'
      ? 'border-green-200 bg-green-50 text-green-700'
      : 'border-red-200 bg-red-50 text-red-700'

  return (
    <div className={`rounded-lg border-2 p-4 ${colorClassName}`}>
      <p className="text-sm font-medium">{message.text}</p>
    </div>
  )
}

function ContattiPage() {
  const [formData, setFormData] = useState(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const updateField = (field) => (event) => {
    const { value } = event.target
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const resetFeedback = () => {
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    resetFeedback()

    try {
      await sendContactEmail(formData)
      setMessage({
        type: 'success',
        text: 'Messaggio inviato con successo. Ti contatteremo presto.',
      })
      setFormData(initialFormState)
    } catch {
      setMessage({
        type: 'error',
        text: "Errore nell'invio del messaggio. Riprova piu tardi.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Contatti"
        title="Entra in contatto con ASD Soccer Dream Fermana"
        description="Se vuoi conoscere meglio il progetto, partecipare a un evento o sostenere la squadra, scrivici e ti ricontatteremo al piu presto."
        tone="neutral"
        actions={
          <>
            <ActionLink to="/eventi">Scopri gli eventi</ActionLink>
            <ActionLink to="/chi-siamo" variant="secondary">
              Chi siamo
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {contactCards.map((card) => (
          <article
            key={card.label}
            className="rounded-[1.6rem] border-2 border-primary/20 bg-base p-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)] md:p-5 lg:p-6"
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">{card.label}</p>
            <p className="text-xs font-medium leading-6 text-text/85 md:text-sm md:leading-7 md:text-text/80">
              {card.text}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Modulo contatti"
            title="Inviaci un messaggio"
            description="Compila il modulo per richiedere informazioni su attivita, eventi, partecipazione, donazioni o collaborazioni."
          />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {contactFields.map((field) => (
              <label key={field.name} className="block">
                <span className="mb-2 block text-sm font-medium text-text">{field.label}</span>
                <input
                  {...field}
                  value={formData[field.name]}
                  onChange={updateField(field.name)}
                  className={fieldClassName}
                  required
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Messaggio *</span>
              <textarea
                name="messaggio"
                value={formData.messaggio}
                onChange={updateField('messaggio')}
                placeholder="Scrivi il tuo messaggio..."
                rows="4"
                className={fieldClassName}
                required
              />
            </label>

            <FeedbackMessage message={message} />

            <button type="submit" disabled={isSubmitting} className={submitButtonClassName}>
              {isSubmitting ? 'Invio in corso...' : 'Invia messaggio'}
            </button>
          </form>
        </div>

        <img src={picture} alt="Contatti ASD Soccer Dream Fermana" className="border-2 border-primary rounded-2xl image-fit" />
      </section>
    </main>
  )
}

export default ContattiPage
