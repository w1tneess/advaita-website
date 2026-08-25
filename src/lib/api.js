const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const apiConfigured = Boolean(API_URL)

export async function apiRequest(path, options = {}) {
  if (!apiConfigured) throw new Error('The site API is not configured.')
  const response = await fetch(`${API_URL}/api${path}`, {
    credentials: 'include',
    headers: { ...(options.body ? { 'content-type': 'application/json' } : {}), ...options.headers },
    ...options,
  })
  let payload = null
  try { payload = await response.json() } catch {}
  if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status}).`)
  return payload
}

export function getRemoteContent() {
  return apiRequest('/content')
}

export function saveRemoteContent(document) {
  return apiRequest('/content', { method: 'PUT', body: JSON.stringify(document) })
}