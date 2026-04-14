import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchEvents, createEvent, deleteEvent, uploadPhoto, fetchPhotos, deletePhoto, fetchDonations } from '../lib/api.js'

function AdminDashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, admin } = useAuth()
  const [events, setEvents] = useState([])
  const [photos, setPhotos] = useState([])
  const [donations, setDonations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    data: '',
    luogo: '',
    volantino: null,
    volantinPreview: null,
  })
  const [photoFormData, setPhotoFormData] = useState({
    titolo: '',
    descrizione: '',
    immagine: null,
    immaginePreview: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPhotoSubmitting, setIsPhotoSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [photoSuccessMessage, setPhotoSuccessMessage] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  // Load events, photos, donations
  useEffect(() => {
    async function loadData() {
      try {
        const eventsData = await fetchEvents()
        setEvents(Array.isArray(eventsData) ? eventsData : [])
        
        const photosData = await fetchPhotos()
        setPhotos(Array.isArray(photosData) ? photosData : [])
        
        const donationsData = await fetchDonations()
        setDonations(Array.isArray(donationsData) ? donationsData : [])
      } catch (err) {
        setError('Errore nel caricamento dei dati.')
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  async function handleAddEvent(e) {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const newEvent = await createEvent({
        titolo: formData.titolo,
        descrizione: formData.descrizione,
        data: new Date(formData.data).toISOString(),
        luogo: formData.luogo,
        maxPartecipanti: 100,
        volantino: formData.volantinPreview || null,
      })
      setEvents([...events, newEvent])
      setFormData({ titolo: '', descrizione: '', data: '', luogo: '', volantino: null, volantinPreview: null })
      setSuccessMessage('✅ Evento creato con successo!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setError('Errore nella creazione dell\'evento.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          volantino: file,
          volantinPreview: event.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const clearVolantino = () => {
    setFormData((prev) => ({
      ...prev,
      volantino: null,
      volantinPreview: null,
    }))
  }

  async function handleDeleteEvent(eventId) {
    if (!window.confirm('Sei sicuro di voler eliminare questo evento?')) return

    try {
      await deleteEvent(eventId)
      setEvents(events.filter((e) => e.id !== eventId))
    } catch (err) {
      setError('Errore nell\'eliminazione dell\'evento.')
    }
  }

  async function handleAddPhoto(e) {
    e.preventDefault()
    setError('')
    setPhotoSuccessMessage('')
    setIsPhotoSubmitting(true)

    try {
      const newPhoto = await uploadPhoto({
        titolo: photoFormData.titolo,
        descrizione: photoFormData.descrizione,
        immagine: photoFormData.immaginePreview || null,
      })
      setPhotos([newPhoto, ...photos])
      setPhotoFormData({ titolo: '', descrizione: '', immagine: null, immaginePreview: null })
      setPhotoSuccessMessage('✅ Foto caricata con successo!')
      setTimeout(() => setPhotoSuccessMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setError('Errore nel caricamento della foto.')
    } finally {
      setIsPhotoSubmitting(false)
    }
  }

  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoFormData((prev) => ({
          ...prev,
          immagine: file,
          immaginePreview: event.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const clearPhotoPreview = () => {
    setPhotoFormData((prev) => ({
      ...prev,
      immagine: null,
      immaginePreview: null,
    }))
  }

  async function handleDeletePhoto(photoId) {
    if (!window.confirm('Sei sicuro di voler eliminare questa foto?')) return

    try {
      await deletePhoto(photoId)
      setPhotos(photos.filter((p) => p.id !== photoId))
    } catch (err) {
      setError('Errore nell\'eliminazione della foto.')
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Dashboard Admin</h1>
            <p className="mt-2 text-sm text-slate-700">Benvenuto, {admin?.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-background px-5 py-3 text-sm font-semibold text-primary shadow-[0_8px_18px_rgba(0,0,0,0.08)] hover:bg-primary/5 transition"
          >
            Esci
          </button>
        </div>

        {/* Add Event Form */}
        <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Aggiungi Nuovo Evento</h2>

          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-text">Titolo</label>
              <input
                type="text"
                value={formData.titolo}
                onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                placeholder="Titolo dell'evento"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-text">Descrizione</label>
              <textarea
                value={formData.descrizione}
                onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                placeholder="Descrizione dell'evento"
                rows="4"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-text">Data e Ora</label>
                <input
                  type="datetime-local"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-text">Luogo</label>
                <input
                  type="text"
                  value={formData.luogo}
                  onChange={(e) => setFormData({ ...formData, luogo: e.target.value })}
                  className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  placeholder="Luogo dell'evento"
                  required
                />
              </div>
            </div>

            {/* Volantino Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-text">Volantino (facoltativo)</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 relative cursor-pointer">
                  <div className="w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center hover:bg-primary/10 transition">
                    <p className="text-sm font-medium text-primary">Clicca per caricare immagine</p>
                    <p className="text-xs text-text/60">oppure trascinala qui</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview Volantino */}
              {formData.volantinPreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={formData.volantinPreview}
                      alt="Anteprima volantino"
                      className="h-40 rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={clearVolantino}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-text/60">{formData.volantino.name}</p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(76,130,169,0.22)] hover:bg-primary/92 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creazione in corso...' : 'Crea Evento'}
            </button>
          </form>
        </section>

        {/* Events List */}
        <section className="rounded-4xl border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Eventi Esistenti</h2>

          {isLoading && (
            <div className="text-center py-8 text-slate-700">Caricamento eventi...</div>
          )}

          {!isLoading && events.length === 0 && (
            <div className="text-center py-8 text-slate-700">Nessun evento disponibile</div>
          )}

          {!isLoading && events.length > 0 && (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-primary/20 bg-background p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{event.titolo}</h3>
                    <p className="mt-1 text-sm text-slate-700">{event.descrizione}</p>
                    <p className="mt-2 text-xs text-slate-600">
                      {event.data && new Date(event.data).toLocaleDateString('it-IT')} • {event.luogo}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="px-4 py-2 text-sm font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition"
                  >
                    Elimina
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upload Photo */}
        <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Aggiungi Foto Galleria</h2>

          <form onSubmit={handleAddPhoto} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-text">Titolo</label>
              <input
                type="text"
                value={photoFormData.titolo}
                onChange={(e) => setPhotoFormData({ ...photoFormData, titolo: e.target.value })}
                className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                placeholder="Titolo della foto"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-text">Descrizione</label>
              <textarea
                value={photoFormData.descrizione}
                onChange={(e) => setPhotoFormData({ ...photoFormData, descrizione: e.target.value })}
                className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                placeholder="Descrizione della foto"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-text">Immagine</label>
              <label className="flex-1 relative cursor-pointer">
                <div className="w-full rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center hover:bg-primary/10 transition">
                  <p className="text-sm font-medium text-primary">Clicca per caricare immagine</p>
                  <p className="text-xs text-text/60">oppure trascinala qui</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {photoFormData.immaginePreview && (
              <div>
                <div className="relative inline-block">
                  <img
                    src={photoFormData.immaginePreview}
                    alt="Anteprima foto"
                    className="h-40 rounded-lg shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={clearPhotoPreview}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-2 text-xs text-text/60">{photoFormData.immagine?.name}</p>
              </div>
            )}

            {photoSuccessMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {photoSuccessMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isPhotoSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(76,130,169,0.22)] hover:bg-primary/92 transition disabled:opacity-50"
            >
              {isPhotoSubmitting ? 'Caricamento in corso...' : 'Carica Foto'}
            </button>
          </form>
        </section>

        {/* Gallery List */}
        <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Foto in Galleria</h2>

          {photos.length === 0 ? (
            <div className="text-center py-8 text-slate-700">Nessuna foto caricata</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-xl border border-primary/20 bg-background overflow-hidden"
                >
                  {photo.immagine && (
                    <img
                      src={photo.immagine}
                      alt={photo.titolo}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900">{photo.titolo}</h3>
                    <p className="mt-1 text-xs text-slate-700 line-clamp-2">{photo.descrizione}</p>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="mt-4 w-full px-3 py-2 text-xs font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Donations Stats */}
        <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Donazioni</h2>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-medium text-text/60">Totale Donazioni</p>
              <p className="mt-2 text-2xl font-bold text-primary">
                €{(donations.reduce((sum, d) => sum + (d.importo || 0), 0)).toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-medium text-text/60">Numero Donatori</p>
              <p className="mt-2 text-2xl font-bold text-primary">{donations.length}</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-medium text-text/60">Media Donazione</p>
              <p className="mt-2 text-2xl font-bold text-primary">
                €{donations.length > 0 ? (donations.reduce((sum, d) => sum + (d.importo || 0), 0) / donations.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-8 text-slate-700">Nessuna donazione al momento</div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="rounded-lg border border-primary/20 bg-background p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-slate-900">{donation.nome}</p>
                    <p className="text-sm text-slate-700">{donation.email}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">€{donation.importo?.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdminDashboard
