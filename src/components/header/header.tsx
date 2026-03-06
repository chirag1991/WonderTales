import { useStoryStore } from '@/store/useStoryStore'

const Header = () => {
  const theme = useStoryStore((state) => state.theme)
  const toggleTheme = useStoryStore((state) => state.toggleTheme)

  return (
    <header className="relative overflow-hidden border-b border-purple-200/40 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/70">
      {/* Decorative floating elements - light mode only */}
      <div className="pointer-events-none absolute inset-0 dark:hidden">
        {/* Sparkles */}
        <span className="absolute left-[15%] top-6 text-2xl animate-pulse" style={{ animationDelay: '0s' }}>✨</span>
        <span className="absolute right-[20%] top-4 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</span>
        <span className="absolute left-[65%] top-8 text-lg animate-pulse" style={{ animationDelay: '1s' }}>💫</span>
        <span className="absolute right-[10%] bottom-4 text-sm animate-pulse" style={{ animationDelay: '1.5s' }}>✨</span>
        <span className="absolute left-[40%] bottom-6 text-base animate-pulse" style={{ animationDelay: '0.7s' }}>⭐</span>
        
        {/* Soft rainbow glow */}
        <div className="absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-gradient-to-br from-yellow-200/30 via-pink-200/30 to-purple-200/30 blur-3xl" />
        <div className="absolute -bottom-10 right-1/4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200/30 via-purple-200/30 to-pink-200/30 blur-2xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Logo section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {/* Book icon decoration */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-300 to-rose-300 shadow-lg dark:from-amber-500 dark:via-orange-500 dark:to-rose-500">
              <span className="text-3xl">📖</span>
            </div>
            
            <div>
              <h1 className="flex items-center text-4xl font-black tracking-tight">
                <span className="relative">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-rose-400">
                    WonderTales
                  </span>
                  {/* Magic underline */}
                  <span className="absolute -bottom-1 left-0 h-1 w-full bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 rounded-full dark:from-amber-500 dark:via-pink-500 dark:to-purple-500" />
                </span>
              </h1>
              <p className="mt-1.5 text-sm font-bold text-purple-600/90 dark:text-purple-300/80">
                ✨ Where every story begins with wonder
              </p>
            </div>
          </div>
        </div>

        {/* Theme toggle button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border-3 border-amber-300/50 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 px-7 py-4 text-base font-black text-amber-900 shadow-xl transition-all hover:scale-110 hover:shadow-2xl active:scale-95 dark:border-slate-700 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 dark:text-amber-400"
        >
          {/* Button glow effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {theme === 'dark' ? (
            <>
              <span className="relative text-2xl">☀️</span>
              <span className="relative">Light Mode</span>
            </>
          ) : (
            <>
              <span className="relative text-2xl">🌙</span>
              <span className="relative">Night Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}

export default Header
