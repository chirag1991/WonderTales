import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/header/header'
import Stepper from '@/components/stepper/stepper'

const MainLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isStoryStep = location.pathname.startsWith('/story')

  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="sticky top-0 z-20 border-b bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-center">
          <Stepper />
        </div>
      </div>

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-16 pt-8 sm:px-6">
        {isStoryStep && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => navigate('/ingredients')}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <span>←</span>
              <span>Back to Ingredients</span>
            </button>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
