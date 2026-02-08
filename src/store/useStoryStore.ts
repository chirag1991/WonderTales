import { create } from 'zustand'
import type { Story, StoryFormData } from '../types/story'
import { generateMockStory } from '../utils/storyGenerator'

export type ThemeMode = 'light' | 'dark'

interface StoryState {
  formData: StoryFormData
  story: Story | null
  history: Story[]
  isLoading: boolean
  error: string | null
  theme: ThemeMode
  updateForm: (patch: Partial<StoryFormData>) => void
  setImage: (imageDataUrl?: string) => void
  generateStory: () => Promise<void>
  selectStory: (storyId: string) => void
  clearError: () => void
  toggleTheme: () => void
}

const initialFormData: StoryFormData = {
  characterName: '',
  ageRange: '6-8',
  storyLength: 'medium',
  genre: 'Fantasy',
  setting: 'a floating lantern festival',
  theme: 'Friendship',
  moral: 'Helping others makes your own light brighter',
  tone: 'gentle',
  readingLevel: 'intermediate',
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const applyTheme = (theme: ThemeMode) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export const useStoryStore = create<StoryState>((set, get) => {
  const initialTheme = getInitialTheme()
  applyTheme(initialTheme)

  return {
    formData: initialFormData,
    story: null,
    history: [],
    isLoading: false,
    error: null,
    theme: initialTheme,
    updateForm: (patch) =>
      set((state) => ({
        formData: { ...state.formData, ...patch },
      })),
    setImage: (imageDataUrl) =>
      set((state) => ({
        formData: { ...state.formData, imageDataUrl },
      })),
    generateStory: async () => {
      const { formData } = get()
      if (!formData.characterName.trim()) {
        set({ error: 'Please add a character name to begin the story.' })
        return
      }

      set({ isLoading: true, error: null })
      try {
        await new Promise((resolve) => setTimeout(resolve, 650))
        const story = generateMockStory(formData)
        set((state) => ({
          story,
          history: [story, ...state.history].slice(0, 8),
        }))
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : 'Something went wrong while creating your story.',
        })
      } finally {
        set({ isLoading: false })
      }
    },
    selectStory: (storyId) =>
      set((state) => ({
        story: state.history.find((item) => item.id === storyId) ?? state.story,
      })),
    clearError: () => set({ error: null }),
    toggleTheme: () => {
      const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark'
      applyTheme(nextTheme)
      set({ theme: nextTheme })
    },
  }
})
