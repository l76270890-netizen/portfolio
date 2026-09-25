import { get } from '@vercel/blob'

export default async function handler(request, response) {
  if (request.method !== 'GET') { response.writeHead(405); response.end('Method not allowed.'); return }
  try {
    const name = new URL(request.url, `https://${request.headers.host}`).searchParams.get('name') || ''
    if (!/^uploads\/[A-Za-z0-9._-]+$/.test(name)) { response.writeHead(400); response.end('Invalid asset path.'); return }
    const blob = await get(name, { access: 'private' })
    if (!blob || blob.statusCode !== 200 || !blob.stream) { response.writeHead(404); response.end('Image not found.'); return }
    const data = Buffer.from(await new Response(blob.stream).arrayBuffer())
    response.writeHead(200, { 'Content-Type': blob.blob.contentType || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable' })
    response.end(data)
  } catch (error) {
    console.error('Could not load image:', error)
    response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Image storage is not configured.')
  }
}
