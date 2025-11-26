# PR 5.3: Chat History & Session Management - Complete Implementation Guide

**Branch:** `5.3-chat-history`  
**Depends On:** PR 5.2 (Saved destinations complete)  
**Estimated Time:** 2-3 hours

---

## Overview

Implement persistent chat history so users can resume previous conversations and access their chat archive.

## Implementation Steps

### 5.3.1 - Update Session Storage Schema

The `chat_sessions` and `messages` tables should already exist from PR 1.2. Verify and enhance:

**File:** `supabase/migrations/004_enhance_sessions.sql`

```sql
-- Enhance chat_sessions table (if not already complete)
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_session_timestamp
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_timestamp();

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_sessions_user_updated 
  ON chat_sessions(user_id, updated_at DESC);
```

### 5.3.2 - Create Session Management API Routes

**File:** `app/api/sessions/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all sessions for user
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .select(`
      id,
      title,
      created_at,
      updated_at,
      archived,
      messages (count)
    `)
    .eq('user_id', user.id)
    .eq('archived', false)
    .order('updated_at', { ascending: false })
    .limit(50)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ sessions: data })
}

// POST - Create new session
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const { title } = body
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: user.id,
      title: title || 'New Chat',
      context: {}
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ session: data })
}
```

**File:** `app/api/sessions/[sessionId]/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Retrieve specific session with messages
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .select(`
      id,
      title,
      created_at,
      updated_at,
      context,
      messages (
        id,
        role,
        content,
        created_at
      )
    `)
    .eq('id', params.sessionId)
    .eq('user_id', user.id)
    .single()
  
  if (error) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }
  
  return NextResponse.json({ session: data })
}

// DELETE - Archive session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { error } = await supabase
    .from('chat_sessions')
    .update({ archived: true })
    .eq('id', params.sessionId)
    .eq('user_id', user.id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}
```

### 5.3.3 - Create Chat History Page

**File:** `app/history/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Trash2, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Session {
  id: string
  title: string
  created_at: string
  updated_at: string
  messages: { count: number }[]
}

export default function ChatHistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchSessions()
  }, [])
  
  async function fetchSessions() {
    try {
      const response = await fetch('/api/sessions')
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }
  
  async function deleteSession(sessionId: string) {
    if (!confirm('Archive this chat? You can still access it later.')) return
    
    try {
      await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE'
      })
      setSessions(sessions.filter(s => s.id !== sessionId))
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }
  
  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }
  
  if (sessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No chat history</h2>
        <p className="text-muted-foreground mb-6">
          Your conversations will appear here
        </p>
        <Link href="/chat">
          <Button>Start a Chat</Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <MessageSquare className="w-8 h-8" />
          Chat History
        </h1>
        <p className="text-muted-foreground mt-2">
          {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="grid gap-4">
        {sessions.map(session => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {session.messages[0]?.count || 0} messages
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                    </span>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSession(session.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/chat/${session.id}`}>
                <Button variant="outline" className="w-full">
                  Resume Chat
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### 5.3.4 - Update Chat Page to Support Sessions

**File:** `app/chat/[sessionId]/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { ChatContainer } from '@/components/chat/ChatContainer'
import { useRouter } from 'next/navigation'

export default function SessionChatPage({
  params
}: {
  params: { sessionId: string }
}) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    fetchSession()
  }, [params.sessionId])
  
  async function fetchSession() {
    try {
      const response = await fetch(`/api/sessions/${params.sessionId}`)
      if (!response.ok) {
        router.push('/chat') // Redirect if session not found
        return
      }
      const data = await response.json()
      setSession(data.session)
    } catch (error) {
      console.error('Error fetching session:', error)
      router.push('/chat')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <div>Loading chat...</div>
  }
  
  if (!session) {
    return null
  }
  
  return (
    <ChatContainer
      sessionId={session.id}
      initialMessages={session.messages}
      title={session.title}
    />
  )
}
```

### 5.3.5 - Add Session Management to Chat UI

**File:** `components/chat/ChatHeader.tsx`

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'

interface ChatHeaderProps {
  sessionTitle?: string
  onNewChat: () => void
}

export function ChatHeader({ sessionTitle, onNewChat }: ChatHeaderProps) {
  return (
    <div className="border-b p-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        {sessionTitle || 'New Chat'}
      </h2>
      <div className="flex items-center gap-2">
        <Link href="/history">
          <Button variant="ghost" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            History
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={onNewChat}>
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
    </div>
  )
}
```

---

## Testing Checklist

- [ ] Migration runs successfully
- [ ] New chat creates session in database
- [ ] Messages persist to database
- [ ] `/history` page shows all user's chats
- [ ] Clicking "Resume Chat" loads previous conversation
- [ ] "New Chat" button creates fresh session
- [ ] Archive functionality works
- [ ] Session titles auto-generate from first message
- [ ] Recent sessions appear at top of history
- [ ] RLS prevents access to other users' sessions

---

## Time Estimate

- 5.3.1 Schema updates: 20 minutes
- 5.3.2 API routes: 50 minutes
- 5.3.3 History page: 40 minutes
- 5.3.4 Session chat page: 30 minutes
- 5.3.5 Header component: 20 minutes

**Total: 2-3 hours**

---

## What Comes Next

**Next Phase:** Phase 6 - Production Readiness

Focus on performance optimization, monitoring, and deployment preparation.
