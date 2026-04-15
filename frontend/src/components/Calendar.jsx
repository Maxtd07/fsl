import { useEffect, useState } from 'react'
import { getEventsByDateRange } from '../lib/api'

export function Calendar({ onDateSelected, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // 'day', 'week', 'month'
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  // Carica eventi per il mese corrente
  useEffect(() => {
    loadEventsForCurrentView()
  }, [currentDate, viewMode])

  const loadEventsForCurrentView = async () => {
    setLoading(true)
    try {
      const start = getMonthStart(currentDate)
      const end = getMonthEnd(currentDate)
      const data = await getEventsByDateRange(start, end)
      setEvents(data || [])
    } catch (error) {
      console.error('Errore caricamento eventi:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const getMonthStart = (date) => {
    const d = new Date(date)
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const getMonthEnd = (date) => {
    const d = new Date(date)
    d.setMonth(d.getMonth() + 1)
    d.setDate(0)
    d.setHours(23, 59, 59, 999)
    return d
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const getEventsForDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return events.filter(event => {
      const eventDate = new Date(event.data)
      return isSameDay(date, eventDate)
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(selectedDate)
    onDateSelected?.(selectedDate)
  }

  const monthName = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(currentDate)

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const calendarDays = []

  // Giorni del mese precedente
  const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, currentMonth: false })
  }

  // Giorni del mese corrente
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, currentMonth: true })
  }

  // Giorni del mese successivo
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({ day: i, currentMonth: false })
  }

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-base/50 p-6">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold capitalize text-text">{monthName}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="rounded-lg border border-primary/20 px-3 py-1.5 text-sm font-semibold text-text hover:bg-primary/10"
            >
              ← Prec
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="rounded-lg border border-primary/20 px-3 py-1.5 text-sm font-semibold text-text hover:bg-primary/10"
            >
              Oggi
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded-lg border border-primary/20 px-3 py-1.5 text-sm font-semibold text-text hover:bg-primary/10"
            >
              Succ →
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${
                viewMode === mode
                  ? 'bg-primary/20 text-primary'
                  : 'border border-primary/20 text-text/70 hover:bg-primary/10'
              }`}
            >
              {mode === 'day' ? 'Giorno' : mode === 'week' ? 'Settimana' : 'Mese'}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex h-96 items-center justify-center">
          <p className="text-text/50">Caricamento eventi...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Calendar Grid */}
          <div className="space-y-3">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="rounded text-center text-xs font-bold uppercase text-text/50 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((dayObj, idx) => {
                const dayEvents = dayObj.currentMonth ? getEventsForDate(dayObj.day) : []
                const isToday = dayObj.currentMonth && isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day))
                const isSelected = dayObj.currentMonth && selectedDate && isSameDay(selectedDate, new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day))

                return (
                  <button
                    key={idx}
                    onClick={() => dayObj.currentMonth && handleDateClick(dayObj.day)}
                    disabled={!dayObj.currentMonth}
                    className={`group relative aspect-square rounded-lg border-2 p-2 text-sm font-semibold transition-all ${
                      !dayObj.currentMonth
                        ? 'bg-text/5 text-text/30 border-transparent cursor-default'
                        : dayEvents.length > 0
                          ? 'border-secondary/40 bg-secondary/10 text-text hover:border-secondary hover:bg-secondary/15'
                          : isToday
                            ? 'border-primary bg-primary/15 text-text'
                            : isSelected
                              ? 'border-accent/40 bg-accent/10 text-text'
                              : 'border-primary/10 text-text hover:border-primary/30 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex h-full flex-col">
                      <span>{dayObj.day}</span>
                      {dayObj.currentMonth && dayEvents.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-0.5">
                          {dayEvents.slice(0, 2).map((event, i) => (
                            <div
                              key={i}
                              onClick={() => onEventClick?.(event)}
                              className="cursor-pointer rounded bg-secondary/40 px-1 py-0.5 text-xs font-bold text-secondary truncate w-full"
                              title={event.titolo}
                            >
                              {event.titolo.substring(0, 8)}...
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-xs text-secondary/70">+{dayEvents.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Events List for selected date */}
          {selectedDate && (
            <div className="mt-6 space-y-3 rounded-lg border border-primary/10 bg-primary/5 p-4">
              <h3 className="font-bold text-text">
                Eventi di {new Intl.DateTimeFormat('it-IT', { weekday: 'long', month: 'long', day: 'numeric' }).format(selectedDate)}
              </h3>
              {getEventsForDate(selectedDate.getDate()).length > 0 ? (
                <div className="space-y-2">
                  {getEventsForDate(selectedDate.getDate()).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className="cursor-pointer rounded-lg border border-secondary/20 bg-base p-3 hover:border-secondary/40 hover:bg-secondary/5"
                    >
                      <p className="font-semibold text-text">{event.titolo}</p>
                      <p className="text-xs text-text/60">{new Date(event.data).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - {event.luogo}</p>
                      {event.availableSeats === 0 && (
                        <span className="inline-block mt-2 rounded bg-accent/20 px-2 py-1 text-xs font-semibold text-accent">
                          Evento al completo
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text/60">Nessun evento in questa data</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
