# RAG Knowledge Quest 🧠

A production-ready **Retrieval-Augmented Generation (RAG)** chatbot specializing in human nutrition knowledge. Built from scratch with modern web technologies, this application processes PDF documents and enables intelligent Q&A through semantic search and large language model integration.

**Author:** Ayush Singh

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture Overview](#-architecture-overview)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Data Ingestion](#data-ingestion)
  - [Running the Application](#running-the-application)
- [Deployment](#-deployment)
  - [Deploy Frontend to Vercel](#deploy-frontend-to-vercel)
  - [Deploy Supabase Edge Functions](#deploy-supabase-edge-functions)
- [How RAG Works](#-how-rag-works)
- [API Reference](#-api-reference)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Semantic Search**: Find relevant information using vector similarity search (cosine distance)
- **Intelligent Chunking**: Sentence-based document chunking with configurable overlap
- **Source Citations**: Every response includes page number references from the source document
- **Conversation History**: Maintains context across multiple exchanges
- **Real-time Chat Interface**: Modern, responsive UI with typing indicators and sound effects
- **Production Ready**: Deployed on Vercel with Supabase Edge Functions backend

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RAG Knowledge Quest Architecture                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐    ┌──────────────────┐    ┌─────────────────────────┐   │
│   │   User      │───▶│  React Frontend  │───▶│  Supabase Edge Function │   │
│   │   Query     │    │  (Vite + TS)     │    │  (rag-chat)             │   │
│   └─────────────┘    └──────────────────┘    └───────────┬─────────────┘   │
│                                                           │                  │
│                      ┌────────────────────────────────────┼───────────┐     │
│                      │                                    ▼           │     │
│                      │  ┌──────────────────┐    ┌─────────────────┐  │     │
│                      │  │  OpenAI API      │    │  Query Embedding │  │     │
│                      │  │  Embeddings      │◀───│  Generation      │  │     │
│                      │  │  (1536 dims)     │    │                  │  │     │
│                      │  └──────────────────┘    └─────────────────┘  │     │
│                      │                                    │           │     │
│                      │                                    ▼           │     │
│                      │  ┌──────────────────┐    ┌─────────────────┐  │     │
│                      │  │  Supabase        │◀───│  Vector Search  │  │     │
│                      │  │  PostgreSQL +    │    │  (match_docs)   │  │     │
│                      │  │  pgvector        │    │  Top 5 chunks   │  │     │
│                      │  └──────────────────┘    └─────────────────┘  │     │
│                      │                                    │           │     │
│                      │                                    ▼           │     │
│                      │  ┌──────────────────┐    ┌─────────────────┐  │     │
│                      │  │  OpenAI GPT-4o   │◀───│  Context +      │  │     │
│                      │  │  mini            │    │  Question       │  │     │
│                      │  └────────┬─────────┘    └─────────────────┘  │     │
│                      │           │                                    │     │
│                      └───────────┼────────────────────────────────────┘     │
│                                  ▼                                          │
│                      ┌──────────────────────┐                               │
│                      │  Response + Sources  │──────▶  User                  │
│                      │  (with page citations)│                              │
│                      └──────────────────────┘                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### RAG Pipeline Flow

1. **User asks a question** → Frontend captures input
2. **Query embedding** → OpenAI converts question to 1536-dimensional vector
3. **Semantic search** → Supabase finds top 5 most similar document chunks
4. **Context assembly** → Retrieved chunks are formatted with source citations
5. **LLM generation** → GPT-4o-mini generates answer grounded in retrieved context
6. **Response delivery** → Answer + source citations returned to user

---

## 🛠 Technology Stack

### Frontend

| Technology         | Purpose                 |
| ------------------ | ----------------------- |
| **React 18**       | UI framework            |
| **TypeScript**     | Type safety             |
| **Vite**           | Build tool & dev server |
| **Tailwind CSS**   | Styling                 |
| **shadcn/ui**      | Component library       |
| **React Router**   | Client-side routing     |
| **React Markdown** | Markdown rendering      |

### Backend

| Technology                  | Purpose                       |
| --------------------------- | ----------------------------- |
| **Supabase Edge Functions** | Serverless API (Deno runtime) |
| **Supabase PostgreSQL**     | Database                      |
| **pgvector**                | Vector similarity search      |
| **OpenAI API**              | Embeddings & chat completions |

### Data Processing

| Technology            | Purpose                            |
| --------------------- | ---------------------------------- |
| **Python 3**          | Ingestion scripts                  |
| **PyMuPDF**           | PDF text extraction                |
| **tiktoken**          | Token counting                     |
| **OpenAI Embeddings** | text-embedding-3-small (1536 dims) |

---

## 📁 Project Structure

```
rag-knowledge-quest/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ChatMessage.tsx       # Chat bubble with markdown support
│   │   ├── CitationChip.tsx      # Source citation badges
│   │   ├── TypingIndicator.tsx   # Loading animation
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/
│   │   └── useChat.ts            # Chat state management & API calls
│   ├── pages/
│   │   ├── Index.tsx             # Main chat interface
│   │   └── NotFound.tsx          # 404 page
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts         # Supabase client initialization
│   │       └── types.ts          # Database type definitions
│   └── lib/
│       ├── sounds.ts             # Audio feedback utilities
│       └── utils.ts              # Helper functions
│
├── supabase/
│   └── functions/
│       └── rag-chat/
│           └── index.ts          # RAG Edge Function (main backend logic)
│
├── prod-rag/                     # Production RAG tools
│   ├── ingest.py                 # PDF processing & embedding pipeline
│   ├── test_embeddings.py        # Embedding verification script
│   └── rag-chat/                 # Alternative Next.js implementation
│
├── public/
│   ├── favicon.svg               # App icon
│   └── robots.txt                # SEO configuration
│
├── vercel.json                   # Vercel deployment config
├── vite.config.ts                # Vite configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm ([install with nvm](https://github.com/nvm-sh/nvm))
- **Python** 3.9+ (for data ingestion)
- **Supabase** account ([sign up free](https://supabase.com))
- **OpenAI** API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rag-knowledge-quest.git
cd rag-knowledge-quest

# Install frontend dependencies
npm install

# Install Python dependencies (for data ingestion)
pip install pymupdf tiktoken supabase openai tqdm python-dotenv
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration (Frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_PROJECT_ID=your-project-id
```

For the Python ingestion script, create `.env` in `prod-rag/`:

```env
# Supabase Configuration (Backend/Ingestion)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# OpenAI Configuration
OPENAI_API_KEY=sk-...
```

### Database Setup

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create chunks table for storing document embeddings
CREATE TABLE chunks (
  id BIGSERIAL PRIMARY KEY,
  doc_id TEXT NOT NULL,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster similarity search
CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create the match_documents function for semantic search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id BIGINT,
  doc_id TEXT,
  chunk_index INT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    chunks.id,
    chunks.doc_id,
    chunks.chunk_index,
    chunks.content,
    chunks.metadata,
    1 - (chunks.embedding <=> query_embedding) AS similarity
  FROM chunks
  ORDER BY chunks.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### Data Ingestion

Process your PDF document and create embeddings:

```bash
cd prod-rag

# Place your PDF in the folder and update PDF_PATH in ingest.py
# Then run:
python ingest.py
```

**Ingestion Configuration** (in `ingest.py`):

| Parameter         | Default                | Description                          |
| ----------------- | ---------------------- | ------------------------------------ |
| `SENTS_PER_CHUNK` | 20                     | Sentences per chunk                  |
| `SENT_OVERLAP`    | 2                      | Overlapping sentences between chunks |
| `MAX_TOKENS`      | 1300                   | Maximum tokens per chunk             |
| `MIN_TOKENS`      | 50                     | Minimum tokens (skip tiny fragments) |
| `EMBED_MODEL`     | text-embedding-3-small | OpenAI embedding model               |

### Running the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

The app will be available at `http://localhost:8080`

---

## 🌐 Deployment

### Deploy Frontend to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Import your repository

3. **Configure Environment Variables**

   Add these in Vercel Project Settings → Environment Variables:

   | Variable                        | Value                     |
   | ------------------------------- | ------------------------- |
   | `VITE_SUPABASE_URL`             | Your Supabase project URL |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key    |
   | `VITE_SUPABASE_PROJECT_ID`      | Your Supabase project ID  |

4. **Deploy!**

   The `vercel.json` is already configured for optimal deployment.

### Deploy Supabase Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Set secrets for Edge Functions
supabase secrets set OPENAI_API_KEY=sk-your-openai-key

# Deploy the rag-chat function
supabase functions deploy rag-chat

# Verify deployment
supabase functions list
```

---

## 🔍 How RAG Works

### What is RAG?

**Retrieval-Augmented Generation (RAG)** is a technique that enhances LLM responses by:

1. **Retrieval**: Finding relevant documents/passages from a knowledge base
2. **Augmentation**: Adding retrieved context to the LLM prompt
3. **Generation**: LLM generates response grounded in retrieved facts

### Why RAG?

| Problem with vanilla LLMs | RAG Solution                   |
| ------------------------- | ------------------------------ |
| Knowledge cutoff date     | Access to up-to-date documents |
| Hallucinations            | Grounded in retrieved facts    |
| No source citations       | Traceable references           |
| Generic knowledge         | Domain-specific expertise      |

### This Implementation

```
Question: "What are the symptoms of pellagra?"
           │
           ▼
    ┌─────────────────┐
    │ Embed Question  │  → [0.012, -0.034, 0.156, ...]
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Vector Search   │  → Find chunks with similar embeddings
    │ (Cosine Sim)    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────────────────────────────┐
    │ Retrieved Context:                                   │
    │ [Source 1, Page 45]: "Pellagra is characterized by   │
    │  the "4 Ds": dermatitis, diarrhea, dementia..."     │
    │ [Source 2, Page 46]: "Niacin deficiency causes..."   │
    └────────┬────────────────────────────────────────────┘
             │
             ▼
    ┌─────────────────┐
    │ GPT-4o-mini     │  → Generate answer with citations
    └────────┬────────┘
             │
             ▼
    Answer: "Pellagra is characterized by the '4 Ds':
    dermatitis, diarrhea, dementia, and death [1].
    This condition results from niacin deficiency [2]."
```

---

## 📚 API Reference

### RAG Chat Edge Function

**Endpoint:** `POST /functions/v1/rag-chat`

**Request Body:**

```json
{
  "message": "What are micronutrients?",
  "history": [
    { "role": "user", "content": "Previous question" },
    { "role": "assistant", "content": "Previous answer" }
  ]
}
```

**Response:**

```json
{
  "answer": "Micronutrients are essential nutrients required in small amounts...",
  "sources": [
    {
      "id": 123,
      "doc_id": "nutrition-v1",
      "chunk_index": 45,
      "content": "Micronutrients include vitamins and minerals...",
      "metadata": { "page": 12 },
      "similarity": 0.89
    }
  ]
}
```

---

## ⚙ Configuration

### Vite Configuration (`vite.config.ts`)

- **Dev server**: Port 8080, HMR enabled
- **Build**: Optimized chunks for vendor/UI libraries
- **Aliases**: `@/` maps to `src/`

### Tailwind Configuration

- Custom color scheme with CSS variables
- Typography plugin for markdown styling
- Animation utilities

### Supabase Edge Function

- **Model**: GPT-4o-mini (fast, cost-effective)
- **Temperature**: 0.3 (balanced creativity)
- **Max tokens**: 1000
- **Retrieved chunks**: Top 5 by similarity

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by Ayush Singh**

[Report Bug](https://github.com/yourusername/rag-knowledge-quest/issues) · [Request Feature](https://github.com/yourusername/rag-knowledge-quest/issues)

</div>
