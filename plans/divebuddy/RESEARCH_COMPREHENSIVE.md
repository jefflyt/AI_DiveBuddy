# DiveBuddy Project - Comprehensive Research Document

**Generated:** 26 November 2025  
**Purpose:** Support implementation file generation with actionable technical details  
**Project:** AI-Powered Dive Learning & Trip Planning Platform

---

## 1. Project Structure Summary

### 1.1 Folder Organization

The project follows Next.js 14 App Router conventions with clear domain separation:

```bash
divebuddy/                          # Project root
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout with navigation
│   ├── page.tsx                    # Landing page
│   ├── auth/                       # Authentication routes
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── chat/                       # Chat interface
│   │   ├── page.tsx                # Protected chat page
│   │   └── [sessionId]/page.tsx    # Resume specific session
│   ├── learn/                      # Education feature
│   │   ├── page.tsx                # Learning dashboard
│   │   ├── ow/page.tsx             # Open Water topics
│   │   └── aow/page.tsx            # Advanced OW topics
│   ├── destinations/               # Trip planning
│   │   ├── page.tsx                # Destination browser
│   │   └── [id]/page.tsx           # Destination detail
│   ├── profile/                    # User profile
│   └── api/                        # API routes
│       ├── chat/route.ts           # Multi-agent chat endpoint
│       ├── auth/                   # Auth endpoints
│       ├── progress/route.ts       # Learning progress tracking
│       └── destinations/route.ts   # Destination search
├── components/                     # React components
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── chat/                       # Chat UI components
│   │   ├── chat-container.tsx
│   │   ├── message-bubble.tsx
│   │   ├── chat-input.tsx
│   │   └── typing-indicator.tsx
│   ├── education/                  # Education components
│   │   ├── module-card.tsx
│   │   ├── quiz.tsx
│   │   └── progress-bar.tsx
│   ├── destinations/               # Destination components
│   │   ├── destination-card.tsx
│   │   ├── search-filters.tsx
│   │   └── destination-map.tsx
│   └── auth/                       # Auth components
├── lib/                            # Core business logic
│   ├── supabase/                   # Database clients
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server-side client
│   │   ├── vector.ts               # Vector search utilities
│   │   └── cache.ts                # Caching layer
│   ├── gemini/                     # Google Gemini SDK
│   │   └── client.ts               # Gemini model clients
│   ├── agents/                     # Multi-agent system
│   │   ├── orchestrator.ts         # Agent router
│   │   ├── education-agent.ts      # OW/AOW specialist
│   │   ├── trip-planning-agent.ts  # Destination specialist
│   │   ├── session-manager.ts      # MCP session management
│   │   ├── context-manager.ts      # Context building utilities
│   │   └── tools/                  # Agent tools
│   │       ├── vector-search.ts
│   │       ├── intent-classifier.ts
│   │       └── destination-filters.ts
│   ├── embeddings/                 # RAG pipeline
│   │   ├── service.ts              # Embedding creation/search
│   │   └── chunker.ts              # Text chunking utilities
│   ├── content/                    # Content schemas
│   │   ├── ow-modules.ts           # Open Water content
│   │   ├── aow-modules.ts          # Advanced OW content
│   │   └── schema.ts               # Type definitions
│   ├── auth/                       # Authentication
│   │   ├── auth-context.tsx        # Auth React context
│   │   ├── get-user.ts             # Server-side user utilities
│   │   └── actions.ts              # Server actions
│   └── utils.ts                    # Shared utilities
├── hooks/                          # Custom React hooks
│   └── useChat.ts                  # Chat state management
├── scripts/                        # Utility scripts
│   ├── seed-content.ts             # Seed educational content
│   └── seed-destinations.ts        # Seed destination data
├── data/                           # Static content (markdown)
│   ├── education/
│   │   ├── open-water/             # OW modules (15-20 .md files)
│   │   └── advanced-open-water/    # AOW modules (10-15 .md files)
│   └── destinations/
│       ├── malaysia/                # Malaysian dive sites
│       ├── thailand/                # Thailand sites
│       ├── philippines/             # Philippines sites
│       └── indonesia/               # Indonesia sites
├── supabase/                       # Supabase migrations
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_enable_pgvector.sql
│       └── 003_saved_destinations.sql
├── middleware.ts                   # Auth & route protection
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies
├── .env.local                      # Environment variables (local, not committed)
└── .env.example                    # Environment template (committed)
```

### 1.2 Existing Implementation Files

Located in `plans/divebuddy/`:

**Phase 1 (Foundation):**

- ✅ `1-nextjs-setup/` - 4 implementation files (initialize, shadcn/ui, landing page, env setup)
- ✅ `2-supabase-setup/` - 4 implementation files (project creation, client install, schema, pgvector)
- ✅ `3-auth-setup/` - 3 implementation files (Supabase auth, UI, middleware)
- ✅ `4-chat-ui/` - Combined README with all chat UI components

**Phase 2 (AI Integration):**

- ✅ `5-gemini-and-embeddings/` - Combined README covering Gemini + embeddings
- ✅ `2-ai-integration/` - 6 implementation files (Google AI Agent Framework)

**Phase 3-6 (Features):**

- ✅ `PHASES_3-6_OVERVIEW.md` - High-level guidance for education, destinations, APAC, production

### 1.3 Naming Conventions

- **Files:** kebab-case (e.g., `chat-container.tsx`, `vector-search.ts`)
- **Components:** PascalCase (e.g., `ChatContainer`, `MessageBubble`)
- **Functions:** camelCase (e.g., `generateEmbedding`, `searchSimilarChunks`)
- **Types/Interfaces:** PascalCase (e.g., `Session`, `Message`, `EducationModule`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `DEFAULT_OPTIONS`, `MAX_RETRIES`)
- **Folders:** kebab-case (e.g., `chat-ui`, `trip-planning`)

---

## 2. Tech Stack Details

### 2.1 Core Framework

**Next.js 14+**

- **Version:** 14.0.0 or higher
- **Router:** App Router (not Pages Router)
- **Rendering:** Hybrid (Server Components by default, Client Components with `'use client'`)
- **Installation:**

  ```bash
  npx create-next-app@latest divebuddy --typescript --tailwind --app
  ```

### 2.2 Dependencies

**Production Dependencies:**

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.0.10",
    "@google/generative-ai": "^0.1.3",
    "ai": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/uuid": "^9.0.7",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "tsx": "^4.7.0"
  }
}
```

**Installation Command:**

```bash
# Core framework
npm install next@latest react@latest react-dom@latest

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Google AI
npm install @google/generative-ai

# Vercel AI SDK
npm install ai

# UI utilities
npm install class-variance-authority clsx tailwind-merge lucide-react

# Forms & validation
npm install react-hook-form @hookform/resolvers zod

# Utilities
npm install uuid

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom @types/uuid tsx
```

### 2.3 Environment Variables

**.env.local** (not committed):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# App Config
NEXT_PUBLIC_APP_NAME=DiveBuddy
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**.env.example** (committed as template):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_GEMINI_API_KEY=
NEXT_PUBLIC_APP_NAME=DiveBuddy
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2.4 Build & Run Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Production build
npm run build            # Create optimized production build
npm start                # Run production server

# Type checking
npm run lint             # Run ESLint
npx tsc --noEmit         # TypeScript type check

# Database migrations
npx supabase migration new <name>  # Create new migration
npx supabase db push               # Apply migrations

# Seed scripts
npx tsx scripts/seed-content.ts       # Seed educational content
npx tsx scripts/seed-destinations.ts  # Seed destination data
```

---

## 3. Code Pattern Library

### 3.1 TypeScript Patterns

**Interface Definitions:**

```typescript
// Type for message objects
export interface Message {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

// Type for session with messages
export interface Session {
  id: string
  userId?: string
  messages: Message[]
  context: Record<string, any>
  intent?: Intent
  createdAt: Date
  updatedAt: Date
}

// Union type for intents
export type Intent = 'education' | 'trip-planning' | 'general'

// Agent tool interface
export interface Tool {
  name: string
  description: string
  parameters: Record<string, string>
  execute: (params: Record<string, any>) => Promise<any>
}
```

**Error Handling Pattern:**

```typescript
try {
  const result = await someAsyncOperation()
  return { success: true, data: result }
} catch (error) {
  console.error('[Context] Operation failed:', error)
  return { 
    success: false, 
    error: error instanceof Error ? error.message : 'Unknown error' 
  }
}
```

**Zod Validation Pattern:**

```typescript
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>
```

### 3.2 React Component Patterns

**Server Component (Default):**

```typescript
// app/chat/page.tsx
import { getCurrentUser } from '@/lib/auth/get-user'
import { redirect } from 'next/navigation'
import { ChatContainer } from '@/components/chat/chat-container'

export default async function ChatPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/chat')
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatContainer className="flex flex-col flex-1" />
    </div>
  )
}
```

**Client Component (Interactive):**

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!message.trim()) return
    onSend(message)
    setMessage('')
  }

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button onClick={handleSend}>Send</Button>
    </div>
  )
}
```

**Custom Hook Pattern:**

```typescript
import { useState, useCallback, useRef, useEffect } from 'react'

export function useChat(initialSessionId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await response.json()
      setMessages(prev => [...prev, data])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { messages, isLoading, error, sendMessage, messagesEndRef }
}
```

### 3.3 API Route Patterns

**Next.js 14 App Router API:**

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge' // Optional: use Edge runtime

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message required' }, 
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Process message...
    const response = await processMessage(message, user?.id)

    return NextResponse.json({ 
      response,
      sessionId: session.id,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('[Chat API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
```

**Streaming Response Pattern:**

```typescript
export async function POST(req: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of generateStreamingResponse(message)) {
        controller.enqueue(new TextEncoder().encode(chunk))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

### 3.4 Supabase Client Patterns

**Browser Client:**

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server Client:**

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

**Database Query Pattern:**

```typescript
const { data, error } = await supabase
  .from('documents')
  .select('id, title, content, category')
  .eq('category', 'education')
  .order('created_at', { ascending: false })
  .limit(10)

if (error) throw error
return data
```

---

## 4. Architecture Patterns

### 4.1 Multi-Agent Flow (Google AI Agent Framework)

**Request Flow:**

```bash
User Input
    ↓
Next.js API Route (/api/chat)
    ↓
Orchestrator Agent
    ├─→ Intent Classifier Tool
    │       └─→ Determine: 'education' | 'trip-planning' | 'general'
    ↓
Specialist Agent (based on intent)
    ├─→ Vector Search Tool (retrieve context from Supabase pgvector)
    ├─→ Gemini API (generate response with context)
    └─→ Session Manager (persist conversation)
    ↓
Formatted Response
    ↓
Stream to Client (Vercel AI SDK)
```

**Agent Structure Pattern:**

```typescript
// lib/agents/education-agent.ts
export class EducationAgent {
  private model = getChatModel(0.3) // Lower temperature for accuracy
  
  private readonly systemPrompt = `You are an expert diving instructor...`

  async handleMessage(message: string, session: Session): Promise<string> {
    // 1. Build context from session
    const sessionContext = ContextManager.buildAgentContext(session)
    
    // 2. Search knowledge base
    const searchResult = await vectorSearchTool.execute({
      query: message,
      category: 'education',
      limit: 3,
    })
    
    // 3. Format retrieved context
    const knowledgeContext = formatSearchResultsForAgent(searchResult.results)
    
    // 4. Generate response with Gemini
    const fullPrompt = `${this.systemPrompt}

Session Context: ${sessionContext}
Retrieved Knowledge: ${knowledgeContext}
Student Question: ${message}

Provide a helpful, accurate response.`

    const result = await this.model.generateContent(fullPrompt)
    return result.response.text()
  }
}
```

### 4.2 RAG (Retrieval-Augmented Generation) Pipeline

**Flow:**

```bash
1. Document Ingestion
   ├─→ Raw content (markdown files)
   ├─→ Chunker (splits into 800-char chunks with 150-char overlap)
   ├─→ Gemini text-embedding-004 (generates 768-dim vectors)
   └─→ Supabase pgvector (stores chunks with embeddings)

2. Query Processing
   ├─→ User query
   ├─→ Generate embedding (text-embedding-004)
   └─→ Vector similarity search (cosine distance)

3. Context Retrieval
   ├─→ match_documents() function (Supabase RPC)
   ├─→ Returns top-k similar chunks (k=3-5)
   └─→ Filter by category (education/destination)

4. Response Generation
   ├─→ Inject retrieved chunks into prompt
   ├─→ Gemini 1.5 Flash generates response
   └─→ Stream to user
```

**Implementation:**

```typescript
// lib/embeddings/service.ts
export async function searchSimilarChunks(
  query: string,
  options: { category?: string; threshold?: number; limit?: number } = {}
) {
  const supabase = createClient()

  // 1. Generate query embedding
  const queryEmbedding = await generateEmbedding(query)

  // 2. Search via pgvector
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

### 4.3 Session Management (MCP Pattern)

**Model Context Protocol (MCP) Implementation:**

```typescript
// lib/agents/session-manager.ts
export class SessionManager {
  async getOrCreate(sessionId: string, userId?: string): Promise<Session> {
    const supabase = createClient()
    
    let { data: session } = await supabase
      .from('sessions')
      .select('*, messages(*)')
      .eq('id', sessionId)
      .single()
    
    if (!session) {
      const { data: newSession } = await supabase
        .from('sessions')
        .insert({ id: sessionId, user_id: userId, context: {} })
        .select()
        .single()
      
      session = newSession
    }
    
    return {
      id: session.id,
      userId: session.user_id,
      messages: session.messages || [],
      context: session.context || {},
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at),
    }
  }
  
  async addMessage(sessionId: string, role: 'user' | 'agent', content: string) {
    await supabase.from('messages').insert({
      session_id: sessionId,
      role,
      content,
      created_at: new Date(),
    })
  }
  
  async updateContext(sessionId: string, context: Record<string, any>) {
    await supabase
      .from('sessions')
      .update({ context, updated_at: new Date() })
      .eq('id', sessionId)
  }
}
```

### 4.4 Authentication Flow

**Supabase Auth Pattern:**

```bash
1. Signup
   ├─→ User submits email + password
   ├─→ Supabase creates auth.users entry
   ├─→ Trigger creates profiles entry
   ├─→ Confirmation email sent
   └─→ User confirms → account active

2. Login
   ├─→ User submits credentials
   ├─→ Supabase validates
   ├─→ Returns session token (JWT)
   ├─→ Set cookie (via @supabase/ssr)
   └─→ Redirect to protected route

3. Protected Routes
   ├─→ middleware.ts intercepts request
   ├─→ Check session cookie
   ├─→ If valid: allow
   └─→ If invalid: redirect to /auth/login
```

**Middleware Implementation:**

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(/* ... */)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const protectedRoutes = ['/chat', '/profile', '/saved']
  const isProtected = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  if (isProtected && !user) {
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${req.nextUrl.pathname}`, req.url)
    )
  }
  
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 5. Framework APIs & Best Practices

### 5.1 Next.js 14 App Router

**Server Components (Default):**

```typescript
// app/page.tsx
import { Header } from '@/components/header'

export default async function HomePage() {
  // Can fetch data directly in component
  const data = await fetch('https://api.example.com/data')
  
  return (
    <div>
      <Header />
      <main>{/* content */}</main>
    </div>
  )
}
```

**Client Components (Interactive):**

```typescript
'use client' // Required at top of file

import { useState } from 'react'

export function InteractiveButton() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}
```

**Route Handlers:**

```typescript
// app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello' })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ received: body })
}
```

**Dynamic Routes:**

```typescript
// app/destinations/[id]/page.tsx
export default async function DestinationPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const destination = await fetchDestination(params.id)
  return <div>{destination.name}</div>
}
```

**Streaming:**

```typescript
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of data) {
        controller.enqueue(encoder.encode(chunk))
      }
      controller.close()
    },
  })
  
  return new Response(stream)
}
```

### 5.2 Supabase Client APIs

**Database Operations:**

```typescript
// Select
const { data, error } = await supabase
  .from('documents')
  .select('id, title, content')
  .eq('category', 'education')

// Insert
const { data, error } = await supabase
  .from('documents')
  .insert({ title: 'New Doc', content: '...', category: 'education' })
  .select()
  .single()

// Update
const { data, error } = await supabase
  .from('documents')
  .update({ content: 'Updated content' })
  .eq('id', docId)

// Delete
const { error } = await supabase
  .from('documents')
  .delete()
  .eq('id', docId)
```

**Vector Search (pgvector):**

```typescript
const { data, error } = await supabase.rpc('match_documents', {
  query_embedding: JSON.stringify(embedding), // array of 768 numbers
  match_threshold: 0.7,                       // similarity threshold
  match_count: 5,                             // top-k results
  filter_category: 'education',               // optional filter
})
```

**Authentication:**

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { full_name: 'John Doe' }, // stored in raw_user_meta_data
  },
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})

// Sign out
const { error } = await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Reset password
const { error } = await supabase.auth.resetPasswordForEmail('user@example.com')
```

**Row Level Security (RLS):**

```sql
-- Example policy: users can only see their own sessions
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);
```

### 5.3 Google Gemini API

**Text Generation:**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

const result = await model.generateContent({
  contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
  generationConfig: {
    temperature: 0.7,           // 0.0-1.0 (higher = more creative)
    maxOutputTokens: 1024,      // Max response length
    topP: 0.9,                  // Nucleus sampling
    topK: 40,                   // Top-k sampling
  },
})

const response = result.response.text()
```

**Streaming:**

```typescript
const result = await model.generateContentStream({
  contents: [{ role: 'user', parts: [{ text: 'Tell me a story' }] }],
})

for await (const chunk of result.stream) {
  const text = chunk.text()
  process.stdout.write(text)
}
```

**Embeddings:**

```typescript
const embeddingModel = genAI.getGenerativeModel({ 
  model: 'text-embedding-004' 
})

const result = await embeddingModel.embedContent('Sample text')
const embedding = result.embedding.values // array of 768 numbers
```

**Multi-turn Conversation:**

```typescript
const chat = model.startChat({
  history: [
    { role: 'user', parts: [{ text: 'What is buoyancy?' }] },
    { role: 'model', parts: [{ text: 'Buoyancy is...' }] },
  ],
})

const result = await chat.sendMessage('How do I control it?')
const response = result.response.text()
```

**Function Calling:**

```typescript
const functionDeclarations = [{
  name: 'search_knowledge_base',
  description: 'Search diving knowledge base',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      category: { type: 'string', enum: ['education', 'destination'] },
    },
    required: ['query'],
  },
}]

const result = await model.generateContent({
  contents: [{ role: 'user', parts: [{ text: 'What is buoyancy?' }] }],
  tools: [{ functionDeclarations }],
})

const functionCall = result.response.functionCalls()?.[0]
if (functionCall) {
  const searchResult = await search_knowledge_base(functionCall.args)
  // Send result back to model...
}
```

### 5.4 Vercel AI SDK

**useChat Hook (Client-Side):**

```typescript
'use client'

import { useChat } from 'ai/react'

export function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

**Server-Side Streaming:**

```typescript
import { OpenAIStream, StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await geminiModel.generateContentStream(/* ... */)
  const stream = OpenAIStream(response)
  
  return new StreamingTextResponse(stream)
}
```

### 5.5 shadcn/ui Components

**Installation:**

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input form
```

**Usage:**

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
      </CardContent>
    </Card>
  )
}
```

**Form with React Hook Form:**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  email: z.string().email(),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## 6. Known Constraints & Gotchas

### 6.1 Next.js 14 Constraints

**Server vs Client Components:**

❌ **Don't:**
```typescript
// This will fail - useState in Server Component
export default function Page() {
  const [count, setCount] = useState(0) // Error!
  return <div>{count}</div>
}
```

✅ **Do:**
```typescript
'use client'

export default function Page() {
  const [count, setCount] = useState(0) // OK
  return <div>{count}</div>
}
```

**Environment Variables:**

- Client-accessible variables **must** have `NEXT_PUBLIC_` prefix
- Server-only variables (like API keys) should **not** have prefix
- Access client vars: `process.env.NEXT_PUBLIC_SUPABASE_URL`
- Access server vars: `process.env.GOOGLE_GEMINI_API_KEY`

**Route Handlers:**

- Can't use `req.query` - use `req.nextUrl.searchParams` instead
- Can't use `res.json()` - use `NextResponse.json()` instead

### 6.2 Supabase Constraints

**Client Differences:**

```typescript
// Browser client (use in client components)
import { createClient } from '@/lib/supabase/client'

// Server client (use in server components, API routes)
import { createClient } from '@/lib/supabase/server'
```

**RLS Policies:**

- Queries fail silently if RLS policies don't allow access
- Use service role key for admin operations (bypass RLS)
- Test policies with different user contexts

**pgvector:**

- Embedding dimension **must match** table definition (768 for text-embedding-004)
- Store embeddings as JSONB or use `VECTOR(768)` type
- Cosine distance: `embedding <=> query_embedding` (lower = more similar)

### 6.3 Google Gemini API Constraints

**Rate Limits (Free Tier):**

- **Gemini 1.5 Flash:** 15 requests per minute (RPM)
- **text-embedding-004:** 1,500 requests per day
- Solution: Implement request queuing or rate limiting

**Model Capabilities:**

- Context window: 1M tokens (Gemini 1.5 Flash)
- Max output: 8,192 tokens
- Supports function calling and multi-turn chat

**Error Handling:**

```typescript
try {
  const result = await model.generateContent(prompt)
  return result.response.text()
} catch (error) {
  if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
    // Wait and retry
  } else if (error.message.includes('SAFETY')) {
    // Content filtered by safety settings
  }
  throw error
}
```

### 6.4 Database & Vector Search

**pgvector Dimension:**

- text-embedding-004 outputs **768 dimensions**
- Table definition: `embedding VECTOR(768)`
- Mismatched dimensions cause errors

**Chunking Strategy:**

- Chunk size: 800-1000 characters (balance context vs. precision)
- Overlap: 150-200 characters (preserve context across chunks)
- Min chunk size: 100 characters (avoid tiny fragments)

**Search Threshold:**

- Similarity threshold: 0.7 (cosine similarity)
- Lower threshold (0.5-0.6) for broader results
- Higher threshold (0.8-0.9) for precise matches

### 6.5 Production Considerations

**Edge Runtime vs Node.js:**

```typescript
// Edge runtime (faster cold starts, limited APIs)
export const runtime = 'edge'

// Node.js runtime (full Node APIs)
export const runtime = 'nodejs'
```

**Caching:**

```typescript
// Revalidate every hour
export const revalidate = 3600

// Static generation
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}
```

**Error Boundaries:**

```typescript
// app/error.tsx
'use client'

export default function Error({ error, reset }: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

---

## 7. Testing & Validation

### 7.1 Manual Testing Checklist

**Phase 1 (Foundation):**
- [ ] Next.js dev server starts on `http://localhost:3000`
- [ ] Landing page loads with styled components
- [ ] Supabase connection test returns success
- [ ] Database tables exist with correct schema
- [ ] Signup flow creates user and sends confirmation
- [ ] Login flow sets session cookie
- [ ] Protected routes redirect unauthenticated users
- [ ] Chat UI renders with message bubbles

**Phase 2 (AI Integration):**
- [ ] Gemini API test returns text generation
- [ ] Embedding generation returns 768-dim vector
- [ ] Seed script populates database with chunks
- [ ] Vector search returns relevant results
- [ ] Intent classifier correctly identifies intent
- [ ] Education agent responds with context
- [ ] Trip planning agent suggests destinations
- [ ] Session persists across messages

### 7.2 Common Testing Commands

```bash
# Test Supabase connection
curl http://localhost:3000/api/test-supabase

# Test Gemini API
curl http://localhost:3000/api/test-gemini

# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is buoyancy?"}'

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint
npm run lint

# Test database migrations
npx supabase db push
```

### 7.3 Debugging Tips

**Check Logs:**

```typescript
console.log('[Component] Debug info:', data)
console.error('[API] Error:', error)
```

**Supabase Logs:**

- Go to Supabase Dashboard → Logs → API/Postgres
- Filter by timestamp and error level

**Browser DevTools:**

- Network tab: Check API request/response
- Console: Look for client-side errors
- React DevTools: Inspect component state

---

## 8. Quick Reference

### 8.1 File Creation Checklist

When creating new files, ensure:

- [ ] Correct path relative to project root
- [ ] Imports use `@/` alias (configured in `tsconfig.json`)
- [ ] TypeScript types are explicit
- [ ] Error handling included
- [ ] No TODOs or placeholders in production code
- [ ] Comments explain complex logic
- [ ] Follows existing code patterns
- [ ] No console.log in production (use proper logging)

### 8.2 Common Import Patterns

```typescript
// Next.js
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// React
import { useState, useEffect, useCallback, useRef } from 'react'

// Supabase
import { createClient } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

// Gemini
import { GoogleGenerativeAI } from '@google/generative-ai'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// Custom Hooks
import { useChat } from '@/hooks/useChat'

// Utilities
import { cn } from '@/lib/utils'
```

### 8.3 Key URLs & Resources

**Official Documentation:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Google Gemini: https://ai.google.dev/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com/docs

**Internal Documentation:**
- Master Plan: `plans/divebuddy/plan.md`
- Quick Start: `plans/divebuddy/QUICKSTART.md`
- Implementation Index: `plans/divebuddy/IMPLEMENTATION_INDEX.md`

---

## 9. Summary for Implementation File Generation

### 9.1 Generation Guidelines

When generating implementation files, ensure:

1. **Complete Code:** No placeholders, TODOs, or "fill in the blank"
2. **Exact Paths:** Use absolute paths from project root
3. **Working Patterns:** Use patterns documented in this research
4. **Error Handling:** Include try-catch with meaningful messages
5. **TypeScript:** Explicit types, no `any` unless necessary
6. **Dependencies:** All imports included and correct
7. **Testing:** Include verification steps and expected outcomes
8. **Troubleshooting:** Common errors and solutions documented

### 9.2 Priority Patterns to Use

**Highest Priority:**
- Next.js 14 App Router patterns (server vs client components)
- Supabase client creation (browser vs server)
- Google Gemini API patterns (text generation, embeddings, streaming)
- TypeScript strict typing with Zod validation
- Error handling with try-catch and user-friendly messages

**Medium Priority:**
- shadcn/ui component usage
- React hooks (useState, useEffect, useCallback)
- Tailwind CSS utility classes
- Session management patterns

**Lower Priority:**
- Advanced optimizations (can be added later)
- Edge cases (document but don't over-engineer)
- Analytics and monitoring (Phase 6)

### 9.3 Copy-Paste Ready Criteria

Implementation files are copy-paste ready when:

- ✅ Code runs without modification
- ✅ All dependencies are installed and imported
- ✅ File paths are correct and absolute
- ✅ Environment variables are documented
- ✅ Types compile without errors
- ✅ No manual decision-making required
- ✅ Verification steps produce expected results
- ✅ Error messages are clear and actionable

---

**End of Comprehensive Research Document**

This research provides all necessary context for generating complete, production-ready implementation files for the DiveBuddy project. Use this as the authoritative reference for code patterns, API usage, and architectural decisions.
