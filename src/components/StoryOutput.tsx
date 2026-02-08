import { useEffect, useMemo, useState } from 'react'
import { exportStoryToPdf } from '../utils/exporters'
import { useStoryStore } from '../store/useStoryStore'
import HistoryPanel from './HistoryPanel'

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
      <div className="wt-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">
              Your story
            </p>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Read, refine, and export your magical tale.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsReadingMode((value) => !value)}
              className="wt-button-secondary"
            >
              Reading mode {isReadingMode ? 'ON' : 'OFF'}
            </button>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`rounded-full px-2 py-1 transition ${fontSize === 'sm' ? 'bg-amber-200 text-amber-950' : ''}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('md')}
                className={`rounded-full px-2 py-1 transition ${fontSize === 'md' ? 'bg-amber-200 text-amber-950' : ''}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`rounded-full px-2 py-1 transition ${fontSize === 'lg' ? 'bg-amber-200 text-amber-950' : ''}`}
              >
                A+
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsPronunciationOn((value) => !value)}
              className={`wt-button-secondary ${
                isPronunciationOn
                  ? 'border-amber-300 bg-amber-100 text-amber-900'
                  : ''
              }`}
            >
              Pronunciation mode {isPronunciationOn ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => story && exportStoryToPdf(story)}
              disabled={!story}
              className="wt-button-secondary"
            >
              Export PDF
            </button>
          </div>
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
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {story.title}
              </h2>
              <p className="text-base text-slate-500 dark:text-slate-400">
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
            <div className={`whitespace-pre-line text-slate-700 dark:text-slate-200 ${storyTextSize}`}>
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
                    className={`cursor-pointer rounded px-0.5 transition hover:bg-amber-200/60 dark:hover:bg-amber-400/20 ${
                      activeTokenIndex === index
                        ? 'bg-amber-200/80 text-amber-950 dark:bg-amber-400/30 dark:text-amber-100'
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
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            Fill in the story ingredients and press "Create story" to see the magic.
          </div>
        )}
      </div>

      {!isReadingMode && <HistoryPanel />}
    </section>
  )
}

export default StoryOutput
