const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')

const DEFAULT_HEADERS = {
  Accept: 'application/json',
}

function buildQueryString(params) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value)
    }
  })

  return searchParams.toString()
}

function withQuery(path, params, { includeEmptyQuery = false } = {}) {
  const queryString = buildQueryString(params)
  if (queryString) {
    return `${path}?${queryString}`
  }

  return includeEmptyQuery ? `${path}?` : path
}

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
    const message = [data?.message, data?.error, data?.title].find(Boolean) ?? `Errore HTTP ${response.status}`
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return data
}

async function apiRequest(path, { method = 'GET', body, auth = false, headers = {} } = {}) {
  const requestHeaders = {
    ...DEFAULT_HEADERS,
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

function postRequest(path, body, options = {}) {
  return apiRequest(path, {
    ...options,
    method: 'POST',
    body,
  })
}

function putRequest(path, body, options = {}) {
  return apiRequest(path, {
    ...options,
    method: 'PUT',
    body,
  })
}

function deleteRequest(path, options = {}) {
  return apiRequest(path, {
    ...options,
    method: 'DELETE',
  })
}

export function loginUser(credentials) {
  return postRequest('/auth/login', credentials)
}

export function registerUser(payload) {
  return postRequest('/auth/register', payload)
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
  return apiRequest(
    withQuery('/events/filter', {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    }),
  )
}

export function getUpcomingEvents(fromDate) {
  return apiRequest(
    withQuery('/events/upcoming', {
      from: fromDate?.toISOString(),
    }, { includeEmptyQuery: true }),
  )
}

export function createEvent(eventData) {
  return postRequest('/events', eventData, {
    auth: true,
  })
}

export function updateEvent(eventId, eventData) {
  return putRequest(`/events/${eventId}`, eventData, {
    auth: true,
  })
}

export function deleteEvent(eventId) {
  return deleteRequest(`/events/${eventId}`, {
    auth: true,
  })
}

export function sendContactEmail(contactData) {
  return postRequest('/email/contatti', contactData)
}

export function createBooking(eventId) {
  return postRequest(
    '/bookings',
    { eventId },
    {
      auth: true,
    },
  )
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
  return deleteRequest(`/bookings/${bookingId}`, {
    auth: true,
  })
}

export function getEventCalendarLink(eventId) {
  return buildApiUrl(`/events/${eventId}/calendar`)
}

export function uploadPhoto(photoData) {
  return postRequest('/photos', photoData, {
    auth: true,
  })
}

export function fetchPhotos() {
  return apiRequest('/photos')
}

export function fetchFacebookPosts() {
  return apiRequest('/facebook/posts')
}

export function deletePhoto(photoId) {
  return deleteRequest(`/photos/${photoId}`, {
    auth: true,
  })
}

export function createPayment(payload) {
  return postRequest('/donations/create-payment', payload)
}

export function capturePayment(orderId) {
  return postRequest('/donations/capture-payment', { orderId })
}

export function createDonation(donationData) {
  return postRequest('/donations', donationData)
}

export function fetchDonations() {
  return apiRequest('/donations', {
    auth: true,
  })
}
