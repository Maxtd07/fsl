import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContattiPage from './pages/ContattiPage.jsx'
import DonazioniPage from './pages/DonazioniPage.jsx'
import GalleriaPage from './pages/GalleriaPage.jsx'
import HomePage from './pages/HomePage.jsx'

const pages = {
  home: HomePage,
  galleria: GalleriaPage,
  about: AboutPage,
  donazioni: DonazioniPage,
  contatti: ContattiPage,
}

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

  const CurrentPage = pages[currentPage]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Associazione La Crisalide
        </h1>
        <Navbar currentPage={currentPage} />
      </header>

      <CurrentPage />
    </div>
  )
}

export default App
