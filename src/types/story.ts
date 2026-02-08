export type AgeRange = '3-5' | '6-8' | '9-12' | '13+'
export type StoryLength = 'short' | 'medium' | 'long'
export type StoryTone = 'gentle' | 'adventurous' | 'silly' | 'mystery'
export type ReadingLevel = 'early' | 'intermediate' | 'advanced'

export interface StoryFormData {
  characterName: string
  ageRange: AgeRange
  storyLength: StoryLength
  genre: string
  setting: string
  theme: string
  moral: string
  tone: StoryTone
  readingLevel: ReadingLevel
  imageDataUrl?: string
}

export interface Story {
  id: string
  title: string
  content: string
  moral: string
  createdAt: string
  formData: StoryFormData
}
