import type { StoryFormData } from '@/types/story'
import { supabase } from '@/config/supabase'

export type GenerateStoryResponse = {
  title: string
  story: string
  moral: string
}

export type GenerateStoryError = {
  message: string
  retryAfterSeconds?: number
}

export const invokeGenerateStory = async (
  formData: StoryFormData,
): Promise<GenerateStoryResponse> => {
  const { data, error } = await supabase.functions.invoke('generate-story', {
    body: formData,
  })

  if (error) {
    const message = error.message ?? 'Story request failed'
    const retryAfterSeconds =
      (error as { retryAfterSeconds?: number }).retryAfterSeconds ??
      (error as { retry_after_seconds?: number }).retry_after_seconds

    const err = new Error(message) as Error & { retryAfterSeconds?: number }
    if (typeof retryAfterSeconds === 'number') {
      err.retryAfterSeconds = retryAfterSeconds
    }
    throw err
  }

  const result = data as GenerateStoryResponse | null
  if (!result?.title || !result?.story || !result?.moral) {
    throw new Error(
      result
        ? 'Story response was missing required fields.'
        : 'Empty response from story generation.',
    )
  }

  return result
}
