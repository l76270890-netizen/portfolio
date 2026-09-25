import { createToken, verifyPassword } from '../../api-utils/auth.js'
import { body, send, validText } from '../../api-utils/http.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') return send(response, 405, { error: 'Method not allowed.' })
  try {
    const { password } = await body(request)
    if (!validText(password, 256) || !verifyPassword(password)) return send(response, 401, { error: 'The password is incorrect.' })
    return send(response, 200, { token: createToken() })
  } catch (error) {
    return send(response, 400, { error: error instanceof Error ? error.message : 'Login failed.' })
  }
}
