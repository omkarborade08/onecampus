import { api } from './api';

export const eventsApi = {
  getAll: (category) => {
    const url = category && category !== 'all' ? `/events?category=${encodeURIComponent(category)}` : '/events';
    return api.get(url);
  },
  search: (query) => api.get(`/events/search?query=${encodeURIComponent(query)}`),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  register: (id) => api.post(`/events/${id}/register`),
  getRegistrants: (id) => api.get(`/events/${id}/registrants`),
};
