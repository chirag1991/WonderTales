/// <reference path="../deno.d.ts" />
import { corsHeaders } from '../_shared/cors.ts'
import OpenAI from 'openai'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const jsonResponse = (data: unknown, status: number) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const contentType = req.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      return jsonResponse(
        { error: 'Content-Type must be application/json.' },
        415,
      )
    }

    const body = (await req.json()) as Record<string, unknown>
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
    } = body || {}

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
      return jsonResponse(
        { error: 'Missing required fields.', details: missingFields },
        400,
      )
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      return jsonResponse(
        {
          error: 'Server missing API configuration.',
          details: 'OPENAI_API_KEY is not set in the environment.',
        },
        500,
      )
    }

    const client = new OpenAI({ apiKey })

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
      return jsonResponse(
        {
          error: 'Empty response from model.',
          details: 'OpenAI returned no output_text.',
        },
        500,
      )
    }

    let payload: Record<string, string>
    try {
      payload = JSON.parse(outputText) as Record<string, string>
    } catch {
      return jsonResponse(
        { error: 'Invalid JSON returned by model.', details: outputText },
        500,
      )
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
      return jsonResponse(
        {
          error: 'Model response missing required fields.',
          details: { payload, normalized },
        },
        500,
      )
    }

    return jsonResponse(normalized, 200)
  } catch (error) {
    console.error('Story generation failed:', error)
    return jsonResponse(
      {
        error: 'Failed to generate story.',
        details:
          error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : String(error),
      },
      500,
    )
  }
})
