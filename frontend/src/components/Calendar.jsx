import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClock,
  faChevronLeft,
  faChevronRight,
  faCalendarDay,
  faCalendarWeek,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons'
import { getEventsByDateRange } from '../lib/api'

export function Calendar({ onDateSelected, onEventClick, eventType = null }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month') // 'day', 'week', 'month'
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  // Load events when currentDate or viewMode changes
  useEffect(() => {
    loadEventsForCurrentView()
  }, [currentDate, eventType, viewMode])

  const loadEventsForCurrentView = async () => {
    setLoading(true)
    try {
      const { start, end } = getDateRange()
      const data = await getEventsByDateRange(start, end, eventType)
      setEvents(data || [])
    } catch (error) {
      console.error('Errore caricamento eventi:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const getDateRange = () => {
    let start, end
    if (viewMode === 'day') {
      start = new Date(currentDate)
      start.setHours(0, 0, 0, 0)
      end = new Date(currentDate)
      end.setHours(23, 59, 59, 999)
    } else if (viewMode === 'week') {
      start = getWeekStart(currentDate)
      end = getWeekEnd(currentDate)
    } else {
      // month
      start = getMonthStart(currentDate)
      end = getMonthEnd(currentDate)
    }
    return { start, end }
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

  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday start
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const getWeekEnd = (date) => {
    const d = getWeekStart(date)
    d.setDate(d.getDate() + 6)
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
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const getEventsForDate = (targetDate) => {
    return events.filter((event) => {
      const eventDate = new Date(event.data)
      return isSameDay(targetDate, eventDate)
    })
  }

  const getEventsForDateAndHour = (targetDate, hour) => {
    return getEventsForDate(targetDate).filter((event) => {
      const eventDate = new Date(event.data)
      return eventDate.getHours() === hour
    })
  }

  const handlePrevPeriod = () => {
    const d = new Date(currentDate)
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() - 1)
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7)
    } else {
      d.setDate(d.getDate() - 1)
    }
    setCurrentDate(d)
  }

  const handleNextPeriod = () => {
    const d = new Date(currentDate)
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1)
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7)
    } else {
      d.setDate(d.getDate() + 1)
    }
    setCurrentDate(d)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(selectedDate)
    onDateSelected?.(selectedDate)
  }

  const formatMonthYear = (date) => {
    return new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(date)
  }

  const formatDateRange = () => {
    if (viewMode === 'month') {
      return formatMonthYear(currentDate)
    } else if (viewMode === 'week') {
      const start = getWeekStart(currentDate)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return `${start.getDate()} ${formatMonthYear(start).split(' ')[0]} - ${end.getDate()} ${formatMonthYear(end)}`
    } else {
      return new Intl.DateTimeFormat('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(currentDate)
    }
  }

  const emptyItemLabel = eventType === 'partita' ? 'partita' : 'evento'

  return (
    <div className="rounded-lg border border-text/10 bg-base shadow-lg">
      {/* Header - Navigation & View Controls */}
      <div className="border-b border-text/10 p-6">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h2 className="text-2xl font-bold text-text">{formatDateRange()}</h2>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePrevPeriod}
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/8 px-3 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
              aria-label={`Periodo precedente`}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
              <span className="hidden sm:inline">Prec</span>
            </button>

            <button
              onClick={handleToday}
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/8 px-3 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
              aria-label="Vai a oggi"
            >
              <FontAwesomeIcon icon={faClock} className="text-xs" />
              <span>Oggi</span>
            </button>

            <button
              onClick={handleNextPeriod}
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/8 px-3 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
              aria-label={`Periodo successivo`}
            >
              <span className="hidden sm:inline">Succ</span>
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('day')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              viewMode === 'day'
                ? 'bg-primary text-white shadow-md'
                : 'border border-primary/30 bg-primary/8 text-primary hover:bg-primary/12'
            } focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40`}
            aria-pressed={viewMode === 'day'}
            aria-label="Visualizza calendario per giorno"
          >
            <FontAwesomeIcon icon={faCalendarDay} />
            <span>Giorno</span>
          </button>

          <button
            onClick={() => setViewMode('week')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              viewMode === 'week'
                ? 'bg-primary text-white shadow-md'
                : 'border border-primary/30 bg-primary/8 text-primary hover:bg-primary/12'
            } focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40`}
            aria-pressed={viewMode === 'week'}
            aria-label="Visualizza calendario per settimana"
          >
            <FontAwesomeIcon icon={faCalendarWeek} />
            <span>Settimana</span>
          </button>

          <button
            onClick={() => setViewMode('month')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              viewMode === 'month'
                ? 'bg-primary text-white shadow-md'
                : 'border border-primary/30 bg-primary/8 text-primary hover:bg-primary/12'
            } focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40`}
            aria-pressed={viewMode === 'month'}
            aria-label="Visualizza calendario per mese"
          >
            <FontAwesomeIcon icon={faCalendar} />
            <span>Mese</span>
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-6">
        {loading && (
          <div className="flex h-96 items-center justify-center">
            <p className="text-text/50">Caricamento eventi...</p>
          </div>
        )}

        {!loading && viewMode === 'month' && <MonthView />}
        {!loading && viewMode === 'week' && <WeekView />}
        {!loading && viewMode === 'day' && <DayView />}
      </div>
    </div>
  )

  // MONTH VIEW
  function MonthView() {
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const calendarDays = []

    const prevMonthDays = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    )
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({ day: prevMonthDays - i, currentMonth: false })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ day: i, currentMonth: true })
    }

    const remainingDays = 42 - calendarDays.length
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({ day: i, currentMonth: false })
    }

    return (
      <div className="space-y-3">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="rounded py-2 text-center text-xs font-bold uppercase text-text/50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayObj, idx) => {
            const dayEvents = dayObj.currentMonth ? getEventsForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day)) : []
            const isToday =
              dayObj.currentMonth &&
              isSameDay(new Date(), new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day))
            const isSelected =
              dayObj.currentMonth &&
              selectedDate &&
              isSameDay(
                selectedDate,
                new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day)
              )

            return (
              <button
                key={idx}
                onClick={() => dayObj.currentMonth && handleDateClick(dayObj.day)}
                disabled={!dayObj.currentMonth}
                className={`group relative aspect-square rounded-lg border p-2 text-sm font-semibold transition-all duration-200 ${
                  !dayObj.currentMonth
                    ? 'bg-background text-text/30 border-transparent cursor-default'
                    : dayEvents.length > 0
                      ? 'border-secondary/40 bg-secondary/10 text-text hover:border-secondary hover:bg-secondary/15'
                      : isToday
                        ? 'border-primary/60 bg-primary/15 text-primary'
                        : isSelected
                          ? 'border-accent/50 bg-accent/15 text-text'
                          : 'border-text/10 text-text hover:border-primary/30 hover:bg-primary/5'
                }`}
                aria-label={dayObj.currentMonth ? `${dayObj.day} ${new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(currentDate)}${dayEvents.length > 0 ? `, ${dayEvents.length} evento${dayEvents.length > 1 ? 'i' : ''}` : ''}` : undefined}
              >
                <div className="flex h-full flex-col">
                  <span>{dayObj.day}</span>
                  {dayObj.currentMonth && dayEvents.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-0.5">
                      {dayEvents.slice(0, 2).map((event, i) => (
                        <div
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick?.(event)
                          }}
                          className="cursor-pointer rounded bg-secondary/50 px-1 py-0.5 text-xs font-bold text-white truncate w-full hover:bg-secondary transition-colors duration-200"
                          title={event.titolo}
                        >
                          {event.titolo.substring(0, 8)}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-xs text-secondary/70 font-bold">+{dayEvents.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // WEEK VIEW
  function WeekView() {
    const weekStart = getWeekStart(currentDate)
    const daysOfWeek = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      daysOfWeek.push(d)
    }

    const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

    return (
      <div className="space-y-3">
        {/* Week header */}
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, idx) => {
            const isToday = isSameDay(day, new Date())
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDate(day)
                  onDateSelected?.(day)
                }}
                className={`rounded-lg p-3 text-center transition-all duration-200 ${
                  isToday
                    ? 'border border-primary/60 bg-primary/15'
                    : selectedDate && isSameDay(selectedDate, day)
                      ? 'border border-accent/50 bg-accent/15'
                      : 'border border-text/10 hover:bg-text/5'
                }`}
                aria-label={`${dayNames[idx]} ${day.getDate()} ${new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(day)}`}
              >
                <div className="text-xs font-bold uppercase text-text/70">{dayNames[idx]}</div>
                <div className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-text'}`}>
                  {day.getDate()}
                </div>
              </button>
            )
          })}
        </div>

        {/* Events for each day (compact view) */}
        <div className="mt-4 grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, idx) => {
            const dayEvents = getEventsForDate(day)
            return (
              <div key={idx} className="rounded-lg border border-text/10 bg-background p-2 min-h-24">
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className="w-full rounded bg-secondary/50 px-2 py-1 text-xs font-bold text-white truncate hover:bg-secondary transition-colors duration-200"
                      title={event.titolo}
                    >
                      {event.titolo.substring(0, 10)}
                    </button>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-secondary/70 px-1 font-bold">+{dayEvents.length - 2}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // DAY VIEW
  function DayView() {
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="space-y-2">
        {/* Day header */}
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <h3 className="font-bold text-text">
            {new Intl.DateTimeFormat('it-IT', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(currentDate)}
          </h3>
        </div>

        {/* Timeline */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {hours.map((hour) => {
            const hourEvents = getEventsForDateAndHour(currentDate, hour)
            const bgClass = hour % 2 === 0 ? 'bg-base' : 'bg-background'

            return (
              <div key={hour} className={`${bgClass} rounded-lg border border-text/10 p-3`}>
                <div className="flex items-start gap-4">
                  <div className="min-w-12 text-sm font-bold text-text/60">
                    {String(hour).padStart(2, '0')}:00
                  </div>
                  <div className="flex-1 space-y-2">
                    {hourEvents.length > 0 ? (
                      hourEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className="w-full rounded-lg border border-secondary/40 bg-secondary/10 p-2 text-left transition-all duration-200 hover:border-secondary hover:bg-secondary/15"
                        >
                          <p className="font-bold text-secondary text-sm">{event.titolo}</p>
                          <p className="text-xs text-text/60">
                            {new Date(event.data).toLocaleTimeString('it-IT', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })} - {event.luogo}
                          </p>
                        {!event.unlimitedCapacity && event.availableSeats === 0 && (
                          <span className="mt-2 inline-block rounded bg-accent/20 px-2 py-1 text-xs font-semibold text-accent">
                            Completo
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-text/40">
                        {emptyItemLabel === 'partita' ? 'Nessuna partita' : 'Nessun evento'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
