# PR 6.1: Performance Optimization - Complete Implementation Guide

**Branch:** `6.1-performance`  
**Depends On:** PR 5.3 (All features complete)  
**Estimated Time:** 3-4 hours

---

## Overview

Optimize application performance for production including bundle size, caching, API rate limiting, and rendering optimizations.

## Implementation Steps

### 6.1.1 - Configure Next.js Optimizations

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Enable React compiler (if using React 19+)
  experimental: {
    reactCompiler: true,
  },
  
  // Output standalone for Docker deployment
  output: 'standalone',
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      }
    }
    return config
  },
  
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### 6.1.2 - Add Response Caching with Vercel KV

**Install dependency:**
```bash
npm install @vercel/kv
```

**File:** `lib/cache/kv.ts`

```typescript
import { kv } from '@vercel/kv'

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  // Try to get from cache
  const cached = await kv.get<T>(key)
  if (cached) {
    return cached
  }
  
  // Fetch fresh data
  const data = await fetcher()
  
  // Store in cache
  await kv.set(key, data, { ex: ttl })
  
  return data
}

export async function invalidateCache(pattern: string) {
  // Clear cache matching pattern
  const keys = await kv.keys(pattern)
  if (keys.length > 0) {
    await kv.del(...keys)
  }
}
```

**File:** `app/api/destinations/route.ts` (add caching)

```typescript
import { getCached } from '@/lib/cache/kv'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const cacheKey = `destinations:${params.toString()}`
  
  const destinations = await getCached(
    cacheKey,
    async () => {
      // Existing fetch logic here
      // ...
      return fetchedDestinations
    },
    1800 // Cache for 30 minutes
  )
  
  return NextResponse.json({ destinations })
}
```

### 6.1.3 - Implement Virtual Scrolling for Long Chat Histories

**Install dependency:**
```bash
npm install @tanstack/react-virtual
```

**File:** `components/chat/MessageList.tsx`

```typescript
'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useEffect } from 'react'
import { Message } from './Message'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated message height
    overscan: 5 // Render 5 extra items above/below viewport
  })
  
  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight
    }
  }, [messages.length])
  
  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-auto"
      style={{ height: '100%' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <Message message={messages[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 6.1.4 - Add API Rate Limiting

**File:** `lib/rate-limit.ts`

```typescript
import { NextRequest } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

const cache = new Map()

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (request: NextRequest, limit: number, token: string) => {
      const tokenCount = cache.get(token) || [0, 0]
      
      if (tokenCount[0] === 0) {
        tokenCount[0] = Date.now()
      }
      
      const diff = Date.now() - tokenCount[0]
      
      if (diff > config.interval) {
        // Reset counter
        tokenCount[0] = Date.now()
        tokenCount[1] = 0
      }
      
      tokenCount[1] += 1
      
      const currentUsage = tokenCount[1]
      const isRateLimited = currentUsage > limit
      
      cache.set(token, tokenCount)
      
      return {
        success: !isRateLimited,
        limit,
        remaining: limit - currentUsage,
        reset: new Date(tokenCount[0] + config.interval)
      }
    }
  }
}

// Usage in middleware
export const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
})
```

**File:** `middleware.ts` (update)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { limiter } from './lib/rate-limit'

export async function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/chat')) {
    const ip = request.ip ?? '127.0.0.1'
    const { success, limit, remaining, reset } = await limiter.check(
      request,
      20, // 20 requests per minute
      ip
    )
    
    if (!success) {
      return new NextResponse('Rate limit exceeded', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toISOString()
        }
      })
    }
  }
  
  // Continue with existing middleware logic
  return NextResponse.next()
}
```

### 6.1.5 - Bundle Size Optimization

**Install bundle analyzer:**
```bash
npm install @next/bundle-analyzer
```

**File:** `next.config.js` (add analyzer)

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

**Run analysis:**
```bash
ANALYZE=true npm run build
```

**Optimize imports (tree-shaking):**

```typescript
// ❌ Bad - imports entire library
import _ from 'lodash'

// ✅ Good - imports only what's needed
import debounce from 'lodash/debounce'

// ❌ Bad - imports all icons
import * as Icons from 'lucide-react'

// ✅ Good - import specific icons
import { Heart, MapPin } from 'lucide-react'
```

**File:** `.npmrc` (add)

```
legacy-peer-deps=false
audit-level=moderate
package-lock=true
```

---

## Testing Checklist

### Performance Metrics
- [ ] Run Lighthouse audit - achieve >90 performance score
- [ ] Page load time < 2 seconds (3G network)
- [ ] Time to Interactive (TTI) < 3 seconds
- [ ] First Contentful Paint (FCP) < 1.5 seconds
- [ ] Largest Contentful Paint (LCP) < 2.5 seconds

### Bundle Size
- [ ] Total JavaScript bundle < 300KB gzipped
- [ ] Vendor chunk < 200KB
- [ ] Main chunk < 100KB
- [ ] No duplicate dependencies

### Caching
- [ ] API responses cached appropriately
- [ ] Cache invalidation works on data updates
- [ ] Static assets cached with long TTL
- [ ] CDN headers configured correctly

### Rate Limiting
- [ ] Rate limiting triggers after limit exceeded
- [ ] Rate limit headers returned correctly
- [ ] 429 status code returned on limit
- [ ] Rate limit resets after time window

### Virtual Scrolling
- [ ] Chat with 500+ messages renders smoothly
- [ ] Scroll performance is smooth (60 FPS)
- [ ] New messages auto-scroll to bottom
- [ ] No memory leaks with long conversations

---

## Monitoring Recommendations

Add these environment variables for production:

```bash
# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_id

# Speed Insights
ENABLE_SPEED_INSIGHTS=true
```

**File:** `app/layout.tsx`

```typescript
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## Time Estimate

- 6.1.1 Next.js config: 40 minutes
- 6.1.2 Caching layer: 60 minutes
- 6.1.3 Virtual scrolling: 45 minutes
- 6.1.4 Rate limiting: 50 minutes
- 6.1.5 Bundle optimization: 45 minutes

**Total: 3-4 hours**

---

## What Comes Next

**Next PR:** 6.2 - Error Handling & Monitoring

Implement comprehensive error tracking and analytics.
