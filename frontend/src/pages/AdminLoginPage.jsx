import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import { useAuth } from '../context/useAuth.js'

const adminLoginFields = [
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'admin@nomeassociazione.it',
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'current-password',
    placeholder: '********',
  },
]

const inputClassName =
  'w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12'

const submitButtonClassName =
  'inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 disabled:opacity-50'

function AdminLoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, login, logout } = useAuth()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const updateCredential = (field) => (event) => {
    const { value } = event.target
    setCredentials((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await login(credentials)

      if (user.ruolo !== 'ADMIN') {
        logout()
        setError('Questo account non ha accesso alla dashboard amministrativa.')
        return
      }

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Email o password non corrette.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="space-y-8">
      <section className="grid gap-8 rounded-[2rem] border border-primary/12 bg-primary/10 p-6 shadow-[0_24px_50px_rgba(76,130,169,0.08)] md:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-center lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="Admin"
            title="Area riservata per la gestione di eventi, donazioni e contenuti."
            description="Questa sezione e dedicata alle persone autorizzate che si occupano dell'organizzazione e dell'aggiornamento del sito."
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <ActionLink to="/" variant="secondary">
              Torna alla home
            </ActionLink>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-primary/12 bg-base p-6 shadow-[0_18px_40px_rgba(76,130,169,0.10)] md:p-7">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">Login amministratori</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {adminLoginFields.map((field) => (
              <label key={field.name} className="block">
                <span className="mb-2 block text-sm font-medium text-text">{field.label}</span>
                <input
                  {...field}
                  className={inputClassName}
                  value={credentials[field.name]}
                  onChange={updateCredential(field.name)}
                  required
                />
              </label>
            ))}

            {error && (
              <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
                {error}
              </div>
            )}

            <button className={submitButtonClassName} type="submit" disabled={isLoading}>
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-primary/12 bg-base p-6 shadow-[0_18px_40px_rgba(76,130,169,0.06)] md:p-8 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <PlaceholderImage alt="Admin preview" className="h-72 md:h-80 lg:h-full lg:min-h-96" />
        <div className="grid gap-4">
          <div className="rounded-[1.4rem] border border-secondary/30 bg-secondary/10 p-4 md:p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">Gestione eventi</p>
            <p className="text-sm leading-7 text-text/80">
              Crea e aggiorna gli eventi pubblicati sul sito con date, luoghi, posti disponibili e informazioni utili.
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-accent/30 bg-accent/10 p-4 md:p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">Contenuti e donazioni</p>
            <p className="text-sm leading-7 text-text/80">
              Consulta le donazioni registrate, aggiorna la galleria e mantieni ordinati i contenuti dell'area pubblica.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminLoginPage
