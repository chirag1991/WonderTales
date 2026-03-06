import { useStoryStore } from '@/store/useStoryStore'

const HistoryPanel = () => {
  const history = useStoryStore((state) => state.history)
  const selectStory = useStoryStore((state) => state.selectStory)

  if (!history.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/40 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
        Your story history will appear here as you create adventures.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Recent tales
      </p>
      <div className="space-y-2">
        {history.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => selectStory(story.id)}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
          >
            <div>
              <p className="font-semibold">{story.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(story.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">View</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default HistoryPanel
