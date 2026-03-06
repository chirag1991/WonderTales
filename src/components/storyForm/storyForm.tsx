import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadArea from '@/components/uploadArea/uploadArea'
import { useStoryStore } from '@/store/useStoryStore'
import { pickRandom } from '@/utils/storyTransforms'

const ageRanges = ['3-5', '6-8', '9-12', '13+'] as const
const storyLengths = ['short', 'medium', 'long'] as const
const genres = ['Fantasy', 'Adventure', 'Mystery', 'Slice of Life', 'Sci-Fi']
const settings = [
  'a floating lantern festival',
  'a whispering library',
  'a moonlit forest trail',
  'a coastal village',
  'a cloud-top playground',
]
const themes = ['Friendship', 'Courage', 'Curiosity', 'Kindness', 'Perseverance']
const morals = [
  'Helping others makes your own light brighter',
  'Curiosity opens doors to new friends',
  'Bravery can be gentle and kind',
  'Patience makes big dreams possible',
  'Sharing joy multiplies it',
]
const tones = ['gentle', 'adventurous', 'silly', 'mystery'] as const
const readingLevels = ['early', 'intermediate', 'advanced'] as const

const StoryForm = () => {
  const formData = useStoryStore((state) => state.formData)
  const updateForm = useStoryStore((state) => state.updateForm)
  const setImage = useStoryStore((state) => state.setImage)
  const generateStory = useStoryStore((state) => state.generateStory)
  const isLoading = useStoryStore((state) => state.isLoading)
  const cooldownUntil = useStoryStore((state) => state.cooldownUntil)
  const isOnline = useStoryStore((state) => state.isOnline)
  const story = useStoryStore((state) => state.story)
  const error = useStoryStore((state) => state.error)
  const clearError = useStoryStore((state) => state.clearError)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [shouldNavigate, setShouldNavigate] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownSeconds(0)
      return
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
      setCooldownSeconds(remaining)
    }

    updateCountdown()
    const interval = window.setInterval(updateCountdown, 500)

    return () => window.clearInterval(interval)
  }, [cooldownUntil])

  useEffect(() => {
    if (!shouldNavigate || isLoading) {
      return
    }

    if (story) {
      navigate('/story')
      setShouldNavigate(false)
      return
    }

    if (error) {
      setShouldNavigate(false)
    }
  }, [error, isLoading, navigate, shouldNavigate, story])

  const handleSurprise = () => {
    updateForm({
      ageRange: pickRandom([...ageRanges]),
      storyLength: pickRandom([...storyLengths]),
      genre: pickRandom(genres),
      setting: pickRandom(settings),
      theme: pickRandom(themes),
      moral: pickRandom(morals),
      tone: pickRandom([...tones]),
      readingLevel: pickRandom([...readingLevels]),
    })
    clearError()
  }

  return (
    <section className="w-full space-y-6">
      {/* Main Card - shadcn inspired */}
      <div className="relative overflow-hidden rounded-3xl border bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900 lg:p-10">
        {/* Decorative background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20" />
        
        {/* Content */}
        <div className="relative z-10 space-y-8">
          {/* Offline Notice */}
          {!isOnline && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
              <span className="text-xl">🌐</span>
              <span>You're offline — you can read saved stories, but can't generate new ones.</span>
            </div>
          )}

          {/* Header Section */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <h2 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight lg:text-4xl">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-rose-400">
                  🎨 Story Ingredients
                </span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                Mix and match to craft your next magical adventure!
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleSurprise}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 px-6 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-amber-500 hover:to-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:from-amber-500 dark:to-orange-500 sm:self-start"
            >
              <span className="text-lg">🎲</span>
              <span>Surprise Me!</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">✨</span>
            </div>
          </div>

          <form
            className="space-y-8"
            onSubmit={(event) => {
              event.preventDefault()
              setShouldNavigate(true)
              generateStory()
            }}
          >
          {/* Character Name - Featured Field */}
          <div className="space-y-4 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-6 dark:border-purple-900/50 dark:from-purple-950/30 dark:to-pink-950/30">
            <label className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                <span className="text-lg">✨</span>
                <span>Character Name *</span>
              </div>
              <input
                value={formData.characterName}
                onChange={(event) => {
                  updateForm({ characterName: event.target.value })
                  if (error) {
                    clearError()
                  }
                }}
                className="flex h-11 w-full rounded-lg border border-purple-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-400 hover:border-purple-400 focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-800 dark:bg-slate-950 dark:text-white dark:hover:border-purple-700 dark:focus-visible:border-purple-600 dark:focus-visible:ring-purple-600"
                placeholder="Luna, Milo, or any hero you love..."
                required
              />
              <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>💡</span>
                <span>Use your child's name or their favorite hero</span>
              </p>
            </label>
          </div>

          {/* Story Details */}
          <div className="space-y-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              <span className="text-xl">⚙️</span>
              <span>Story Details</span>
            </h3>
            
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <label className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span>🎂</span>
                  <span>Age Range</span>
                </div>
                <select
                  value={formData.ageRange}
                  onChange={(event) => updateForm({ ageRange: event.target.value as typeof formData.ageRange })}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-purple-600 dark:focus:ring-purple-600"
                >
                  {ageRanges.map((range) => (
                    <option key={range} value={range}>
                      {range} years old
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span>📏</span>
                  <span>Story Length</span>
                </div>
                <select
                  value={formData.storyLength}
                  onChange={(event) =>
                    updateForm({
                      storyLength: event.target.value as typeof formData.storyLength,
                    })
                  }
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-purple-600 dark:focus:ring-purple-600 capitalize"
                >
                  {storyLengths.map((length) => (
                    <option key={length} value={length} className="capitalize">
                      {length}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span>📚</span>
                  <span>Reading Level</span>
                </div>
                <select
                  value={formData.readingLevel}
                  onChange={(event) =>
                    updateForm({
                      readingLevel: event.target.value as typeof formData.readingLevel,
                    })
                  }
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-purple-600 dark:focus:ring-purple-600 capitalize"
                >
                  {readingLevels.map((level) => (
                    <option key={level} value={level} className="capitalize">
                      {level}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Story Elements */}
          <div className="space-y-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
              <span className="text-xl">🌟</span>
              <span>Story Elements</span>
            </h3>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span>🎭</span>
                  <span>Genre</span>
                </div>
                <select
                  value={formData.genre}
                  onChange={(event) => updateForm({ genre: event.target.value })}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-purple-600 dark:focus:ring-purple-600"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span>🌍</span>
                  <span>Setting</span>
                </div>
                <select
                  value={formData.setting}
                  onChange={(event) => updateForm({ setting: event.target.value })}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-purple-600 dark:focus:ring-purple-600"
                >
                  {settings.map((setting) => (
                    <option key={setting} value={setting}>
                      {setting}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span>💫</span>
                  <span>Theme</span>
                </div>
                <select
                  value={formData.theme}
                  onChange={(event) => updateForm({ theme: event.target.value })}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-purple-600 dark:focus:ring-purple-600"
                >
                  {themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span>🎵</span>
                  <span>Tone</span>
                </div>
                <select
                  value={formData.tone}
                  onChange={(event) => updateForm({ tone: event.target.value as typeof formData.tone })}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-purple-600 dark:focus:ring-purple-600 capitalize"
                >
                  {tones.map((tone) => (
                    <option key={tone} value={tone} className="capitalize">
                      {tone}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 sm:col-span-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                  <span>💡</span>
                  <span>Moral</span>
                </div>
                <select
                  value={formData.moral}
                  onChange={(event) => updateForm({ moral: event.target.value })}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-purple-600 dark:focus:ring-purple-600"
                >
                  {morals.map((moral) => (
                    <option key={moral} value={moral}>
                      {moral}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Optional Image Upload */}
          <div className="space-y-4 rounded-2xl border border-dashed border-blue-300 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-6 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-purple-950/30">
            <div className="flex items-start gap-2.5">
              <span className="text-2xl">🖼️</span>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Optional Image Upload
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add a picture to inspire the story's visual details and mood
                </p>
              </div>
            </div>
            <UploadArea
              imageDataUrl={formData.imageDataUrl}
              onImageChange={(imageDataUrl) => setImage(imageDataUrl)}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col gap-4 pt-2">
            <button
              type="submit"
              disabled={isLoading || cooldownSeconds > 0 || !isOnline}
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-8 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:from-slate-400 disabled:via-slate-500 disabled:to-slate-600 dark:from-purple-500 dark:via-fuchsia-500 dark:to-pink-500 lg:h-16 lg:text-lg"
              title={!isOnline ? 'Go online to generate a new story.' : undefined}
            >
              {isLoading && (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-white/30 border-t-white lg:h-6 lg:w-6" />
              )}
              <span>
                {isLoading
                  ? '✨ Creating Your Story...'
                  : cooldownSeconds > 0
                    ? `⏳ Try Again in ${cooldownSeconds}s`
                    : !isOnline
                      ? '🌐 Offline'
                      : '🚀 Create My Story!'}
              </span>
            </button>
            
            {!isOnline && (
              <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
                <span>🌐</span>
                <span>Connect to the internet to generate a new story</span>
              </p>
            )}
          </div>
        </form>
        </div>
      </div>
    </section>
  )
}

export default StoryForm
