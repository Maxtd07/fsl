import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContattiPage from './pages/ContattiPage.jsx'
import DonazioniPage from './pages/DonazioniPage.jsx'
import GalleriaPage from './pages/GalleriaPage.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-col gap-6">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Associazione La Crisalide
        </h1>
        <Navbar />
        </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/galleria" element={<GalleriaPage />} />
        <Route path="/chi-siamo" element={<AboutPage />} />
        <Route path="/donazioni" element={<DonazioniPage />} />
        <Route path="/contatti" element={<ContattiPage />} />
      </Routes>
    </div>
  )
}

export default App
