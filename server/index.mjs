import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const dataDir = join(root, 'server', 'data')
const dataFile = join(dataDir, 'site.json')
const messagesFile = join(dataDir, 'messages.json')
const defaultFile = join(root, 'server', 'default-content.json')
const sessions = new Map()
const loginAttempts = new Map()
const sessionAge = 12 * 60 * 60 * 1000
const port = Number(process.env.PORT || 3001)
const envFile = await readFile(join(root, '.env'), 'utf8').catch(() => '')
for (const line of envFile.split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
  if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
}
const adminPassword = process.env.ADMIN_PASSWORD

function equalSecret(input, expected) {
  const left = createHash('sha256').update(input).digest()
  const right = createHash('sha256').update(expected).digest()
  return timingSafeEqual(left, right)
}
function send(response, status, body, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers })
  response.end(JSON.stringify(body))
}
function readBody(request, limit = 1024 * 1024) {
  return new Promise((resolveBody, reject) => {
    let body = ''
    request.on('data', (chunk) => { body += chunk; if (body.length > limit) { reject(Object.assign(new Error('Request body is too large.'), { status: 413 })); request.destroy() } })
    request.on('end', () => { try { resolveBody(JSON.parse(body || '{}')) } catch { reject(Object.assign(new Error('Invalid JSON body.'), { status: 400 })) } })
    request.on('error', reject)
  })
}
async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')) } catch { return fallback }
}
async function writeJson(file, value) { await mkdir(dataDir, { recursive: true }); await writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8') }
function getSession(request) {
  const bearer = request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  const expires = bearer && sessions.get(bearer)
  if (!expires || expires < Date.now()) { if (bearer) sessions.delete(bearer); return false }
  sessions.set(bearer, Date.now() + sessionAge)
  return true
}
function validContent(value) {
  return value && ['navigation', 'hero', 'about', 'services', 'skills', 'projects', 'contact'].every((key) => value[key] && typeof value[key] === 'object')
}
function validText(value, max = 5000) { return typeof value === 'string' && value.trim().length > 0 && value.length <= max }

async function handle(request, response) {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  try {
    if (request.method === 'GET' && url.pathname === '/api/content') {
      const defaults = await readJson(defaultFile, {})
      const saved = await readJson(dataFile, defaults)
      return send(response, 200, { ...defaults, ...saved }, { 'Cache-Control': 'no-cache' })
    }
    if (request.method === 'POST' && url.pathname === '/api/admin/login') {
      const { password } = await readBody(request)
      const address = request.socket.remoteAddress || 'unknown'
      const attempt = loginAttempts.get(address)
      if (attempt && attempt.count >= 10 && attempt.until > Date.now()) return send(response, 429, { error: 'Too many sign-in attempts. Try again in 15 minutes.' })
      if (!adminPassword || !validText(password, 256) || !equalSecret(password, adminPassword)) {
        const next = !attempt || attempt.until <= Date.now() ? { count: 1, until: Date.now() + 15 * 60 * 1000 } : { ...attempt, count: attempt.count + 1 }
        loginAttempts.set(address, next)
        return send(response, 401, { error: 'The password is incorrect.' })
      }
      loginAttempts.delete(address)
      const token = randomBytes(32).toString('hex')
      sessions.set(token, Date.now() + sessionAge)
      return send(response, 200, { token })
    }
    if (url.pathname.startsWith('/api/admin/') && !getSession(request)) return send(response, 401, { error: 'Please sign in again.' })
    if (request.method === 'GET' && url.pathname === '/api/admin/content') return send(response, 200, await readJson(dataFile, await readJson(defaultFile, {})))
    if (request.method === 'PUT' && url.pathname === '/api/admin/content') {
      const content = await readBody(request, 2 * 1024 * 1024)
      if (!validContent(content)) return send(response, 400, { error: 'The portfolio content is incomplete.' })
      await writeJson(dataFile, content)
      return send(response, 200, content)
    }
    if (request.method === 'POST' && url.pathname === '/api/admin/upload') {
      const { filename, data } = await readBody(request, 7 * 1024 * 1024)
      if (!validText(filename, 200) || typeof data !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(data)) return send(response, 400, { error: 'Invalid image upload.' })
      const buffer = Buffer.from(data, 'base64')
      if (!buffer.length || buffer.length > 5 * 1024 * 1024) return send(response, 413, { error: 'Images must be 5 MB or smaller.' })
      const signatures = [
        { ext: '.png', bytes: [0x89, 0x50, 0x4e, 0x47] }, { ext: '.jpg', bytes: [0xff, 0xd8, 0xff] },
        { ext: '.webp', bytes: [0x52, 0x49, 0x46, 0x46], tail: [0x57, 0x45, 0x42, 0x50] }, { ext: '.gif', bytes: [0x47, 0x49, 0x46, 0x38] },
      ]
      const image = signatures.find(({ bytes, tail }) => bytes.every((byte, index) => buffer[index] === byte) && (!tail || tail.every((byte, index) => buffer[index + 8] === byte)))
      if (!image) return send(response, 400, { error: 'That file is not a supported image.' })
      const uploadsDir = join(root, 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })
      const filenamePart = normalize(filename).split(/[\\/]/).pop().replace(/[^A-Za-z0-9._-]/g, '-').replace(/\.+/g, '.') || 'image'
      const savedName = `${Date.now()}-${randomBytes(4).toString('hex')}-${filenamePart.replace(/\.[^.]+$/, '')}${image.ext}`
      await writeFile(join(uploadsDir, savedName), buffer, { flag: 'wx' })
      return send(response, 201, { url: `/uploads/${savedName}` })
    }
    if (request.method === 'GET' && url.pathname === '/api/admin/messages') {
      const messages = await readJson(messagesFile, [])
      return send(response, 200, messages)
    }
    if (request.method === 'POST' && url.pathname === '/api/contact') {
      const body = await readBody(request, 16000)
      const firstName = String(body.firstName || '').trim()
      const lastName = String(body.lastName || '').trim()
      const email = String(body.email || '').trim()
      const message = String(body.message || '').trim()
      if (!validText(firstName, 100) || !validText(lastName, 100) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !validText(message, 5000)) return send(response, 400, { error: 'Please enter your name, a valid email, and a message.' })
      const messages = await readJson(messagesFile, [])
      messages.unshift({ id: randomBytes(12).toString('hex'), name: `${firstName} ${lastName}`.trim(), email, phone: String(body.phone || '').slice(0, 40), message, createdAt: new Date().toISOString() })
      await writeJson(messagesFile, messages.slice(0, 500))
      return send(response, 201, { ok: true })
    }
    if (url.pathname.startsWith('/api/')) return send(response, 404, { error: 'API route not found.' })
    return await serveStatic(url.pathname, response)
  } catch (error) {
    const status = error.status || 500
    if (status >= 500) console.error(error)
    return send(response, status, { error: status >= 500 ? 'The server could not complete this request.' : error.message })
  }
}

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' }
async function serveStatic(path, response) {
  const distDir = join(root, 'dist')
  const safePath = normalize(decodeURIComponent(path)).replace(/^([/\\]|\.\.[/\\])+/g, '')
  let file = join(distDir, safePath || 'index.html')
  try { if (!(await stat(file)).isFile()) file = join(distDir, 'index.html') } catch { file = join(distDir, 'index.html') }
  try {
    const body = await readFile(file)
    response.writeHead(200, { 'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream' })
    response.end(body)
  } catch { send(response, 503, { error: 'Build the frontend first with npm run build.' }) }
}

if (!process.env.ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD is required. Set it in the project .env file before starting the server.')
  process.exit(1)
}
await mkdir(dataDir, { recursive: true })
if (!(await readJson(dataFile, null))) await writeJson(dataFile, await readJson(defaultFile, {}))
createServer(handle).listen(port, '0.0.0.0', () => console.log(`Portfolio API listening on http://localhost:${port}`))
