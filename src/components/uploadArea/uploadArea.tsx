import { type DragEvent, useEffect, useRef, useState } from 'react'

interface UploadAreaProps {
  imageDataUrl?: string
  onImageChange: (imageDataUrl?: string) => void
}

const UploadArea = ({ imageDataUrl, onImageChange }: UploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [])

  const simulateProgress = () => {
    setProgress(0)
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
    }

    intervalRef.current = window.setInterval(() => {
      setProgress((value) => {
        if (value === null) {
          return 0
        }

        if (value >= 90) {
          return value
        }

        return value + 6
      })
    }, 120)
  }

  const finishProgress = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
    }
    setProgress(100)
    window.setTimeout(() => setProgress(null), 600)
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return
    }

    simulateProgress()
    const reader = new FileReader()
    reader.onload = () => {
      onImageChange(typeof reader.result === 'string' ? reader.result : undefined)
      finishProgress()
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    if (event.dataTransfer.files.length) {
      handleFile(event.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-6 text-center transition-all ${
          isDragging
            ? 'border-purple-400 bg-purple-50 dark:border-purple-500 dark:bg-purple-950/30'
            : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-100/50 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600'
        }`}
      >
        <div className="text-4xl">🖼️</div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Drag and drop your image here
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            or click to browse
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          <span>📁</span>
          <span>Browse Files</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.[0]) {
              handleFile(event.target.files[0])
            }
          }}
        />
      </div>

      {progress !== null && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {imageDataUrl && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/50">
          <div className="flex items-center gap-3">
            <img
              src={imageDataUrl}
              alt="Uploaded preview"
              className="h-16 w-16 rounded-lg object-cover shadow-sm ring-1 ring-slate-900/5 dark:ring-slate-100/10"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
                ✅ Image Ready!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Your picture will inspire the story
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onImageChange(undefined)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default UploadArea
