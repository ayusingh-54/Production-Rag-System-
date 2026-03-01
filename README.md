# RAG Knowledge Quest

A RAG (Retrieval-Augmented Generation) chat application built by Ayush Singh.

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Edge Functions)

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```sh
cp .env.example .env
```

Required variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd rag-knowledge-quest

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
4. Deploy!

The `vercel.json` configuration is already set up for this project.

### Supabase Edge Functions

The RAG backend runs on Supabase Edge Functions. Make sure to:
1. Deploy your Supabase Edge Functions separately using `supabase functions deploy`
2. Set the required secrets in Supabase:
   - `OPENAI_API_KEY` - Your OpenAI API key

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run linter

## Project Structure

```
src/
  components/     # React components
  hooks/          # Custom React hooks
  pages/          # Page components
  integrations/   # External service integrations
  lib/            # Utility functions
supabase/
  functions/      # Supabase Edge Functions
```
