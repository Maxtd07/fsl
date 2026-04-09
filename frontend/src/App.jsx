import { useEffect, useState } from 'react'
import './App.css'

const pages = {
  home: {
    title: 'Home',
    description: 'Pagina principale del sito.',
  },
  galleria: {
    title: 'Galleria',
    description: 'Spazio riservato a foto, video e contenuti visivi.',
  },
  about: {
    title: 'Chi siamo',
    description: 'Una breve presentazione dell\'associazione e della sua missione.',
  },
  donazioni: {
    title: 'Donazioni',
    description: 'Pagina base per raccogliere informazioni e link per donare.',
  },
  contatti: {
    title: 'Contatti',
    description: 'Informazioni utili per contattarci.',
  },
}

const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'galleria', label: 'Galleria' },
  { key: 'about', label: 'About (Chi siamo)' },
  { key: 'donazioni', label: 'Donazioni' },
  { key: 'contatti', label: 'Contatti' },
]

function getPageFromHash() {
  const key = window.location.hash.replace('#/', '').toLowerCase()
  return pages[key] ? key : 'home'
}

function App() {
  const [currentPage, setCurrentPage] = useState(getPageFromHash)

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(getPageFromHash())
    }

    window.addEventListener('hashchange', onHashChange)

    if (!window.location.hash) {
      window.location.hash = '/home'
    }

    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  const page = pages[currentPage]

  return (
    <div className="app-shell">
      <header className="site-header">
        <h1>Associazione La Crisalide</h1>
        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={`#/${item.key}`}
              className={item.key === currentPage ? 'active' : ''}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="page-card">
        <p className="page-label">Pagina</p>
        <h2>{page.title}</h2>
        <p>{page.description}</p>
      </main>
    </div>
  )
}

export default App
