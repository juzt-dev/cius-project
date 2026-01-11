# Phase 2: Next.js 16 Modernization

**Parent Plan:** [Source Code Refactoring](./plan.md)
**Dependencies:** Phase 1 (Foundation) must complete first
**Related Docs:** [Research: Modern Patterns](./research/researcher-01-modern-patterns.md) | [System Architecture](/Users/Chuo/CODE/Code Learn/docs/system-architecture.md)

---

## Overview

**Date:** 2026-01-10
**Description:** Implement "use cache" directive, enable PPR, migrate to Server Actions, add Suspense boundaries
**Priority:** P1 (High Impact)
**Implementation Status:** Partial (Server Actions Complete, PPR/Caching Incomplete)
**Review Status:** Completed (2026-01-11) - Score 7.8/10
**Effort:** 10 hours (6h spent, 4h remaining)

---

## Key Insights from Research

- **"use cache" directive:** Breaking change in Next.js 16—explicit caching replaces implicit fetch() caching
- **Partial Prerendering (PPR):** Prerender static shell + stream dynamic content—eliminates waterfall loading
- **Server Actions:** Type-safe mutations with automatic pending states, error handling
- **Suspense boundaries:** Enable streaming, show instant static content while dynamic loads
- **React 19 integration:** Server Actions work seamlessly with useTransition, useOptimistic hooks

---

## Requirements & Acceptance Criteria

### 1. Implement "use cache" Directive

- [ ] Audit all data fetching functions (async Server Components, API calls)
- [ ] Add "use cache" to expensive operations (DB queries, external API calls)
- [ ] Configure cache tags for invalidation strategy
- [ ] Test revalidateTag() and updateTag() for cache invalidation

**Acceptance:** All DB/API fetches explicitly cached or uncached (no reliance on implicit behavior)

### 2. Enable Partial Prerendering

- [ ] Add `experimental.ppr = true` to next.config.mjs
- [ ] Identify routes for PPR (homepage, static pages with dynamic sections)
- [ ] Wrap dynamic sections in Suspense boundaries
- [ ] Test static shell renders instantly, dynamic streams in

**Acceptance:** Homepage renders static shell <100ms, dynamic content streams after

### 3. Migrate API Routes to Server Actions

- [ ] Convert app/api/contact/route.ts to Server Action
- [ ] Convert app/api/careers/route.ts to Server Action
- [ ] Convert app/api/report/route.ts to Server Action
- [ ] Keep rate limiting logic in Server Actions
- [ ] Update client components to use Server Actions

**Acceptance:** All form submissions use Server Actions, API routes deprecated

### 4. Add Suspense Boundaries

- [ ] Wrap Hero component dynamic parts (particles) in Suspense
- [ ] Add Suspense to sections with async data fetching
- [ ] Create loading fallbacks for each Suspense boundary
- [ ] Test streaming behavior in network throttling

**Acceptance:** All async components wrapped in Suspense with loading states

---

## Architecture Decisions

### Caching Strategy

**Decision:** Use "use cache" at function level, not component level
**Rationale:**

- Granular control over what's cached
- Easier to invalidate specific data (tag-based)
- Components can mix cached and uncached data

**Pattern:**

```typescript
// lib/data/users.ts
'use cache';
export async function getUsers() {
  return await prisma.user.findMany();
}
```

### PPR Configuration

**Decision:** Enable PPR per-route, not globally
**Rationale:**

- Safer rollout (test one route at a time)
- Some routes may not benefit (fully static or fully dynamic)
- Easier to debug issues

**Pattern:**

```typescript
// app/page.tsx
export const experimental_ppr = true;
```

### Server Actions vs API Routes

**Decision:** Migrate forms to Server Actions, keep API routes for external integrations
**Rationale:**

- Server Actions: Better DX, type-safe, automatic pending states
- API routes: Needed for webhooks, external services, non-form endpoints

---

## Related Code Files

1. **next.config.mjs** - Enable PPR experimental flag
2. **app/page.tsx** (line 1) - Add "use cache" to data fetching
3. **components/sections/Hero.tsx** (lines 15-80) - Wrap particles in Suspense
4. **app/api/contact/route.ts** - Migrate to Server Action
5. **app/api/careers/route.ts** - Migrate to Server Action
6. **app/api/report/route.ts** - Migrate to Server Action
7. **lib/actions/** - Create new directory for Server Actions
8. **app/loading.tsx** - Enhance loading state for Suspense
9. **components/common/LoadingFallback.tsx** - Create reusable fallback

---

## Implementation Steps

### Step 1: Enable PPR (1h)

```javascript
// next.config.mjs
export default {
  experimental: {
    ppr: true, // Enable globally
  },
};
```

```typescript
// app/page.tsx - Opt-in per route
export const experimental_ppr = true;
```

Test:

```bash
pnpm dev
# Visit homepage, inspect network tab for streaming behavior
```

### Step 2: Add "use cache" Directive (2h)

Identify expensive operations:

```bash
# Find all async Server Components
grep -r "export default async function" app/
```

Add caching:

```typescript
// Before
export default async function HomePage() {
  const data = await prisma.content.findMany()
  return <div>{data}</div>
}

// After
import { unstable_cache } from 'next/cache'

const getCachedContent = unstable_cache(
  async () => prisma.content.findMany(),
  ['homepage-content'],
  { revalidate: 3600, tags: ['content'] }
)

export default async function HomePage() {
  const data = await getCachedContent()
  return <div>{data}</div>
}
```

### Step 3: Create Server Actions (3h)

```bash
mkdir -p lib/actions
```

Migrate contact form:

```typescript
// lib/actions/contact.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { contactRateLimit } from '@/lib/rate-limit';
import { sendEmail } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContact(formData: FormData) {
  // Rate limiting
  const ip = headers().get('x-forwarded-for') || 'unknown';
  const { success } = await contactRateLimit.limit(ip);
  if (!success) {
    return { error: 'Too many requests' };
  }

  // Validation
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Send email
  try {
    await sendEmail({
      to: 'contact@cius.com',
      subject: 'New Contact Form Submission',
      html: `<p>${parsed.data.message}</p>`,
    });

    revalidatePath('/contact');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to send message' };
  }
}
```

Update client component:

```typescript
// app/contact/ContactForm.tsx
'use client'

import { useTransition } from 'react'
import { submitContact } from '@/lib/actions/contact'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitContact(formData)
      if (result.error) {
        // Show error
      } else {
        // Show success
      }
    })
  }

  return (
    <form action={handleSubmit}>
      {/* form fields */}
      <button disabled={isPending}>
        {isPending ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Step 4: Add Suspense Boundaries (2h)

```typescript
// components/sections/Hero.tsx
import { Suspense } from 'react'
import { ParticlesSkeleton } from '@/components/common/LoadingFallback'

export function Hero() {
  return (
    <section>
      <div>{/* Static content */}</div>

      <Suspense fallback={<ParticlesSkeleton />}>
        <ParticlesBackground />
      </Suspense>
    </section>
  )
}
```

Create loading fallback:

```typescript
// components/common/LoadingFallback.tsx
export function ParticlesSkeleton() {
  return <div className="animate-pulse bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
}
```

### Step 5: Test & Validate (2h)

```bash
# Test caching
pnpm dev
# Visit page twice, check server logs for cache hits

# Test PPR
curl http://localhost:3000 -v
# Should see Transfer-Encoding: chunked

# Test Server Actions
# Submit forms, verify rate limiting works
# Check network tab for server action requests
```

---

## Todo Checklist

**Completed (2026-01-11):**

- [x] Create lib/actions/ directory
- [x] Migrate contact form to Server Action (lib/actions/contact.ts)
- [x] Migrate careers form to Server Action (lib/actions/careers.ts)
- [x] Migrate report form to Server Action (lib/actions/report.ts)
- [x] Update client components to use Server Actions (3 pages)
- [x] Add Suspense around Hero particles
- [x] Create LoadingFallback components (ParticlesSkeleton, ContentSkeleton, CardSkeleton)
- [x] Write tests for Server Actions (44 tests passing)

**Remaining (4h effort):**

- [ ] Add `experimental.ppr = true` to next.config.mjs
- [ ] Add `experimental_ppr = true` to app/page.tsx
- [ ] Audit all async Server Components
- [ ] Implement unstable_cache for expensive queries
- [ ] Add cache tags for invalidation
- [ ] Test streaming behavior with PPR
- [ ] Test cache invalidation with revalidateTag()
- [ ] Deprecate API routes OR extract shared service logic
- [ ] Add field-level error display in form pages
- [ ] Migrate to useTransition hook (React 19)
- [ ] Update documentation

---

## Success Criteria (Measurable)

1. **PPR Enabled:** Homepage transfers via chunked encoding (verify in network tab)
2. **Caching Working:** Second page load shows <50ms server response (cache hit)
3. **Server Actions:** All 3 forms use Server Actions, rate limiting functional
4. **Suspense:** All async sections wrapped, loading states visible during throttling
5. **Tests Passing:** Server Action tests verify validation, rate limiting, error handling
6. **Performance:** Lighthouse Performance score ≥85 (baseline for comparison)

---

## Risk Assessment

**Medium Risk:**

- **PPR experimental:** May have edge cases or bugs
  - **Mitigation:** Enable per-route, test thoroughly, disable if issues
- **Cache invalidation:** Complex tag hierarchies may cause over/under-invalidation
  - **Mitigation:** Start simple (one tag per resource), iterate
- **Server Actions:** Different error handling than API routes
  - **Mitigation:** Comprehensive error handling, keep API routes as backup

**Low Risk:**

- Suspense boundaries: Isolated changes, easy to add/remove
- unstable_cache: Can be removed if issues, falls back to no caching

---

## Security Considerations

- **Server Actions:** Automatically CSRF-protected by Next.js
- **Rate limiting:** Must work in Server Actions (use headers() for IP)
- **Validation:** Zod schemas prevent malicious input
- **Error messages:** Don't expose internal details (DB errors, stack traces)

---

## Next Steps

After Phase 2 completion:

1. Measure performance improvements (Lighthouse, Core Web Vitals)
2. Document caching strategy for team
3. Monitor cache hit rates in production
4. Proceed to Phase 3: Code Quality & Testing
