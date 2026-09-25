import { randomBytes } from 'node:crypto'
import { body, send, validText } from '../api-utils/http.js'
import { readMessages, saveMessages } from '../api-utils/storage.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') return send(response, 405, { error: 'Method not allowed.' })
  try {
    const input = await body(request)
    const firstName = String(input.firstName || '').trim()
    const lastName = String(input.lastName || '').trim()
    const email = String(input.email || '').trim()
    const message = String(input.message || '').trim()
    if (!validText(firstName, 100) || !validText(lastName, 100) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !validText(message, 5000)) return send(response, 400, { error: 'Please enter your name, a valid email, and a message.' })
    const messages = await readMessages()
    messages.unshift({ id: randomBytes(12).toString('hex'), name: `${firstName} ${lastName}`.trim(), email, phone: String(input.phone || '').slice(0, 40), message, createdAt: new Date().toISOString() })
    await saveMessages(messages.slice(0, 500))
    return send(response, 201, { ok: true })
  } catch (error) {
    console.error('Could not save contact message:', error)
    return send(response, 503, { error: error instanceof Error ? error.message : 'Message could not be sent.' })
  }
}
