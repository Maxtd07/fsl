import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const initialRegisterState = {
  nome: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState(initialRegisterState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const redirectTo = useMemo(() => location.state?.from ?? '/', [location.state])

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const user = await login(loginForm)
      if (user.ruolo === 'ADMIN') {
        // Logout immediatamente
        logout()
        setIsSubmitting(false)
        setError('Gli amministratori devono accedere dall\'area riservata.')
        navigate('/admin/login', { replace: true })
        return
      }
      // Utente normale → home
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Accesso non riuscito.')
      setIsSubmitting(false)
    }
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Le password non coincidono.')
      return
    }

    setIsSubmitting(true)

    try {
      const user = await register({
        nome: registerForm.nome,
        email: registerForm.email,
        password: registerForm.password,
      })
      
      if (user.ruolo === 'ADMIN') {
        // Logout immediatamente
        logout()
        setIsSubmitting(false)
        setError('Gli amministratori devono accedere dall\'area riservata.')
        navigate('/admin/login', { replace: true })
        return
      }
      
      setMessage('Profilo creato con successo. Ora puoi iscriverti agli eventi.')
      // Nuovo utente normale → home
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registrazione non riuscita.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Accesso"
        title="Accedi o crea il tuo profilo per iscriverti agli eventi."
        description="Il tuo account ti permette di gestire la sessione sul frontend, prenotare gli eventi e ricevere promemoria via email con allegato calendario."
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
            title="Sessione sicura con JWT e iscrizione rapida agli eventi."
            description="Usa la tua email per entrare. Se non hai ancora un profilo, puoi registrarti in pochi secondi."
          />

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
                setMessage('')
              }}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                mode === 'login'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-primary/15 text-text/75 hover:bg-primary/5'
              }`}
            >
              Ho gia un account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError('')
                setMessage('')
              }}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                mode === 'register'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-primary/15 text-text/75 hover:bg-primary/5'
              }`}
            >
              Crea un account
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-secondary/30 bg-secondary/8 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Cosa ottieni</p>
            <p className="mt-3 text-sm leading-7 text-text/80">
              Dopo l&apos;accesso puoi iscriverti agli eventi, vedere la tua sessione attiva e ricevere le conferme
              via email con file `.ics` compatibile con i calendari piu diffusi.
            </p>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-primary/12 bg-background p-6 shadow-[0_18px_40px_rgba(76,130,169,0.10)] md:p-7">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {mode === 'login' ? 'Accesso utente' : 'Registrazione'}
          </p>

          {mode === 'login' ? (
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text">Email</span>
                <input
                  autoComplete="email"
                  className="w-full rounded-2xl border border-primary/15 bg-base px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  name="email"
                  type="email"
                  placeholder="nome@email.it"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text">Password</span>
                <input
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-primary/15 bg-base px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </label>

              <button
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 disabled:opacity-50"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text">Nome e cognome</span>
                <input
                  autoComplete="name"
                  className="w-full rounded-2xl border border-primary/15 bg-base px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  name="nome"
                  type="text"
                  placeholder="Mario Rossi"
                  value={registerForm.nome}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, nome: event.target.value }))}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text">Email</span>
                <input
                  autoComplete="email"
                  className="w-full rounded-2xl border border-primary/15 bg-base px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  name="email"
                  type="email"
                  placeholder="nome@email.it"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text">Password</span>
                <input
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-primary/15 bg-base px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  name="password"
                  type="password"
                  placeholder="Almeno 8 caratteri"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text">Conferma password</span>
                <input
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-primary/15 bg-base px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  name="confirmPassword"
                  type="password"
                  placeholder="Ripeti la password"
                  value={registerForm.confirmPassword}
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  required
                />
              </label>

              <button
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 disabled:opacity-50"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creazione profilo...' : 'Registrati'}
              </button>
            </form>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          <p className="mt-5 text-xs text-text/60">
            Se sei amministratore puoi usare la pagina dedicata in <span className="font-semibold">/admin/login</span>.
          </p>
          <p className="mt-2 text-xs text-text/60">
            Credenziali admin seed locali: <span className="font-semibold">admin@lacrisalide.it</span> /{' '}
            <span className="font-semibold">Admin123!</span>
          </p>
          {user && <p className="mt-2 text-xs text-text/60">Sessione attiva per {user.nome}</p>}
        </div>
      </section>
    </main>
  )
}

export default AuthPage
