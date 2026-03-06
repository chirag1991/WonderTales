# WonderTales

WonderTales is a kids story creator web app.
Tagline: "Where every story begins with wonder"

## Tech Stack

- React + TypeScript (Vite)
- TailwindCSS
- Zustand
- jsPDF
- Supabase (Edge Functions for story generation)

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run preview` - preview the production build
- `npm run lint` - run eslint

## Environment

Create a `.env` file with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

1. Create a project at [database.new](https://database.new) or use an existing Supabase project.
2. Deploy the Edge Function:
   ```bash
   supabase functions deploy generate-story --project-ref <your-project-ref>
   ```
3. Set the OpenAI API key secret:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-... --project-ref <your-project-ref>
   ```
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env` (from Project Settings > API).

## Local Development

To test the Edge Function locally:

```bash
supabase functions serve generate-story
```

Then set `.env` with your local Supabase URL and anon key from `supabase status` (when running Supabase locally), or use your project's URL/keys to hit the deployed function.

## Requirements

This project requires Node 20.19+ or 22.12+.
