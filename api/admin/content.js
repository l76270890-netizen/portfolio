import { isAuthenticated } from '../../api-utils/auth.js'
import { body, send, validContent } from '../../api-utils/http.js'
import { readContent, saveContent } from '../../api-utils/storage.js'

export default async function handler(request, response) {
  if (!isAuthenticated(request)) return send(response, 401, { error: 'Please sign in again.' })
  try {
    if (request.method === 'GET') return send(response, 200, await readContent())
    if (request.method === 'PUT') {
      const content = await body(request)
      if (!validContent(content)) return send(response, 400, { error: 'The portfolio content is incomplete.' })
      await saveContent(content)
      return send(response, 200, content)
    }
    return send(response, 405, { error: 'Method not allowed.' })
  } catch (error) {
    console.error('Could not update portfolio content:', error)
    return send(response, 503, { error: error instanceof Error ? error.message : 'Could not update portfolio content.' })
  }
}
