import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const distDir = path.resolve(__dirname, '../dist');

// Azure OpenAI configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt4o';
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview';

if (!endpoint || !apiKey) {
  console.error('Missing Azure OpenAI credentials in environment variables');
  process.exit(1);
}

const client = new OpenAI({
  apiKey: apiKey,
  baseURL: `${endpoint}/openai/deployments/${deploymentName}`,
  defaultQuery: { 'api-version': apiVersion },
  defaultHeaders: { 'api-key': apiKey },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'wondertales-backend' });
});

// Story generation endpoint
app.post('/api/story', async (req, res) => {
  try {
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
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!characterName) missingFields.push('characterName');
    if (!ageRange) missingFields.push('ageRange');
    if (!storyLength) missingFields.push('storyLength');
    if (!genre) missingFields.push('genre');
    if (!setting) missingFields.push('setting');
    if (!theme) missingFields.push('theme');
    if (!tone) missingFields.push('tone');
    if (!readingLevel) missingFields.push('readingLevel');
    if (!moral) missingFields.push('moral');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: missingFields,
      });
    }

    const prompt = JSON.stringify({
      characterName,
      ageRange,
      storyLength,
      genre,
      setting,
      theme,
      tone,
      readingLevel,
      moral,
    });

    console.log('Generating story with Azure OpenAI...');

    const messages = [
      {
        role: 'system',
        content:
          "You are WonderTales, a friendly children's story writer. Return ONLY a JSON object with EXACT keys: title, story, moral. Do not add extra keys, markdown, or commentary. Write a safe, uplifting story with a clear beginning, middle, and end. Match the requested age range and reading level in vocabulary, sentence length, and complexity. Keep the tone consistent (gentle, adventurous, silly, or mystery) throughout. Avoid repetition in phrasing or events. Do not include scary, violent, or adult content. The story field MUST NOT contain a moral line. The moral MUST be returned only in the moral field as a single sentence.",
      },
      {
        role: 'user',
        content: `Create a story using this JSON:\n${prompt}`,
      },
    ];

    const result = await client.chat.completions.create({
      model: deploymentName,
      messages: messages,
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const outputText = result.choices[0]?.message?.content;

    if (!outputText) {
      console.error('Empty response from Azure OpenAI');
      return res.status(500).json({
        error: 'Empty response from model',
        details: 'Azure OpenAI returned no content.',
      });
    }

    let payload;
    try {
      payload = JSON.parse(outputText);
    } catch (parseError) {
      console.error('Invalid JSON from model:', outputText);
      return res.status(500).json({
        error: 'Invalid JSON returned by model',
        details: outputText,
      });
    }

    const normalized = {
      title: payload?.title || payload?.name || '',
      story: payload?.story || payload?.content || payload?.text || '',
      moral: payload?.moral || '',
    };

    // Extract moral from story if embedded
    if (normalized.story && !normalized.moral) {
      const moralPatterns = [
        /\bMoral:\s*(.+)$/i,
        /\*\*Moral:\*\*\s*(.+)$/i,
        /\bAnd remember:\s*(.+)$/i,
      ];

      for (const pattern of moralPatterns) {
        const match = normalized.story.match(pattern);
        if (match?.[1]) {
          normalized.moral = match[1].trim();
          normalized.story = normalized.story.replace(pattern, '').trim();
          break;
        }
      }
    }

    if (!normalized.title || !normalized.story || !normalized.moral) {
      console.error('Response missing required fields:', normalized);
      return res.status(500).json({
        error: 'Model response missing required fields',
        details: { payload, normalized },
      });
    }

    console.log('Story generated successfully');
    res.json(normalized);
  } catch (error) {
    console.error('Story generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate story',
      details: error.message || String(error),
    });
  }
});

app.use(express.static(distDir));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`WonderTales server running on port ${PORT}`);
  console.log(`Azure OpenAI endpoint: ${endpoint}`);
  console.log(`Azure OpenAI deployment: ${deploymentName}`);
});
