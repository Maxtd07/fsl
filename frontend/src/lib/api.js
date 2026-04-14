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

export async function getEventById(eventId) {
  const response = await fetch(buildApiUrl(`/events/${eventId}`), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Errore nel caricamento evento: ${response.status}`)
  }

  return response.json()
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

export async function updateEvent(eventId, eventData) {
  const response = await fetch(buildApiUrl(`/events/${eventId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(eventData),
  })

  if (!response.ok) {
    throw new Error(`Failed to update event: ${response.status}`)
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

export async function sendContactEmail(contactData) {
  const response = await fetch(buildApiUrl('/email/contatti'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(contactData),
  })

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.status}`)
  }

  return response.json()
}

// Bookings
export async function createBooking(eventId, userId) {
  const response = await fetch(buildApiUrl(`/bookings/${eventId}/users/${userId}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to create booking: ${response.status}`)
  }

  return response.json()
}

export async function getBookingsByEvent(eventId) {
  const response = await fetch(buildApiUrl(`/bookings/event/${eventId}`), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get bookings: ${response.status}`)
  }

  return response.json()
}

export async function getBookingsByUser(userId) {
  const response = await fetch(buildApiUrl(`/bookings/user/${userId}`), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get bookings: ${response.status}`)
  }

  return response.json()
}

export async function deleteBooking(bookingId) {
  const response = await fetch(buildApiUrl(`/bookings/${bookingId}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete booking: ${response.status}`)
  }

  return response.ok
}

// Calendar
export async function getEventCalendarLink(eventId) {
  // Genera un link di calendario (.ics)
  return buildApiUrl(`/events/${eventId}/calendar`)
}

// Photos Gallery
export async function uploadPhoto(photoData) {
  const response = await fetch(buildApiUrl('/photos'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(photoData),
  })

  if (!response.ok) {
    throw new Error(`Failed to upload photo: ${response.status}`)
  }

  return response.json()
}

export async function fetchPhotos() {
  const response = await fetch(buildApiUrl('/photos'), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch photos: ${response.status}`)
  }

  return response.json()
}

export async function deletePhoto(photoId) {
  const response = await fetch(buildApiUrl(`/photos/${photoId}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete photo: ${response.status}`)
  }

  return response.ok
}

// Donations
export async function createDonation(donationData) {
  const response = await fetch(buildApiUrl('/donations'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(donationData),
  })

  if (!response.ok) {
    throw new Error(`Failed to create donation: ${response.status}`)
  }

  return response.json()
}

export async function fetchDonations() {
  const response = await fetch(buildApiUrl('/donations'), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch donations: ${response.status}`)
  }

  return response.json()
}

