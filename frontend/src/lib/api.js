const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')

function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl}${normalizedPath}`
}

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export async function fetchEvents() {
  const response = await fetch(buildApiUrl('/events'), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Errore API: ${response.status}`)
  }

  return response.json()
}

export async function loginAdmin(username, password) {
  const response = await fetch(buildApiUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`)
  }

  const data = await response.json()
  return data
}

export async function createEvent(eventData) {
  const response = await fetch(buildApiUrl('/events'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create event: ${response.status}`)
  }

  return response.json()
}

export async function deleteEvent(eventId) {
  const response = await fetch(buildApiUrl(`/events/${eventId}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete event: ${response.status}`)
  }

  return response.ok
}
