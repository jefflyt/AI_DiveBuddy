# DiveBuddy - Quick Start Guide

**Get your development environment running in 15 minutes**
This guide walks you through the minimum steps to start implementing DiveBuddy from scratch. Follow these steps in order before diving into the detailed implementation files in `plans/divebuddy/`.

---

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Git** installed
- [ ] **Code editor** (VS Code recommended)
- [ ] **Google account** (for Gemini API)
- [ ] **Supabase account** ([Sign up free](https://supabase.com))
- [ ] **Vercel account** (optional, for deployment - [Sign up](https://vercel.com))

Check your Node.js version:

```bash
node --version  # Should be v18 or higher
```

---

## Phase 0: Account Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name:** `divebuddy-dev`
   - **Database Password:** (generate a strong password - save it!)
   - **Region:** Choose closest to you (e.g., Singapore for Malaysia)
   - **Pricing Plan:** Free
4. Click **"Create new project"** (takes 1-2 minutes)
5. Once ready, go to **Settings → API**:
   - Copy **Project URL** → Save as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon/public key** → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Get Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API Key"** or **"Create API Key"**
3. Select **"Create API key in new project"**
4. Copy the key → Save as `GOOGLE_GEMINI_API_KEY`

**Important:** Keep these credentials safe. Never commit them to Git!

---

## Phase 1: Project Initialization (3 minutes)

### Step 1: Create Next.js Project

```bash
# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest divebuddy \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd divebuddy
```

When prompted:

- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ `src/` directory → **NO** (we'll use `app/` directly)
- ✅ App Router
- ✅ Import alias: `@/*`

### Step 2: Install Core Dependencies

```bash
# Supabase client
npm install @supabase/supabase-js @supabase/ssr

# Google AI SDK
npm install @google/generative-ai

# Vercel AI SDK
npm install ai

# Schema validation and utilities
npm install zod uuid

# Dev dependencies
npm install -D @types/uuid
```

### Step 3: Set Up Environment Variables

Create `.env.local` in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google Gemini
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here

# App Config (optional)
NEXT_PUBLIC_APP_NAME=DiveBuddy
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Create `.env.example` (for Git):

```bash
# Copy from .env.local but remove actual values
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_GEMINI_API_KEY=
NEXT_PUBLIC_APP_NAME=DiveBuddy
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add to `.gitignore`:

```bash# Local env files
.env.local
.env*.local
```

---

## Phase 2: Verify Setup (2 minutes)

### Step 1: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you should see the default Next.js page.

### Step 2: Test Supabase Connection

Create `app/api/test-supabase/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { data, error } = await supabase.from('_test').select('*').limit(1)
  
  return NextResponse.json({
    status: error ? 'error' : 'connected',
    message: error?.message || 'Supabase connected successfully',
  })
}
```

Test: [http://localhost:3000/api/test-supabase](http://localhost:3000/api/test-supabase)

### Step 3: Test Gemini API

Create `app/api/test-gemini/route.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent('Say hello in one word')
    const response = result.response.text()
    
    return NextResponse.json({
      status: 'connected',
      message: 'Gemini API working',
      sample: response,
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
```

Test: [http://localhost:3000/api/test-gemini](http://localhost:3000/api/test-gemini)

---

## Phase 3: Start Implementation (5 minutes)

Now you're ready to follow the detailed implementation plans!

### Recommended Order

1. **Start with PR 1.1:** [1-nextjs-setup/](./1-nextjs-setup/)
   - Follow `1.1-initialize-project.md` (skip if already done above)
   - Then `1.2-setup-shadcn-ui.md`
   - Then `1.3-create-landing-page.md`
   - Then `1.4-environment-setup.md`

2. **Continue to PR 1.2:** [2-supabase-setup/](./2-supabase-setup/)
   - Database schema and pgvector setup

3. **Build Authentication (PR 1.3):**
   - Email/password auth with Supabase

4. **Create Chat UI (PR 1.4):**
   - Message components and input handling

5. **Integrate AI (Phase 2):**
   - Follow all steps in `2-ai-integration/`

---

## Project Structure

After completing the quick start, your project should look like:

``` plain text
divebuddy/
├── app/
│   ├── api/
│   │   ├── test-supabase/route.ts
│   │   └── test-gemini/route.ts
│   ├── page.tsx
│   └── layout.tsx
├── lib/                        # Will be created in PR 1.2+
│   ├── supabase/
│   ├── agents/
│   └── utils/
├── components/                 # Will be created in PR 1.3+
├── .env.local                  # Your secrets (NOT in Git)
├── .env.example               # Template (in Git)
├── package.json
└── README.md
```

---

## Common Issues & Solutions

### Issue: Supabase connection fails

**Solution:**

- Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server: `Ctrl+C`, then `npm run dev`
- Verify Supabase project is active (not paused)

### Issue: Gemini API returns 403

**Solution:**
- Verify API key is correct in `.env.local`

- Check you've enabled Gemini API in Google Cloud Console
- Try generating a new API key

### Issue: TypeScript errors in generated files

**Solution:**

- Run `npm install` to ensure all types are installed
- Restart VS Code TypeScript server: `Cmd/Ctrl + Shift + P` → "Restart TS Server"

### Issue: Port 3000 already in use

**Solution:**

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

---

## Next Steps

✅ **Setup Complete!** You're ready to build DiveBuddy.

### Choose Your Path

**Option A: Full Implementation (Recommended)**
Follow all implementation files in order:

1. `plans/divebuddy/1-nextjs-setup/` (Foundation)
2. `plans/divebuddy/2-supabase-setup/` (Database)
3. `plans/divebuddy/2-ai-integration/` (Google AI Agent Framework)

**Option B: Feature-First**
Jump to specific features:

- Want chat first? → Start with PR 1.4 (Chat UI)
- Want AI first? → Start with PR 2.3 (Google AI Framework)
- Want content first? → Start with Phase 3 (Education Feature)

**Option C: Explore the Plan**
Read `plans/divebuddy/plan.md` to understand the full architecture before coding.

---

## Resources

- **Project Plan:** [plans/divebuddy/plan.md](./plan.md)
- **Implementation Files:** [plans/divebuddy/](./README.md)
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Google Gemini Docs:** https://ai.google.dev/docs
- **Vercel AI SDK:** https://sdk.vercel.ai/docs

---

## Getting Help

If you encounter issues:

1. Check the troubleshooting section in each implementation file
2. Review the `plan.md` for architectural context
3. Consult official documentation for each tool
4. Check Supabase logs: Project → Logs → API/Postgres
5. Check browser console and terminal for error messages

---

**Happy coding! 🤿 Let's build DiveBuddy together.**
