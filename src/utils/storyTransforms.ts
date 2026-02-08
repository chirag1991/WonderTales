export const ensurePeriod = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  if (/[.!?]$/.test(trimmed)) {
    return trimmed
  }

  return `${trimmed}.`
}

export const capitalize = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  return `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`
}

export const sentenceCase = (value: string) => ensurePeriod(capitalize(value))

export const trimOrFallback = (value: string, fallback: string) =>
  value.trim() ? value.trim() : fallback

export const pickRandom = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)]
