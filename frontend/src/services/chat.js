import { api, getAuthToken, API_BASE } from './api';

export const chatApi = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (data) => api.post('/chat/messages', data),
  getOrCreateConversation: (otherUserId) => api.get(`/chat/conversations/with?otherUserId=${encodeURIComponent(otherUserId)}`),
  markAsRead: (conversationId) => api.put(`/chat/conversations/${conversationId}/read`),
  getUnreadCount: () => api.get('/chat/unread-count'),
  updatePresence: (userId, status) => api.post(`/chat/presence?userId=${encodeURIComponent(userId)}&status=${encodeURIComponent(status)}`),
  uploadImage: async (file) => {
    const token = getAuthToken()
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/chat/upload`, {
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
