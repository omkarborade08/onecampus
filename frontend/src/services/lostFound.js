import { api, getAuthToken, API_BASE } from './api';

export const lostFoundApi = {
  getAll: (type) => {
    const url = type && type !== 'all' ? `/lost-found?type=${encodeURIComponent(type)}` : '/lost-found';
    return api.get(url);
  },
  search: (query) => api.get(`/lost-found/search?query=${encodeURIComponent(query)}`),
  getById: (id) => api.get(`/lost-found/${id}`),
  create: (data) => api.post('/lost-found', data),
  update: (id, data) => api.put(`/lost-found/${id}`, data),
  remove: (id) => api.delete(`/lost-found/${id}`),
  uploadImage: async (file) => {
    const token = getAuthToken()
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/lost-found/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const text = await res.text()
      let error = text
      try {
        const json = JSON.parse(text)
        error = json.error || text
      } catch {
        // keep raw text
      }
      throw new Error(error || `Upload failed with status ${res.status}`)
    }

    return res.json()
  },
};
