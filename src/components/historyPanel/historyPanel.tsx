import { useStoryStore } from '@/store/useStoryStore'

const HistoryPanel = () => {
  const history = useStoryStore((state) => state.history)
  const selectStory = useStoryStore((state) => state.selectStory)

  if (!history.length) {
    return (
      <div className="rounded-3xl border-4 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 p-6 text-center shadow-inner dark:border-purple-700 dark:bg-purple-900/10">
        <div className="text-5xl mb-3">📚</div>
        <p className="text-base font-bold text-purple-700 dark:text-purple-300">
          Your story history will appear here as you create adventures!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
        📖 Recent Tales
      </p>
      <div className="space-y-3">
        {history.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => selectStory(story.id)}
            className="flex w-full items-center justify-between gap-4 rounded-3xl border-3 border-sky-200 bg-gradient-to-r from-white to-sky-50 px-6 py-4 text-left shadow-md transition-all hover:scale-102 hover:border-sky-300 hover:shadow-xl dark:border-sky-800 dark:from-slate-900 dark:to-sky-900/30 dark:hover:border-sky-700"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">📕</div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{story.title}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {new Date(story.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-purple-300 to-pink-300 px-4 py-2 text-sm font-bold text-purple-900 shadow-sm dark:from-purple-600 dark:to-pink-600 dark:text-white">
              👁️ View
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default HistoryPanel
