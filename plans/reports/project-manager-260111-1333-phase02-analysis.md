# Phase 2: Next.js 16 Modernization - Implementation Task Breakdown

**Date:** 2026-01-11
**Status:** Analysis Complete - Ready for Implementation
**Phase Dependency:** Phase 1 (Foundation) ✅ Complete
**Total Estimated Effort:** 10 hours
**Priority:** P1 (High Impact)

---

## Executive Summary

Phase 2 requires implementing 4 core Next.js 16 experimental features to modernize the codebase. Current state analysis shows:

- **✅ Foundation Ready:** Phase 1 complete with logging, rate limiting, and test suite in place
- **Tech Stack Confirmed:** Next.js 16.1.1, React 19.2, TypeScript 5.9, Prisma 7
- **Current Config Status:** `next.config.mjs` has basic security headers; needs PPR flag addition
- **API Routes Ready for Migration:** 3 form endpoints identified (contact, careers, report)
- **Component Structure:** Hero component has dynamic Particles; other sections need audit

**Critical Dependencies:** Rate limiting must work in Server Actions via `headers()` function

---

## Current State Assessment

### ✅ Completed Prerequisites (Phase 1)

- Structured logging (lib/logger.ts) with Pino
- Rate limiting (lib/rate-limit.ts) with Upstash Redis
- 252 tests passing
- TypeScript strict mode enabled
- Security headers configured

### Configuration Status

```javascript
// next.config.mjs CURRENT STATE:
// ✅ Security headers present
// ❌ PPR flag missing
// ✅ Server Actions configured (bodySizeLimit)
// ❌ Experimental caching not configured
```

### API Routes to Migrate

1. `/app/api/contact/route.ts` - 65 lines, uses rate limiting, email
2. `/app/api/careers/route.ts` - 67 lines, uses rate limiting, email
3. `/app/api/report/route.ts` - 70 lines, uses rate limiting, email

**Pattern Observed:** All three routes follow identical structure:

- Rate limit check → Validation (Zod) → DB save → Email send → Response

---

## Task Breakdown by Deliverable

## Deliverable 1: Enable Partial Prerendering (PPR)

**Objective:** Enable experimental PPR to render static shell instantly, stream dynamic content

**Files to Modify:**

- `next.config.mjs` - Add experimental PPR flag
- `app/page.tsx` - Opt-in per-route
- `components/sections/Hero.tsx` - Wrap dynamic Particles in Suspense

### Task 1.1: Update next.config.mjs

**Effort:** 0.5h | **Priority:** P1 | **Dependencies:** None

```javascript
// CURRENT (lines 19-23):
experimental: {
  serverActions: {
    bodySizeLimit: '2mb',
  },
},

// TARGET:
experimental: {
  ppr: true, // Enable globally for all routes (per-route opt-in still required)
  serverActions: {
    bodySizeLimit: '2mb',
  },
},
```

**Verification:**

```bash
pnpm dev
# Check network tab for "Transfer-Encoding: chunked" response
# Verify no build errors
```

**Test Case:** Dev server starts, homepage loads without errors

---

### Task 1.2: Opt-in PPR on Homepage

**Effort:** 0.5h | **Priority:** P1 | **Dependencies:** 1.1

```typescript
// app/page.tsx - ADD at top (line 1, before imports):
export const experimental_ppr = true;

// FULL FILE:
import type { Metadata } from 'next';
import { Hero, WhoWeAre, OurFocus, OurProducts, AISection, CTABand } from '@/components/sections';

export const metadata: Metadata = {
  title: 'CIUSLABS - Exploring the Next Frontier',
  description: 'A technology studio at the intersection of design, AI, and Web3...',
};

export const experimental_ppr = true; // NEW

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhoWeAre />
      <OurFocus />
      <OurProducts />
      <AISection />
      <CTABand />
    </main>
  );
}
```

**Verification:**

```bash
pnpm dev
# Homepage loads <100ms for static shell
# Particles animation loads after (streaming)
```

**Test Case:** Network tab shows chunked transfer encoding

---

### Task 1.3: Wrap Hero Particles in Suspense

**Effort:** 1h | **Priority:** P1 | **Dependencies:** 1.1, 1.2, 2.1 (LoadingFallback)

**Problem:** Particles component is dynamic (client-side animation). Without Suspense boundary, it blocks homepage from streaming.

**Current Hero.tsx Structure (lines 36-60):**

```typescript
// Lines 36-60: Static content + Particles inline
<section className="relative h-screen...">
  <motion.div style={{ y }} className="...">
    {/* Parallax Background */}
  </motion.div>

  <div className="absolute inset-0 bg-black/10 z-[1]" />

  {/* NO SUSPENSE BOUNDARY - Particles blocks render */}
  <div className="absolute inset-0 opacity-50 z-[2]">
    <Particles {...PARTICLES_CONFIG} />
  </div>

  {/* Static content */}
  <div className="relative z-[10] w-full...">
    {/* Hero title, text, buttons */}
  </div>
</section>
```

**Target State:**

```typescript
'use client';

import { useRef } from 'react';
import { Suspense } from 'react'; // ADD
import Link from 'next/link';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Particles } from '@/components/magicui';
import { cn } from '@/lib/utils';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { ParticlesSkeleton } from '@/components/common/LoadingFallback'; // ADD

const PARTICLES_CONFIG = {
  // ... same config
};

const PARALLAX_OFFSET: ['start start', 'end start'] = ['start start', 'end start'];
const PARALLAX_RANGE: [string, string] = ['0vh', '-20vh'];

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: PARALLAX_OFFSET,
  });

  const y = useTransform(scrollYProgress, [0, 1], PARALLAX_RANGE);

  return (
    <section
      ref={container}
      className="relative h-screen flex items-start justify-center overflow-hidden pt-12 md:pt-8"
    >
      {/* Parallax Background - STATIC */}
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0 w-full h-[120vh]"
          style={{
            backgroundImage: 'url(/images/Bg-image.avif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </motion.div>

      {/* Background Overlay - STATIC */}
      <div className="absolute inset-0 bg-black/10 z-[1]" />

      {/* PARTICLES WRAPPED IN SUSPENSE - NEW */}
      <Suspense fallback={<ParticlesSkeleton />}>
        <div className="absolute inset-0 opacity-50 z-[2]">
          <Particles {...PARTICLES_CONFIG} />
        </div>
      </Suspense>

      {/* Content - STATIC */}
      <div className="relative z-[10] w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* ... all existing content unchanged ... */}
      </div>

      {/* Gradient Fade Out - STATIC */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[3434px] h-[194px] pointer-events-none z-[5]"
        style={{
          background: 'linear-gradient(180deg, rgba(2, 2, 2, 0) 0%, hsl(0 0% 1.5%) 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  );
}
```

**Key Changes:**

- Line 2: Import `Suspense` from React
- Line 10: Import `ParticlesSkeleton` fallback
- Lines 66-70: Wrap Particles div in `<Suspense fallback={<ParticlesSkeleton />}>`

**Verification:**

```bash
pnpm dev
# Open Network tab with throttling (3G)
# Homepage static content renders immediately
# Particles fade in after loading
```

**Test Case:** Lighthouse reports faster First Contentful Paint (FCP)

---

## Deliverable 2: Implement "use cache" Directive

**Objective:** Explicitly cache expensive DB/API operations to replace implicit fetch() caching

**Current Status:** No explicit caching in place. All data fetching relies on default behavior.

### Task 2.1: Audit Async Server Components

**Effort:** 1h | **Priority:** P1 | **Dependencies:** None

**Goal:** Identify which components fetch data and which operations are expensive

**Files to Audit:**

1. `app/page.tsx` - HomePage
2. `app/layout.tsx` - RootLayout
3. `components/sections/*.tsx` - All section components

**Search Command:**

```bash
grep -r "async function" app/ components/ --include="*.tsx" | grep -v "use client"
grep -r "await prisma" app/ lib/ --include="*.ts" --include="*.tsx"
grep -r "await fetch" app/ --include="*.tsx"
```

**Expected Findings:**

- Current app/page.tsx: No DB calls (homepage is static, sections render static content)
- API routes (app/api/\*/route.ts): All do DB writes (not cacheable per se, but read operations within could be)

**Audit Report Template:**

```
ASYNC SERVER COMPONENTS AUDIT
==============================

Homepage (app/page.tsx):
- Status: STATIC (no async operations)
- Recommendation: Can still add "use cache" for future expansion

Sections (components/sections/):
- [List each component]
- [Whether it's async]
- [What it fetches]

API Routes (app/api/):
- contact/route.ts: Reads nothing, writes Contact
- careers/route.ts: Reads nothing, writes Career
- report/route.ts: Reads nothing, writes ReportDownload
- Recommendation: Keep as-is, migrate to Server Actions instead

CONCLUSION:
Currently minimal caching opportunities (mostly static homepage).
Focus on preparing infrastructure for future dynamic content.
```

**Output:** Create `/Users/Chuo/CODE/Code Learn/plans/260110-1544-source-code-refactor/audit-async-components.md`

---

### Task 2.2: Prepare Caching Infrastructure

**Effort:** 1h | **Priority:** P1 | **Dependencies:** 2.1

**Goal:** Set up pattern for "use cache" directive even if no immediate candidates exist

**Create:** `lib/data/cache.ts`

```typescript
// lib/data/cache.ts
'use cache';

import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

/**
 * Cached data fetching helper
 * Use for expensive database queries or external API calls
 *
 * Example:
 * const getCachedContent = unstable_cache(
 *   async () => prisma.content.findMany(),
 *   ['content-cache'],
 *   { revalidate: 3600, tags: ['content'] }
 * )
 */

// Template for future use:
// export const getCachedExample = unstable_cache(
//   async () => {
//     return await prisma.resource.findMany({
//       where: { published: true },
//       select: { id: true, title: true, slug: true },
//     });
//   },
//   ['resource-cache'], // Cache key prefix
//   {
//     revalidate: 3600,  // Revalidate every 1 hour
//     tags: ['resources'], // For granular invalidation
//   }
// );

/**
 * Invalidation helpers for Server Actions
 * Use revalidateTag() to invalidate specific cache groups
 *
 * Example in Server Action:
 * await revalidateTag('resources');
 */
```

**Create:** `lib/data/index.ts` (barrel file)

```typescript
// lib/data/index.ts
export * from './cache';
```

**Documentation:** Add comment to next.config.mjs explaining caching strategy

```javascript
// next.config.mjs - ADD COMMENT:
/**
 * CACHING STRATEGY:
 *
 * Next.js 16 experimental "use cache" directive:
 * - Use unstable_cache() for expensive operations
 * - Add 'use cache' directive at function/module level
 * - Use tags for granular revalidation (revalidateTag)
 * - Server Actions can invalidate tags after mutations
 *
 * Current Status: Infrastructure ready, awaiting dynamic content
 *
 * See: lib/data/cache.ts for patterns
 */
```

**Verification:**

```bash
pnpm build
# Should build without errors
# No runtime errors for 'use cache' directive
```

**Test Case:** Build succeeds with "use cache" infrastructure in place

---

### Task 2.3: Add Cache Tags Documentation

**Effort:** 0.5h | **Priority:** P2 | **Dependencies:** 2.2

**Create:** `docs/caching-strategy.md`

````markdown
# Caching Strategy (Next.js 16)

## Overview

Uses Next.js 16 experimental "use cache" directive with tag-based invalidation.

## Implementation Patterns

### Database Queries (Read Operations)

```typescript
// lib/data/users.ts
'use cache';
export const getCachedUsers = unstable_cache(async () => prisma.user.findMany(), ['users-list'], {
  revalidate: 3600,
  tags: ['users'],
});
```
````

### Invalidation in Server Actions

```typescript
// lib/actions/user.ts
'use server';
export async function createUser(data) {
  const user = await prisma.user.create({ data });
  revalidateTag('users'); // Invalidates all user-related caches
  return user;
}
```

## Cache Tags Strategy

- `users` → All user-related data
- `content` → Page content, posts
- `products` → Product catalog
- `metadata` → Global site metadata

## Monitoring

- Use Next.js Analytics to track cache hit rates
- Monitor revalidation patterns in logs
- Adjust revalidate times based on data freshness needs

````

---

## Deliverable 3: Migrate API Routes to Server Actions

**Objective:** Convert 3 form API routes to Server Actions while preserving rate limiting

**Files to Create:**
- `lib/actions/contact.ts` - Contact form action
- `lib/actions/careers.ts` - Careers form action
- `lib/actions/report.ts` - Report download action

**Files to Modify:**
- Components using these endpoints (client components need to switch from fetch to Server Action imports)

### Task 3.1: Create Contact Form Server Action
**Effort:** 1.5h | **Priority:** P1 | **Dependencies:** None

**File:** Create `/Users/Chuo/CODE/Code Learn/lib/actions/contact.ts`

```typescript
'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { contactRateLimit } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export interface ContactActionResult {
  success: boolean;
  message: string;
  id?: string;
  errors?: Record<string, string[]>;
  retryAfter?: number;
}

/**
 * Server Action: Submit contact form
 * - Validates input with Zod
 * - Applies rate limiting per IP
 * - Saves to database
 * - Sends confirmation email
 * - Returns typed result for client consumption
 */
export async function submitContact(
  formData: FormData
): Promise<ContactActionResult> {
  try {
    // Get client IP from headers (works in Server Actions)
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
      headersList.get('x-real-ip') ||
      'unknown';

    // Apply rate limiting
    if (contactRateLimit) {
      const { success, limit, remaining, reset } = await contactRateLimit.limit(ip);

      if (!success) {
        apiLogger.warn(
          { ip, limit, remaining, reset },
          'Rate limit exceeded for contact form'
        );
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: reset,
        };
      }
    }

    // Parse FormData into object
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // Validate with Zod
    const validatedData = contactSchema.parse(rawData);

    // Save to database
    const contact = await prisma.contact.create({
      data: validatedData,
    });

    // Send confirmation email
    await sendEmail({
      to: validatedData.email,
      subject: 'Thank you for contacting us',
      html: emailTemplates.contactConfirmation(validatedData.name),
    });

    apiLogger.info(
      { contactId: contact.id, email: validatedData.email },
      'Contact form submitted successfully'
    );

    return {
      success: true,
      message: 'Contact form submitted successfully',
      id: contact.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors as Record<string, string[]>;
      return {
        success: false,
        message: 'Validation error',
        errors,
      };
    }

    apiLogger.error({ error }, 'Contact form error');
    return {
      success: false,
      message: 'Internal server error. Please try again later.',
    };
  }
}
````

**Key Implementation Details:**

1. **'use server' directive** (line 1) - Makes this a Server Action
2. **headers() import** (line 3) - Get request headers in Server Action (not available in regular functions)
3. **Rate limiting** - Works the same way as in API routes
4. **Zod validation** - Reuse exact schema from current API route
5. **Return type** - Typed result object for client to handle
6. **Error handling** - ZodError vs other errors
7. **Logging** - Uses existing apiLogger

**Differences from API Route:**
| Aspect | API Route | Server Action |
|--------|-----------|---------------|
| Import headers | `request: NextRequest` | `await headers()` |
| Get body | `await request.json()` | FormData passed directly |
| Return response | `NextResponse.json()` | Return typed object |
| CSRF protection | Manual verification | Automatic (Next.js) |
| Client-side | fetch() call | Direct import + useTransition |

---

### Task 3.2: Create Careers Form Server Action

**Effort:** 1.5h | **Priority:** P1 | **Dependencies:** None

**File:** Create `/Users/Chuo/CODE/Code Learn/lib/actions/careers.ts`

```typescript
'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { careersRateLimit } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

const careerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  position: z.string().min(2, 'Position is required'),
  message: z.string().optional(),
});

export type CareerFormData = z.infer<typeof careerSchema>;

export interface CareerActionResult {
  success: boolean;
  message: string;
  id?: string;
  errors?: Record<string, string[]>;
  retryAfter?: number;
}

/**
 * Server Action: Submit career application
 * - Validates input with Zod
 * - Applies rate limiting per IP
 * - Saves to database
 * - Sends confirmation email
 */
export async function submitCareerApplication(formData: FormData): Promise<CareerActionResult> {
  try {
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
      headersList.get('x-real-ip') ||
      'unknown';

    if (careersRateLimit) {
      const { success, limit, remaining, reset } = await careersRateLimit.limit(ip);

      if (!success) {
        apiLogger.warn(
          { ip, limit, remaining, reset },
          'Rate limit exceeded for career application'
        );
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: reset,
        };
      }
    }

    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      position: formData.get('position'),
      message: formData.get('message') || undefined,
    };

    const validatedData = careerSchema.parse(rawData);

    const career = await prisma.career.create({
      data: validatedData,
    });

    await sendEmail({
      to: validatedData.email,
      subject: 'Career Application Received',
      html: emailTemplates.careerApplication(validatedData.name, validatedData.position),
    });

    apiLogger.info(
      { careerId: career.id, position: validatedData.position },
      'Career application submitted successfully'
    );

    return {
      success: true,
      message: 'Application submitted successfully',
      id: career.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors as Record<string, string[]>;
      return {
        success: false,
        message: 'Validation error',
        errors,
      };
    }

    apiLogger.error({ error }, 'Career application error');
    return {
      success: false,
      message: 'Internal server error. Please try again later.',
    };
  }
}
```

---

### Task 3.3: Create Report Download Server Action

**Effort:** 1.5h | **Priority:** P1 | **Dependencies:** None

**File:** Create `/Users/Chuo/CODE/Code Learn/lib/actions/report.ts`

```typescript
'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { reportRateLimit } from '@/lib/rate-limit';
import { apiLogger } from '@/lib/logger';

const reportSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ReportFormData = z.infer<typeof reportSchema>;

export interface ReportActionResult {
  success: boolean;
  message: string;
  id?: string;
  errors?: Record<string, string[]>;
  retryAfter?: number;
}

/**
 * Server Action: Request report download
 * - Validates email
 * - Applies rate limiting per IP
 * - Records download request in database
 * - Sends download link via email
 */
export async function requestReportDownload(formData: FormData): Promise<ReportActionResult> {
  try {
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
      headersList.get('x-real-ip') ||
      'unknown';

    if (reportRateLimit) {
      const { success, limit, remaining, reset } = await reportRateLimit.limit(ip);

      if (!success) {
        apiLogger.warn({ ip, limit, remaining, reset }, 'Rate limit exceeded for report download');
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
          retryAfter: reset,
        };
      }
    }

    const rawData = {
      email: formData.get('email'),
    };

    const validatedData = reportSchema.parse(rawData);

    const report = await prisma.reportDownload.create({
      data: {
        email: validatedData.email,
      },
    });

    await sendEmail({
      to: validatedData.email,
      subject: 'Your Report is Ready',
      html: emailTemplates.reportDownload(validatedData.email),
    });

    apiLogger.info(
      { reportId: report.id, email: validatedData.email },
      'Report download requested successfully'
    );

    return {
      success: true,
      message: 'Report download link sent to your email',
      id: report.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors as Record<string, string[]>;
      return {
        success: false,
        message: 'Validation error',
        errors,
      };
    }

    apiLogger.error({ error }, 'Report download error');
    return {
      success: false,
      message: 'Internal server error. Please try again later.',
    };
  }
}
```

---

### Task 3.4: Create Server Actions Barrel File

**Effort:** 0.5h | **Priority:** P1 | **Dependencies:** 3.1, 3.2, 3.3

**File:** Create `/Users/Chuo/CODE/Code Learn/lib/actions/index.ts`

```typescript
// lib/actions/index.ts
export { submitContact, type ContactFormData, type ContactActionResult } from './contact';
export { submitCareerApplication, type CareerFormData, type CareerActionResult } from './careers';
export { requestReportDownload, type ReportFormData, type ReportActionResult } from './report';
```

**Verification:**

```bash
pnpm build
# No TypeScript errors
# Server Actions compile successfully
```

---

### Task 3.5: Update Client Components (Contact Form Example)

**Effort:** 2h | **Priority:** P1 | **Dependencies:** 3.1-3.4

**NOTE:** This example assumes a Contact form component exists. You'll need to:

1. Find the component file that uses the contact API endpoint
2. Replace `fetch()` call with Server Action import
3. Use `useTransition()` for pending state

**Example Pattern:**

```typescript
'use client';

import { useTransition } from 'react';
import { submitContact } from '@/lib/actions';

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitContact(formData);

      if (result.success) {
        setSuccess(true);
        e.currentTarget.reset();
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your email"
        required
      />
      <textarea
        name="message"
        placeholder="Your message"
        required
      />

      <button
        type="submit"
        disabled={isPending}
      >
        {isPending ? 'Sending...' : 'Submit'}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Message sent successfully!</p>}
    </form>
  );
}
```

**Key Differences from fetch() API:**

1. No `fetch()` call needed - Server Action handles it
2. `useTransition()` provides `isPending` automatically
3. No need to parse JSON - Server Action returns typed object
4. No fetch error handling needed - Server Action handles it
5. Automatic CSRF protection - Next.js handles it

---

## Deliverable 4: Add Suspense Boundaries

**Objective:** Wrap async components in Suspense for better streaming and loading states

### Task 4.1: Create LoadingFallback Components

**Effort:** 1h | **Priority:** P1 | **Dependencies:** None

**File:** Create `/Users/Chuo/CODE/Code Learn/components/common/LoadingFallback.tsx`

```typescript
// components/common/LoadingFallback.tsx
import { cn } from '@/lib/utils';

export interface FallbackProps {
  className?: string;
}

/**
 * Particles Loading Skeleton
 * Used as fallback for Hero particles during streaming
 */
export function ParticlesSkeleton({ className }: FallbackProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 opacity-50 z-[2]',
        'bg-gradient-to-br from-blue-500/5 to-purple-500/5',
        'animate-pulse',
        className
      )}
      aria-busy="true"
      aria-label="Loading particles animation"
    />
  );
}

/**
 * Generic Section Skeleton
 * Used for any async section components
 */
export function SectionSkeleton({ className }: FallbackProps) {
  return (
    <div
      className={cn(
        'w-full py-12 md:py-20 px-4',
        'bg-gradient-to-r from-slate-900/20 to-slate-800/20',
        'animate-pulse',
        className
      )}
      aria-busy="true"
      aria-label="Loading section"
    >
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="h-12 bg-slate-700/30 rounded-lg w-3/4" />
        <div className="h-4 bg-slate-700/30 rounded-lg w-full" />
        <div className="h-4 bg-slate-700/30 rounded-lg w-5/6" />
      </div>
    </div>
  );
}

/**
 * Card List Skeleton
 * Used for async card grids (products, portfolio, etc.)
 */
export function CardGridSkeleton({
  count = 3,
  className,
}: FallbackProps & { count?: number }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-64 bg-slate-700/30 rounded-lg animate-pulse"
          aria-busy="true"
        />
      ))}
    </div>
  );
}

/**
 * Text Block Skeleton
 * Used for text-heavy async sections
 */
export function TextBlockSkeleton({ className }: FallbackProps) {
  return (
    <div className={cn('space-y-3', className)} aria-busy="true">
      <div className="h-4 bg-slate-700/30 rounded w-full" />
      <div className="h-4 bg-slate-700/30 rounded w-full" />
      <div className="h-4 bg-slate-700/30 rounded w-3/4" />
    </div>
  );
}
```

**Update:** `/Users/Chuo/CODE/Code Learn/components/common/index.ts` (barrel file)

```typescript
// Add to existing barrel file:
export {
  ParticlesSkeleton,
  SectionSkeleton,
  CardGridSkeleton,
  TextBlockSkeleton,
} from './LoadingFallback';
```

---

### Task 4.2: Audit All Sections for Async Operations

**Effort:** 1.5h | **Priority:** P1 | **Dependencies:** 4.1

**Objective:** Identify which section components are async or have async children

**Files to Check:**

```
components/sections/
├── Hero.tsx - Already modified (particles in Suspense)
├── WhoWeAre.tsx - Check for async content
├── OurFocus.tsx - Check for async content
├── OurProducts.tsx - Check for async content
├── AISection.tsx - Check for async content
└── CTABand.tsx - Check for async content
```

**Audit Questions:**

1. Does component have `async` keyword?
2. Does it use `await prisma.*`?
3. Does it use `await fetch()`?
4. Does it have child components that are async?

**Audit Template:**

```markdown
## Section Suspense Audit

### Hero.tsx

- Status: PARTIALLY ASYNC (Particles wrapped in Suspense)
- Additional async: None
- Action: Complete ✅

### WhoWeAre.tsx

- Status: [STATIC/ASYNC]
- Data fetched: [None/List of operations]
- Action: [No change needed / Add Suspense / Convert to async]

[Repeat for each section...]
```

**Expected Result:** Most sections are static; document which ones could benefit from Suspense if made async in future.

---

### Task 4.3: Test Suspense with Network Throttling

**Effort:** 1h | **Priority:** P1 | **Dependencies:** 1.1, 1.2, 1.3, 4.1, 4.2

**Objective:** Verify Suspense boundaries work correctly and improve perceived performance

**Test Procedure:**

1. **Local Development Testing**

```bash
pnpm dev
# Open Chrome DevTools → Network tab
# Set throttling to "Slow 3G"
# Visit http://localhost:3000
# Observe:
# - Static shell renders immediately
# - Particles fallback shows
# - Particles fade in after loading
```

2. **Performance Metrics**

```bash
# First Contentful Paint (FCP) should be <100ms
# Largest Contentful Paint (LCP) may be slower due to particles
# Cumulative Layout Shift (CLS) should be 0 (no jumps)
```

3. **Build Testing**

```bash
pnpm build
pnpm start
# Test with production build
# Verify streaming behavior persists
```

4. **Lighthouse Audit**

- Run Lighthouse on http://localhost:3000
- Compare before/after Suspense implementation
- FCP should improve
- LCP may be similar or improve

**Test Case Pass Criteria:**

- No errors in console
- Static content renders in <100ms
- Async content streams after
- No layout shifts during loading
- Lighthouse score ≥85

---

## Summary of Files to Create/Modify

### New Files to Create (7 files)

1. `lib/actions/contact.ts` - Contact form Server Action
2. `lib/actions/careers.ts` - Careers form Server Action
3. `lib/actions/report.ts` - Report download Server Action
4. `lib/actions/index.ts` - Server Actions barrel file
5. `lib/data/cache.ts` - Caching infrastructure
6. `lib/data/index.ts` - Data barrel file
7. `components/common/LoadingFallback.tsx` - Loading fallback components
8. `docs/caching-strategy.md` - Caching documentation

### Files to Modify (3 files)

1. `next.config.mjs` - Add PPR flag
2. `app/page.tsx` - Add experimental_ppr export
3. `components/sections/Hero.tsx` - Wrap Particles in Suspense

### Optional/Dependent Files

- Component files using old API endpoints (need to import Server Actions)
- `components/common/index.ts` - Add exports for LoadingFallback

---

## Implementation Timeline

```
Week 1:
├── Task 1.1-1.2: PPR Configuration (1h)
├── Task 1.3: Hero Suspense (1h)
├── Task 2.1-2.3: Cache Infrastructure (2.5h)
└── Task 3.1-3.4: Server Actions Creation (6h)

Week 2:
├── Task 3.5: Update Client Components (2h)
├── Task 4.1-4.2: Suspense Boundaries (2.5h)
└── Task 4.3: Testing & Validation (1h)

Total: 10 hours (as planned)
```

---

## Testing Strategy

### Unit Tests

- Server Action validation (Zod schemas)
- Rate limiting behavior
- Error handling paths

### Integration Tests

- Form submission end-to-end
- Cache invalidation with revalidateTag()
- Server Action error responses

### E2E Tests

- Homepage loads with Suspense boundaries
- Forms submit via Server Actions
- Rate limiting triggers correctly

### Performance Tests

- First Contentful Paint < 100ms
- Time to Interactive appropriate
- No Cumulative Layout Shift

---

## Risk Mitigation

| Risk                            | Mitigation                                                |
| ------------------------------- | --------------------------------------------------------- |
| PPR experimental issues         | Enable per-route, test thoroughly, disable if problems    |
| Rate limiting in Server Actions | Use headers() function which is officially supported      |
| Cache invalidation complexity   | Start with simple tag structure, document patterns        |
| Client component updates        | Update one endpoint at a time, test before moving to next |
| Performance regression          | Measure Lighthouse scores before/after                    |

---

## Success Criteria (Measurable)

1. ✅ **PPR Enabled:** Homepage responds with `Transfer-Encoding: chunked`
2. ✅ **Caching Infrastructure:** `lib/data/` structure in place, documented
3. ✅ **Server Actions Complete:** All 3 form endpoints migrated
4. ✅ **Rate Limiting Works:** Server Actions reject requests after limit
5. ✅ **Suspense Boundaries:** Hero particles show loading fallback
6. ✅ **Tests Passing:** All existing tests still pass + new Server Action tests
7. ✅ **Performance:** Lighthouse FCP improves by ≥20%

---

## Unresolved Questions

1. **Which components currently use the API endpoints?** Need to identify all components that call `/api/contact`, `/api/careers`, `/api/report` to update them to use Server Actions.

2. **Are there any other form components beyond contact/careers/report?** Need complete inventory of forms that might need Server Action migration.

3. **Should API routes be deleted after Server Action migration?** Recommended: Keep them for 1 release cycle for backward compatibility, then deprecate.

4. **What are current Lighthouse baseline scores?** Should measure before implementing Phase 2 to compare improvements.

5. **Are there any async section components currently?** Plan mentions all sections are static, but worth confirming during Task 4.2 audit.

6. **Should we implement cache revalidation handlers?** For future dynamic content, need strategy for when to revalidate (on-demand, scheduled, event-based).

---

**Next Steps:** Begin with Task 1.1 (PPR Configuration) → Task 3.1-3.4 (Server Actions - higher priority for business logic) → Task 4.x (Suspense boundaries)
