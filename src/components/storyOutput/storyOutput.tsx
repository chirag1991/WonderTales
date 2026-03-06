import { useEffect, useMemo, useState } from 'react'
import { exportStoryToPdf } from '@/utils/exporters'
import { useStoryStore } from '@/store/useStoryStore'
import HistoryPanel from '@/components/historyPanel/historyPanel'

const StoryOutput = () => {
  const story = useStoryStore((state) => state.story)
  const isLoading = useStoryStore((state) => state.isLoading)
  const [isPronunciationOn, setIsPronunciationOn] = useState(false)
  const [activeTokenIndex, setActiveTokenIndex] = useState<number | null>(null)
  const [isReadingMode, setIsReadingMode] = useState(false)
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')

  useEffect(() => {
    const storedReadingMode = window.localStorage.getItem('wt-reading-mode')
    const storedFontSize = window.localStorage.getItem('wt-reading-font')

    if (storedReadingMode === 'on') {
      setIsReadingMode(true)
    }

    if (storedFontSize === 'sm' || storedFontSize === 'md' || storedFontSize === 'lg') {
      setFontSize(storedFontSize)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('wt-reading-mode', isReadingMode ? 'on' : 'off')
  }, [isReadingMode])

  useEffect(() => {
    window.localStorage.setItem('wt-reading-font', fontSize)
  }, [fontSize])

  const tokens = useMemo(() => {
    if (!story?.content) {
      return []
    }

    return story.content.split(/(\s+)/)
  }, [story?.content])

  useEffect(() => {
    if (!isPronunciationOn) {
      window.speechSynthesis.cancel()
      setActiveTokenIndex(null)
    }
  }, [isPronunciationOn])

  useEffect(() => {
    setActiveTokenIndex(null)
  }, [story?.id])

  const getSpeakableWord = (token: string) => {
    const match = token.match(/[A-Za-z0-9'-]+/g)
    return match ? match.join('') : ''
  }

  const speakWord = (word: string, index: number) => {
    if (!isPronunciationOn || !word) {
      return
    }

    window.speechSynthesis.cancel()
    setActiveTokenIndex(index)

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.onend = () => setActiveTokenIndex((current) => (current === index ? null : current))
    utterance.onerror = () => setActiveTokenIndex((current) => (current === index ? null : current))
    window.speechSynthesis.speak(utterance)
  }

  const storyTextSize =
    fontSize === 'lg' ? 'text-lg leading-8' : fontSize === 'sm' ? 'text-sm leading-6' : 'text-base leading-7'

  return (
    <section className={`space-y-6 ${isReadingMode ? 'mx-auto w-full max-w-5xl' : ''}`}>
      <div className="rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm border-4 border-sky-200/50 dark:bg-slate-900 dark:border-slate-700">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-purple-600 dark:from-sky-400 dark:to-purple-400">
              📖 Your Story
            </p>
            <p className="text-base text-slate-600 font-medium dark:text-slate-400">
              Read, refine, and export your magical tale!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsReadingMode((value) => !value)}
              className={`rounded-2xl px-5 py-3 text-sm font-bold shadow-md transition-all hover:scale-105 hover:shadow-lg ${
                isReadingMode
                  ? 'bg-gradient-to-r from-green-300 to-emerald-300 text-green-900 dark:from-green-600 dark:to-emerald-600 dark:text-white'
                  : 'bg-white border-2 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
              }`}
            >
              📚 Reading Mode {isReadingMode ? 'ON' : 'OFF'}
            </button>
            <div className="flex items-center gap-2 rounded-2xl border-3 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 shadow-md dark:border-amber-700 dark:bg-amber-900/20">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`rounded-xl px-3 py-2 text-sm font-black transition-all ${
                  fontSize === 'sm'
                    ? 'bg-amber-300 text-amber-950 shadow-md scale-110 dark:bg-amber-600 dark:text-white'
                    : 'text-slate-600 hover:bg-white/50 dark:text-slate-300'
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('md')}
                className={`rounded-xl px-3 py-2 text-sm font-black transition-all ${
                  fontSize === 'md'
                    ? 'bg-amber-300 text-amber-950 shadow-md scale-110 dark:bg-amber-600 dark:text-white'
                    : 'text-slate-600 hover:bg-white/50 dark:text-slate-300'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`rounded-xl px-3 py-2 text-sm font-black transition-all ${
                  fontSize === 'lg'
                    ? 'bg-amber-300 text-amber-950 shadow-md scale-110 dark:bg-amber-600 dark:text-white'
                    : 'text-slate-600 hover:bg-white/50 dark:text-slate-300'
                }`}
              >
                A+
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsPronunciationOn((value) => !value)}
              className={`rounded-2xl px-5 py-3 text-sm font-bold shadow-md transition-all hover:scale-105 hover:shadow-lg ${
                isPronunciationOn
                  ? 'bg-gradient-to-r from-pink-300 to-rose-300 text-pink-900 border-3 border-pink-400 dark:from-pink-600 dark:to-rose-600 dark:text-white dark:border-pink-700'
                  : 'bg-white border-2 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
              }`}
            >
              🔊 Pronunciation {isPronunciationOn ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => story && exportStoryToPdf(story)}
              disabled={!story}
              className="rounded-2xl bg-gradient-to-r from-blue-300 to-cyan-300 px-5 py-3 text-sm font-bold text-blue-900 shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:from-blue-600 dark:to-cyan-600 dark:text-white"
            >
              📥 Export PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 space-y-4">
            <div className="h-5 w-1/2 animate-pulse rounded-full bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800" />
            <div className="h-5 w-full animate-pulse rounded-full bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-800 dark:to-blue-800" />
            <div className="h-5 w-5/6 animate-pulse rounded-full bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-800 dark:to-emerald-800" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-gradient-to-r from-amber-200 to-yellow-200 dark:from-amber-800 dark:to-yellow-800" />
          </div>
        ) : story ? (
          <div className="mt-8 space-y-6">
            <div className="space-y-3 rounded-3xl bg-gradient-to-br from-purple-100 via-pink-100 to-sky-100 p-6 shadow-lg dark:from-purple-900/20 dark:via-pink-900/20 dark:to-sky-900/20">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300">
                ✨ {story.title}
              </h2>
              <p className="text-base font-bold text-purple-700 dark:text-purple-300">
                💫 Moral: {story.moral}
              </p>
            </div>
            {story.formData.imageDataUrl && (
              <img
                src={story.formData.imageDataUrl}
                alt="Story inspiration"
                className="h-48 w-full rounded-3xl object-cover shadow-xl border-4 border-white/50 dark:border-slate-700"
              />
            )}
            <div className={`whitespace-pre-line text-slate-700 dark:text-slate-200 ${storyTextSize} leading-relaxed`}>
              {tokens.map((token, index) => {
                if (token.trim() === '') {
                  return <span key={`${index}-space`}>{token}</span>
                }

                const word = getSpeakableWord(token)
                if (!word) {
                  return <span key={`${index}-punct`}>{token}</span>
                }

                return (
                  <span
                    key={`${index}-${token}`}
                    onClick={() => speakWord(word, index)}
                    className={`cursor-pointer rounded-lg px-1 py-0.5 transition-all hover:bg-amber-200/70 hover:shadow-sm dark:hover:bg-amber-400/20 ${
                      activeTokenIndex === index
                        ? 'bg-amber-300 text-amber-950 shadow-md scale-105 dark:bg-amber-400/30 dark:text-amber-100'
                        : ''
                    }`}
                  >
                    {token}
                  </span>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border-4 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center shadow-inner dark:border-purple-700 dark:bg-purple-900/10">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-base font-bold text-purple-700 dark:text-purple-300">
              Fill in the story ingredients and press "Create My Story!" to see the magic ✨
            </p>
          </div>
        )}
      </div>

      {!isReadingMode && <HistoryPanel />}
    </section>
  )
}

export default StoryOutput
