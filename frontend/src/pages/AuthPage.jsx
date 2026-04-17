import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/useAuth.js'

const initialLoginState = {
  email: '',
  password: '',
}

const initialRegisterState = {
  nome: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const modeOptions = [
  { value: 'login', label: 'Ho gia un profilo' },
  { value: 'register', label: 'Crea il tuo profilo' },
]

const loginFields = [
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'nome@email.it',
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'current-password',
    placeholder: '********',
  },
]

const registerFields = [
  {
    label: 'Nome e cognome',
    name: 'nome',
    type: 'text',
    autoComplete: 'name',
    placeholder: 'Mario Rossi',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'nome@email.it',
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: 'Almeno 8 caratteri',
  },
  {
    label: 'Conferma password',
    name: 'confirmPassword',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: 'Ripeti la password',
  },
]

const inputClassName =
  'w-full rounded-2xl border border-primary/15 bg-base px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12'

const submitButtonClassName =
  'inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 disabled:opacity-50'

function getModeButtonClassName(isActive) {
  return `rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
    isActive
      ? 'border-primary bg-primary/10 text-primary'
      : 'border-primary/15 text-text/75 hover:bg-primary/5'
  }`
}

function FormField({ label, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-text">{label}</span>
      <input className={inputClassName} required {...inputProps} />
    </label>
  )
}

function FeedbackMessage({ children, className }) {
  return <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${className}`}>{children}</div>
}

function AuthPage() {
  const location = useLocation()
  const { isAuthenticated, user, login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState(initialLoginState)
  const [registerForm, setRegisterForm] = useState(initialRegisterState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const redirectTo = location.state?.from ?? '/'

  const clearFeedback = () => {
    setError('')
    setMessage('')
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    clearFeedback()
  }

  const updateFormField = (setForm) => (field) => (event) => {
    const { value } = event.target
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmitError = (err, fallbackMessage) => {
    setError(err.message || fallbackMessage)
    setIsSubmitting(false)
  }

  const updateLoginField = updateFormField(setLoginForm)
  const updateRegisterField = updateFormField(setRegisterForm)

  if (isAuthenticated) {
    const destination = user?.ruolo === 'ADMIN' ? '/admin/dashboard' : redirectTo
    return <Navigate to={destination} replace />
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    clearFeedback()
    setIsSubmitting(true)

    try {
      await login(loginForm)
    } catch (err) {
      handleSubmitError(err, 'Accesso non riuscito.')
    }
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    clearFeedback()

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Le password non coincidono.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        nome: registerForm.nome,
        email: registerForm.email,
        password: registerForm.password,
      })
      setMessage('Profilo creato con successo. Ora puoi accedere alla tua area personale.')
    } catch (err) {
      handleSubmitError(err, 'Registrazione non riuscita.')
    }
  }

  const formConfig =
    mode === 'login'
      ? {
          title: 'Accedi alla tua area',
          fields: loginFields,
          values: loginForm,
          onFieldChange: updateLoginField,
          onSubmit: handleLoginSubmit,
          submitLabel: isSubmitting ? 'Accesso in corso...' : 'Accedi',
        }
      : {
          title: 'Crea il tuo profilo',
          fields: registerFields,
          values: registerForm,
          onFieldChange: updateRegisterField,
          onSubmit: handleRegisterSubmit,
          submitLabel: isSubmitting ? 'Creazione profilo...' : 'Registrati',
        }

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Accesso"
        title="Accedi alla tua area o crea il tuo profilo."
        description="Da qui puoi seguire gli eventi di ASD Soccer Dream Fermana, gestire le tue partecipazioni e restare aggiornato sulle iniziative della squadra."
        tone="secondary"
        actions={
          <>
            <ActionLink to="/eventi">Vai agli eventi</ActionLink>
            <ActionLink to="/privacy" variant="secondary">
              Privacy e GDPR
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Area utente"
            title="Un accesso semplice alla tua area personale."
            description="Usa la tua email per entrare. Se non hai ancora un profilo, puoi crearlo in pochi passaggi e iniziare a seguire le attivita di Soccer Dream Fermana."
          />

          <div className="grid gap-3 md:grid-cols-2">
            {modeOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => switchMode(value)}
                className={getModeButtonClassName(mode === value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-secondary/30 bg-secondary/8 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Cosa trovi nella tua area</p>
            <p className="mt-3 text-sm leading-7 text-text/80">
              Dopo l&apos;accesso puoi visualizzare le iniziative disponibili, gestire le tue partecipazioni e ricevere
              le comunicazioni utili di ASD Soccer Dream Fermana.
            </p>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-primary/12 bg-background p-6 shadow-[0_18px_40px_rgba(76,130,169,0.10)] md:p-7">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">{formConfig.title}</p>

          <form className="space-y-4" onSubmit={formConfig.onSubmit}>
            {formConfig.fields.map((field) => (
              <FormField
                key={field.name}
                {...field}
                value={formConfig.values[field.name]}
                onChange={formConfig.onFieldChange(field.name)}
              />
            ))}

            <button className={submitButtonClassName} type="submit" disabled={isSubmitting}>
              {formConfig.submitLabel}
            </button>
          </form>

          {error && (
            <FeedbackMessage className="border border-accent/30 bg-accent/10 text-accent">{error}</FeedbackMessage>
          )}

          {message && (
            <FeedbackMessage className="border border-green-200 bg-green-50 text-green-700">{message}</FeedbackMessage>
          )}

          <p className="mt-5 text-xs text-text/60">
            Se sei amministratore puoi usare la pagina dedicata in <span className="font-semibold">/admin/login</span>.
          </p>
          {user && <p className="mt-2 text-xs text-text/60">Sessione attiva per {user.nome}</p>}
        </div>
      </section>
    </main>
  )
}

export default AuthPage
