import { exportStoryToPdf } from '../utils/exporters'
import { useStoryStore } from '../store/useStoryStore'
import HistoryPanel from './HistoryPanel'

const StoryOutput = () => {
  const story = useStoryStore((state) => state.story)
  const isLoading = useStoryStore((state) => state.isLoading)

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Your story
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Read, refine, and export your magical tale.
            </p>
          </div>
          <button
            type="button"
            onClick={() => story && exportStoryToPdf(story)}
            disabled={!story}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            Export PDF
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 space-y-3">
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : story ? (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {story.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Moral: {story.moral}
              </p>
            </div>
            {story.formData.imageDataUrl && (
              <img
                src={story.formData.imageDataUrl}
                alt="Story inspiration"
                className="h-40 w-full rounded-2xl object-cover"
              />
            )}
            <div className="whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200">
              {story.content}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            Fill in the story ingredients and press "Create story" to see the magic.
          </div>
        )}
      </div>

      <HistoryPanel />
    </section>
  )
}

export default StoryOutput
