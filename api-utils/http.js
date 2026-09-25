export function send(response, status, value, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers })
  response.end(JSON.stringify(value))
}

export function body(request) {
  if (request.body && typeof request.body === 'object') return Promise.resolve(request.body)
  return new Promise((resolve, reject) => {
    let input = ''
    request.on('data', (chunk) => { input += chunk })
    request.on('end', () => {
      try { resolve(JSON.parse(input || '{}')) } catch { reject(new Error('Invalid JSON body.')) }
    })
    request.on('error', reject)
  })
}

export function validText(value, max = 5000) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max
}

export function validContent(value) {
  return value && ['navigation', 'hero', 'about', 'services', 'skills', 'projects', 'contact'].every((key) => value[key] && typeof value[key] === 'object')
}
