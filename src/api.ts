const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export function apiUrl(path: string) {
  return `${apiBaseUrl}${path}`
}

export function contentAssetUrl(path: string) {
  if (apiBaseUrl && path.startsWith('/uploads/')) return `${apiBaseUrl}${path}`
  return path
}
