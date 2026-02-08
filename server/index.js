import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import OpenAI from 'openai'

dotenv.config({ path: './server/.env' })

const app = express()
const port = process.env.PORT || 3001
const apiKey = process.env.OPENAI_API_KEY

console.log(
  `OPENAI_API_KEY loaded: ${apiKey ? 'yes' : 'no'}`,
)

if (!apiKey) {
  console.warn('Missing OPENAI_API_KEY in environment variables.')
}

const client = new OpenAI({ apiKey })

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  console.log('Health check pinged')
  return res.status(200).json({ status: 'ok' })
})

app.post('/api/story', async (req, res) => {
  try {
    if (!req.is('application/json')) {
      return res.status(415).json({
        error: 'Content-Type must be application/json.',
      })
    }

    const {
      characterName,
      ageRange,
      storyLength,
      genre,
      setting,
      theme,
      tone,
      readingLevel,
      moral,
    } = req.body || {}

    const missingFields = [
      ['characterName', characterName],
      ['ageRange', ageRange],
      ['storyLength', storyLength],
      ['genre', genre],
      ['setting', setting],
      ['theme', theme],
      ['tone', tone],
      ['readingLevel', readingLevel],
      ['moral', moral],
    ]
      .filter(([, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length) {
      return res.status(400).json({
        error: 'Missing required fields.',
        details: missingFields,
      })
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'Server missing API configuration.',
        details: 'OPENAI_API_KEY is not set in the environment.',
      })
    }

    const prompt = {
      characterName,
      ageRange,
      storyLength,
      genre,
      setting,
      theme,
      tone,
      readingLevel,
      moral,
    }

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      instructions:
        "You are WonderTales, a friendly children's story writer. Return ONLY a JSON object with EXACT keys: title, story, moral. Do not add extra keys, markdown, or commentary. Write a safe, uplifting story with a clear beginning, middle, and end. Match the requested age range and reading level in vocabulary, sentence length, and complexity. Keep the tone consistent (gentle, adventurous, silly, or mystery) throughout. Avoid repetition in phrasing or events. Do not include scary, violent, or adult content. The story field MUST NOT contain a moral line. The moral MUST be returned only in the moral field as a single sentence.",
      input: `Create a story using this JSON:\n${JSON.stringify(prompt)}`,
      text: {
        format: {
          type: 'json_object',
        },
      },
    })

    const outputText = response.output_text
    if (!outputText) {
      return res.status(500).json({
        error: 'Empty response from model.',
        details: 'OpenAI returned no output_text.',
      })
    }

    let payload
    try {
      payload = JSON.parse(outputText)
    } catch (parseError) {
      return res.status(500).json({
        error: 'Invalid JSON returned by model.',
        details: outputText,
      })
    }

    const normalized = {
      title: payload?.title ?? payload?.name ?? '',
      story: payload?.story ?? payload?.content ?? payload?.text ?? '',
      moral: payload?.moral ?? '',
    }

    if (normalized.story && !normalized.moral) {
      const moralPatterns = [
        /\bMoral:\s*(.+)$/i,
        /\*\*Moral:\*\*\s*(.+)$/i,
        /\bAnd remember:\s*(.+)$/i,
      ]

      for (const pattern of moralPatterns) {
        const match = normalized.story.match(pattern)
        if (match?.[1]) {
          normalized.moral = match[1].trim()
          normalized.story = normalized.story.replace(pattern, '').trim()
          break
        }
      }
    }

    if (!normalized.title || !normalized.story || !normalized.moral) {
      return res.status(500).json({
        error: 'Model response missing required fields.',
        details: {
          payload,
          normalized,
        },
      })
    }

    return res.status(200).json(normalized)
  } catch (error) {
    console.error('Story generation failed:', error)
    return res.status(500).json({
      error: 'Failed to generate story.',
      details:
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : error,
    })
  }
})

app.listen(port, () => {
  console.log(`WonderTales API running on http://localhost:${port}`)
})
