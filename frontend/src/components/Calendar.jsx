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
  const [viewMode, setViewMode] = useState('month')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  // MOBILE DETECTION
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [])

  // AUTO SWITCH SU MOBILE
  useEffect(() => {
    if (isMobile && viewMode === 'month') {
      setViewMode('week')
    }
  }, [isMobile])

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
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)

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
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )

    setSelectedDate(selectedDate)

    onDateSelected?.(selectedDate)
  }

  const formatMonthYear = (date) => {
    return new Intl.DateTimeFormat('it-IT', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const formatDateRange = () => {
    if (viewMode === 'month') {
      return formatMonthYear(currentDate)
    }

    if (viewMode === 'week') {
      const start = getWeekStart(currentDate)

      const end = new Date(start)
      end.setDate(end.getDate() + 6)

      return `${start.getDate()} ${
        formatMonthYear(start).split(' ')[0]
      } - ${end.getDate()} ${formatMonthYear(end)}`
    }

    return new Intl.DateTimeFormat('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(currentDate)
  }

  return (
    <div className="rounded-lg border border-text/10 bg-base shadow-lg">
      {/* HEADER */}
      <div className="border-b border-text/10 p-3 sm:p-6">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h2 className="truncate text-sm font-bold text-text sm:text-2xl">
            {formatDateRange()}
          </h2>

          <div className="flex gap-2">
            <button
              onClick={handlePrevPeriod}
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/8 px-3 py-2 text-sm font-semibold text-primary"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>

            <button
              onClick={handleToday}
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/8 px-3 py-2 text-sm font-semibold text-primary"
            >
              <FontAwesomeIcon icon={faClock} className="text-xs" />
              <span>Oggi</span>
            </button>

            <button
              onClick={handleNextPeriod}
              className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/8 px-3 py-2 text-sm font-semibold text-primary"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
          </div>
        </div>

        {/* VIEW MODES */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('day')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
              viewMode === 'day'
                ? 'bg-primary text-white'
                : 'border border-primary/30 bg-primary/8 text-primary'
            }`}
          >
            <FontAwesomeIcon icon={faCalendarDay} />
            <span className="hidden sm:inline">Giorno</span>
          </button>

          <button
            onClick={() => setViewMode('week')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
              viewMode === 'week'
                ? 'bg-primary text-white'
                : 'border border-primary/30 bg-primary/8 text-primary'
            }`}
          >
            <FontAwesomeIcon icon={faCalendarWeek} />
            <span className="hidden sm:inline">Settimana</span>
          </button>

          {!isMobile && (
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                viewMode === 'month'
                  ? 'bg-primary text-white'
                  : 'border border-primary/30 bg-primary/8 text-primary'
              }`}
            >
              <FontAwesomeIcon icon={faCalendar} />
              <span className="hidden sm:inline">Mese</span>
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-6">
        {loading && (
          <div className="flex h-96 items-center justify-center">
            <p className="text-text/50">Caricamento eventi...</p>
          </div>
        )}

        {!loading && viewMode === 'month' && (
          <div className="overflow-x-auto">
            <MonthView />
          </div>
        )}

        {!loading && viewMode === 'week' && <WeekView />}
        {!loading && viewMode === 'day' && <DayView />}
      </div>
    </div>
  )

  // MONTH VIEW
  function MonthView() {
    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

    const daysInMonth = getDaysInMonth(currentDate)

    // FIX LUNEDÌ
    const firstDay = (getFirstDayOfMonth(currentDate) + 6) % 7

    const calendarDays = []

    const prevMonthDays = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    )

    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthDays - i,
        currentMonth: false,
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        day: i,
        currentMonth: true,
      })
    }

    const remainingDays = 42 - calendarDays.length

    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        day: i,
        currentMonth: false,
      })
    }

    return (
      <div className="space-y-1 sm:space-y-3">
        {/* HEADER */}
        <div className="grid grid-cols-7 gap-px sm:gap-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="rounded py-1 text-center text-[9px] font-bold uppercase text-text/50 sm:py-2 sm:text-xs"
            >
              <span className="sm:hidden">{day[0]}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-7 gap-px sm:gap-2">
          {calendarDays.map((dayObj, idx) => {
            const dayEvents = dayObj.currentMonth
              ? getEventsForDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    dayObj.day
                  )
                )
              : []

            return (
              <button
                key={idx}
                onClick={() =>
                  dayObj.currentMonth && handleDateClick(dayObj.day)
                }
                className={`
                  group relative
                  min-h-[56px]
                  sm:aspect-square
                  rounded-lg
                  border
                  p-1
                  text-[10px]
                  font-semibold
                  transition-all
                  sm:p-2
                  sm:text-sm

                  ${
                    dayObj.currentMonth
                      ? 'border-text/10 bg-background text-text'
                      : 'border-transparent bg-background text-text/30'
                  }
                `}
              >
                <div className="flex h-full flex-col items-center justify-between">
                  <span className="text-[11px] sm:text-sm">
                    {dayObj.day}
                  </span>

                  {dayEvents.length > 0 && (
                    <>
                      {/* MOBILE */}
                      <div className="mt-auto flex justify-center sm:hidden">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      </div>

                      {/* DESKTOP */}
                      <div className="mt-auto hidden w-full flex-wrap gap-0.5 sm:flex">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="w-full truncate rounded bg-secondary/50 px-1 py-0.5 text-xs font-bold text-white"
                          >
                            {event.titolo.substring(0, 8)}
                          </div>
                        ))}
                      </div>
                    </>
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
      <div className="overflow-x-auto">
        <div className="min-w-[480px] space-y-3">
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-text/10 p-2 text-center sm:p-3"
              >
                <div className="text-xs font-bold uppercase text-text/70">
                  {dayNames[idx]}
                </div>

                <div className="text-base font-bold sm:text-lg">
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // DAY VIEW
  function DayView() {
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="space-y-2">
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

        {/* FIX MOBILE HEIGHT */}
        <div className="max-h-[70vh] space-y-2 overflow-y-auto">
          {hours.map((hour) => {
            const hourEvents = getEventsForDateAndHour(currentDate, hour)

            return (
              <div
                key={hour}
                className="rounded-lg border border-text/10 p-3"
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-12 text-sm font-bold text-text/60">
                    {String(hour).padStart(2, '0')}:00
                  </div>

                  <div className="flex-1 space-y-2">
                    {hourEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className="w-full rounded-lg border border-secondary/40 bg-secondary/10 p-2 text-left"
                      >
                        <p className="text-sm font-bold text-secondary">
                          {event.titolo}
                        </p>
                      </button>
                    ))}
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