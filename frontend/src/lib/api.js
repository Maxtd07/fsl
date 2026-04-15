const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl}${normalizedPath}`
}

function getStoredToken() {
  return localStorage.getItem('authToken')
}

async function parseResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data?.title ||
      `Errore HTTP ${response.status}`
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return data
}

async function apiRequest(path, { method = 'GET', body, auth = false, headers = {} } = {}) {
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getStoredToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  return parseResponse(response)
}

export function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function fetchCurrentUser() {
  return apiRequest('/auth/me', {
    auth: true,
  })
}

export function fetchEvents() {
  return apiRequest('/events')
}

export function getEventById(eventId) {
  return apiRequest(`/events/${eventId}`)
}

export function getEventsByDateRange(startDate, endDate) {
  const params = new URLSearchParams()
  params.append('start', startDate.toISOString())
  params.append('end', endDate.toISOString())
  return apiRequest(`/events/filter?${params.toString()}`)
}

export function getUpcomingEvents(fromDate) {
  const params = new URLSearchParams()
  if (fromDate) {
    params.append('from', fromDate.toISOString())
  }
  return apiRequest(`/events/upcoming?${params.toString()}`)
}

export function createEvent(eventData) {
  return apiRequest('/events', {
    method: 'POST',
    body: eventData,
    auth: true,
  })
}

export function updateEvent(eventId, eventData) {
  return apiRequest(`/events/${eventId}`, {
    method: 'PUT',
    body: eventData,
    auth: true,
  })
}

export function deleteEvent(eventId) {
  return apiRequest(`/events/${eventId}`, {
    method: 'DELETE',
    auth: true,
  })
}

export function sendContactEmail(contactData) {
  return apiRequest('/email/contatti', {
    method: 'POST',
    body: contactData,
  })
}

export function createBooking(eventId) {
  return apiRequest('/bookings', {
    method: 'POST',
    body: { eventId },
    auth: true,
  })
}

export function fetchMyBookings() {
  return apiRequest('/bookings/my', {
    auth: true,
  })
}

export function getBookingsByEvent(eventId) {
  return apiRequest(`/bookings/event/${eventId}`, {
    auth: true,
  })
}

export function getBookingsByUser(userId) {
  return apiRequest(`/bookings/user/${userId}`, {
    auth: true,
  })
}

export function deleteBooking(bookingId) {
  return apiRequest(`/bookings/${bookingId}`, {
    method: 'DELETE',
    auth: true,
  })
}

export function getEventCalendarLink(eventId) {
  return buildApiUrl(`/events/${eventId}/calendar`)
}

export function uploadPhoto(photoData) {
  return apiRequest('/photos', {
    method: 'POST',
    body: photoData,
    auth: true,
  })
}

export function fetchPhotos() {
  return apiRequest('/photos')
}

export function deletePhoto(photoId) {
  return apiRequest(`/photos/${photoId}`, {
    method: 'DELETE',
    auth: true,
  })
}

export function createPayment(payload) {
  return apiRequest('/donations/create-payment', {
    method: 'POST',
    body: payload,
  })
}

export function capturePayment(orderId) {
  return apiRequest('/donations/capture-payment', {
    method: 'POST',
    body: { orderId },
  })
}

export function createDonation(donationData) {
  return apiRequest('/donations', {
    method: 'POST',
    body: donationData,
  })
}

export function fetchDonations() {
  return apiRequest('/donations', {
    auth: true,
  })
}
