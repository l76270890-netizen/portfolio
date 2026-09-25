import { get, put } from '@vercel/blob'
import defaultContent from '../server/default-content.json' with { type: 'json' }

const contentPath = 'portfolio/content.json'
const messagesPath = 'portfolio/messages.json'

export function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

async function readJson(path, fallback) {
  if (!hasBlobStorage()) return fallback
  const blob = await get(path, { access: 'private' })
  if (!blob || blob.statusCode !== 200 || !blob.stream) return fallback
  return JSON.parse(await new Response(blob.stream).text())
}

async function writeJson(path, value) {
  if (!hasBlobStorage()) throw new Error('Connect a Vercel Blob store to enable saving.')
  await put(path, JSON.stringify(value), {
    access: 'private',
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: 'application/json; charset=utf-8',
    cacheControlMaxAge: 60,
  })
}

export async function readContent() {
  return { ...defaultContent, ...(await readJson(contentPath, defaultContent)) }
}

export async function saveContent(content) {
  await writeJson(contentPath, content)
}

export async function readMessages() {
  return readJson(messagesPath, [])
}

export async function saveMessages(messages) {
  await writeJson(messagesPath, messages)
}

export { defaultContent }
