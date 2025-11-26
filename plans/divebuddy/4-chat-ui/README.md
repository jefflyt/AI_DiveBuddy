# PR 1.4: Chat UI Components - Complete Implementation Guide

**Part of:** Phase 1 - Foundation  
**Focus:** Build interactive chat interface with streaming support  
**Total Steps:** 4 (4.1-4.4)  
**Estimated Time:** 45 minutes

---

## Step 4.1: Chat Message Components

### Create Message Bubble Component

Create `src/components/chat/message-bubble.tsx`:

```typescript
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface MessageBubbleProps {
  role: 'user' | 'agent'
  content: string
  timestamp?: Date
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex gap-3 mb-4', isUser && 'flex-row-reverse')}>
      <Avatar className={cn(
        'w-8 h-8',
        isUser ? 'bg-blue-100' : 'bg-coral-100'
      )}>
        <AvatarFallback>
          {isUser ? 'You' : '🤿'}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        'flex flex-col max-w-[70%]',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className={cn(
          'rounded-2xl px-4 py-2',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        )}>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-gray-500 mt-1 px-1">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  )
}
```

### Create Typing Indicator

Create `src/components/chat/typing-indicator.tsx`:

```typescript
export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-sm">
        🤿
      </div>
      <div className="bg-gray-100 rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}
```

---

## Step 4.2: Chat Input Component

Create `src/components/chat/chat-input.tsx`:

```typescript
'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SendHorizontal } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder = 'Ask DiveBuddy anything...' }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed || disabled) return

    onSend(trimmed)
    setMessage('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
  }

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-[150px] resize-none"
          rows={1}
        />
        <Button 
          onClick={handleSend} 
          disabled={!message.trim() || disabled}
          size="icon"
          className="h-11 w-11 shrink-0"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
```

---

## Step 4.3: Chat Container & State Management

### Create Chat Hook

Create `src/hooks/useChat.ts`:

```typescript
import { useState, useCallback, useRef, useEffect } from 'react'

export interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

export function useChat(initialSessionId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const data = await response.json()

      // Update session ID
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId)
      }

      // Add agent response
      const agentMessage: Message = {
        id: crypto.randomUUID(),
        role: 'agent',
        content: data.response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, agentMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  const clearChat = useCallback(async () => {
    if (sessionId) {
      await fetch(`/api/chat?sessionId=${sessionId}`, { method: 'DELETE' })
    }
    setMessages([])
    setSessionId(undefined)
    setError(null)
  }, [sessionId])

  return {
    messages,
    sessionId,
    isLoading,
    error,
    sendMessage,
    clearChat,
    messagesEndRef,
  }
}
```

### Create Chat Container

Create `src/components/chat/chat-container.tsx`:

```typescript
'use client'

import { useChat } from '@/hooks/useChat'
import { MessageBubble } from './message-bubble'
import { TypingIndicator } from './typing-indicator'
import { ChatInput } from './chat-input'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw } from 'lucide-react'

interface ChatContainerProps {
  sessionId?: string
  className?: string
}

export function ChatContainer({ sessionId, className }: ChatContainerProps) {
  const { messages, isLoading, error, sendMessage, clearChat, messagesEndRef } = useChat(sessionId)

  return (
    <div className={className}>
      {/* Header */}
      <div className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-lg">DiveBuddy Chat</h2>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat}>
            <RotateCcw className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg font-medium">Welcome to DiveBuddy! 🤿</p>
            <p className="text-sm mt-2">Ask me about diving education or trip planning.</p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  )
}
```

---

## Step 4.4: Chat Page

Create `src/app/chat/page.tsx`:

```typescript
import { ChatContainer } from '@/components/chat/chat-container'
import { getCurrentUser } from '@/lib/auth/get-user'
import { redirect } from 'next/navigation'

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

---

## Install Required Dependencies

```bash
npx shadcn-ui@latest add textarea avatar
npm install lucide-react
```

---

## Verification Checklist

- [ ] Message bubbles render with correct styling
- [ ] User and agent messages visually distinct
- [ ] Typing indicator animates during loading
- [ ] Chat input expands with multi-line text
- [ ] Enter key sends message (Shift+Enter for new line)
- [ ] Auto-scroll to bottom on new messages
- [ ] Clear chat button resets conversation
- [ ] Error messages display when API fails
- [ ] Protected route redirects unauthenticated users

---

## Testing

1. Navigate to `/chat` while logged in
2. Type "What is buoyancy control?" → Send
3. Verify:
   - Message appears in chat
   - Typing indicator shows
   - Agent response appears
   - Auto-scrolls to bottom
4. Test multi-line input with Shift+Enter
5. Click "New Chat" → Verify messages clear

---

## Files Created

- ✅ `src/components/chat/message-bubble.tsx`
- ✅ `src/components/chat/typing-indicator.tsx`
- ✅ `src/components/chat/chat-input.tsx`
- ✅ `src/components/chat/chat-container.tsx`
- ✅ `src/hooks/useChat.ts`
- ✅ `src/app/chat/page.tsx`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Messages don't scroll | Check `messagesEndRef` is attached to bottom div |
| Textarea doesn't expand | Verify `handleInput` resizes height |
| Enter sends unexpectedly | Check `!e.shiftKey` condition in `handleKeyDown` |
| API errors | Ensure `/api/chat` route exists (from PR 2.3) |
| TypeScript errors | Run `npm install lucide-react @types/react` |

---

## PR 1.4 Complete! ✅

Chat UI fully implemented with:
- Message components with user/agent distinction
- Auto-resizing input with keyboard shortcuts
- Typing indicators and error handling
- Session management and chat history
- Protected route for authenticated users

**Next:** Phase 2 - AI Integration (PRs 2.1-2.3)
