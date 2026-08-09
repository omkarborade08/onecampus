import { api } from './api';

function getApiMessage(error) {
  const rawMessage = error?.message || ''

  try {
    const body = JSON.parse(rawMessage)
    return body.message || body.error || body.detail || ''
  } catch {
    return rawMessage
  }
}

function getFriendlyAuthError(error, action) {
  const message = getApiMessage(error).toLowerCase()

  if (message.includes('invalid credentials') || message.includes('bad credentials') || message.includes('unauthorized')) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }

  if (message.includes('already registered') || message.includes('already exists') || message.includes('duplicate')) {
    return 'An account with this email already exists. Please sign in instead.'
  }

  if (message.includes('email') && (message.includes('valid') || message.includes('format'))) {
    return 'Please enter a valid email address.'
  }

  if (message.includes('password') && (message.includes('weak') || message.includes('short') || message.includes('length'))) {
    return 'Please choose a stronger password and try again.'
  }

  if (message.includes('failed to fetch') || message.includes('network') || message.includes('connection')) {
    return 'Unable to connect right now. Please check your internet connection and try again.'
  }

  return action === 'login'
    ? 'We could not sign you in right now. Please try again.'
    : 'We could not create your account right now. Please check your details and try again.'
}

export const authApi = {
  register: async (data) => {
    try {
      return await api.post('/auth/register', data)
    } catch (error) {
      throw new Error(getFriendlyAuthError(error, 'register'))
    }
  },
  login: async (data) => {
    try {
      return await api.post('/auth/login', data)
    } catch (error) {
      throw new Error(getFriendlyAuthError(error, 'login'))
    }
  },
};
