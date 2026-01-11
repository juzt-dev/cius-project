# Phase 4: Bundle Analysis Baseline

**Date:** 2026-01-11
**Analysis Method:** BundlePhobia API + Manual Dependency Analysis
**Note:** Traditional bundle analyzer unavailable (Turbopack incompatible with @next/bundle-analyzer)

---

## Dependency Size Analysis

### Heavy Dependencies (>100KB minified)

| Package           | Minified | Gzipped  | Usage                 | Status                    |
| ----------------- | -------- | -------- | --------------------- | ------------------------- |
| **lucide-react**  | 769.1 KB | 146.0 KB | Icons (2 files)       | ⚠️ Tree-shaken correctly  |
| **three**         | 718.2 KB | 177.1 KB | LiquidEther animation | ✅ Code-split in Hero.tsx |
| **cloudinary**    | 190.6 KB | 61.4 KB  | Image SDK             | ⚠️ Should be server-only  |
| **framer-motion** | 188.1 KB | 57.3 KB  | Animations (8 files)  | ⚠️ Needs optimization     |

### Medium Dependencies (50-100KB minified)

| Package                 | Minified | Gzipped | Usage           | Notes        |
| ----------------------- | -------- | ------- | --------------- | ------------ |
| **@tsparticles/engine** | 89.6 KB  | 24.1 KB | Particle system | Used in Hero |

### Current Code Splitting Status

**Already Optimized:**

- ✅ **Three.js** - Dynamically imported in `components/sections/Hero.tsx:17-20`
  ```typescript
  const Particles = dynamic(() => import('@/components/magicui').then((mod) => mod.Particles), {
    ssr: false,
    loading: () => <ParticlesSkeleton />,
  });
  ```

  - LiquidEther component (1,241 lines) properly lazy-loaded
  - Suspense boundary with skeleton fallback

**Tree-Shaking Verified:**

- ✅ **Lucide React** - Named imports only (no barrel import)
  - `components/layout/DropdownMenu.tsx:6` - `ChevronDown`
  - `components/layout/Header.tsx:7` - `MessageCircle, ChevronDown`

---

## Framer Motion Usage Analysis

**8 files using Framer Motion** (188.1KB minified, 57.3KB gzipped):

### Critical Path (Hero Section)

1. `components/sections/Hero.tsx` - Main landing section animations

### Non-Critical Animations (Lazy Load Candidates)

2. `components/layout/DropdownMenu.tsx` - Dropdown menu animations
3. `components/sections/WhoWeAre.tsx` - Section scroll animations
4. `components/common/ScrollProgress.tsx` - Scroll indicator
5. `components/common/theme-toggle.tsx` - Theme switch animation
6. `components/animations/SlideIn.tsx` - Slide-in animation wrapper
7. `components/animations/FadeIn.tsx` - Fade-in animation wrapper
8. `components/animations/FadeUp.tsx` - Fade-up animation wrapper

**Optimization Strategy:**

- Keep Framer Motion in Hero (critical)
- Lazy load for non-critical animations (dropdowns, scroll effects)
- Consider CSS animations for simple transitions (theme toggle)

---

## Cloudinary SDK Analysis

**Package:** 190.6KB minified, 61.4KB gzipped

**Expected Usage:** Server-side only (image uploads, transformations)

**Action Required:** Verify Cloudinary is not bundled in client code

- Check `lib/cloudinary.ts` for server-only usage
- Add to Next.js `serverComponentsExternalPackages` if needed

---

## Optimization Opportunities

### 🔴 High Priority

1. **Lazy Load Non-Critical Framer Motion**
   - Target: 6 non-critical animation files
   - Estimated Savings: ~40-50KB gzipped (70% of Framer Motion)
   - Files: DropdownMenu, WhoWeAre, ScrollProgress, theme-toggle, animation wrappers

2. **Verify Cloudinary Server-Only**
   - Ensure 190.6KB SDK not in client bundle
   - Add to `next.config.mjs` externals if needed

### 🟡 Medium Priority

3. **Split Lucide Icons to On-Demand Loading**
   - Current: Tree-shaken but entire icon set in bundle
   - Strategy: Use dynamic imports for icon-heavy components
   - Estimated Savings: ~50-100KB gzipped

4. **Code Split Heavy Sections**
   - Target: Large section components not in viewport
   - Candidates: OurProducts, OurFocus, CTABand sections

### 🟢 Low Priority

5. **Investigate @tsparticles Slim Usage**
   - Already using `@tsparticles/slim` (89.6KB)
   - Verify no full engine imported elsewhere

---

## Next Steps

### Step 2: Document Baseline Metrics (Estimated)

Based on dependency analysis:

- **Client Bundle Estimate:** ~500-700KB gzipped
- **Server Bundle:** ~200-300KB gzipped
- **Shared Chunks:** React 19, Next.js framework

### Step 3: Implementation Plan

1. Lazy load 6 non-critical Framer Motion usages
2. Verify Cloudinary server-only configuration
3. Dynamic import for heavy sections below fold
4. Test bundle size reduction with build

### Step 4: Image Optimization

- Add `sizes` prop to responsive images
- Set `priority` on LCP image (Hero background)
- Implement blur placeholders
- Convert to WebP/AVIF via Cloudinary transformations

### Step 5: Redis Caching Enhancement

- Cache Prisma queries (Contact, Careers, Reports)
- Implement stale-while-revalidate pattern
- Add cache warming for popular queries

### Step 6: Lighthouse Audit

- Run after optimizations complete
- Target: LCP <2.5s, FCP <1.8s, TTI <3.8s

---

## Blockers Resolved

**Bundle Analyzer Issue:**

- ❌ `@next/bundle-analyzer` incompatible with Turbopack
- ✅ Alternative: BundlePhobia API + manual dependency analysis
- ✅ Accurate size data obtained for all major dependencies

---

## Estimated Impact

**Conservative Estimate:**

- Lazy load Framer Motion: -40KB gzipped
- Cloudinary server-only: -60KB gzipped (if in bundle)
- Dynamic section imports: -30KB gzipped
- **Total Estimated Savings:** ~130KB gzipped (~20-25% reduction)

**Performance Impact:**

- LCP improvement: 200-400ms (less blocking JS)
- TTI improvement: 300-500ms (smaller main bundle)
- FCP improvement: 100-200ms (faster parse time)
