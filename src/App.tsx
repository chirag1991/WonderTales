import Header from './components/Header'
import StoryForm from './components/StoryForm'
import StoryOutput from './components/StoryOutput'

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-amber-200/70 via-pink-200/60 to-sky-200/60 blur-3xl dark:from-amber-400/10 dark:via-fuchsia-400/10 dark:to-sky-400/10" />
        <div className="absolute -bottom-28 left-0 h-80 w-80 rounded-full bg-gradient-to-br from-sky-200/60 via-emerald-200/50 to-amber-200/60 blur-3xl dark:from-indigo-400/10 dark:via-emerald-400/10 dark:to-amber-400/10" />
      </div>

      <div className="relative">
        <Header />

        <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          <StoryForm />
          <StoryOutput />
        </main>
      </div>
    </div>
  )
}

export default App
