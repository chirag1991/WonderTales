import { create } from 'zustand'
import type { Story, StoryFormData } from '../types/story'
import { generateStoryFromApi } from '../utils/storyGenerator'

export type ThemeMode = 'light' | 'dark'

interface StoryState {
  formData: StoryFormData
  story: Story | null
  history: Story[]
  isLoading: boolean
  lastRequestAt: number | null
  cooldownUntil: number | null
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
    lastRequestAt: null,
    cooldownUntil: null,
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
      const { formData, isLoading, lastRequestAt, cooldownUntil } = get()
      if (!formData.characterName.trim()) {
        set({ error: 'Please add a character name to begin the story.' })
        return
      }

      if (isLoading) {
        return
      }

      const now = Date.now()
      if (cooldownUntil && now < cooldownUntil) {
        const remainingSeconds = Math.ceil((cooldownUntil - now) / 1000)
        set({
          error: `Rate limit reached, try again in ${remainingSeconds} seconds`,
        })
        return
      }
      if (lastRequestAt && now - lastRequestAt < 20000) {
        set({
          error: 'Please wait a few seconds before creating another story.',
        })
        return
      }

      set({ isLoading: true, error: null, lastRequestAt: now })
      try {
        const story = await generateStoryFromApi(formData)
        set((state) => ({
          story,
          history: [story, ...state.history].slice(0, 8),
        }))
      } catch (error) {
        const retryAfterSeconds =
          typeof (error as Error & { retryAfterSeconds?: number })
            .retryAfterSeconds === 'number'
            ? (error as Error & { retryAfterSeconds?: number }).retryAfterSeconds
            : undefined

        if (retryAfterSeconds && retryAfterSeconds > 0) {
          const nextCooldownUntil = Date.now() + retryAfterSeconds * 1000
          set({
            cooldownUntil: nextCooldownUntil,
            error: `Rate limit reached, try again in ${retryAfterSeconds} seconds`,
          })
          return
        }
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
