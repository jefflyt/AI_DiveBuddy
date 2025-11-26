# PR 4.2: Destination Search & Filtering UI - Complete Implementation Guide

**Branch:** `4.2-destination-search`  
**Depends On:** PR 4.1 (Malaysia destinations seeded)  
**Estimated Time:** 2-3 hours total

---

## Overview

Build the destination browsing experience with filtering, search, and individual destination detail pages.

## Substeps Summary

### 4.2.1 - Create Destination Browser Page ✅
Already created in `4.2.1-create-destination-browser.md`

### 4.2.2 - Create Destination Detail Pages

**File:** `app/destinations/[slug]/page.tsx`

Create dynamic destination pages showing full content, dive sites, getting there info, and more.

**Key Components:**
- Fetch destination by slug from database
- Render full markdown content with syntax highlighting
- Display metadata (coordinates, skill level, best months)
- Show dive sites section
- "Save Destination" button (for later PR)
- Share functionality

**Example Implementation:**

```typescript
// app/destinations/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Waves } from 'lucide-react'

export async function generateStaticParams() {
  const supabase = createClient()
  const { data } = await supabase
    .from('diving_documents')
    .select('metadata')
    .eq('category', 'destinations')
    .eq('metadata->>chunk_index', '0')
  
  return data?.map(doc => ({
    slug: doc.metadata.source.split('/')[1]
  })) || []
}

export default async function DestinationPage({
  params
}: {
  params: { slug: string }
}) {
  const supabase = createClient()
  
  // Fetch all chunks for this destination
  const { data, error } = await supabase
    .from('diving_documents')
    .select('content, metadata')
    .eq('category', 'destinations')
    .ilike('metadata->>source', `%${params.slug}`)
    .order('metadata->>chunk_index')
  
  if (error || !data || data.length === 0) {
    notFound()
  }
  
  // Combine chunks
  const fullContent = data.map(d => d.content).join('\n\n')
  const metadata = data[0].metadata
  
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{metadata.destination_name}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {metadata.region}
          </span>
        </div>
      </div>
      
      {/* Markdown Content */}
      <div className="prose prose-blue max-w-none">
        <ReactMarkdown>{fullContent}</ReactMarkdown>
      </div>
    </article>
  )
}
```

**Install dependencies:**
```bash
npm install react-markdown remark-gfm
```

### 4.2.3 - Add Destination Map View (Optional)

**File:** `components/destinations/DestinationMap.tsx`

Add interactive map showing all destinations using Leaflet or Mapbox.

**Note:** This is optional for MVP. Can be added later.

---

## Testing Checklist

- [ ] `/destinations` page shows all Malaysian destinations
- [ ] Filters work correctly
- [ ] `/destinations/sipadan` loads detail page
- [ ] `/destinations/tioman` loads detail page
- [ ] All markdown renders correctly
- [ ] Navigation between browse and detail pages works
- [ ] Mobile responsive

---

## Time Estimate

- 4.2.1: 45-60 minutes ✅
- 4.2.2: 45-60 minutes
- 4.2.3: 30-45 minutes (optional)
- **Total: 2-3 hours**
