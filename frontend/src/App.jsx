import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import IntroSplash from './components/IntroSplash.jsx'
import Navbar from './components/Navbar.jsx'
import { PrivacyBanner } from './components/PrivacyBanner.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import ContattiPage from './pages/ContattiPage.jsx'
import DonazioniPage from './pages/DonazioniPage.jsx'
import EventiPage from './pages/EventiPage.jsx'
import GalleriaPage from './pages/GalleriaPage.jsx'
import HomePage from './pages/HomePage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location.pathname])

  return null
}

function AppContent() {
  const location = useLocation()
  const [showIntro, setShowIntro] = useState(() => !location.pathname.startsWith('/admin'))

  useEffect(() => {
    if (!showIntro) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setShowIntro(false)
    }, 3000) 

    return () => {
      window.clearTimeout(timer)
    }
  }, [showIntro])

  return (
    <>
      <AnimatePresence>
        {showIntro ? <IntroSplash /> : null}
      </AnimatePresence>
      <ScrollToTop />
      <Navbar />
      <PrivacyBanner />
      <div className="mx-auto flex min-h-screen w-[90vw] max-w-[90vw] flex-col p-0 md:py-0 lg:px-6">
        <div id="main-content" tabIndex="-1" className="flex-1 p-0 focus:outline-none md:py-0 lg:px-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/accedi" element={<AuthPage />} />
            <Route path="/eventi" element={<EventiPage />} />
            <Route path="/galleria" element={<GalleriaPage />} />
            <Route path="/chi-siamo" element={<AboutPage />} />
            <Route path="/donazioni" element={<DonazioniPage />} />
            <Route path="/contatti" element={<ContattiPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
