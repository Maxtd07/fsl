import { useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { sendContactEmail } from '../lib/api.js'

const initialFormState = {
  nome: '',
  email: '',
  messaggio: '',
}

const contactCards = [
  {
    label: 'Lorem email',
    text: 'lorem.ipsum@example.com',
  },
  {
    label: 'Lorem phone',
    text: '+39 000 000 0000',
  },
  {
    label: 'Lorem address',
    text: 'Via Lorem Ipsum 123, Dolor Sit (RM) 00000',
  },
]

const contactFields = [
  {
    label: 'Lorem name *',
    name: 'nome',
    type: 'text',
    placeholder: 'Lorem name',
  },
  {
    label: 'Lorem email *',
    name: 'email',
    type: 'email',
    placeholder: 'lorem@ipsum.com',
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
      <p className="text-sm font-medium">
        {message.text}
      </p>
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
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      })
      setFormData(initialFormState)
    } catch {
      setMessage({
        type: 'error',
        text: 'Lorem ipsum error sit amet, retry later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Lorem"
        title="Lorem ipsum dolor sit amet"
        description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
        tone="neutral"
        actions={
          <>
            <ActionLink to="/eventi">Lorem events</ActionLink>
            <ActionLink to="/chi-siamo" variant="secondary">
              Lorem ipsum
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
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              {card.label}
            </p>
            <p className="text-xs font-medium leading-6 text-text/85 md:text-sm md:leading-7 md:text-text/80">
              {card.text}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Lorem form"
            title="Lorem ipsum contact section"
            description="Aliquam erat volutpat. Curabitur blandit tempus porttitor. Integer posuere erat."
          />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {contactFields.map((field) => (
              <label key={field.name} className="block">
                <span className="mb-2 block text-sm font-medium text-text">
                  {field.label}
                </span>
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
              <span className="mb-2 block text-sm font-medium text-text">
                Lorem message *
              </span>
              <textarea
                name="messaggio"
                value={formData.messaggio}
                onChange={updateField('messaggio')}
                placeholder="Lorem ipsum dolor sit amet..."
                rows="4"
                className={fieldClassName}
                required
              />
            </label>

            <FeedbackMessage message={message} />

            <button
              type="submit"
              disabled={isSubmitting}
              className={submitButtonClassName}
            >
              {isSubmitting ? 'Lorem sending...' : 'Lorem submit'}
            </button>
          </form>
        </div>

        <PlaceholderImage
          alt="Lorem contacts"
          className="h-72 md:h-80 lg:h-full lg:min-h-96"
        />
      </section>
    </main>
  )
}

export default ContattiPage