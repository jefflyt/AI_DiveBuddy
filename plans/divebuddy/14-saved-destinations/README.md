# PR 5.2: Saved Destinations & Trip Lists - Complete Implementation Guide

**Branch:** `5.2-saved-destinations`  
**Depends On:** PR 5.1 (APAC destinations complete)  
**Estimated Time:** 2-3 hours

---

## Overview

Add user functionality to save favorite destinations and organize them into trip lists for future reference.

## Implementation Steps

### 5.2.1 - Create Database Schema for Saved Destinations

**File:** `supabase/migrations/003_saved_destinations.sql`

```sql
-- Create saved_destinations table
CREATE TABLE IF NOT EXISTS saved_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_slug TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  trip_list_name TEXT, -- Optional: organize into trip lists
  notes TEXT, -- User's personal notes
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, destination_slug)
);

-- Create trip_lists table
CREATE TABLE IF NOT EXISTS trip_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Add indexes
CREATE INDEX idx_saved_destinations_user ON saved_destinations(user_id);
CREATE INDEX idx_trip_lists_user ON trip_lists(user_id);

-- Row Level Security
ALTER TABLE saved_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_lists ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own saved destinations"
  ON saved_destinations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save destinations"
  ON saved_destinations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved destinations"
  ON saved_destinations FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own trip lists"
  ON trip_lists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create trip lists"
  ON trip_lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trip lists"
  ON trip_lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trip lists"
  ON trip_lists FOR DELETE
  USING (auth.uid() = user_id);
```

Run migration:
```bash
# In Supabase Dashboard SQL Editor, paste and run the above
# Or use Supabase CLI:
supabase db push
```

### 5.2.2 - Create API Routes for Saving

**File:** `app/api/saved/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabase
    .from('saved_destinations')
    .select('*')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ saved: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const { destination_slug, destination_name, destination_country, trip_list_name, notes } = body
  
  const { data, error } = await supabase
    .from('saved_destinations')
    .insert({
      user_id: user.id,
      destination_slug,
      destination_name,
      destination_country,
      trip_list_name,
      notes
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ saved: data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')
  
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }
  
  const { error } = await supabase
    .from('saved_destinations')
    .delete()
    .eq('user_id', user.id)
    .eq('destination_slug', slug)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}
```

### 5.2.3 - Create Save Button Component

**File:** `components/destinations/SaveButton.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SaveButtonProps {
  destination: {
    slug: string
    name: string
    country: string
  }
  variant?: 'default' | 'icon'
}

export function SaveButton({ destination, variant = 'default' }: SaveButtonProps) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  useEffect(() => {
    checkIfSaved()
  }, [destination.slug])
  
  async function checkIfSaved() {
    try {
      const response = await fetch('/api/saved')
      const data = await response.json()
      const isSaved = data.saved?.some((s: any) => s.destination_slug === destination.slug)
      setSaved(isSaved)
    } catch (error) {
      console.error('Error checking saved status:', error)
    }
  }
  
  async function toggleSave() {
    setLoading(true)
    
    try {
      if (saved) {
        // Unsave
        await fetch(`/api/saved?slug=${destination.slug}`, {
          method: 'DELETE'
        })
        setSaved(false)
        toast({
          title: 'Removed from saved',
          description: `${destination.name} has been removed from your saved destinations.`
        })
      } else {
        // Save
        await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination_slug: destination.slug,
            destination_name: destination.name,
            destination_country: destination.country
          })
        })
        setSaved(true)
        toast({
          title: 'Saved!',
          description: `${destination.name} has been added to your saved destinations.`
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save destination. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }
  
  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSave}
        disabled={loading}
        className={saved ? 'text-red-500' : ''}
      >
        <Heart className={saved ? 'fill-current' : ''} />
      </Button>
    )
  }
  
  return (
    <Button
      variant={saved ? 'default' : 'outline'}
      onClick={toggleSave}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <Heart className={saved ? 'fill-current' : ''} />
      {saved ? 'Saved' : 'Save Destination'}
    </Button>
  )
}
```

### 5.2.4 - Create Saved Destinations Page

**File:** `app/saved/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { DestinationCard } from '@/components/destinations/DestinationCard'
import { Button } from '@/components/ui/button'
import { Heart, FolderPlus } from 'lucide-react'
import Link from 'next/link'

export default function SavedDestinationsPage() {
  const [saved, setSaved] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchSaved()
  }, [])
  
  async function fetchSaved() {
    try {
      const response = await fetch('/api/saved')
      const data = await response.json()
      setSaved(data.saved || [])
    } catch (error) {
      console.error('Error fetching saved:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (saved.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No saved destinations yet</h2>
        <p className="text-muted-foreground mb-6">
          Start exploring and save destinations you'd like to visit!
        </p>
        <Link href="/destinations">
          <Button>Browse Destinations</Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Heart className="w-8 h-8 text-red-500" />
          Saved Destinations
        </h1>
        <p className="text-muted-foreground mt-2">
          {saved.length} destination{saved.length !== 1 ? 's' : ''} saved
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {saved.map(item => (
          <div key={item.id}>
            {/* Show destination card with saved metadata */}
            <Link href={`/destinations/${item.destination_slug}`}>
              <div className="p-4 border rounded-lg hover:shadow-lg transition">
                <h3 className="font-semibold text-lg">{item.destination_name}</h3>
                <p className="text-sm text-muted-foreground">{item.destination_country}</p>
                {item.notes && (
                  <p className="text-sm mt-2 italic">{item.notes}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Saved {new Date(item.saved_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 5.2.5 - Add Save Button to Destination Pages

**File:** `app/destinations/[slug]/page.tsx`

Add SaveButton component:

```typescript
import { SaveButton } from '@/components/destinations/SaveButton'

// In the destination page:
<div className="flex items-center gap-4 mb-8">
  <SaveButton 
    destination={{
      slug: params.slug,
      name: metadata.destination_name,
      country: metadata.country
    }}
  />
</div>
```

---

## Testing Checklist

- [ ] Migration runs successfully in Supabase
- [ ] Save button appears on destination detail pages
- [ ] Clicking save adds destination to database
- [ ] Clicking again removes destination
- [ ] `/saved` page shows saved destinations
- [ ] Empty state shows when no destinations saved
- [ ] Toast notifications work
- [ ] RLS policies prevent access to other users' data

---

## Time Estimate

- 5.2.1 Database schema: 20 minutes
- 5.2.2 API routes: 40 minutes
- 5.2.3 Save button: 30 minutes
- 5.2.4 Saved page: 40 minutes
- 5.2.5 Integration: 20 minutes

**Total: 2-3 hours**

---

## What Comes Next

**Next PR:** 5.3 - Chat History & Session Management

Add persistent chat history so users can resume previous conversations.
