import type { Story, StoryFormData } from '../types/story'

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `story-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

export const generateStoryFromApi = async (
  formData: StoryFormData,
): Promise<Story> => {
  const response = await fetch('http://localhost:3001/api/story', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    if (response.status === 429) {
      let retryAfterSeconds: number | undefined
      let message = 'Rate limit reached.'

      try {
        const body = (await response.json()) as {
          retryAfterSeconds?: number
          retry_after_seconds?: number
          error?: string
          details?: string
        }
        retryAfterSeconds =
          body.retryAfterSeconds ?? body.retry_after_seconds ?? undefined
        message = body.error || body.details || message
      } catch (parseError) {
        // Ignore parse errors and fall back to a generic rate limit message.
      }

      const rateLimitError = new Error(message)
      ;(rateLimitError as Error & { retryAfterSeconds?: number }).retryAfterSeconds =
        retryAfterSeconds
      throw rateLimitError
    }

    const detail = await response.text()
    throw new Error(
      detail
        ? `Story request failed: ${response.status} ${detail}`
        : `Story request failed: ${response.status}`,
    )
  }

  const data = (await response.json()) as {
    title: string
    story: string
    moral: string
  }

  if (!data?.title || !data?.story || !data?.moral) {
    throw new Error('Story response was missing required fields.')
  }

  return {
    id: createId(),
    title: data.title,
    content: data.story,
    moral: data.moral,
    createdAt: new Date().toISOString(),
    formData,
  }
}
