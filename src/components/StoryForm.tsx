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
  const error = useStoryStore((state) => state.error)
  const clearError = useStoryStore((state) => state.clearError)

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
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Story ingredients
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mix and match to craft your next adventure.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSurprise}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            Surprise me
          </button>
        </div>

        <form
          className="mt-6 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            generateStory()
          }}
        >
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200 sm:col-span-2">
            Character name *
            <input
              value={formData.characterName}
              onChange={(event) => {
                updateForm({ characterName: event.target.value })
                if (error) {
                  clearError()
                }
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Luna, Milo, or any hero"
              required
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Age range
            <select
              value={formData.ageRange}
              onChange={(event) => updateForm({ ageRange: event.target.value as typeof formData.ageRange })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {ageRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Story length
            <select
              value={formData.storyLength}
              onChange={(event) =>
                updateForm({
                  storyLength: event.target.value as typeof formData.storyLength,
                })
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {storyLengths.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Genre
            <select
              value={formData.genre}
              onChange={(event) => updateForm({ genre: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Setting
            <select
              value={formData.setting}
              onChange={(event) => updateForm({ setting: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {settings.map((setting) => (
                <option key={setting} value={setting}>
                  {setting}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Theme
            <select
              value={formData.theme}
              onChange={(event) => updateForm({ theme: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Moral
            <select
              value={formData.moral}
              onChange={(event) => updateForm({ moral: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {morals.map((moral) => (
                <option key={moral} value={moral}>
                  {moral}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Tone
            <select
              value={formData.tone}
              onChange={(event) => updateForm({ tone: event.target.value as typeof formData.tone })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Reading level
            <select
              value={formData.readingLevel}
              onChange={(event) =>
                updateForm({
                  readingLevel: event.target.value as typeof formData.readingLevel,
                })
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {readingLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Optional image upload
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
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
                disabled={isLoading}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-white dark:text-slate-900"
              >
                {isLoading ? 'Creating story...' : 'Create story'}
              </button>
              <button
                type="button"
                onClick={handleSurprise}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
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
