# PR 2.1 & 2.2: Gemini Integration & Vector Embeddings - Complete Guide

**Part of:** Phase 2 - AI Integration  
**Focus:** Basic Gemini chat + RAG embedding pipeline  
**Total Steps:** 6 (2.1.1-2.1.3 + 2.2.1-2.2.3)  
**Estimated Time:** 60 minutes

---

## PR 2.1: Basic Gemini Integration

### Step 2.1.1: Create Gemini Client Utilities

Create `src/lib/gemini/client.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export const models = {
  flash: 'gemini-1.5-flash',
  embedding: 'text-embedding-004',
} as const

export function getGeminiModel(modelName: string = models.flash) {
  return genAI.getGenerativeModel({ model: modelName })
}

export function getEmbeddingModel() {
  return genAI.getGenerativeModel({ model: models.embedding })
}

// Helper for simple text generation
export async function generateText(prompt: string, options?: {
  temperature?: number
  maxTokens?: number
}) {
  const model = getGeminiModel()
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 1024,
    },
  })

  return result.response.text()
}

// Helper for streaming text generation
export async function* streamText(prompt: string, options?: {
  temperature?: number
}) {
  const model = getGeminiModel()
  const result = await model.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
    },
  })

  for await (const chunk of result.stream) {
    const text = chunk.text()
    yield text
  }
}

// Helper for embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = getEmbeddingModel()
  const result = await model.embedContent(text)
  return result.embedding.values
}

// Batch embeddings
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const model = getEmbeddingModel()
  const embeddings = await Promise.all(
    texts.map(text => model.embedContent(text))
  )
  return embeddings.map(e => e.embedding.values)
}
```

### Step 2.1.2: Create Basic Chat API (Non-Agent Version)

Create `src/app/api/chat-basic/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/gemini/client'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Get user from session
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Generate response with Gemini
    const prompt = `You are DovvyBuddy, a helpful AI assistant for scuba divers. 
You help with diving education and trip planning.

User: ${message}

Provide a helpful, accurate response.`

    const response = await generateText(prompt, { temperature: 0.7 })

    return NextResponse.json({
      response,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('[Chat Basic API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
```

### Step 2.1.3: Test Gemini Integration

Create `src/app/api/test-gemini/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { generateText, generateEmbedding } from '@/lib/gemini/client'

export async function GET() {
  try {
    // Test text generation
    const textResult = await generateText('Say hello in one word')

    // Test embedding
    const embedding = await generateEmbedding('test text')

    return NextResponse.json({
      status: 'success',
      textGeneration: textResult,
      embeddingDimension: embedding.length,
      message: 'Gemini API is working correctly',
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
```

**Test:** Visit `/api/test-gemini` → Should see successful response

---

## PR 2.2: Vector Embeddings & RAG Pipeline

### Step 2.2.1: Create Text Chunking Utility

Create `src/lib/embeddings/chunker.ts`:

```typescript
export interface Chunk {
  content: string
  index: number
  metadata: {
    startPosition: number
    endPosition: number
    wordCount: number
  }
}

export interface ChunkOptions {
  chunkSize?: number  // Characters per chunk
  overlap?: number    // Character overlap between chunks
  minChunkSize?: number
}

const DEFAULT_OPTIONS: Required<ChunkOptions> = {
  chunkSize: 1000,
  overlap: 200,
  minChunkSize: 100,
}

export function chunkText(text: string, options?: ChunkOptions): Chunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const chunks: Chunk[] = []

  // Split by paragraphs first
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
  
  let currentChunk = ''
  let currentPosition = 0
  let chunkIndex = 0

  for (const paragraph of paragraphs) {
    const paragraphWithSpace = paragraph.trim() + '\n\n'

    // If adding this paragraph would exceed chunk size, save current chunk
    if (currentChunk.length + paragraphWithSpace.length > opts.chunkSize && currentChunk.length >= opts.minChunkSize) {
      chunks.push({
        content: currentChunk.trim(),
        index: chunkIndex++,
        metadata: {
          startPosition: currentPosition,
          endPosition: currentPosition + currentChunk.length,
          wordCount: currentChunk.trim().split(/\s+/).length,
        },
      })

      // Start new chunk with overlap
      currentPosition += currentChunk.length - opts.overlap
      currentChunk = currentChunk.slice(-opts.overlap) + paragraphWithSpace
    } else {
      currentChunk += paragraphWithSpace
    }
  }

  // Add final chunk
  if (currentChunk.trim().length >= opts.minChunkSize) {
    chunks.push({
      content: currentChunk.trim(),
      index: chunkIndex,
      metadata: {
        startPosition: currentPosition,
        endPosition: currentPosition + currentChunk.length,
        wordCount: currentChunk.trim().split(/\s+/).length,
      },
    })
  }

  return chunks
}

// Sentence-based chunking (alternative strategy)
export function chunkBySentences(text: string, sentencesPerChunk: number = 5): Chunk[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  const chunks: Chunk[] = []

  for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
    const chunk = sentences.slice(i, i + sentencesPerChunk).join(' ').trim()
    chunks.push({
      content: chunk,
      index: chunks.length,
      metadata: {
        startPosition: 0,
        endPosition: chunk.length,
        wordCount: chunk.split(/\s+/).length,
      },
    })
  }

  return chunks
}
```

### Step 2.2.2: Create Embedding Service

Create `src/lib/embeddings/service.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding, generateEmbeddings } from '@/lib/gemini/client'
import { chunkText, Chunk } from './chunker'

export interface DocumentInput {
  title: string
  content: string
  category: 'education' | 'destination' | 'general'
  subcategory?: string
  metadata?: Record<string, any>
  sourceUrl?: string
}

export interface ChunkWithEmbedding extends Chunk {
  embedding: number[]
  documentId: string
}

export async function embedDocument(input: DocumentInput) {
  const supabase = createClient()

  // 1. Insert document
  const { data: document, error: docError } = await supabase
    .from('documents')
    .insert({
      title: input.title,
      content: input.content,
      category: input.category,
      subcategory: input.subcategory,
      metadata: input.metadata || {},
      source_url: input.sourceUrl,
    })
    .select()
    .single()

  if (docError) throw docError

  // 2. Chunk the content
  const chunks = chunkText(input.content, {
    chunkSize: 800,
    overlap: 150,
  })

  // 3. Generate embeddings
  const embeddings = await generateEmbeddings(chunks.map(c => c.content))

  // 4. Insert chunks with embeddings
  const chunksWithEmbeddings = chunks.map((chunk, i) => ({
    document_id: document.id,
    content: chunk.content,
    chunk_index: chunk.index,
    embedding: JSON.stringify(embeddings[i]), // PostgreSQL vector format
    metadata: chunk.metadata,
  }))

  const { error: chunkError } = await supabase
    .from('document_chunks')
    .insert(chunksWithEmbeddings)

  if (chunkError) throw chunkError

  return {
    documentId: document.id,
    chunksCreated: chunks.length,
  }
}

export async function searchSimilarChunks(
  query: string,
  options: {
    category?: string
    threshold?: number
    limit?: number
  } = {}
) {
  const supabase = createClient()

  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query)

  // Call database function
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: options.threshold || 0.7,
    match_count: options.limit || 5,
    filter_category: options.category || null,
  })

  if (error) throw error

  return data
}
```

### Step 2.2.3: Create Seed Script for Sample Content

Create `scripts/seed-content.ts`:

```typescript
import { embedDocument } from '@/lib/embeddings/service'

const sampleEducationContent = [
  {
    title: 'Buoyancy Control Fundamentals',
    content: `Buoyancy control is the foundation of good diving. It allows you to hover effortlessly at any depth, conserve air, protect the reef, and dive safely.

What is Buoyancy?
Buoyancy is the upward force exerted by water that opposes the weight of an object. In diving, we manage three types:
- Positive buoyancy: You float upward
- Negative buoyancy: You sink downward
- Neutral buoyancy: You neither float nor sink

How to Achieve Neutral Buoyancy:
1. Proper Weighting: Start with a weight check. At the surface with an empty BCD, you should float at eye level while holding a normal breath.
2. Breathing Control: Your lungs act as a buoyancy control device. Inhale to rise slightly, exhale to descend.
3. BCD Adjustment: Add small amounts of air as you descend, release air as you ascend.

Common Mistakes:
- Over-weighting leads to excessive BCD inflation and poor control
- Rapid breathing disturbs your position
- Not adjusting for depth changes

Practice Tips:
- Hover exercises: Try to stay at one depth for 2 minutes
- Fin pivot: Lie on the bottom and use breathing to lift your fins
- Buoyancy games: Pick up objects without touching the bottom`,
    category: 'education' as const,
    subcategory: 'OW',
  },
  {
    title: 'Deep Diving Safety - Advanced Open Water',
    content: `Deep diving (18-30 meters for AOW) requires special considerations and precautions.

Nitrogen Narcosis:
At depths beyond 30m, nitrogen acts as an anesthetic. Symptoms include:
- Impaired judgment
- Loss of coordination
- Euphoria or anxiety
- Tunnel vision

Prevention: Stay within limits, ascend if symptoms occur, dive with experienced buddies.

Air Consumption:
Air consumption increases with depth due to increased pressure. At 30m (4 ATA), you use air 4x faster than at the surface.

Planning:
- Calculate your SAC rate (Surface Air Consumption)
- Plan for reserve air (Rule of Thirds: 1/3 down, 1/3 up, 1/3 reserve)
- Consider cold water and exertion

Safety Stops:
Always perform a 3-5 minute safety stop at 5m, even on no-decompression dives.

Deep Diving Checklist:
□ Check depth gauge and computer
□ Monitor air frequently
□ Stay with your buddy
□ Be aware of narcosis symptoms
□ Plan your ascent before reaching turnaround pressure`,
    category: 'education' as const,
    subcategory: 'AOW',
  },
]

const sampleDestinations = [
  {
    title: 'Sipadan Island - World-Class Diving',
    content: `Sipadan is Malaysia's only oceanic island, rising 600m from the seabed. It's consistently ranked among the world's best dive sites.

Why Visit Sipadan:
- Massive schools of barracuda and jacks
- Green and hawksbill turtle sightings on every dive
- Hammerhead sharks seasonally
- Pristine coral walls dropping to 600m
- Excellent visibility (20-40m)

Best Dive Sites:
1. Barracuda Point: Famous tornado of barracudas
2. South Point: Strong currents, pelagic action
3. Drop Off: Stunning wall dive with sea fans
4. Turtle Cave: For experienced divers only (overhead environment)

When to Go:
March to October for best conditions. Peak season is April-June.

Requirements:
- Advanced Open Water certification minimum
- Good buoyancy control essential
- Limited permits (120/day) - book months in advance
- Drift diving experience recommended

Getting There:
Fly to Tawau, transfer to Semporna (1 hour). Liveaboards and day trips available from Semporna.

Cost: RM 150-300 per dive (permit included)`,
    category: 'destination' as const,
    subcategory: 'Malaysia',
  },
]

async function seed() {
  console.log('Starting content seeding...')

  for (const doc of [...sampleEducationContent, ...sampleDestinations]) {
    try {
      const result = await embedDocument(doc)
      console.log(`✅ Embedded: ${doc.title} (${result.chunksCreated} chunks)`)
    } catch (error) {
      console.error(`❌ Failed: ${doc.title}`, error)
    }
  }

  console.log('Seeding complete!')
}

seed()
```

**Run seed:**

```bash
npx tsx scripts/seed-content.ts
```

---

## Verification Checklist

**PR 2.1:**

- [ ] Gemini client utilities created
- [ ] Basic chat API working
- [ ] Test endpoint returns successful response
- [ ] Text generation and embeddings both functional

**PR 2.2:**

- [ ] Chunker splits text correctly
- [ ] Embedding service creates embeddings
- [ ] Search function returns relevant chunks
- [ ] Seed script populates database

---

## Testing

### Test PR 2.1

```bash
# Test basic Gemini
curl http://localhost:3000/api/test-gemini

# Test basic chat
curl -X POST http://localhost:3000/api/chat-basic \
  -H "Content-Type: application/json" \
  -d '{"message": "What is buoyancy?"}'
```

### Test PR 2.2

```typescript
// In test file or console
import { searchSimilarChunks } from '@/lib/embeddings/service'

const results = await searchSimilarChunks('How do I control buoyancy?', {
  category: 'education',
  limit: 3,
})

console.log(results)
```

---

## Files Created

**PR 2.1:**

- ✅ `src/lib/gemini/client.ts`
- ✅ `src/app/api/chat-basic/route.ts`
- ✅ `src/app/api/test-gemini/route.ts`

**PR 2.2:**

- ✅ `src/lib/embeddings/chunker.ts`
- ✅ `src/lib/embeddings/service.ts`
- ✅ `scripts/seed-content.ts`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Embedding dimension mismatch | Check `text-embedding-004` returns 768 dimensions |
| Seed script fails | Verify Supabase credentials and pgvector enabled |
| Search returns no results | Lower `match_threshold` or check embeddings exist |
| Rate limit errors | Gemini free tier: 15 RPM - add delays between requests |

---

## PRs 2.1 & 2.2 Complete! ✅

You now have:

- Basic Gemini text generation
- Vector embeddings pipeline
- Content chunking strategy
- Semantic search capability
- Sample knowledge base

**Next:** Connect this to the agent framework (PR 2.3 - already completed!)

**Or jump to:** Phase 3 - Education Feature Implementation
