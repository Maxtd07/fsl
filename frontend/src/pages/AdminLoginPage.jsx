import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { loginAdmin } from '../lib/api.js'

function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await loginAdmin(username, password)
      login(username, response.token || 'admin-token')
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Username o password non corretti.')
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
            title="Area riservata per la gestione del sito e dei contenuti."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <ActionLink to="/" variant="secondary">
              Torna alla home
            </ActionLink>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-primary/12 bg-base p-6 shadow-[0_18px_40px_rgba(76,130,169,0.10)] md:p-7">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Login amministratori
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text">Username</span>
              <input
                autoComplete="username"
                className="w-full rounded-2xl border border-primary/15 bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                name="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && (
              <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
                {error}
              </div>
            )}

            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50"
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
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">
              Gestione eventi
            </p>
            <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-accent/30 bg-accent/10 p-4 md:p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
              Gestione contenuti
            </p>
            <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminLoginPage
