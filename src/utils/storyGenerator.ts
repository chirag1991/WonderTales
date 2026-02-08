import type { Story, StoryFormData, StoryTone } from '../types/story'
import {
  capitalize,
  ensurePeriod,
  pickRandom,
  sentenceCase,
  trimOrFallback,
} from './storyTransforms'

const toneOpeners: Record<StoryTone, string[]> = {
  gentle: [
    'On a calm morning,',
    'In a soft glow of sunshine,',
    'With a quiet breeze drifting by,',
  ],
  adventurous: [
    'At the edge of a thrilling day,',
    'With a backpack full of courage,',
    'Just as the drums of adventure began,',
  ],
  silly: [
    'In a giggly twist of fate,',
    'With a funny hop and a skip,',
    'On a day that felt full of bubbles,',
  ],
  mystery: [
    'In a hush of curiosity,',
    'Under a sky full of secrets,',
    'When the clues started to shimmer,',
  ],
}

const ageFlavor: Record<StoryFormData['ageRange'], string> = {
  '3-5': 'simple, warm words and gentle surprises',
  '6-8': 'playful discoveries and brave little choices',
  '9-12': 'vivid scenes and thoughtful twists',
  '13+': 'rich details and steady emotional beats',
}

const extraBeats = [
  'A helpful friend appeared with a sparkling idea',
  'A hidden path opened right where hope was growing',
  'A tiny mistake turned into a big, meaningful lesson',
  'A clever plan formed, one small step at a time',
  'A burst of laughter brightened the whole journey',
  'A moment of doubt passed, replaced by quiet courage',
  'A gentle surprise reminded everyone to stay curious',
  'A quiet promise turned into a brave first step',
  'A secret message nudged the adventure forward',
  'A kind gesture rippled through the whole day',
]

const lengthExtras: Record<StoryFormData['storyLength'], number> = {
  short: 1,
  medium: 3,
  long: 5,
}

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `story-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

const pickDifferent = (items: string[], lastPick?: string) => {
  if (items.length === 0) {
    return ''
  }

  if (!lastPick) {
    return pickRandom(items)
  }

  const filtered = items.filter((item) => item !== lastPick)
  return filtered.length ? pickRandom(filtered) : pickRandom(items)
}

const buildBeats = (count: number) => {
  const beats: string[] = []
  let lastPick: string | undefined

  for (let i = 0; i < count; i += 1) {
    const next = pickDifferent(extraBeats, lastPick)
    beats.push(next)
    lastPick = next
  }

  return beats
}

export const generateMockStory = (formData: StoryFormData): Story => {
  const hero = trimOrFallback(formData.characterName, 'Our hero')
  const genre = trimOrFallback(formData.genre, 'magical adventure')
  const setting = trimOrFallback(formData.setting, 'a place full of wonder')
  const theme = trimOrFallback(formData.theme, 'friendship')
  const moral = trimOrFallback(formData.moral, 'kindness makes every day brighter')
  const tone = formData.tone

  const opening = `${pickRandom(toneOpeners[tone])} ${hero} stepped into ${setting}.`
  const mood = `The story unfolded with ${ageFlavor[formData.ageRange]}, keeping the ${genre.toLowerCase()} spirit bright.`
  const guidingLine = `${capitalize(hero)} carried ${theme.toLowerCase()} in every choice, even when things felt uncertain.`
  const challenge = `${capitalize(hero)} noticed a small problem that needed a gentle, brave answer.`
  const discovery = `${capitalize(hero)} listened closely and spotted the detail that others had missed.`

  const beats = buildBeats(lengthExtras[formData.storyLength])
  const paragraphs = [opening, mood, guidingLine, challenge, discovery, ...beats]

  const resolution = `${capitalize(hero)} found a warm, steady solution, and the day felt brighter than when it began.`
  const moralLine = `And remember: ${sentenceCase(moral)}`

  const content = [...paragraphs, resolution, moralLine]
    .map((line) => ensurePeriod(line))
    .join('\n\n')

  const title = `${capitalize(hero)} and the ${capitalize(theme)}`

  return {
    id: createId(),
    title: title.trim() || 'A WonderTales Adventure',
    content,
    moral: sentenceCase(moral),
    createdAt: new Date().toISOString(),
    formData,
  }
}
