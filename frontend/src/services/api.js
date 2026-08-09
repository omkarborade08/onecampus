const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('campusconnect_token')
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}

let isRefreshing = false
let refreshSubscribers = []

function subscribeToRefresh(cb) {
  refreshSubscribers.push(cb)
}

function unsubscribeFromRefresh(cb) {
  refreshSubscribers = refreshSubscribers.filter((fn) => fn !== cb)
}

function onRefreshed(token, refreshToken) {
  refreshSubscribers.forEach((cb) => cb(token, refreshToken))
  refreshSubscribers = []
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers || {}),
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  })

  if (res.status === 401) {
    const originalRequest = { path, options }
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeToRefresh(async (token, refreshToken) => {
          resolve(request(originalRequest.path, {
            ...originalRequest.options,
            headers: {
              ...originalRequest.options.headers,
              Authorization: `Bearer ${token}`,
            },
          }))
        })
      })
    }

    isRefreshing = true
    try {
      const refreshToken = localStorage.getItem('campusconnect_refresh_token')
      if (!refreshToken) throw new Error('No refresh token')

      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!refreshRes.ok) {
        throw new Error('Refresh failed')
      }

      const data = await refreshRes.json()
      localStorage.setItem('campusconnect_token', data.token)
      localStorage.setItem('campusconnect_refresh_token', data.refreshToken)

      onRefreshed(data.token, data.refreshToken)

      const retryRes = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.token}`,
        },
      })

      if (!retryRes.ok) {
        const text = await retryRes.text()
        let error = text
        try {
          const json = JSON.parse(text)
          error = json.error || text
        } catch {
          // keep raw text
        }
        throw new Error(error || `Request failed with status ${retryRes.status}`)
      }

      if (retryRes.status === 204) return null
      return retryRes.json()
    } catch (err) {
      localStorage.removeItem('campusconnect_token')
      localStorage.removeItem('campusconnect_refresh_token')
      localStorage.removeItem('campusconnect_user')
      window.location.href = '/login'
      throw err
    } finally {
      isRefreshing = false
    }
  }

  if (!res.ok) {
    const text = await res.text()
    let error = text
    try {
      const json = JSON.parse(text)
      error = json.error || text
    } catch {
      // keep raw text
    }
    throw new Error(error || `Request failed with status ${res.status}`)
  }

  if (res.status === 204) return null

  return res.json()
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  delete: (path) =>
    request(path, {
      method: 'DELETE',
    }),
}

export function getAuthToken() {
  return localStorage.getItem('campusconnect_token')
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('campusconnect_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}


