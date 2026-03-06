import type { Story, StoryFormData } from '@/types/story'
import { invokeGenerateStory } from '@/apiLogic/storyApi'

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `story-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

export const generateStoryFromApi = async (
  formData: StoryFormData,
): Promise<Story> => {
  try {
    const data = await invokeGenerateStory(formData)

    return {
      id: createId(),
      title: data.title,
      content: data.story,
      moral: data.moral,
      createdAt: new Date().toISOString(),
      formData,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      const err = error as Error & { retryAfterSeconds?: number }
      if (typeof err.retryAfterSeconds === 'number') {
        const rateLimitError = new Error(err.message) as Error & {
          retryAfterSeconds?: number
        }
        rateLimitError.retryAfterSeconds = err.retryAfterSeconds
        throw rateLimitError
      }
    }

    throw error
  }
}
