# DovvyBuddy - AI-Powered Dive Learning & Trip Planning Platform

## Project Overview

DovvyBuddy is an AI-powered chatbot website that helps scuba divers learn and plan their adventures in Malaysia and the Asia Pacific region. The platform features two core capabilities: (1) educational guidance for Open Water (OW) and Advanced Open Water (AOW) certifications using original content, and (2) intelligent trip planning with destination search focused on Malaysian dive sites. Built with RAG (Retrieval-Augmented Generation) using Supabase and Google's Gemini API with multi-agent orchestration, DovvyBuddy provides accurate, context-aware responses by combining AI with a curated knowledge base.

## Architecture & Technology Stack

### Recommended Approach

A modern full-stack application with Next.js for the frontend/API layer, Supabase for database and vector storage, and Google Gemini API with LangGraph for multi-agent orchestration. This approach minimizes costs during testing while providing production-ready scalability.

### Key Technologies

- **Next.js 14+** (App Router): Full-stack framework with server components, API routes, and excellent SEO
- **TypeScript**: Type safety across frontend and backend
- **Google Gemini API**: LLM for chat responses (free tier available)
- **Google AI Agent Framework**: Multi-agent orchestration with tools and MCP (Model Context Protocol)
- **Supabase**: PostgreSQL database + pgvector for RAG retrieval + Auth
- **@google/generative-ai**: Official Gemini SDK with function calling and streaming
- **Vercel AI SDK**: Streaming chat UI integration
- **Tailwind CSS + shadcn/ui**: Modern, accessible UI components

### High-Level Architecture

```plaintext
User Browser
    ↓
Next.js App (Frontend + API Routes)
    ↓
    ├──→ Google AI Agent Framework
    │       ├──→ Orchestrator Agent (session management, routing)
    │       │     └──→ Tools: intent classification, context retrieval
    │       │
    │       ├──→ Education Agent (OW/AOW specialist)
    │       │     └──→ Tools: vector search (education docs), Gemini function calls
    │       │
    │       └──→ Trip Planning Agent (Malaysia/APAC specialist)
    │             └──→ Tools: vector search (destinations), destination filters
    │
    ├──→ Supabase (MCP Server integration)
    │       ├──→ PostgreSQL (user data, chat history, sessions)
    │       ├──→ pgvector (embeddings for RAG)
    │       └──→ Auth (email/password)
    │
    └──→ Google Gemini API
            ├──→ Gemini 1.5 Flash (chat completions with function calling)
            └──→ text-embedding-004 (document embeddings)
```

**Multi-Agent Flow (Google AI Agent Framework):**

1. User message → Orchestrator Agent creates/resumes session
2. Orchestrator uses **intent classification tool** to determine: education vs. trip planning
3. Orchestrator delegates to specialist agent (Education or Trip Planning)
4. Specialist agent executes tools:
   - **Vector search tool** → Queries Supabase pgvector for relevant context
   - **Gemini function calling** → Generates response with retrieved context
5. Agent maintains **session memory** (conversation history, context)
6. Response streams back to user via Vercel AI SDK
7. Session state persisted to Supabase for continuity

**Key Framework Features:**

- **Tools**: Vector search, destination filters, session management
- **MCP (Model Context Protocol)**: Supabase integration as context provider
- **Sessions**: Persistent conversation state with memory
- **Quality**: Structured outputs, guardrails, error handling

## Project Phases & PR Breakdown

### Phase 1: Foundation & Core Infrastructure

Establish the basic application structure, Supabase setup, and authentication.

#### PR 1.1: Next.js Project Setup & UI Framework

**Branch:** `1.1-nextjs-setup`

**Description:** Initialize Next.js 14 project with TypeScript, Tailwind, and base UI components

**Goal:** Create a production-ready Next.js foundation with modern tooling

**Key Components/Files:**

- `package.json` - Dependencies (Next.js 14, TypeScript, Tailwind CSS, shadcn/ui)
- `app/layout.tsx` - Root layout with navigation header
- `app/page.tsx` - Landing page with DovvyBuddy intro
- `components/ui/*` - shadcn/ui components (Button, Card, Input, Badge)
- `tailwind.config.ts` - Tailwind configuration with diving theme colors
- `.env.example` - Environment variables template

**Dependencies:** None

**Testing:** Run `npm run dev` and verify landing page loads

---

#### PR 1.2: Supabase Setup & Database Schema

**Branch:** `1.2-supabase-setup`

**Description:** Set up Supabase project with PostgreSQL schema and pgvector extension

**Goal:** Enable database storage, vector search, and authentication foundation

**Key Components/Files:**

- `lib/supabase/client.ts` - Supabase client (browser)
- `lib/supabase/server.ts` - Supabase client (server-side)
- `supabase/migrations/001_initial_schema.sql` - Database schema
  - `profiles` table (user profiles)
  - `chat_sessions` table (conversation threads)
  - `messages` table (chat messages)
  - `diving_documents` table (embedded knowledge base)
  - `saved_destinations` table (user favorites)
- `supabase/migrations/002_enable_pgvector.sql` - Enable pgvector extension
- `.env.example` - Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

**Dependencies:** PR 1.1

**Testing:** Run migrations and verify tables created in Supabase dashboard

---

#### PR 1.3: Email/Password Authentication

**Branch:** `1.3-auth`

**Description:** Implement email/password authentication with Supabase Auth

**Goal:** Enable user signup, login, and session management

**Key Components/Files:**

- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page
- `components/auth/AuthForm.tsx` - Reusable auth form
- `components/Header.tsx` - Navigation with login/logout buttons
- `lib/auth/actions.ts` - Server actions for auth
- `middleware.ts` - Protected route middleware

**Dependencies:** PR 1.2

**Testing:** Create account, login, logout, and verify session persistence

---

#### PR 1.4: Chat UI Components

**Branch:** `1.4-chat-ui`

**Description:** Build chat interface with message display, input, and streaming support

**Goal:** Create functional chat UI ready for AI integration

**Key Components/Files:**

- `app/chat/page.tsx` - Chat page route (protected)
- `components/chat/ChatContainer.tsx` - Main chat wrapper
- `components/chat/MessageList.tsx` - Message display with auto-scroll
- `components/chat/ChatInput.tsx` - User input with send button
- `components/chat/Message.tsx` - Message bubble component
- `components/chat/TypingIndicator.tsx` - Loading state

**Dependencies:** PR 1.3

**Testing:** Navigate to /chat, verify UI renders and input works (no AI yet)

---

### Phase 2: AI Integration & Multi-Agent Framework

Integrate Google Gemini API and build the LangGraph multi-agent system.

#### PR 2.1: Google Gemini API Integration

**Branch:** `2.1-gemini-integration`

**Description:** Integrate Google Gemini API for basic conversational chat (no agents yet)

**Goal:** Establish LLM integration with streaming responses using Vercel AI SDK

**Key Components/Files:**

- `lib/ai/gemini.ts` - Gemini API client configuration
- `app/api/chat/route.ts` - Streaming chat API endpoint
- `hooks/useChat.ts` - Client-side chat hook with streaming
- `.env.example` - Add GOOGLE_API_KEY
- `lib/ai/prompts.ts` - Base system prompt

**Dependencies:** PR 1.4

**Testing:** Send message in chat UI, verify Gemini response streams back

---

#### PR 2.2: Vector Embeddings & Supabase pgvector Setup

**Branch:** `2.2-vector-embeddings`

**Description:** Set up embedding generation and pgvector storage in Supabase

**Goal:** Prepare vector storage for RAG retrieval

**Key Components/Files:**

- `lib/ai/embeddings.ts` - Text embedding using Gemini text-embedding-004
- `lib/ai/chunking.ts` - Document chunking utility (recursive character split)
- `scripts/seed-embeddings.ts` - Script to embed and store documents
- `lib/supabase/vector.ts` - Vector search functions
- `data/sample-content.md` - Sample diving content for testing

**Dependencies:** PR 2.1

**Testing:** Run seed script, verify embeddings stored in `diving_documents` table

---

#### PR 2.3: Google AI Agent Framework Integration

**Branch:** `2.3-google-ai-agents`

**Description:** Build multi-agent system using Google AI Agent Framework with orchestrator and specialist agents

**Goal:** Implement intelligent routing between education and trip planning agents with session management

**Key Components/Files:**

- `lib/agents/orchestrator.ts` - Orchestrator agent with session and routing logic
- `lib/agents/education-agent.ts` - Education specialist agent with tools
- `lib/agents/trip-planning-agent.ts` - Trip planning specialist agent
- `lib/agents/tools/vector-search.ts` - Vector search tool for RAG retrieval
- `lib/agents/tools/intent-classifier.ts` - Intent classification tool
- `lib/agents/session-manager.ts` - Session state and memory management
- `lib/agents/config.ts` - Agent configurations and prompts
- `app/api/chat/route.ts` - Update to use Google AI Agent Framework

**Implementation Details:**

Using Google AI Agent Framework patterns:

```typescript
// lib/agents/orchestrator.ts
import { Agent, Tool } from '@google/generative-ai/agents'

export class OrchestratorAgent {
  private agent: Agent
  private sessionManager: SessionManager
  
  constructor() {
    this.agent = new Agent({
      model: 'gemini-1.5-flash',
      name: 'DovvyBuddy Orchestrator',
      instructions: `You are the orchestrator for DovvyBuddy. 
        Analyze user intent and delegate to specialist agents:
        - Education Agent: diving certification, skills, theory
        - Trip Planning Agent: destinations, travel planning`,
      tools: [intentClassifierTool, sessionManagementTool]
    })
  }

  async handleMessage(message: string, sessionId: string) {
    const session = await this.sessionManager.getOrCreate(sessionId)
    const intent = await this.classifyIntent(message, session)
    
    const specialistAgent = intent === 'education' 
      ? educationAgent 
      : tripPlanningAgent
    
    return await specialistAgent.execute(message, session)
  }
}

// lib/agents/tools/vector-search.ts
export const vectorSearchTool: Tool = {
  name: 'search_knowledge_base',
  description: 'Search diving knowledge base using vector similarity',
  parameters: {
    query: 'string',
    category: 'education | destinations',
    limit: 'number'
  },
  execute: async ({ query, category, limit = 5 }) => {
    const embedding = await embed(query)
    const results = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: limit,
      filter: { category }
    })
    return results.data
  }
}

// lib/agents/education-agent.ts
export class EducationAgent {
  private agent: Agent
  
  constructor() {
    this.agent = new Agent({
      model: 'gemini-1.5-flash',
      name: 'Diving Education Expert',
      instructions: `You are a certified diving instructor assistant.
        Help learners understand OW and AOW concepts.
        Use the search_knowledge_base tool to retrieve accurate content.`,
      tools: [vectorSearchTool],
      config: {
        temperature: 0.3, // More deterministic for education
        maxOutputTokens: 1024
      }
    })
  }
  
  async execute(message: string, session: Session) {
    return await this.agent.chat(message, {
      sessionId: session.id,
      history: session.messages
    })
  }
}
```

**Session Management (MCP Pattern):**

```typescript
// lib/agents/session-manager.ts
export class SessionManager {
  async getOrCreate(sessionId: string): Promise<Session> {
    let session = await supabase
      .from('chat_sessions')
      .select('*, messages(*)')
      .eq('id', sessionId)
      .single()
    
    if (!session.data) {
      session = await supabase
        .from('chat_sessions')
        .insert({ id: sessionId, context: {} })
        .select()
        .single()
    }
    
    return {
      id: session.data.id,
      messages: session.data.messages || [],
      context: session.data.context || {}
    }
  }
  
  async addMessage(sessionId: string, role: 'user' | 'agent', content: string) {
    await supabase.from('messages').insert({
      session_id: sessionId,
      role,
      content,
      timestamp: new Date()
    })
  }
}
```

**Dependencies:** PR 2.2

**Testing:**

- Send "Tell me about buoyancy control" → Education agent responds with retrieved OW content
- Send "Where can I dive in Malaysia?" → Trip planning agent responds with destinations
- Verify session persistence across multiple messages
- Test intent classification accuracy (education vs. trip planning)
- Validate tool execution (vector search returns relevant results)

---

### Phase 3: Diving Education Feature

Build the certification learning assistant with original OW/AOW content.

#### PR 3.1: OW/AOW Original Content Creation

**Branch:** `3.1-ow-aow-content`

**Description:** Create and structure original Open Water and AOW educational content

**Goal:** Populate knowledge base with comprehensive diving education materials

**Key Components/Files:**

- `data/education/open-water/` - OW topics (15-20 markdown files)
  - `equipment.md` - Diving equipment overview
  - `buoyancy.md` - Buoyancy control techniques
  - `safety.md` - Safety procedures and emergency protocols
  - `physics.md` - Diving physics (pressure, gases)
  - `marine-life.md` - Marine life awareness
  - (More topics based on OW curriculum)
- `data/education/advanced-open-water/` - AOW topics (10-15 files)
  - `deep-diving.md` - Deep diving specialty
  - `navigation.md` - Underwater navigation
  - `night-diving.md` - Night diving techniques
  - `wreck-diving.md` - Wreck diving introduction
  - (More AOW specialties)
- `scripts/seed-education.ts` - Embed education content into Supabase
- `lib/agents/education.ts` - Update with education-specific prompts

**Dependencies:** PR 2.3

**Testing:**

- Run seed script
- Ask "What is the buddy system?" → Verify accurate response with source

---

#### PR 3.2: Education Mode & Topic Navigation

**Branch:** `3.2-education-mode`

**Description:** Add education mode UI with topic browsing and structured learning

**Goal:** Help learners navigate OW/AOW topics systematically

**Key Components/Files:**

- `app/learn/page.tsx` - Education landing page with certification cards
- `app/learn/[certification]/page.tsx` - Dynamic topic browsing page
- `app/learn/[certification]/[topic]/page.tsx` - Individual topic detail page
- `components/education/TopicCard.tsx` - Individual topic card
- `components/education/CertificationCard.tsx` - OW/AOW certification cards
- `components/education/ProgressBadge.tsx` - Module completion badges
- `app/api/education/topics/[topicId]/route.ts` - Topic metadata API
- `app/chat/page.tsx` - Update with education context support
- `lib/agents/orchestrator.ts` - Add systemContext parameter

**Dependencies:** PR 3.1

**Testing:**

- Navigate to /learn → See certification cards
- Click OW card → Browse all OW topics grouped by module
- Click topic → Read content with markdown rendering
- Click "Ask AI Tutor" → Opens chat with topic context pre-loaded
- Verify agent responds with topic-specific information

---

#### PR 3.3: Quiz System & Knowledge Validation

**Branch:** `3.3-quiz-system`

**Description:** Add interactive quizzes to validate learning and track progress

**Goal:** Enable knowledge validation through quizzes with instant feedback and progress tracking

**Key Components/Files:**

- `components/quiz/QuizQuestion.tsx` - Multiple choice question component
- `components/quiz/QuizResults.tsx` - Score display and pass/fail feedback
- `components/quiz/Quiz.tsx` - Quiz container with state management
- `components/quiz/QuizStats.tsx` - Performance statistics component
- Database tables: `quiz_attempts`, `quiz_answers`
- `app/api/quiz/submit/route.ts` - Quiz submission and scoring
- `app/api/quiz/stats/[topicId]/route.ts` - Statistics endpoint
- `app/api/quiz/attempts/[attemptId]/route.ts` - Attempt details
- `app/learn/quiz-history/page.tsx` - Quiz performance dashboard
- `app/learn/[certification]/[topic]/page.tsx` - Update to include quiz
- SQL functions: `get_topic_quiz_stats`, `get_recent_quiz_attempts`

**Dependencies:** PR 3.2

**Testing:**

- Complete a topic quiz → Score calculated correctly
- Pass quiz (70%+) → User progress updated
- View /learn/quiz-history → See all attempts and statistics
- Retake quiz → New attempt recorded
- Check database → `quiz_attempts` and `quiz_answers` populated
- Verify RLS policies allow user access to own data

---

### Phase 4: Malaysia Trip Planning Feature

Build destination search and trip planning for Malaysian dive sites.

#### PR 4.1: Malaysia Dive Destination Database

**Branch:** `4.1-malaysia-destinations`

**Description:** Create comprehensive Malaysia dive destination data

**Goal:** Populate knowledge base with Malaysian dive sites (Sipadan, Tioman, Perhentian, etc.)

**Key Components/Files:**

- `data/destinations/malaysia/` - Destination markdown files
  - `sipadan.md` - Sipadan Island (Sabah)
  - `mabul.md` - Mabul Island (Sabah)
  - `kapalai.md` - Kapalai Island (Sabah)
  - `tioman.md` - Pulau Tioman (Pahang)
  - `perhentian.md` - Perhentian Islands (Terengganu)
  - `redang.md` - Redang Island (Terengganu)
  - `payar.md` - Pulau Payar Marine Park (Kedah)
  - `tenggol.md` - Pulau Tenggol (Terengganu)
  - (20+ destinations covering East/West Malaysia)
- Each file includes: location, depth range, marine life, visibility, best season, skill level, how to get there
- `scripts/seed-destinations.ts` - Embed destinations into Supabase
- `lib/agents/trip-planning.ts` - Update with Malaysia-specific prompts

**Dependencies:** PR 2.3

**Testing:**

- Run seed script
- Ask "Where can I see turtles in Malaysia?" → Verify Sipadan/Perhentian suggested

---

#### PR 4.2: Destination Search & Filtering UI

**Branch:** `4.2-destination-search`

**Description:** Build destination browser with filters (region, skill level, season, marine life)

**Goal:** Enable users to discover dive sites matching their criteria

**Key Components/Files:**

- `app/destinations/page.tsx` - Destination browser page
- `app/destinations/[slug]/page.tsx` - Individual destination detail page
- `components/destinations/DestinationCard.tsx` - Destination preview card
- `components/destinations/SearchFilters.tsx` - Filter sidebar (region, skill, season)
- `components/destinations/DestinationMap.tsx` - Simple map view (optional: use Leaflet)
- `app/api/destinations/route.ts` - Destination search API
- `app/api/destinations/[slug]/route.ts` - Single destination API

**Dependencies:** PR 4.1

**Testing:**

- Navigate to /destinations
- Apply filters (e.g., "Beginner" + "East Malaysia") → Verify filtered results
- Click destination → View detail page

---

#### PR 4.3: Trip Planning Chat Integration

**Branch:** `4.3-trip-planning-chat`

**Description:** Enhance trip planning agent to suggest destinations in chat with rich cards

**Goal:** Let users chat to plan trips with AI-suggested Malaysian dive sites

**Key Components/Files:**

- `components/chat/DestinationCard.tsx` - Rich destination card in chat
- `lib/agents/trip-planning.ts` - Enhanced prompts for destination recommendations
- `lib/agents/tools/destination-search.ts` - Tool for agent to search destinations
- `app/api/chat/route.ts` - Add structured output for destination suggestions
- `components/chat/Message.tsx` - Support rendering destination cards

**Dependencies:** PR 4.2

**Testing:**

- Ask "I'm a beginner, where should I dive in Malaysia?"
- Verify agent suggests 2-3 destinations with cards (Tioman, Redang, Perhentian)
- Click "View Details" → Opens destination page

---

### Phase 5: Asia Pacific Expansion & User Features

Expand coverage to Asia Pacific and add user personalization.

#### PR 5.1: Asia Pacific Destinations Expansion

**Branch:** `5.1-apac-destinations`

**Description:** Add dive destinations across Asia Pacific (Thailand, Philippines, Indonesia, etc.)

**Goal:** Expand trip planning coverage beyond Malaysia

**Key Components/Files:**

- `data/destinations/thailand/` - Thailand destinations (Similan, Phi Phi, Koh Tao, etc.)
- `data/destinations/philippines/` - Philippines destinations (Tubbataha, Apo Reef, Moalboal, etc.)
- `data/destinations/indonesia/` - Indonesia destinations (Raja Ampat, Komodo, Bali, etc.)
- `data/destinations/vietnam/` - Vietnam destinations (Nha Trang, Con Dao, etc.)
- `data/destinations/australia/` - Australia destinations (Great Barrier Reef, Ningaloo Reef, etc.)
- `scripts/seed-destinations.ts` - Update to include APAC destinations
- `components/destinations/SearchFilters.tsx` - Add country filter

**Dependencies:** PR 4.3

**Testing:**

- Ask "Best dive sites in Indonesia?" → Verify Raja Ampat, Komodo suggested
- Filter destinations by "Philippines" → Verify Filipino sites shown

---

#### PR 5.2: Saved Destinations & Trip Lists

**Branch:** `5.2-saved-destinations`

**Description:** Allow users to save favorite destinations and create trip lists

**Goal:** Provide personalized experience with saved data

**Key Components/Files:**

- `app/saved/page.tsx` - Saved destinations page
- `components/destinations/SaveButton.tsx` - Heart icon to save/unsave
- `app/api/saved/route.ts` - Save/unsave destinations API
- `supabase/migrations/003_saved_destinations.sql` - Add saved_destinations table
- `components/destinations/TripList.tsx` - Organize saves into trips

**Dependencies:** PR 5.1

**Testing:**

- Click heart icon on destination → Save to favorites
- Navigate to /saved → Verify saved destinations displayed
- Create trip list "Malaysia 2025" → Add multiple destinations

---

#### PR 5.3: Chat History & Session Management

**Branch:** `5.3-chat-history`

**Description:** Save chat conversations and allow users to access previous chats

**Goal:** Enable users to continue previous conversations

**Key Components/Files:**

- `app/history/page.tsx` - Chat history page
- `components/chat/SessionList.tsx` - List of previous chat sessions
- `app/api/sessions/route.ts` - Create/list sessions API
- `app/api/messages/route.ts` - Save/retrieve messages API
- `app/chat/[sessionId]/page.tsx` - Resume specific chat session
- `lib/supabase/chat.ts` - Chat persistence utilities

**Dependencies:** PR 5.2

**Testing:**

- Start chat → Messages auto-save to Supabase
- Navigate to /history → Verify previous chats listed
- Click chat → Resume conversation from where it left off

---

### Phase 6: Production Readiness & Launch

Optimize for production deployment with monitoring and analytics.

#### PR 6.1: Performance Optimization

**Branch:** `6.1-performance`

**Description:** Optimize bundle size, caching, and database queries

**Goal:** Ensure fast load times and efficient resource usage

**Key Components/Files:**

- `next.config.js` - Enable compression, image optimization
- `lib/supabase/cache.ts` - Redis caching layer (or Vercel KV)
- `app/api/*/route.ts` - Add response caching headers
- `components/chat/MessageList.tsx` - Virtual scrolling for long chats
- `middleware.ts` - Add rate limiting for API routes

**Dependencies:** PR 5.3

**Testing:**

- Run Lighthouse audit → Verify >90 performance score
- Load chat with 100+ messages → Verify smooth scrolling
- Test API rate limits → Verify 429 responses after threshold

---

#### PR 6.2: Error Handling & Monitoring

**Branch:** `6.2-monitoring`

**Description:** Add comprehensive error handling and monitoring

**Goal:** Track errors and usage in production

**Key Components/Files:**

- `lib/monitoring/sentry.ts` - Sentry error tracking (optional: use free tier)
- `lib/monitoring/analytics.ts` - PostHog/Vercel Analytics
- `app/error.tsx` - Global error boundary
- `app/api/*/route.ts` - Add try-catch with logging
- `lib/logger.ts` - Structured logging utility

**Dependencies:** PR 6.1

**Testing:**

- Trigger errors → Verify captured in Sentry
- Navigate pages → Verify analytics events tracked
- Check error.tsx → Verify friendly error page displays

---

#### PR 6.3: Production Deployment & Documentation

**Branch:** `6.3-deployment`

**Description:** Deploy to Vercel, configure environment, and create documentation

**Goal:** Launch DovvyBuddy to production

**Key Components/Files:**

- `vercel.json` - Vercel deployment configuration
- `.env.production.example` - Production environment template
- `README.md` - Project overview, setup guide, deployment instructions
- `docs/DEPLOYMENT.md` - Detailed deployment steps
- `docs/DEVELOPMENT.md` - Local development guide
- `docs/AGENTS.md` - Multi-agent architecture documentation

**Dependencies:** PR 6.2

**Testing:**

- Deploy to Vercel preview → Verify all features work
- Test production environment variables → Verify Supabase, Gemini API connected
- Run smoke tests on production URL

---

## Implementation Sequence

1. **Phase 1 (Foundation)** → **Phase 2 (AI/Multi-Agent)** → **Phase 3 (Education)** must be sequential
2. **Phase 4 (Malaysia)** builds on Phase 3
3. **Phase 5 (APAC Expansion)** and **Phase 6 (Production)** are final polish
4. Within each phase, PRs should be completed in order

**Recommended Sprint Breakdown:**

- Sprint 1-2: Phase 1 + Phase 2 (Foundation + AI)
- Sprint 3: Phase 3 (Education feature)
- Sprint 4: Phase 4 (Malaysia destinations)
- Sprint 5: Phase 5 (APAC + User features)
- Sprint 6: Phase 6 (Production launch)

## Testing Strategy

### Automated Testing

- **Unit Tests:** Vitest for utility functions (chunking, embeddings, vector search)
- **Integration Tests:** API routes with mock Gemini responses
- **E2E Tests:** Playwright for critical flows (signup, chat, destination search)

### Manual Testing Per PR

- **Functional:** Verify feature works as specified
- **Agent Quality:** Test agent responses for accuracy and helpfulness
- **RAG Accuracy:** Verify retrieved context is relevant to query
- **UI/UX:** Check responsive design, loading states, error states

### Pre-Launch Testing

- Load testing on chat API (handle 50+ concurrent users)
- Cross-browser testing (Chrome, Safari, Firefox)
- Mobile responsiveness testing
- Accessibility audit (WCAG 2.1 AA compliance)

## Success Criteria

### MVP Success Metrics

- ✅ Users can create account and login with email/password
- ✅ Chat interface responds in <3 seconds with streaming
- ✅ Education agent answers OW/AOW questions accurately (>80% relevance)
- ✅ Trip planning agent suggests relevant Malaysian dive sites
- ✅ Multi-agent router correctly classifies user intent (>90% accuracy)
- ✅ Users can browse and filter 20+ Malaysian dive destinations
- ✅ Destination detail pages are SEO-optimized and server-rendered
- ✅ Users can save favorite destinations and access chat history

### Launch Success Metrics

- ✅ Application deployed to production (Vercel)
- ✅ 100+ APAC dive destinations in knowledge base
- ✅ <2s page load time (Lighthouse score >90)
- ✅ Error rate <1% in production
- ✅ Documentation complete for contributors

## Cost Optimization Strategy (Testing Phase)

To keep costs minimal during testing:

### Free Tier Usage

- **Vercel:** Free Hobby plan (100GB bandwidth, unlimited deployments)
- **Supabase:** Free tier (500MB database, 50MB file storage, 2GB bandwidth)
- **Google Gemini API:**
  - Free tier: 15 requests/minute for Gemini 1.5 Flash
  - 1,500 requests/day for text-embedding-004
- **Vercel AI SDK:** Free, open-source

### Cost Monitoring

- Set up billing alerts in Google Cloud Console (Gemini API)
- Monitor Supabase usage dashboard
- Track API request counts in application logs
- Implement rate limiting to prevent abuse

### Scalability Path

When ready to scale beyond free tiers:

- **Vercel Pro:** $20/month (better performance)
- **Supabase Pro:** $25/month (better limits)
- **Gemini API Paid:** Pay-per-use (still very affordable vs OpenAI)

## Known Constraints & Considerations

### Technical Constraints

- **Supabase pgvector limits:** Free tier has 500MB database limit; monitor storage usage
- **Gemini API rate limits:** 15 RPM on free tier; implement queuing for production
- **Content copyright:** All educational content must be original (no PADI/SSI copyrighted material)
- **Embedding dimensions:** text-embedding-004 outputs 768 dimensions (ensure pgvector configured correctly)

### Content Considerations

- **Educational accuracy:** OW/AOW content should be reviewed by certified instructor
- **Destination data quality:** Verify dive site information is current and accurate
- **Regional coverage:** Start with Malaysia (10+ sites), expand to APAC (100+ sites)
- **Seasonal information:** Include best diving seasons for each destination

### Architecture Decisions

- **Multi-agent vs. single LLM:** Google AI Agent Framework provides specialized agents with tool integration, session management, and better accuracy through domain-specific expertise
- **Supabase vs. separate DB/vector store:** Supabase simplifies stack, pgvector sufficient for MVP, integrates well with MCP pattern
- **Gemini vs. OpenAI:** Gemini more cost-effective, competitive quality, native function calling and agent support
- **Server-side rendering:** Critical for SEO on destination pages
- **Session management:** MCP (Model Context Protocol) pattern for persistent context and conversation history

## Next Steps

1. **Review this plan** - Confirm architecture and phasing approach
2. **Set up accounts:**
   - Create Supabase project
   - Enable Google Cloud project for Gemini API
   - Create Vercel account (connect to GitHub)
3. **Start Phase 1, PR 1.1** - Initialize Next.js project
4. **Content creation planning** - Outline OW/AOW topics for original content
5. **Malaysia destination research** - Compile list of dive sites to document

---

**Ready to begin implementation?** Let me know if you'd like me to generate detailed implementation files for Phase 1 using the `generate.prompt.md` workflow, or if you have any questions about the architecture!
