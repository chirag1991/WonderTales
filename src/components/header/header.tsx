import { useStoryStore } from '@/store/useStoryStore'

const Header = () => {
  const theme = useStoryStore((state) => state.theme)
  const toggleTheme = useStoryStore((state) => state.toggleTheme)

  return (
    <header className="border-b border-slate-200/70 bg-white/70 px-4 py-6 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            WonderTales ✨
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Where every story begins with wonder
          </p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"
        >
          <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </header>
  )
}

export default Header
