import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContattiPage from './pages/ContattiPage.jsx'
import DonazioniPage from './pages/DonazioniPage.jsx'
import EventiPage from './pages/EventiPage.jsx'
import GalleriaPage from './pages/GalleriaPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function ScrollToTop() {
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [location.pathname])
  
  return null
}

function App() {
  return (
    <AuthProvider>
      <>
        <ScrollToTop />
        <div className="mx-auto flex min-h-screen w-[90vw] max-w-[90vw] flex-col px-4 py-4 md:px-6 md:py-8 lg:px-8">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-text focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Vai al contenuto principale
        </a>

        <header className="mb-8">
          <Navbar />
        </header>

        <div id="main-content" tabIndex="-1" className="flex-1 focus:outline-none transition-opacity duration-150">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/eventi" element={<EventiPage />} />
            <Route path="/galleria" element={<GalleriaPage />} />
            <Route path="/chi-siamo" element={<AboutPage />} />
            <Route path="/donazioni" element={<DonazioniPage />} />
            <Route path="/contatti" element={<ContattiPage />} />
          </Routes>
        </div>
      </div>

    <Footer />
    </>
    </AuthProvider>
  )
}

export default App
