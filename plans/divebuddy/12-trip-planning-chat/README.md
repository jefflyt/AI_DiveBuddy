# PR 4.3: Trip Planning Chat Integration - Complete Implementation Guide

**Branch:** `4.3-trip-planning-chat`  
**Depends On:** PR 4.2 (Destination UI complete)  
**Estimated Time:** 2-3 hours

---

## Overview

Enhance the trip planning agent to suggest destinations in chat with rich cards and integrate destination search tools.

## Implementation Steps

### 4.3.1 - Create Destination Card for Chat

**File:** `components/chat/DestinationCard.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin, Eye, Waves } from 'lucide-react'

interface ChatDestinationCardProps {
  destination: {
    name: string
    slug: string
    region: string
    skillLevel: string
    visibility: string
    highlights: string[]
    marineLife: string[]
  }
}

export function ChatDestinationCard({ destination }: ChatDestinationCardProps) {
  return (
    <Card className="my-4 max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">{destination.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {destination.region}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Waves className="w-4 h-4 text-blue-500" />
            <span>{destination.skillLevel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-cyan-500" />
            <span>{destination.visibility}</span>
          </div>
        </div>
        
        {destination.highlights.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Highlights</h4>
            <ul className="text-sm space-y-1">
              {destination.highlights.slice(0, 2).map((h, i) => (
                <li key={i} className="text-muted-foreground">• {h}</li>
              ))}
            </ul>
          </div>
        )}
        
        <Link href={`/destinations/${destination.slug}`}>
          <Button size="sm" variant="outline" className="w-full">
            View Full Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
```

### 4.3.2 - Add Destination Search Tool to Trip Planning Agent

**File:** `lib/agents/tools/destination-search.ts`

```typescript
import { Tool } from '@google/generative-ai/agents'
import { createClient } from '@/lib/supabase/client'
import { embed } from '@/lib/ai/embeddings'

export const destinationSearchTool: Tool = {
  name: 'search_dive_destinations',
  description: `Search for dive destinations based on user criteria.
    Use this when users ask about where to dive, trip planning, or destination recommendations.
    Parameters:
    - query: User's search criteria (e.g., "beginner sites", "turtle diving", "Malaysia")
    - filters: Optional filters (skillLevel, region, month)`,
  
  parameters: {
    query: 'string',
    skillLevel: 'string (optional)',
    region: 'string (optional)',
    month: 'number (optional)'
  },
  
  execute: async ({ query, skillLevel, region, month }) => {
    const supabase = createClient()
    
    // Vector search for relevant destinations
    const queryEmbedding = await embed(query)
    
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5,
      filter: { category: 'destinations' }
    })
    
    if (error) throw error
    
    // Apply additional filters if provided
    let results = data
    
    if (skillLevel) {
      results = results.filter((d: any) => 
        d.content.toLowerCase().includes(skillLevel.toLowerCase())
      )
    }
    
    if (region) {
      results = results.filter((d: any) =>
        d.metadata.region.toLowerCase().includes(region.toLowerCase())
      )
    }
    
    // Return formatted results
    return {
      destinations: results.map((r: any) => ({
        name: r.metadata.destination_name,
        region: r.metadata.region,
        slug: r.metadata.source.split('/')[1],
        relevance: r.similarity,
        summary: r.content.substring(0, 300)
      })),
      count: results.length
    }
  }
}
```

### 4.3.3 - Update Trip Planning Agent with Tool

**File:** `lib/agents/trip-planning-agent.ts`

```typescript
import { Agent } from '@google/generative-ai/agents'
import { vectorSearchTool } from './tools/vector-search'
import { destinationSearchTool } from './tools/destination-search'

export class TripPlanningAgent {
  private agent: Agent
  
  constructor() {
    this.agent = new Agent({
      model: 'gemini-1.5-flash',
      name: 'Trip Planning Expert',
      instructions: `You are a dive trip planning assistant specializing in Malaysia and Asia Pacific.
        
        When users ask about destinations:
        1. Use the search_dive_destinations tool to find relevant sites
        2. Suggest 2-3 destinations that match their criteria
        3. Format responses with destination cards (use [DESTINATION_CARD] format)
        4. Provide practical advice on getting there, best times, etc.
        
        Always consider:
        - User's skill level and experience
        - Time of year (monsoon seasons)
        - Budget and accessibility
        - Specific marine life interests`,
      
      tools: [vectorSearchTool, destinationSearchTool],
      
      config: {
        temperature: 0.4, // Balanced creativity and accuracy
        maxOutputTokens: 1024
      }
    })
  }
  
  async execute(message: string, session: Session) {
    const response = await this.agent.chat(message, {
      sessionId: session.id,
      history: session.messages
    })
    
    // Parse response for destination cards
    const enrichedResponse = this.enrichWithDestinationCards(response)
    
    return enrichedResponse
  }
  
  private enrichWithDestinationCards(response: string) {
    // Look for [DESTINATION_CARD:slug] markers and convert to React components
    // This will be handled in the chat UI component
    return response
  }
}
```

### 4.3.4 - Integrate Destination Cards in Chat UI

**File:** `components/chat/Message.tsx`

```typescript
import { ChatDestinationCard } from './DestinationCard'
import ReactMarkdown from 'react-markdown'

function parseDestinationCards(content: string) {
  // Parse [DESTINATION_CARD:slug] markers
  const cardRegex = /\[DESTINATION_CARD:(\w+)\]/g
  const cards: string[] = []
  let match
  
  while ((match = cardRegex.exec(content)) !== null) {
    cards.push(match[1])
  }
  
  return { cards, cleanContent: content.replace(cardRegex, '') }
}

export function Message({ message }: { message: Message }) {
  const { cards, cleanContent } = parseDestinationCards(message.content)
  
  return (
    <div className={cn('message', message.role === 'user' ? 'user' : 'agent')}>
      <ReactMarkdown>{cleanContent}</ReactMarkdown>
      
      {/* Render destination cards */}
      {cards.map(slug => (
        <ChatDestinationCard key={slug} slug={slug} />
      ))}
    </div>
  )
}
```

---

## Testing Checklist

- [ ] Ask "Where should I dive in Malaysia?" → Agent uses destination search tool
- [ ] Response includes 2-3 destination suggestions
- [ ] Destination cards render in chat
- [ ] "View Full Details" links work
- [ ] Agent considers skill level ("I'm a beginner")
- [ ] Agent considers timing ("visiting in July")
- [ ] Tool integration doesn't break existing chat functionality

---

## Example Conversation

**User:** "I'm an Open Water diver visiting Malaysia in June. Where should I go to see turtles?"

**Agent Response:**
"Great! June is an excellent time for diving in Malaysia. Based on your skill level and interest in turtles, I recommend these destinations:

**Pulau Perhentian** is perfect for Open Water divers and famous for turtle encounters. The calm, shallow reefs make it beginner-friendly, and you're almost guaranteed to see green and hawksbill turtles.

[DESTINATION_CARD:perhentian]

**Pulau Tioman** is another fantastic option with excellent turtle populations at sites like Chebeh Island. It's easily accessible from Kuala Lumpur.

[DESTINATION_CARD:tioman]

Both destinations have calm seas in June and offer great visibility. Would you like more details about accommodation or dive operators?"

---

## Time Estimate

**Total: 2-3 hours** for all substeps combined
