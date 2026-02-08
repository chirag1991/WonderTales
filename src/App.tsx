import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Stepper from './components/Stepper'
import IngredientsPage from './pages/IngredientsPage'
import StoryPage from './pages/StoryPage'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isStoryStep = location.pathname.startsWith('/story')

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-amber-200/70 via-pink-200/60 to-sky-200/60 blur-3xl dark:from-amber-400/10 dark:via-fuchsia-400/10 dark:to-sky-400/10" />
        <div className="absolute -bottom-28 left-0 h-80 w-80 rounded-full bg-gradient-to-br from-sky-200/60 via-emerald-200/50 to-amber-200/60 blur-3xl dark:from-indigo-400/10 dark:via-emerald-400/10 dark:to-amber-400/10" />
      </div>

      <div className="relative">
        <Header />
        <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur md:static dark:border-slate-800/80 dark:bg-slate-950/70">
          <Stepper />
        </div>

        <main
          key={location.pathname}
          className="wt-page mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6"
        >
          {isStoryStep && (
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => navigate('/ingredients')}
                className="wt-button-secondary min-h-[56px] px-6 text-base"
              >
                Back to Ingredients
              </button>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/ingredients" replace />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/story" element={<StoryPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
