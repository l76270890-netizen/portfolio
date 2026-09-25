import { put } from '@vercel/blob'
import { randomBytes } from 'node:crypto'
import { isAuthenticated } from '../../api-utils/auth.js'
import { body, send, validText } from '../../api-utils/http.js'

const imageTypes = new Map([
  ['.png', { type: 'image/png', signature: [0x89, 0x50, 0x4e, 0x47] }],
  ['.jpg', { type: 'image/jpeg', signature: [0xff, 0xd8, 0xff] }],
  ['.jpeg', { type: 'image/jpeg', signature: [0xff, 0xd8, 0xff] }],
  ['.webp', { type: 'image/webp', signature: [0x52, 0x49, 0x46, 0x46], tail: [0x57, 0x45, 0x42, 0x50] }],
  ['.gif', { type: 'image/gif', signature: [0x47, 0x49, 0x46, 0x38] }],
])

export default async function handler(request, response) {
  if (request.method !== 'POST') return send(response, 405, { error: 'Method not allowed.' })
  if (!isAuthenticated(request)) return send(response, 401, { error: 'Please sign in again.' })
  try {
    const { filename, data } = await body(request)
    if (!validText(filename, 200) || typeof data !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(data)) return send(response, 400, { error: 'Invalid image upload.' })
    const buffer = Buffer.from(data, 'base64')
    if (!buffer.length || buffer.length > 3 * 1024 * 1024) return send(response, 413, { error: 'Images must be 3 MB or smaller.' })
    const extension = filename.toLowerCase().match(/\.[^.]+$/)?.[0] || ''
    const image = imageTypes.get(extension)
    if (!image || !image.signature.every((byte, index) => buffer[index] === byte) || (image.tail && !image.tail.every((byte, index) => buffer[index + 8] === byte))) return send(response, 400, { error: 'Choose a valid PNG, JPG, WEBP, or GIF image.' })
    const safeName = filename.replace(/[^A-Za-z0-9._-]/g, '-').replace(/\.[^.]+$/, '') || 'image'
    const name = `uploads/${Date.now()}-${randomBytes(6).toString('hex')}-${safeName}${extension === '.jpeg' ? '.jpg' : extension}`
    await put(name, buffer, { access: 'private', contentType: image.type, addRandomSuffix: false })
    return send(response, 201, { url: `/api/assets?name=${encodeURIComponent(name)}` })
  } catch (error) {
    console.error('Could not upload image:', error)
    return send(response, 503, { error: error instanceof Error ? error.message : 'Image upload failed.' })
  }
}
