# PR 6.2: Error Handling & Monitoring - Complete Implementation Guide

**Branch:** `6.2-monitoring`  
**Depends On:** PR 6.1 (Performance optimized)  
**Estimated Time:** 2-3 hours

---

## Overview

Implement comprehensive error handling, monitoring, and analytics for production.

## Implementation Steps

### 6.2.1 - Integrate Sentry for Error Tracking

**Install dependencies:**
```bash
npm install @sentry/nextjs
```

**Initialize Sentry:**
```bash
npx @sentry/wizard@latest -i nextjs
```

**File:** `sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Session replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  
  // Filter out expected errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
  
  beforeSend(event, hint) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      return null
    }
    
    // Filter out specific errors
    if (event.exception) {
      const error = hint.originalException
      if (error && typeof error === 'object' && 'status' in error) {
        // Don't report 404s or 401s
        if (error.status === 404 || error.status === 401) {
          return null
        }
      }
    }
    
    return event
  },
})
```

**File:** `sentry.server.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
})
```

**File:** `sentry.edge.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

### 6.2.2 - Add PostHog Analytics

**Install dependency:**
```bash
npm install posthog-js
```

**File:** `lib/analytics/posthog.ts`

```typescript
import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.opt_out_capturing() // Disable in development
        }
      },
      capture_pageview: false, // Disable automatic pageview capture (we'll do it manually)
      capture_pageleave: true,
    })
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }
}

export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, traits)
  }
}
```

**File:** `app/providers.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog } from '@/lib/analytics/posthog'
import posthog from 'posthog-js'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    initPostHog()
  }, [])
  
  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])
  
  return <>{children}</>
}
```

**Update:** `app/layout.tsx`

```typescript
import { AnalyticsProvider } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
```

### 6.2.3 - Create Global Error Boundary

**File:** `app/error.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
        
        <div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="text-left bg-gray-100 p-4 rounded-lg overflow-auto max-h-40">
            <pre className="text-xs">{error.message}</pre>
          </div>
        )}
        
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**File:** `app/global-error.tsx`

```typescript
'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Application Error</h2>
            <p className="text-muted-foreground mb-4">
              Something went wrong. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

### 6.2.4 - Add Structured Logging

**File:** `lib/logger.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  userId?: string
  sessionId?: string
  action?: string
  [key: string]: any
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...context
    }
    
    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
      logFn(`[${timestamp}] ${level.toUpperCase()}: ${message}`, context || '')
    }
    
    // Send to Sentry for errors
    if (level === 'error') {
      Sentry.captureException(new Error(message), {
        extra: context,
        level: 'error'
      })
    }
    
    // In production, could send to logging service
    if (process.env.NODE_ENV === 'production') {
      // Example: send to CloudWatch, Datadog, etc.
      // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(logData) })
    }
  }
  
  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }
  
  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }
  
  error(message: string, context?: LogContext) {
    this.log('error', message, context)
  }
  
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context)
    }
  }
}

export const logger = new Logger()
```

**Usage example in API route:**

```typescript
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    logger.info('Chat request received', { 
      userId: user.id,
      sessionId: session.id 
    })
    
    // ... API logic
    
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Chat API error', {
      userId: user?.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
```

---

## Environment Variables

Add to `.env.local`:

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Testing Checklist

### Error Tracking
- [ ] Trigger intentional error - verify captured in Sentry
- [ ] Check error details include stack trace, context
- [ ] Verify source maps uploaded (for readable stack traces)
- [ ] Test error boundary UI displays correctly
- [ ] Confirm 404 and 401 errors filtered out

### Analytics
- [ ] Page views tracked correctly
- [ ] Custom events fire (e.g., "Chat Sent", "Destination Saved")
- [ ] User identification works
- [ ] Properties attached to events correctly
- [ ] Analytics disabled in development

### Logging
- [ ] Logs appear in console (development)
- [ ] Error logs sent to Sentry
- [ ] Log context includes relevant data
- [ ] No sensitive data logged (passwords, tokens)

---

## Key Events to Track

Add these custom events throughout the app:

```typescript
// Chat interactions
trackEvent('chat_message_sent', { agent_type: 'education' })
trackEvent('chat_session_created')

// Destination interactions
trackEvent('destination_viewed', { slug: 'sipadan' })
trackEvent('destination_saved', { slug: 'sipadan', country: 'malaysia' })

// User actions
trackEvent('signup_completed')
trackEvent('profile_updated')

// Education tracking
trackEvent('topic_viewed', { topic: 'buoyancy' })
trackEvent('quiz_completed', { score: 85, topic: 'safety' })
```

---

## Time Estimate

- 6.2.1 Sentry integration: 45 minutes
- 6.2.2 PostHog analytics: 40 minutes
- 6.2.3 Error boundaries: 35 minutes
- 6.2.4 Logging system: 30 minutes

**Total: 2-3 hours**

---

## What Comes Next

**Next PR:** 6.3 - Production Deployment & Documentation

Final deployment configuration and comprehensive documentation.
