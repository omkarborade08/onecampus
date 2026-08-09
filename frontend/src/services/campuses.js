import { api } from './api';

export const campusesApi = {
  getAll: () => api.get('/campuses'),
};
