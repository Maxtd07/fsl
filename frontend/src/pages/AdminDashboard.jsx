import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  createEvent,
  deleteEvent,
  deletePhoto,
  fetchDonations,
  fetchEvents,
  fetchPhotos,
  updateEvent,
  uploadPhoto,
} from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const emptyEventForm = {
  titolo: '',
  descrizione: '',
  data: '',
  dataFine: '',
  luogo: '',
  maxPartecipanti: 50,
  volantino: null,
  volantinoPreview: null,
}

const emptyPhotoForm = {
  titolo: '',
  descrizione: '',
  immagine: null,
  immaginePreview: null,
}

function toInputDateTime(value) {
  if (!value) return ''
  return value.slice(0, 16)
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin, isLoading: isAuthLoading, logout, user } = useAuth()
  const [events, setEvents] = useState([])
  const [photos, setPhotos] = useState([])
  const [donations, setDonations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [photoSuccessMessage, setPhotoSuccessMessage] = useState('')
  const [eventForm, setEventForm] = useState(emptyEventForm)
  const [photoForm, setPhotoForm] = useState(emptyPhotoForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPhotoSubmitting, setIsPhotoSubmitting] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)

  // Redirect se non autenticato o non admin → vai a admin login
  if (!isAuthLoading && (!isAuthenticated || !isAdmin)) {
    return <Navigate to="/admin/login" replace />
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [eventsData, photosData, donationsData] = await Promise.all([
          fetchEvents(),
          fetchPhotos(),
          fetchDonations(),
        ])

        setEvents(Array.isArray(eventsData) ? eventsData : [])
        setPhotos(Array.isArray(photosData) ? photosData : [])
        setDonations(Array.isArray(donationsData) ? donationsData : [])
      } catch (err) {
        setError(err.message || 'Errore nel caricamento dei dati.')
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && isAdmin) {
      loadData()
    } else if (!isAuthLoading) {
      setIsLoading(false)
    }
  }, [isAuthenticated, isAdmin, isAuthLoading])

  const resetEventForm = () => {
    setEditingEventId(null)
    setEventForm(emptyEventForm)
  }

  const handleEventFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      setEventForm((current) => ({
        ...current,
        volantino: file,
        volantinoPreview: loadEvent.target?.result ?? null,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      setPhotoForm((current) => ({
        ...current,
        immagine: file,
        immaginePreview: loadEvent.target?.result ?? null,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleEventSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const payload = {
        titolo: eventForm.titolo,
        descrizione: eventForm.descrizione,
        data: eventForm.data,
        dataFine: eventForm.dataFine || null,
        luogo: eventForm.luogo,
        maxPartecipanti: Number(eventForm.maxPartecipanti),
        volantino: eventForm.volantinoPreview || null,
      }

      const savedEvent = editingEventId
        ? await updateEvent(editingEventId, payload)
        : await createEvent(payload)

      setEvents((current) =>
        editingEventId
          ? current.map((item) => (item.id === editingEventId ? savedEvent : item))
          : [...current, savedEvent].sort((a, b) => new Date(a.data) - new Date(b.data))
      )

      setSuccessMessage(editingEventId ? 'Evento aggiornato con successo.' : 'Evento creato con successo.')
      resetEventForm()
    } catch (err) {
      setError(err.message || 'Errore nella gestione dell evento.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditEvent = (eventItem) => {
    setEditingEventId(eventItem.id)
    setEventForm({
      titolo: eventItem.titolo,
      descrizione: eventItem.descrizione,
      data: toInputDateTime(eventItem.data),
      dataFine: toInputDateTime(eventItem.dataFine),
      luogo: eventItem.luogo,
      maxPartecipanti: eventItem.maxPartecipanti,
      volantino: null,
      volantinoPreview: eventItem.volantino,
    })
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Vuoi eliminare questo evento?')) return

    try {
      await deleteEvent(eventId)
      setEvents((current) => current.filter((eventItem) => eventItem.id !== eventId))
    } catch (err) {
      setError(err.message || 'Errore durante l eliminazione dell evento.')
    }
  }

  const handlePhotoSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setPhotoSuccessMessage('')
    setIsPhotoSubmitting(true)

    try {
      const savedPhoto = await uploadPhoto({
        titolo: photoForm.titolo,
        descrizione: photoForm.descrizione,
        immagine: photoForm.immaginePreview || null,
      })

      setPhotos((current) => [savedPhoto, ...current])
      setPhotoForm(emptyPhotoForm)
      setPhotoSuccessMessage('Foto caricata con successo.')
    } catch (err) {
      setError(err.message || 'Errore nel caricamento della foto.')
    } finally {
      setIsPhotoSubmitting(false)
    }
  }

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Vuoi eliminare questa foto?')) return

    try {
      await deletePhoto(photoId)
      setPhotos((current) => current.filter((photo) => photo.id !== photoId))
    } catch (err) {
      setError(err.message || 'Errore durante l eliminazione della foto.')
    }
  }

  const totalDonations = donations.reduce((sum, donation) => sum + (donation.importo || 0), 0)
  const averageDonation = donations.length > 0 ? totalDonations / donations.length : 0

  if (!isAuthLoading && !isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAuthLoading && isAuthenticated && !isAdmin) {
    return <Navigate to="/accedi" replace />
  }

  if (isAuthLoading || isLoading) {
    return (
      <main className="rounded-[2rem] border border-primary/15 bg-base p-8 text-center text-sm text-text/70">
        Caricamento dashboard...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Dashboard Admin</h1>
            <p className="mt-2 text-sm text-slate-700">Benvenuto, {user?.nome}.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
            {error}
          </div>
        )}

        <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900 md:text-2xl">
            {editingEventId ? 'Modifica evento' : 'Crea nuovo evento'}
          </h2>

          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">Titolo</label>
              <input
                type="text"
                value={eventForm.titolo}
                onChange={(event) => setEventForm((current) => ({ ...current, titolo: event.target.value }))}
                className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">Descrizione</label>
              <textarea
                value={eventForm.descrizione}
                onChange={(event) => setEventForm((current) => ({ ...current, descrizione: event.target.value }))}
                className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                rows="4"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text">Inizio</label>
                <input
                  type="datetime-local"
                  value={eventForm.data}
                  onChange={(event) => setEventForm((current) => ({ ...current, data: event.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text">Fine</label>
                <input
                  type="datetime-local"
                  value={eventForm.dataFine}
                  onChange={(event) => setEventForm((current) => ({ ...current, dataFine: event.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text">Luogo</label>
                <input
                  type="text"
                  value={eventForm.luogo}
                  onChange={(event) => setEventForm((current) => ({ ...current, luogo: event.target.value }))}
                  className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text">Capienza massima</label>
                <input
                  type="number"
                  min="1"
                  value={eventForm.maxPartecipanti}
                  onChange={(event) =>
                    setEventForm((current) => ({ ...current, maxPartecipanti: event.target.value }))
                  }
                  className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">Volantino</label>
              <label className="block cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center transition hover:bg-primary/10">
                <span className="text-sm font-medium text-primary">Carica immagine evento</span>
                <input type="file" accept="image/*" onChange={handleEventFileChange} className="hidden" />
              </label>

              {eventForm.volantinoPreview && (
                <div className="mt-4">
                  <img
                    src={eventForm.volantinoPreview}
                    alt="Anteprima volantino"
                    className="h-40 rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>

            {successMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {successMessage}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(76,130,169,0.22)] hover:bg-primary/92 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Salvataggio...' : editingEventId ? 'Aggiorna evento' : 'Crea evento'}
              </button>

              {editingEventId && (
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="inline-flex items-center justify-center rounded-full border border-primary/20 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition"
                >
                  Annulla modifica
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900 md:text-2xl">Eventi esistenti</h2>

          {events.length === 0 ? (
            <div className="py-8 text-center text-slate-700">Nessun evento disponibile</div>
          ) : (
            <div className="space-y-4">
              {events.map((eventItem) => (
                <div
                  key={eventItem.id}
                  className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-background p-4 md:flex-row md:items-center md:justify-between md:p-5"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{eventItem.titolo}</h3>
                    <p className="mt-1 text-sm text-slate-700">{eventItem.descrizione}</p>
                    <p className="mt-2 text-xs text-slate-600">
                      {new Date(eventItem.data).toLocaleString('it-IT')} | {eventItem.luogo}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Iscritti: {eventItem.registeredParticipants} / {eventItem.maxPartecipanti}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditEvent(eventItem)}
                      className="rounded-lg border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition"
                    >
                      Modifica
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(eventItem.id)}
                      className="rounded-lg border border-accent/30 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900 md:text-2xl">Aggiungi foto galleria</h2>

          <form onSubmit={handlePhotoSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">Titolo</label>
              <input
                type="text"
                value={photoForm.titolo}
                onChange={(event) => setPhotoForm((current) => ({ ...current, titolo: event.target.value }))}
                className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">Descrizione</label>
              <textarea
                value={photoForm.descrizione}
                onChange={(event) =>
                  setPhotoForm((current) => ({ ...current, descrizione: event.target.value }))
                }
                className="w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12"
                rows="3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">Immagine</label>
              <label className="block cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center transition hover:bg-primary/10">
                <span className="text-sm font-medium text-primary">Carica foto</span>
                <input type="file" accept="image/*" onChange={handlePhotoFileChange} className="hidden" />
              </label>
            </div>

            {photoForm.immaginePreview && (
              <img src={photoForm.immaginePreview} alt="Anteprima foto" className="h-40 rounded-lg shadow-lg" />
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
              {isPhotoSubmitting ? 'Caricamento...' : 'Carica foto'}
            </button>
          </form>
        </section>

        <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900 md:text-2xl">Foto in galleria</h2>

          {photos.length === 0 ? (
            <div className="py-8 text-center text-slate-700">Nessuna foto caricata</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-xl border border-primary/20 bg-background">
                  {photo.immagine && (
                    <img src={photo.immagine} alt={photo.titolo} className="h-48 w-full object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900">{photo.titolo}</h3>
                    <p className="mt-1 text-xs text-slate-700">{photo.descrizione}</p>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="mt-4 w-full rounded-lg border border-accent/30 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/10 transition"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900 md:text-2xl">Donazioni</h2>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-medium text-text/60">Totale raccolto</p>
              <p className="mt-2 text-2xl font-bold text-primary">EUR {totalDonations.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-medium text-text/60">Numero donazioni</p>
              <p className="mt-2 text-2xl font-bold text-primary">{donations.length}</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-medium text-text/60">Media</p>
              <p className="mt-2 text-2xl font-bold text-primary">EUR {averageDonation.toFixed(2)}</p>
            </div>
          </div>

          {donations.length === 0 ? (
            <div className="py-8 text-center text-slate-700">Nessuna donazione registrata</div>
          ) : (
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between rounded-lg border border-primary/20 bg-background p-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">{donation.nome}</p>
                    <p className="text-sm text-slate-700">{donation.email}</p>
                    <p className="text-xs text-slate-600">{donation.paymentStatus}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">EUR {donation.importo?.toFixed(2)}</p>
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
