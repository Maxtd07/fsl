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
  { value: 'login', label: 'Lorem ipsum dolor' },
  { value: 'register', label: 'Sed ut perspiciatis' },
]

const loginFields = [
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'lorem@ipsum.it',
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
    label: 'Lorem name',
    name: 'nome',
    type: 'text',
    autoComplete: 'name',
    placeholder: 'Lorem Ipsum',
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'dolor@sit.amet',
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: 'Minima 8 caratteri',
  },
  {
    label: 'Confirm lorem',
    name: 'confirmPassword',
    type: 'password',
    autoComplete: 'new-password',
    placeholder: 'Ripeti ipsum',
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
      handleSubmitError(err, 'Lorem ipsum dolor sit amet.')
    }
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    clearFeedback()

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Lorem ipsum mismatch dolor.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        nome: registerForm.nome,
        email: registerForm.email,
        password: registerForm.password,
      })
      setMessage('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
    } catch (err) {
      handleSubmitError(err, 'Registratio non concluditur.')
    }
  }

  const formConfig =
    mode === 'login'
      ? {
          title: 'Lorem accessus',
          fields: loginFields,
          values: loginForm,
          onFieldChange: updateLoginField,
          onSubmit: handleLoginSubmit,
          submitLabel: isSubmitting ? 'Lorem...' : 'Accedi',
        }
      : {
          title: 'Lorem registratio',
          fields: registerFields,
          values: registerForm,
          onFieldChange: updateRegisterField,
          onSubmit: handleRegisterSubmit,
          submitLabel: isSubmitting ? 'Creazione...' : 'Registrati',
        }

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Lorem"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        description="Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer vitae lorem non massa facilisis."
        tone="secondary"
        actions={
          <>
            <ActionLink to="/eventi">Lorem events</ActionLink>
            <ActionLink to="/privacy" variant="secondary">
              Lorem privacy
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Lorem area"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            description="Suspendisse potenti. Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis."
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
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
              Lorem benefits
            </p>
            <p className="mt-3 text-sm leading-7 text-text/80">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-primary/12 bg-background p-6 shadow-[0_18px_40px_rgba(76,130,169,0.10)] md:p-7">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {formConfig.title}
          </p>

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
            <FeedbackMessage className="border border-accent/30 bg-accent/10 text-accent">
              {error}
            </FeedbackMessage>
          )}

          {message && (
            <FeedbackMessage className="border border-green-200 bg-green-50 text-green-700">
              {message}
            </FeedbackMessage>
          )}

          <p className="mt-5 text-xs text-text/60">
            Lorem admin area: <span className="font-semibold">/admin/login</span>
          </p>

          <p className="mt-2 text-xs text-text/60">
            Seed credentials: <span className="font-semibold">admin@lorem.it</span> /{' '}
            <span className="font-semibold">Admin123!</span>
          </p>

          {user && <p className="mt-2 text-xs text-text/60">Lorem session active: {user.nome}</p>}
        </div>
      </section>
    </main>
  )
}

export default AuthPage