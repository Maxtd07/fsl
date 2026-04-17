export const EVENT_TYPES = ['partita', 'evento']

export const EVENT_TYPE_LABELS = {
  partita: 'Partita',
  evento: 'Evento',
}

export function normalizeEventType(value) {
  const normalized = (value ?? '').trim().toLowerCase()
  return EVENT_TYPES.includes(normalized) ? normalized : 'evento'
}

export function formatEventType(value) {
  const normalized = normalizeEventType(value)
  return EVENT_TYPE_LABELS[normalized]
}

export function isMatchEvent(event) {
  return normalizeEventType(event?.tipo) === 'partita'
}

export function isGenericEvent(event) {
  return normalizeEventType(event?.tipo) === 'evento'
}
