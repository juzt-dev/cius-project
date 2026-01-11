# Phase 4: Performance Optimization

**Parent Plan:** [Source Code Refactoring](./plan.md)
**Dependencies:** Phase 1 (Foundation), Phase 2 (Next.js Modernization)
**Related Docs:** [Research: Modern Patterns](./research/researcher-01-modern-patterns.md) | [Scout Report](./scout/scout-01-codebase-analysis.md)

---

## Overview

**Date:** 2026-01-10
**Description:** Analyze bundle, implement code splitting, optimize images, add caching strategy
**Priority:** P1 (High Impact)
**Implementation Status:** Pending
**Review Status:** Not Started
**Effort:** 6 hours

---

## Key Insights from Research

- **Bundle analyzer:** Configured in Phase 1, now use for optimization
- **Heavy dependencies:** Framer Motion (~50KB), Three.js (unknown size), Particles library
- **Code splitting opportunity:** LiquidEther (canvas animation), Particles (heavy component) can lazy load
- **Image optimization:** next/image used, but missing sizes prop and priority on LCP images
- **Caching:** Redis configured but underutilized—can cache expensive computations

---

## Requirements & Acceptance Criteria

### 1. Analyze Bundle Size

- [ ] Run bundle analyzer: `pnpm analyze`
- [ ] Document baseline sizes (client, server, shared chunks)
- [ ] Identify bloated dependencies (>100KB)
- [ ] Find duplicate dependencies (same library multiple versions)
- [ ] Document optimization targets (reduce client bundle 50%+)

**Acceptance:** Baseline documented, top 10 largest dependencies identified

### 2. Implement Code Splitting

- [ ] Lazy load LiquidEther component (canvas animation)
- [ ] Lazy load Particles component (Three.js/heavy rendering)
- [ ] Lazy load admin components (if any)
- [ ] Split heavy third-party libs (Framer Motion, charts)
- [ ] Add loading states for dynamic imports

**Acceptance:** Client bundle reduced by ≥50%, verified by bundle analyzer

### 3. Optimize Images

- [ ] Add sizes prop to all next/image instances
- [ ] Add priority to LCP images (Hero background, logo)
- [ ] Convert remaining PNGs to WebP/AVIF
- [ ] Implement blur placeholders for below-fold images
- [ ] Audit Cloudinary transformations (compression, format)

**Acceptance:** Lighthouse LCP <2.5s, no missing sizes warnings

### 4. Enhance Caching Strategy

- [ ] Cache Prisma query results in Redis (expensive queries only)
- [ ] Add cache warming for homepage data
- [ ] Implement stale-while-revalidate pattern
- [ ] Add cache headers to static assets
- [ ] Monitor cache hit rates

**Acceptance:** Cache hit rate ≥60% for repeated requests, response time <100ms

---

## Architecture Decisions

### Code Splitting Strategy

**Decision:** Dynamic import with loading fallback for components >50KB
**Rationale:**

- Reduces initial bundle, improves FCP (First Contentful Paint)
- Loading states prevent layout shift
- Users on slow networks benefit most

**Pattern:**

```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Skip SSR if component is client-only
})
```

### Image Optimization Strategy

**Decision:** Use Cloudinary auto-format and quality optimization
**Rationale:**

- Cloudinary serves WebP/AVIF automatically to supported browsers
- Quality=auto reduces size without visible degradation
- Responsive images via sizes prop

**Pattern:**

```typescript
<Image
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority // Only for LCP images
/>
```

### Caching Strategy

**Decision:** Cache at multiple levels (Redis, Next.js, CDN)
**Rationale:**

- Redis: Expensive DB queries (user data, content)
- Next.js: Static pages, Server Components
- CDN: Static assets, images

**Cache hierarchy:**

1. CDN (Vercel Edge) - Static assets, images
2. Next.js (unstable_cache) - Server Component data
3. Redis - Database query results
4. Database - Source of truth

---

## Related Code Files

1. **components/animations/LiquidEther.tsx** - Heavy canvas animation (~20KB)
2. **components/magicui/particles.tsx** - Particle effects (Three.js?)
3. **components/sections/Hero.tsx** (lines 15-30) - LCP images, particles
4. **lib/redis.ts** - Redis client (enhance with caching utils)
5. **next.config.mjs** - Image domains, bundle config
6. **package.json** - Audit dependencies
7. **app/page.tsx** - Homepage (cache expensive data)

---

## Implementation Steps

### Step 1: Bundle Analysis (1h)

```bash
pnpm analyze
```

Review output:

- Client bundle size (target: <200KB gzipped)
- Server bundle size (less critical)
- Shared chunks (good for caching)
- Largest modules (candidates for splitting)

Document findings:

```markdown
## Bundle Analysis Baseline (2026-01-10)

- Total client: 450KB gzipped
- Largest: framer-motion (52KB), @radix-ui (38KB), particles (unknown)
- Duplicates: None found
- Target: Reduce to <225KB (50% reduction)
```

### Step 2: Implement Code Splitting (2h)

```typescript
// components/sections/Hero.tsx
import dynamic from 'next/dynamic'

const LiquidEther = dynamic(() => import('@/components/animations/LiquidEther'), {
  loading: () => <div className="h-full w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse" />,
  ssr: false, // Canvas requires browser APIs
})

const Particles = dynamic(() => import('@/components/magicui/particles'), {
  loading: () => null, // Particles are decorative, no fallback needed
  ssr: false,
})

export function Hero() {
  return (
    <section>
      <LiquidEther />
      <Particles />
      {/* Rest of Hero */}
    </section>
  )
}
```

Test:

```bash
pnpm analyze
# Verify LiquidEther and Particles in separate chunks
# Check client bundle size reduction
```

### Step 3: Optimize Images (1h)

```typescript
// components/sections/Hero.tsx
import Image from 'next/image'

export function Hero() {
  return (
    <section>
      <Image
        src="/images/hero-bg.avif"
        alt="Hero background"
        fill
        sizes="100vw"
        priority // LCP image
        quality={85}
        className="object-cover"
      />
    </section>
  )
}
```

Audit all images:

```bash
grep -r "next/image" components/ app/ | grep -v "sizes="
# Find images missing sizes prop
```

Add blur placeholders:

```typescript
<Image
  src="/image.jpg"
  alt="Product"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..." // Generate with plaiceholder or similar
/>
```

### Step 4: Enhance Redis Caching (1.5h)

```typescript
// lib/cache.ts
import { redis } from './redis';

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }

  // Fetch and cache
  const data = await fetcher();
  await redis.set(key, JSON.stringify(data), { ex: ttl });
  return data;
}
```

Use in Server Components:

```typescript
// app/page.tsx
import { getCached } from '@/lib/cache'

export default async function HomePage() {
  const content = await getCached(
    'homepage:content',
    () => prisma.content.findMany(),
    3600 // 1 hour
  )

  return <div>{content}</div>
}
```

### Step 5: Monitor Performance (30 min)

```bash
# Lighthouse CI
pnpm dlx lighthouse https://localhost:3000 --view
```

Check metrics:

- FCP (First Contentful Paint) - Target: <1.8s
- LCP (Largest Contentful Paint) - Target: <2.5s
- TBT (Total Blocking Time) - Target: <200ms
- CLS (Cumulative Layout Shift) - Target: <0.1

---

## Todo Checklist

- [ ] Run `pnpm analyze` and document baseline
- [ ] Identify top 10 largest dependencies
- [ ] Lazy load LiquidEther component
- [ ] Lazy load Particles component
- [ ] Add loading fallbacks for dynamic imports
- [ ] Audit all next/image instances
- [ ] Add sizes prop to all images
- [ ] Add priority to LCP images (Hero background)
- [ ] Convert PNGs to WebP/AVIF where possible
- [ ] Create lib/cache.ts helper
- [ ] Cache homepage data in Redis
- [ ] Cache expensive Prisma queries
- [ ] Run Lighthouse audit (before/after)
- [ ] Compare bundle sizes (before/after)
- [ ] Document performance improvements
- [ ] Setup GitHub Action for Lighthouse CI

---

## Success Criteria (Measurable)

1. **Bundle Size:** Client bundle reduced by ≥50% (verified by bundle analyzer)
2. **Performance Score:** Lighthouse Performance ≥90 (up from baseline)
3. **LCP:** Largest Contentful Paint <2.5s (Core Web Vital)
4. **Cache Hit Rate:** ≥60% for repeated homepage requests (monitored in Redis)
5. **Image Optimization:** All images have sizes prop, LCP images have priority
6. **Code Splitting:** Heavy components (LiquidEther, Particles) in separate chunks

---

## Risk Assessment

**Low Risk:**

- Code splitting: Easy to rollback (remove dynamic import)
- Image optimization: No breaking changes, only performance gains
- Caching: Falls back to DB if cache fails

**Medium Risk:**

- **Over-aggressive caching:** May show stale data
  - **Mitigation:** Conservative TTL (1 hour), revalidate on mutations
- **Bundle splitting:** Too many chunks may hurt HTTP/1.1 (solved by HTTP/2)
  - **Mitigation:** Vercel uses HTTP/2, check with `curl -I --http2`

---

## Security Considerations

- **Cache poisoning:** Validate data before caching
- **Sensitive data caching:** Don't cache user-specific data without scoping (user ID in key)
- **Image CDN:** Cloudinary signed URLs for private images

---

## Next Steps

After Phase 4 completion:

1. Monitor Core Web Vitals in production (Vercel Analytics)
2. Setup performance budgets in CI (fail if bundle >250KB)
3. Document caching strategy for team
4. Proceed to Phase 5: Architecture Improvements
