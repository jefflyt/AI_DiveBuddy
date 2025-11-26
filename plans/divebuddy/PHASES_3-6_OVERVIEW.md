# Phase 3: Education Feature - Implementation Overview

**Goal:** Create comprehensive diving education content with OW and AOW courses  
**PRs:** 3.1-3.3  
**Estimated Time:** 2-3 weeks

---

## PR 3.1: Create OW/AOW Content Structure

### Implementation Summary

**Create content schemas and templates:**

```typescript
// src/lib/content/schema.ts
export interface EducationModule {
  id: string
  course: 'OW' | 'AOW'
  moduleNumber: number
  title: string
  objectives: string[]
  content: string
  keyTerms: { term: string; definition: string }[]
  quizQuestions?: QuizQuestion[]
}

export const owModules: EducationModule[] = [
  {
    id: 'ow-1',
    course: 'OW',
    moduleNumber: 1,
    title: 'Introduction to Scuba Diving',
    objectives: [
      'Understand basic diving physics',
      'Learn dive equipment components',
      'Know basic safety procedures',
    ],
    content: `...comprehensive content...`,
    keyTerms: [
      { term: 'BCD', definition: 'Buoyancy Control Device...' },
      { term: 'Regulator', definition: 'Device that reduces tank pressure...' },
    ],
  },
  // ... 4 more modules for OW
]
```

**Content Topics:**

**Open Water (5 modules):**
1. Introduction to Scuba Diving
2. Equipment and How It Works
3. Buoyancy Control and Diving Skills
4. Dive Planning and Environment
5. Safety, Problem Management, and Certification

**Advanced Open Water (5 adventures):**
1. Deep Diving (mandatory)
2. Underwater Navigation (mandatory)
3. Peak Performance Buoyancy
4. Wreck Diving
5. Night Diving / Drift Diving

---

## PR 3.2: Interactive Learning Components

### Create Quiz System

```typescript
// src/components/education/quiz.tsx
export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  // Multiple choice quiz with instant feedback
  // Progress tracking
  // Score calculation
  // Certificate generation on passing
}
```

### Create Progress Tracking

```sql
-- Database schema addition
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  course TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, module_id)
);
```

---

## PR 3.3: Education Agent Enhancement

### Integrate Content with Agent

Update Education Agent to:
- Reference specific modules in responses
- Adapt difficulty based on user's certification level
- Provide module recommendations
- Generate practice questions

```typescript
// src/lib/agents/education-agent.ts (enhanced)
const systemPrompt = `You are an expert scuba diving instructor...

Available Modules:
${modules.map(m => `- ${m.title}`).join('\n')}

User Context:
- Certification: ${userCertification}
- Modules Completed: ${completedModules.length}/${totalModules}

When answering:
1. Reference relevant modules
2. Adjust difficulty to user level
3. Suggest next learning steps
`
```

---

## Files to Create

### PR 3.1: Content Structure
- ✅ `src/lib/content/ow-modules.ts` - Open Water content
- ✅ `src/lib/content/aow-modules.ts` - Advanced OW content
- ✅ `src/lib/content/schema.ts` - Type definitions
- ✅ `src/app/learn/page.tsx` - Learning dashboard

### PR 3.2: Interactive Components
- ✅ `src/components/education/module-card.tsx` - Module display
- ✅ `src/components/education/quiz.tsx` - Quiz interface
- ✅ `src/components/education/progress-bar.tsx` - Visual progress
- ✅ `src/app/api/progress/route.ts` - Progress tracking API

### PR 3.3: Agent Integration
- ✅ Enhanced `src/lib/agents/education-agent.ts`
- ✅ `src/lib/content/retriever.ts` - Module lookup utilities

---

## Testing Checklist

- [ ] All OW modules display correctly
- [ ] All AOW modules display correctly
- [ ] Quiz questions work with scoring
- [ ] Progress saves to database
- [ ] Education agent references modules
- [ ] Certificate generated on course completion

---

## Key Metrics

**Content Volume:**
- Open Water: ~8,000 words across 5 modules
- Advanced OW: ~6,000 words across 5 adventures
- Total quiz questions: ~50

**Expected Outcomes:**
- Users can complete theoretical training
- Progress tracked across sessions
- Agent provides contextual module recommendations

---

# Phase 4: Malaysia Destinations - Implementation Overview

**Goal:** Comprehensive dive site information for Malaysian destinations  
**PRs:** 4.1-4.3  
**Estimated Time:** 2 weeks

---

## PR 4.1: Destination Database

### Seed Malaysia Destinations

```typescript
// scripts/seed-destinations.ts
const malaysianDestinations = [
  {
    name: 'Sipadan Island',
    country: 'Malaysia',
    region: 'Sabah',
    diveSites: [
      {
        name: 'Barracuda Point',
        depth: { min: 5, max: 30 },
        difficulty: 'advanced',
        highlights: ['Barracuda tornado', 'Jacks', 'Grey reef sharks'],
        description: '...',
      },
      // ... more sites
    ],
    bestSeason: 'March-October',
    difficultyLevel: 'advanced',
    features: ['Wall diving', 'Pelagics', 'Strong currents'],
    coordinates: { lat: 4.1132, lng: 118.6288 },
  },
  // Perhentian, Tioman, Redang, Mabul, Layang-Layang, etc.
]
```

**Destinations to Cover:**
1. Sipadan (Sabah)
2. Mabul & Kapalai (Sabah)
3. Layang-Layang (Sabah)
4. Perhentian Islands (Terengganu)
5. Redang Island (Terengganu)
6. Tioman Island (Pahang)
7. Langkawi (Kedah)
8. Miri & Luconia Shoals (Sarawak)

---

## PR 4.2: Destination UI Components

```typescript
// src/app/destinations/page.tsx
export default function DestinationsPage() {
  return (
    <div>
      <FilterBar regions={regions} difficulties={difficulties} />
      <DestinationGrid destinations={destinations} />
      <MapView destinations={destinations} />
    </div>
  )
}

// src/app/destinations/[id]/page.tsx
export default function DestinationDetail({ params }: { params: { id: string } }) {
  return (
    <div>
      <HeroImage />
      <DestinationInfo />
      <DiveSitesList />
      <BestTimeToVisit />
      <HowToGetThere />
      <ChatWithAI destination={destination} />
    </div>
  )
}
```

---

## PR 4.3: Trip Planning Agent Enhancement

### Add Destination Recommendations

```typescript
// Enhanced trip planning agent with:
- Budget-based filtering
- Season-aware suggestions
- Skill level matching
- Multi-destination itineraries

const systemPrompt = `You are a dive trip planning specialist for Malaysia...

Available Destinations:
${destinations.map(d => `
- ${d.name} (${d.region})
  Difficulty: ${d.difficultyLevel}
  Best: ${d.bestSeason}
  Highlights: ${d.features.join(', ')}
`).join('\n')}

Consider:
- User certification level
- Travel dates and seasons
- Budget constraints
- Marine life preferences
`
```

---

# Phase 5: APAC Expansion - Implementation Overview

**Goal:** Add Singapore, Thailand, Indonesia, Philippines destinations  
**PRs:** 5.1-5.2  
**Estimated Time:** 1-2 weeks

---

## PR 5.1: APAC Destination Database

**Countries to Add:**
- **Singapore:** Pulau Hantu, Sisters' Islands
- **Thailand:** Similan Islands, Koh Tao, Richelieu Rock
- **Indonesia:** Raja Ampat, Komodo, Bali, Bunaken
- **Philippines:** Tubbataha, Apo Reef, Malapascua, Anilao

**Implementation:**

```typescript
// Similar structure to Malaysia destinations
// Add ~30 more destinations across APAC
// Include liveaboard options
// Add regional dive seasons
// Include visa and travel requirements
```

---

## PR 5.2: Multi-Country Trip Planning

### Enhanced Features:
- Regional itineraries (e.g., "Borneo Circuit")
- Flight connection suggestions
- Budget comparison across countries
- Seasonal migration patterns (e.g., whale sharks, mantas)

---

# Phase 6: Production Launch - Implementation Overview

**Goal:** Production-ready deployment with monitoring  
**PRs:** 6.1-6.3  
**Estimated Time:** 1-2 weeks

---

## PR 6.1: Performance Optimization

### Implement Caching

```typescript
// src/lib/cache/redis.ts (optional)
// Or use Vercel KV for edge caching

export async function getCachedDestinations() {
  const cached = await kv.get('destinations')
  if (cached) return cached

  const fresh = await fetchDestinations()
  await kv.set('destinations', fresh, { ex: 3600 })
  return fresh
}
```

### Image Optimization
- Compress destination images
- Use Next.js Image component
- Implement lazy loading

### Database Optimization
- Add connection pooling
- Optimize vector search queries
- Create materialized views for common queries

---

## PR 6.2: Monitoring & Analytics

```typescript
// src/lib/analytics/tracking.ts
export function trackChatInteraction(data: {
  sessionId: string
  intent: string
  responseTime: number
  userSatisfaction?: number
}) {
  // Send to analytics service
}

// Implement:
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Usage metrics (custom dashboard)
- RAG quality metrics (retrieval accuracy)
```

---

## PR 6.3: Production Deployment

### Deployment Checklist:

- [ ] Environment variables configured on Vercel
- [ ] Supabase production project created
- [ ] Database migrations applied
- [ ] Content seeded to production
- [ ] Custom domain configured
- [ ] SSL certificates active
- [ ] Rate limiting enabled
- [ ] Backup strategy implemented
- [ ] Monitoring dashboards configured
- [ ] Documentation updated

### Post-Launch:
- Monitor error rates
- Track user engagement
- Gather feedback
- Iterate on agent responses

---

## Complete File Structure Summary

```
divebuddy/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── chat/
│   │   └── page.tsx
│   ├── learn/
│   │   ├── page.tsx
│   │   └── [moduleId]/
│   ├── destinations/
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── profile/
│   └── api/
│       ├── chat/
│       ├── progress/
│       └── destinations/
├── components/
│   ├── chat/
│   ├── education/
│   ├── destinations/
│   └── ui/
├── lib/
│   ├── supabase/
│   ├── gemini/
│   ├── agents/
│   ├── embeddings/
│   ├── content/
│   ├── cache/
│   └── analytics/
├── scripts/
│   ├── seed-content.ts
│   └── seed-destinations.ts
└── ...
```

---

## Next Steps for User

1. **Start with Phase 1-2** (Foundation + AI) - Already have implementation files
2. **Phase 3** (Education) - Create content, then implement UI
3. **Phase 4** (Malaysia) - Research destinations, gather images, implement
4. **Phase 5** (APAC) - Expand based on Phase 4 patterns
5. **Phase 6** (Production) - Optimize and deploy

**Recommendation:** Implement incrementally, test thoroughly at each phase, and gather user feedback before moving to the next phase.
