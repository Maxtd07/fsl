import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContattiPage from './pages/ContattiPage.jsx'
import DonazioniPage from './pages/DonazioniPage.jsx'
import EventiPage from './pages/EventiPage.jsx'
import GalleriaPage from './pages/GalleriaPage.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 sm:py-8">
      <header className="mb-8">
        <Navbar />
      </header>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
