import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadArea from './UploadArea'
import { useStoryStore } from '../store/useStoryStore'
import { pickRandom } from '../utils/storyTransforms'

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
    <section className="space-y-6">
      <div className="wt-card space-y-6">
        {!isOnline && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
            You're offline — you can read saved stories, but can't generate new ones.
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              Story ingredients
            </p>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Mix and match to craft your next adventure.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSurprise}
            className="wt-button-secondary"
          >
            Surprise me
          </button>
        </div>

        <form
          className="grid gap-5 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            setShouldNavigate(true)
            generateStory()
          }}
        >
          <label className="wt-label space-y-2 sm:col-span-2">
            Character name *
            <input
              value={formData.characterName}
              onChange={(event) => {
                updateForm({ characterName: event.target.value })
                if (error) {
                  clearError()
                }
              }}
              className="wt-input"
              placeholder="Luna, Milo, or any hero"
              required
            />
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              Use your child’s name or their favorite hero.
            </span>
          </label>

          <label className="wt-label space-y-2">
            Age range
            <select
              value={formData.ageRange}
              onChange={(event) => updateForm({ ageRange: event.target.value as typeof formData.ageRange })}
              className="wt-input"
            >
              {ageRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </label>

          <label className="wt-label space-y-2">
            Story length
            <select
              value={formData.storyLength}
              onChange={(event) =>
                updateForm({
                  storyLength: event.target.value as typeof formData.storyLength,
                })
              }
              className="wt-input"
            >
              {storyLengths.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </select>
          </label>

          <label className="wt-label space-y-2">
            Genre
            <select
              value={formData.genre}
              onChange={(event) => updateForm({ genre: event.target.value })}
              className="wt-input"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>

          <label className="wt-label space-y-2">
            Setting
            <select
              value={formData.setting}
              onChange={(event) => updateForm({ setting: event.target.value })}
              className="wt-input"
            >
              {settings.map((setting) => (
                <option key={setting} value={setting}>
                  {setting}
                </option>
              ))}
            </select>
          </label>

          <label className="wt-label space-y-2">
            Theme
            <select
              value={formData.theme}
              onChange={(event) => updateForm({ theme: event.target.value })}
              className="wt-input"
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </label>

          <label className="wt-label space-y-2">
            Moral
            <select
              value={formData.moral}
              onChange={(event) => updateForm({ moral: event.target.value })}
              className="wt-input"
            >
              {morals.map((moral) => (
                <option key={moral} value={moral}>
                  {moral}
                </option>
              ))}
            </select>
          </label>

          <label className="wt-label space-y-2">
            Tone
            <select
              value={formData.tone}
              onChange={(event) => updateForm({ tone: event.target.value as typeof formData.tone })}
              className="wt-input"
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </label>

          <label className="wt-label space-y-2">
            Reading level
            <select
              value={formData.readingLevel}
              onChange={(event) =>
                updateForm({
                  readingLevel: event.target.value as typeof formData.readingLevel,
                })
              }
              className="wt-input"
            >
              {readingLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <div className="sm:col-span-2 space-y-2">
            <p className="wt-label">
              Optional image upload
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Add a picture to inspire story details.
            </p>
            <div className="mt-3">
              <UploadArea
                imageDataUrl={formData.imageDataUrl}
                onImageChange={(imageDataUrl) => setImage(imageDataUrl)}
              />
            </div>
          </div>

          {error && (
            <div className="sm:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}

          <div className="sm:col-span-2">
            <div className="sticky bottom-0 -mx-6 mt-4 flex flex-col gap-3 border-t border-slate-200 bg-white/90 px-6 py-4 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 dark:border-slate-800 dark:bg-slate-950/80">
              <button
                type="submit"
                disabled={isLoading || cooldownSeconds > 0 || !isOnline}
                className="wt-button-primary"
                title={!isOnline ? 'Go online to generate a new story.' : undefined}
              >
                {isLoading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-slate-300/40 dark:border-t-slate-900" />
                )}
                {isLoading
                  ? 'Creating story...'
                  : cooldownSeconds > 0
                    ? `Try again in ${cooldownSeconds}s`
                    : !isOnline
                      ? 'Offline'
                      : 'Create story'}
              </button>
              {!isOnline && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Connect to the internet to generate a new story.
                </p>
              )}
              <button
                type="button"
                onClick={handleSurprise}
                className="wt-button-secondary"
              >
                Surprise me again
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default StoryForm
