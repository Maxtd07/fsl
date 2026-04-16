import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import { useAuth } from '../context/useAuth.js'

const adminLoginFields = [
  {
    label: 'Lorem Ipsum',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'lorem@ipsum.com',
  },
  {
    label: 'Dolor Sit',
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
    email: 'lorem@ipsum.com',
    password: 'Lorem123!',
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
        setError('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        return
      }

      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Lorem ipsum dolor sit amet.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="space-y-8">
      <section className="grid gap-8 rounded-[2rem] border border-primary/12 bg-primary/10 p-6 shadow-[0_24px_50px_rgba(76,130,169,0.08)] md:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-center lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="Lorem"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <ActionLink to="/" variant="secondary">
              Lorem ipsum
            </ActionLink>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-primary/12 bg-base p-6 shadow-[0_18px_40px_rgba(76,130,169,0.10)] md:p-7">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Lorem ipsum dolor
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {adminLoginFields.map((field) => (
              <label key={field.name} className="block">
                <span className="mb-2 block text-sm font-medium text-text">
                  {field.label}
                </span>
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
              {isLoading ? 'Lorem ipsum...' : 'Lorem ipsum'}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-primary/12 bg-base p-6 shadow-[0_18px_40px_rgba(76,130,169,0.06)] md:p-8 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <PlaceholderImage alt="Lorem ipsum" className="h-72 md:h-80 lg:h-full lg:min-h-96" />
        <div className="grid gap-4">
          <div className="rounded-[1.4rem] border border-secondary/30 bg-secondary/10 p-4 md:p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">
              Lorem ipsum
            </p>
            <p className="text-sm leading-7 text-text/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-accent/30 bg-accent/10 p-4 md:p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
              Lorem ipsum dolor
            </p>
            <p className="text-sm leading-7 text-text/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminLoginPage