import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function AdminLoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, login, logout } = useAuth()
  const [email, setEmail] = useState('admin@lacrisalide.it')
  const [password, setPassword] = useState('Admin123!')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await login({ email, password })

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
            description="Questa pagina usa lo stesso sistema JWT del resto dell'applicazione, con accesso consentito solo agli utenti con ruolo amministratore."
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
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Email</span>
              <input
                autoComplete="email"
                className="w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                name="email"
                type="email"
                placeholder="admin@lacrisalide.it"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Password</span>
              <input
                autoComplete="current-password"
                className="w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                name="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {error && (
              <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
                {error}
              </div>
            )}

            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
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
              Crea, modifica ed elimina gli eventi visibili nel frontend, con capienza, date e calendario scaricabile.
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-accent/30 bg-accent/10 p-4 md:p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">Monitoraggio donazioni</p>
            <p className="text-sm leading-7 text-text/80">
              Consulta il totale raccolto, l'elenco dei donatori e la galleria contenuti protetta dal ruolo admin.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminLoginPage
