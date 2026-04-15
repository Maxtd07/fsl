import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Footer from './components/Footer.jsx'
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
        <PrivacyBanner />
        <div className="mx-auto flex min-h-screen w-[90vw] max-w-[90vw] flex-col p-0 md:py-0 lg:px-6">

        <header className="mb-8">
          <Navbar />
        </header>

        <div id="main-content" tabIndex="-1" className="flex-1 focus:outline-none p-0 md:py-0 lg:px-0">
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
    </AuthProvider>
  )
}

export default App
