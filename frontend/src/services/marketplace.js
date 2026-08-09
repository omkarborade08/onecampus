import { api, getAuthToken } from './api';

export const marketplaceApi = {
  getAll: (category) => {
    const url = category && category !== 'All' ? `/marketplace?category=${encodeURIComponent(category)}` : '/marketplace';
    return api.get(url);
  },
  search: (query) => api.get(`/marketplace/search?query=${encodeURIComponent(query)}`),
  getById: (id) => api.get(`/marketplace/${id}`),
  create: (data) => api.post('/marketplace', data),
  uploadImage: async (file) => {
    const token = getAuthToken()
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/marketplace/upload', {
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
