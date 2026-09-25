import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

const tokenDuration = 12 * 60 * 60 * 1000

function sign(value) {
  return createHmac('sha256', process.env.ADMIN_PASSWORD || '').update(value).digest('base64url')
}

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD
  if (typeof password !== 'string' || !expected) return false
  const suppliedHash = createHmac('sha256', 'portfolio-admin-check').update(password).digest()
  const expectedHash = createHmac('sha256', 'portfolio-admin-check').update(expected).digest()
  return timingSafeEqual(suppliedHash, expectedHash)
}

export function createToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + tokenDuration, nonce: randomBytes(16).toString('hex') })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export function isAuthenticated(request) {
  const token = request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  const expected = Buffer.from(sign(payload))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).exp > Date.now() } catch { return false }
}
