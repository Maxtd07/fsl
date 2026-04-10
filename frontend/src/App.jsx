import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContattiPage from './pages/ContattiPage.jsx'
import DonazioniPage from './pages/DonazioniPage.jsx'
import EventiPage from './pages/EventiPage.jsx'
import GalleriaPage from './pages/GalleriaPage.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[78rem] flex-col px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-text focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Vai al contenuto principale
      </a>

      <header className="mb-8">
        <Navbar />
      </header>

      <div id="main-content" tabIndex="-1" className="flex-1 focus:outline-none">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/eventi" element={<EventiPage />} />
          <Route path="/galleria" element={<GalleriaPage />} />
          <Route path="/chi-siamo" element={<AboutPage />} />
          <Route path="/donazioni" element={<DonazioniPage />} />
          <Route path="/contatti" element={<ContattiPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
