import { readContent } from '../api-utils/storage.js'
import { send } from '../api-utils/http.js'

export default async function handler(_request, response) {
  try {
    return send(response, 200, await readContent(), { 'Cache-Control': 'public, max-age=0, must-revalidate' })
  } catch (error) {
    console.error('Could not load portfolio content:', error)
    return send(response, 500, { error: 'Could not load portfolio content.' })
  }
}
