import type { StoryFormData } from '@/types/story'
import axiosClient from '@/api/axiosClient'
import API_URLS from '@/api/apiUrls'

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
  try {
    const response = await axiosClient.post(API_URLS.story, formData)
    const result = response.data as GenerateStoryResponse

    if (!result?.title || !result?.story || !result?.moral) {
      throw new Error(
        result
          ? 'Story response was missing required fields.'
          : 'Empty response from story generation.',
      )
    }

    return result
  } catch (error: any) {
    const message = error.response?.data?.error || error.message || 'Story request failed'
    const retryAfterSeconds = error.response?.data?.retryAfterSeconds

    const err = new Error(message) as Error & { retryAfterSeconds?: number }
    if (typeof retryAfterSeconds === 'number') {
      err.retryAfterSeconds = retryAfterSeconds
    }
    throw err
  }
}
