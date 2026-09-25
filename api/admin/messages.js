import { isAuthenticated } from '../../api-utils/auth.js'
import { send } from '../../api-utils/http.js'
import { readMessages } from '../../api-utils/storage.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') return send(response, 405, { error: 'Method not allowed.' })
  if (!isAuthenticated(request)) return send(response, 401, { error: 'Please sign in again.' })
  try { return send(response, 200, await readMessages()) }
  catch (error) {
    console.error('Could not load messages:', error)
    return send(response, 503, { error: 'Could not load messages.' })
  }
}
