# Phase 2: Detailed Implementation Tasks (Extracted)

**Report Generated:** 2026-01-11 13:33
**Phase Dependency Status:** Phase 1 ✅ Complete
**Total Tasks:** 13 subtasks across 4 deliverables
**Estimated Effort:** 10 hours
**Priority:** P1 (High Impact)

---

## Task Extraction Matrix

### Deliverable 1: Enable Partial Prerendering (PPR)

| Task ID | Title                                | Effort | Priority | Status  | Dependencies  |
| ------- | ------------------------------------ | ------ | -------- | ------- | ------------- |
| 1.1     | Update next.config.mjs with PPR flag | 0.5h   | P1       | Pending | None          |
| 1.2     | Add experimental_ppr to app/page.tsx | 0.5h   | P1       | Pending | 1.1           |
| 1.3     | Wrap Hero Particles in Suspense      | 1h     | P1       | Pending | 1.1, 1.2, 2.1 |

**Total Effort:** 2h
**Acceptance Criteria:**

- PPR flag present in next.config.mjs
- app/page.tsx exports experimental_ppr = true
- Hero Particles wrapped in Suspense fallback
- Network response shows Transfer-Encoding: chunked
- No build/runtime errors

---

### Deliverable 2: Implement "use cache" Directive

| Task ID | Title                                      | Effort | Priority | Status  | Dependencies |
| ------- | ------------------------------------------ | ------ | -------- | ------- | ------------ |
| 2.1     | Audit async components & document findings | 1h     | P1       | Pending | None         |
| 2.2     | Prepare caching infrastructure (lib/data/) | 1h     | P1       | Pending | None         |
| 2.3     | Add cache strategy documentation           | 0.5h   | P2       | Pending | 2.2          |

**Total Effort:** 2.5h
**Acceptance Criteria:**

- Audit report documents all async operations
- lib/data/cache.ts exists with 'use cache' patterns
- lib/data/index.ts barrel file created
- docs/caching-strategy.md explains patterns
- Build succeeds without errors

---

### Deliverable 3: Migrate API Routes to Server Actions

| Task ID | Title                                          | Effort | Priority | Status  | Dependencies  |
| ------- | ---------------------------------------------- | ------ | -------- | ------- | ------------- |
| 3.1     | Create contact form Server Action              | 1.5h   | P1       | Pending | None          |
| 3.2     | Create careers form Server Action              | 1.5h   | P1       | Pending | None          |
| 3.3     | Create report form Server Action               | 1.5h   | P1       | Pending | None          |
| 3.4     | Create Server Actions barrel file              | 0.5h   | P1       | Pending | 3.1, 3.2, 3.3 |
| 3.5     | Update client components to use Server Actions | 2h     | P1       | Pending | 3.1-3.4       |

**Total Effort:** 6.5h
**Acceptance Criteria:**

- All 3 Server Actions created in lib/actions/
- Rate limiting works in Server Actions
- Zod validation schemas preserved
- Email sending preserved
- All forms migrate from fetch to Server Actions
- Build succeeds
- Tests pass

---

### Deliverable 4: Add Suspense Boundaries

| Task ID | Title                                 | Effort | Priority | Status  | Dependencies     |
| ------- | ------------------------------------- | ------ | -------- | ------- | ---------------- |
| 4.1     | Create LoadingFallback components     | 1h     | P1       | Pending | None             |
| 4.2     | Audit sections for async operations   | 1.5h   | P1       | Pending | 4.1              |
| 4.3     | Test Suspense with network throttling | 1h     | P1       | Pending | 1.1-1.3, 4.1-4.2 |

**Total Effort:** 3.5h
**Acceptance Criteria:**

- LoadingFallback.tsx created with multiple skeleton components
- All sections audited for async operations
- Suspense boundaries working correctly
- Lighthouse FCP metric improves
- No layout shifts during loading
- Tests pass

---

## Detailed Task Instructions

### Task 1.1: Update next.config.mjs

**File:** `/Users/Chuo/CODE/Code Learn/next.config.mjs`

**Current Lines 19-23:**

```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '2mb',
  },
},
```

**Target Lines 19-25:**

```javascript
experimental: {
  ppr: true, // Enable Partial Prerendering
  serverActions: {
    bodySizeLimit: '2mb',
  },
},
```

**Change:** Add `ppr: true,` to experimental object

**Verification:**

```bash
pnpm build
# Should complete without errors
```

---

### Task 1.2: Add experimental_ppr to app/page.tsx

**File:** `/Users/Chuo/CODE/Code Learn/app/page.tsx`

**Add Before Line 1 (before imports):**

```typescript
export const experimental_ppr = true;
```

**Full File:**

```typescript
export const experimental_ppr = true;

import type { Metadata } from 'next';
import { Hero, WhoWeAre, OurFocus, OurProducts, AISection, CTABand } from '@/components/sections';

export const metadata: Metadata = {
  title: 'CIUSLABS - Exploring the Next Frontier',
  description: 'A technology studio at the intersection of design, AI, and Web3 - building products that shape tomorrow digital universe.',
};

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
# Visit localhost:3000
# Check Network tab for streaming behavior
```

---

### Task 1.3: Wrap Hero Particles in Suspense

**File:** `/Users/Chuo/CODE/Code Learn/components/sections/Hero.tsx`

**Changes:**

1. Add import: `import { Suspense } from 'react';`
2. Add import: `import { ParticlesSkeleton } from '@/components/common/LoadingFallback';`
3. Replace lines 57-60:

**BEFORE (lines 57-60):**

```typescript
{/* LiquidEther Animation */}
<div className="absolute inset-0 opacity-50 z-[2]">
  <Particles {...PARTICLES_CONFIG} />
</div>
```

**AFTER:**

```typescript
{/* LiquidEther Animation */}
<Suspense fallback={<ParticlesSkeleton />}>
  <div className="absolute inset-0 opacity-50 z-[2]">
    <Particles {...PARTICLES_CONFIG} />
  </div>
</Suspense>
```

**Full Changes in Context:**

```typescript
'use client';

import { useRef, Suspense } from 'react'; // ADD Suspense
import Link from 'next/link';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Particles } from '@/components/magicui';
import { cn } from '@/lib/utils';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { ParticlesSkeleton } from '@/components/common/LoadingFallback'; // ADD

// ... rest of file unchanged until Suspense wrapper
```

**Verification:**

```bash
pnpm dev
# DevTools Network → Throttle to "Slow 3G"
# Visit homepage
# Observe static content renders first, particles load after
```

---

### Task 2.1: Audit Async Components

**Output File:** `/Users/Chuo/CODE/Code Learn/plans/260110-1544-source-code-refactor/audit-async-components.md`

**Commands to Run:**

```bash
# Find async components
grep -r "async function" app/ components/ --include="*.tsx" | grep -v "use client"
grep -r "export.*async" app/ components/ --include="*.tsx"

# Find data fetching
grep -r "await prisma" app/ lib/ --include="*.ts" --include="*.tsx"
grep -r "await fetch" app/ --include="*.tsx"
```

**Report Structure:**

```markdown
# Async Components Audit

## Homepage (app/page.tsx)

- Type: Static component
- Async operations: None
- Recommendation: No changes needed

## Sections (components/sections/)

### Hero.tsx

- Type: Client component ('use client')
- Async operations: Particles (client-side animation)
- Status: Suspense boundary added in Task 1.3
- Recommendation: Complete ✅

### WhoWeAre.tsx

[Status]

### OurFocus.tsx

[Status]

### OurProducts.tsx

[Status]

### AISection.tsx

[Status]

### CTABand.tsx

[Status]

## API Routes

### contact/route.ts

- Type: Server handler (read headers, write DB, send email)
- Note: Migrating to Server Action in Phase 2
- Status: Defer to Server Action migration

### careers/route.ts

- Type: Server handler
- Note: Migrating to Server Action in Phase 2

### report/route.ts

- Type: Server handler
- Note: Migrating to Server Action in Phase 2

## Conclusion

Current codebase is primarily static with minimal server-side data fetching.
Caching infrastructure prepared for future dynamic content.
```

---

### Task 2.2: Prepare Caching Infrastructure

**File 1 - Create:** `/Users/Chuo/CODE/Code Learn/lib/data/cache.ts`

```typescript
'use cache';

import { unstable_cache } from 'next/cache';

/**
 * Cache tag constants for granular invalidation
 * Use revalidateTag(TAG_NAME) to invalidate specific caches
 */
export const CACHE_TAGS = {
  USERS: 'users',
  CONTENT: 'content',
  PRODUCTS: 'products',
  METADATA: 'metadata',
} as const;

/**
 * Template for creating cached database queries
 *
 * Example usage:
 * export const getCachedUsers = unstable_cache(
 *   async () => prisma.user.findMany(),
 *   ['users-cache'],
 *   { revalidate: 3600, tags: [CACHE_TAGS.USERS] }
 * );
 *
 * In Server Action:
 * await revalidateTag(CACHE_TAGS.USERS);
 */

// Placeholder for future cached queries
// Add more as dynamic content is added to the application
```

**File 2 - Create:** `/Users/Chuo/CODE/Code Learn/lib/data/index.ts`

```typescript
export * from './cache';
```

**Update:** `/Users/Chuo/CODE/Code Learn/lib/index.ts` (if exists, or create)

```typescript
// lib/index.ts - barrel file for all lib exports
export * from './data';
```

**Verification:**

```bash
pnpm build
# Should compile without errors
# No 'use cache' directive warnings
```

---

### Task 2.3: Add Caching Documentation

**File:** Create `/Users/Chuo/CODE/Code Learn/docs/caching-strategy.md`

````markdown
# Caching Strategy (Next.js 16)

## Overview

This document explains how caching works in the application using Next.js 16's experimental `"use cache"` directive.

## Architecture

### Implicit vs Explicit Caching

**Next.js 15 (Implicit):**

- fetch() calls cached by default
- Manual opt-out with `{ cache: 'no-store' }`
- Can cause confusion about what's cached

**Next.js 16 (Explicit):**

- "use cache" directive required for explicit caching
- Granular control at function/module level
- Tag-based invalidation with revalidateTag()

## Implementation Patterns

### Module-Level Caching

```typescript
'use cache';
// This entire module's exports are cached

export async function getCachedData() {
  return await prisma.data.findMany();
}
```
````

### Function-Level Caching

```typescript
import { unstable_cache } from 'next/cache';

export const getCachedUsers = unstable_cache(
  async () => prisma.user.findMany(),
  ['users-list'], // Cache key
  {
    revalidate: 3600, // 1 hour in seconds
    tags: ['users'], // Cache tags for invalidation
  }
);
```

## Cache Tags Strategy

| Tag        | Purpose                  | Used By          | Invalidation Trigger      |
| ---------- | ------------------------ | ---------------- | ------------------------- |
| `users`    | All user-related queries | User components  | User create/update/delete |
| `content`  | Page content, posts      | Content pages    | Content update            |
| `products` | Product catalog          | Product listings | Product change            |
| `metadata` | Site metadata            | Global           | Rare manual update        |

## Invalidation

### In Server Actions

```typescript
'use server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function updateUser(userId: string, data: UserData) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  // Invalidate all user-related caches
  revalidateTag('users');

  // Alternative: Invalidate specific path
  revalidatePath('/dashboard/users');

  return user;
}
```

## Performance Considerations

### Cache Hit Scenarios

- Second visit to same page
- Multiple requests for same resource
- Batch operations on cached data

### Cache Miss Scenarios

- First visit to page
- After revalidateTag() called
- After revalidate time expired
- Dynamic parameters changed

## Monitoring

### Development

- Console logs show cache hits/misses (if configured)
- Network tab shows response times

### Production

- CloudFront/CDN logs track cache efficiency
- Analytics dashboard shows cache hit rates
- Monitor revalidation patterns in logs

## Best Practices

1. **Start Conservative**
   - Cache only expensive operations
   - Start with longer revalidation times (1 hour+)
   - Adjust based on data freshness needs

2. **Use Tags Strategically**
   - Group related data under same tag
   - Avoid too many granular tags
   - Document tag strategy for team

3. **Test Cache Behavior**
   - Verify cache hits in dev tools
   - Test invalidation with revalidateTag()
   - Monitor performance in production

4. **Handle Stale Data**
   - User-facing data: shorter revalidation (10-30 min)
   - Admin data: longer revalidation (1-24 hours)
   - Real-time data: no caching or event-based invalidation

## Migration Path

### Phase 2 (Current)

- ✅ Infrastructure in place
- ✅ Patterns documented
- Awaiting dynamic content

### Phase 3+

- Add cached queries as features develop
- Implement tag-based invalidation
- Monitor cache efficiency

## References

- [Next.js Cache Directive](https://nextjs.org/docs/app/building-your-application/caching)
- [unstable_cache API](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)
- [revalidateTag API](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

````

---

### Task 3.1: Create Contact Form Server Action

**File:** Create `/Users/Chuo/CODE/Code Learn/lib/actions/contact.ts`

See full code in earlier section. Key points:
- 'use server' directive at top
- Import headers from 'next/headers'
- Preserve exact Zod schema from API route
- Use contactRateLimit.limit(ip)
- Return typed result object
- Complete error handling

---

### Task 3.2: Create Careers Form Server Action

**File:** Create `/Users/Chuo/CODE/Code Learn/lib/actions/careers.ts`

See full code in earlier section. Key points:
- Same pattern as contact
- Replace contactRateLimit with careersRateLimit
- Adjust field validation (position is required)
- Use emailTemplates.careerApplication()

---

### Task 3.3: Create Report Form Server Action

**File:** Create `/Users/Chuo/CODE/Code Learn/lib/actions/report.ts`

See full code in earlier section. Key points:
- Simpler validation (email only)
- Replace reportRateLimit
- Use emailTemplates.reportDownload()
- Same error handling pattern

---

### Task 3.4: Create Server Actions Barrel File

**File:** Create `/Users/Chuo/CODE/Code Learn/lib/actions/index.ts`

```typescript
// lib/actions/index.ts
export { submitContact, type ContactFormData, type ContactActionResult } from './contact';
export {
  submitCareerApplication,
  type CareerFormData,
  type CareerActionResult,
} from './careers';
export {
  requestReportDownload,
  type ReportFormData,
  type ReportActionResult,
} from './report';
````

---

### Task 3.5: Update Client Components

**Process:**

1. Find component that submits to `/api/contact`
2. Import Server Action: `import { submitContact } from '@/lib/actions';`
3. Replace fetch() with useTransition() pattern
4. Test form submission

**Example Client Component Pattern:**

```typescript
'use client';

import { useTransition, useState } from 'react';
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
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Submit'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Success!</p>}
    </form>
  );
}
```

**Steps:**

1. Keep form structure
2. Replace fetch with Server Action import
3. Use useTransition for pending state
4. Handle result object instead of JSON response
5. Test with rate limiting

---

### Task 4.1: Create LoadingFallback Components

**File:** Create `/Users/Chuo/CODE/Code Learn/components/common/LoadingFallback.tsx`

See full code in earlier section. Components:

- `ParticlesSkeleton` - For Hero particles
- `SectionSkeleton` - For any section
- `CardGridSkeleton` - For card layouts
- `TextBlockSkeleton` - For text content

**Update:** Add to `/Users/Chuo/CODE/Code Learn/components/common/index.ts`

```typescript
// Add these exports:
export {
  ParticlesSkeleton,
  SectionSkeleton,
  CardGridSkeleton,
  TextBlockSkeleton,
} from './LoadingFallback';
```

---

### Task 4.2: Audit Sections for Async Operations

**Output File:** `/Users/Chuo/CODE/Code Learn/plans/260110-1544-source-code-refactor/audit-sections-suspense.md`

**Process:**

```bash
# Check each section component
cat components/sections/WhoWeAre.tsx | grep -E "(async|await|fetch|prisma)"
cat components/sections/OurFocus.tsx | grep -E "(async|await|fetch|prisma)"
cat components/sections/OurProducts.tsx | grep -E "(async|await|fetch|prisma)"
cat components/sections/AISection.tsx | grep -E "(async|await|fetch|prisma)"
cat components/sections/CTABand.tsx | grep -E "(async|await|fetch|prisma)"
```

**Report:**

```markdown
# Section Components Suspense Audit

## Components Reviewed

- ✅ Hero.tsx - Particles wrapped in Suspense (Task 1.3)
- WhoWeAre.tsx - [STATIC/ASYNC]
- OurFocus.tsx - [STATIC/ASYNC]
- OurProducts.tsx - [STATIC/ASYNC]
- AISection.tsx - [STATIC/ASYNC]
- CTABand.tsx - [STATIC/ASYNC]

## Findings

All components are currently static (no async operations).
No additional Suspense boundaries needed at this time.

## For Future Reference

If making any component async:

1. Wrap in Suspense with appropriate fallback
2. Import fallback from components/common/LoadingFallback
3. Use matching skeleton (SectionSkeleton, CardGridSkeleton, etc.)
```

---

### Task 4.3: Test Suspense with Network Throttling

**Testing Steps:**

1. **Local Dev Test**

```bash
pnpm dev
# Open Chrome DevTools (F12)
# Go to Network tab
# Throttle to "Slow 3G" or "Fast 3G"
# Visit http://localhost:3000
```

2. **Observations to Verify**

- [ ] Static content renders in <100ms
- [ ] Particles fallback shows
- [ ] Particles fade in after loading
- [ ] No layout shifts (CLS = 0)
- [ ] No console errors

3. **Lighthouse Audit**

```bash
# Still in pnpm dev
# DevTools → Lighthouse
# Run "Mobile" audit
# Record baseline metrics:
#   - First Contentful Paint (FCP)
#   - Largest Contentful Paint (LCP)
#   - Cumulative Layout Shift (CLS)
```

4. **Production Build Test**

```bash
pnpm build
pnpm start
# Test at http://localhost:3000
# Verify Suspense works in production
```

5. **Test Pass Criteria**

- [ ] No errors in console
- [ ] FCP < 100ms
- [ ] CLS = 0 (no layout shifts)
- [ ] Lighthouse score ≥85
- [ ] Particles load smoothly after static content

---

## Execution Checklist

### Before Starting

- [ ] Phase 1 complete (verify all 252 tests passing)
- [ ] Working in main branch
- [ ] No uncommitted changes beyond Phase 2 work

### During Implementation

- [ ] Complete tasks in order (dependencies matter)
- [ ] Run `pnpm build` after each file creation
- [ ] Commit after each deliverable
- [ ] Keep git history clean

### After Completion

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Lighthouse audit shows improvement
- [ ] Create PR with detailed description
- [ ] Request code review from team

---

## Success Metrics

| Metric                 | Target                     | How to Measure           |
| ---------------------- | -------------------------- | ------------------------ |
| Build succeeds         | 100%                       | `pnpm build` exit code 0 |
| Tests pass             | 252+                       | `pnpm test` all pass     |
| PPR working            | Transfer-Encoding: chunked | Network tab inspection   |
| FCP improved           | <100ms                     | Lighthouse audit         |
| Rate limiting works    | 429 after limit            | Test form submission     |
| Server Actions working | All 3 forms                | Manual form testing      |
| Suspense working       | Fallback shows             | Throttled network test   |
| No layout shifts       | CLS = 0                    | Lighthouse audit         |

---

## File Checklist

### New Files (8 total)

- [ ] `lib/actions/contact.ts`
- [ ] `lib/actions/careers.ts`
- [ ] `lib/actions/report.ts`
- [ ] `lib/actions/index.ts`
- [ ] `lib/data/cache.ts`
- [ ] `lib/data/index.ts`
- [ ] `components/common/LoadingFallback.tsx`
- [ ] `docs/caching-strategy.md`

### Modified Files (4 total)

- [ ] `next.config.mjs` - Add PPR flag
- [ ] `app/page.tsx` - Add experimental_ppr
- [ ] `components/sections/Hero.tsx` - Add Suspense
- [ ] `components/common/index.ts` - Add exports (if exists)

### Optional Audit/Report Files

- [ ] `plans/260110-1544-source-code-refactor/audit-async-components.md`
- [ ] `plans/260110-1544-source-code-refactor/audit-sections-suspense.md`

---

**Report Generated By:** Project Manager (project-manager-260111-1333)
**Next Review Date:** After implementation complete
**Questions For Development Team:** See "Unresolved Questions" in main analysis document
