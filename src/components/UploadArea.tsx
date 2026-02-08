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
        className={`flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 py-6 text-center transition ${
          isDragging
            ? 'border-amber-400 bg-amber-50/80 dark:border-amber-300 dark:bg-amber-500/10'
            : 'border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60'
        }`}
      >
        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Drag and drop an image, or
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          Browse files
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
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {imageDataUrl && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <img
              src={imageDataUrl}
              alt="Uploaded preview"
              className="h-12 w-12 rounded-xl object-cover"
            />
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Image ready for story flavoring
            </p>
          </div>
          <button
            type="button"
            onClick={() => onImageChange(undefined)}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export default UploadArea
