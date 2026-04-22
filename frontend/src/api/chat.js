const API_URL = 'http://localhost:8000/chat'

/**
 * Sends a user message (and optional image) to the backend.
 * @param {Object} params
 * @param {string} params.sessionId
 * @param {string} params.message
 * @param {number} params.temperature
 * @param {string} params.verbosity
 * @param {string|null} params.imageBase64
 * @param {string|null} params.imageType
 * @returns {Promise<string>}
 */
export async function sendMessage({ sessionId, message, temperature, verbosity, imageBase64, imageType }) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      message,
      temperature,
      verbosity,
      image_base64: imageBase64 || null,
      image_type: imageType || null,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Chef Marco is unavailable. Is the backend running?')
  }

  const data = await response.json()
  return data.reply
}
