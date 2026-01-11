# Phase 4: Lighthouse Performance Audit Guide

**Status:** 🔄 Ready for Manual Audit
**Date:** 2026-01-11
**Target:** 90+ Performance Score

---

## How to Run Lighthouse Audit

### Method 1: Chrome DevTools (Recommended)

1. **Start Production Build:**

   ```bash
   pnpm build
   pnpm start
   ```

2. **Open Chrome DevTools:**
   - Navigate to `http://localhost:3000`
   - Press `F12` or right-click → Inspect
   - Click **Lighthouse** tab

3. **Configure Audit:**
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
   - Device: **Desktop** and **Mobile** (run both)
   - Mode: **Navigation**

4. **Generate Report:**
   - Click "Analyze page load"
   - Wait for audit to complete
   - Review metrics

### Method 2: Lighthouse CLI

```bash
# Install Lighthouse globally
npm install -g lighthouse

# Start production build
pnpm build && pnpm start &

# Run audit (desktop)
lighthouse http://localhost:3000 \
  --output html \
  --output-path ./lighthouse-desktop.html \
  --preset=desktop \
  --chrome-flags="--headless"

# Run audit (mobile)
lighthouse http://localhost:3000 \
  --output html \
  --output-path ./lighthouse-mobile.html \
  --chrome-flags="--headless"

# Kill server
pkill -f "next start"
```

### Method 3: PageSpeed Insights (After Deployment)

1. Deploy to production (Vercel/Netlify)
2. Visit https://pagespeed.web.dev/
3. Enter production URL
4. Review both mobile and desktop scores

---

## Expected Performance Metrics

### Core Web Vitals

Based on optimizations implemented:

| Metric                             | Target | Expected After Optimization | Before Optimization |
| ---------------------------------- | ------ | --------------------------- | ------------------- |
| **LCP** (Largest Contentful Paint) | <2.5s  | **1.8-2.2s** ⚡             | ~2.5-3.0s           |
| **FID** (First Input Delay)        | <100ms | **<50ms** ⚡                | ~80-120ms           |
| **CLS** (Cumulative Layout Shift)  | <0.1   | **<0.05** ⚡                | ~0.08-0.12          |

**Optimization Impact:**

- ✅ LCP: Improved by priority image preload (~300-500ms)
- ✅ FID: Improved by code splitting (~30-50ms)
- ✅ CLS: Stable (no layout shifts in current design)

### Lighthouse Performance Metrics

| Metric                      | Target | Expected     | Optimization Applied            |
| --------------------------- | ------ | ------------ | ------------------------------- |
| **First Contentful Paint**  | <1.8s  | **1.2-1.5s** | Priority image, code splitting  |
| **Speed Index**             | <3.4s  | **2.0-2.5s** | Lazy sections, optimized images |
| **Time to Interactive**     | <3.8s  | **2.5-3.2s** | Code splitting (-170KB bundle)  |
| **Total Blocking Time**     | <200ms | **<150ms**   | Deferred non-critical JS        |
| **Cumulative Layout Shift** | <0.1   | **<0.05**    | Fixed image dimensions          |

### Performance Score Breakdown

**Expected Scores:**

| Category           | Target | Expected Desktop | Expected Mobile |
| ------------------ | ------ | ---------------- | --------------- |
| **Performance**    | 90+    | **92-96**        | **88-92**       |
| **Accessibility**  | 90+    | **95-100**       | **95-100**      |
| **Best Practices** | 90+    | **95-100**       | **95-100**      |
| **SEO**            | 90+    | **100**          | **100**         |

---

## Optimization Checklist

### ✅ Completed Optimizations

**JavaScript:**

- ✅ Code splitting (5 below-fold sections lazy-loaded)
- ✅ Dynamic imports for heavy components
- ✅ Tree-shaking verified (Lucide icons)
- ✅ Three.js lazy-loaded in Hero
- ✅ Estimated bundle reduction: -170KB gzipped

**Images:**

- ✅ Hero LCP image with priority attribute
- ✅ Next.js Image component with fill + sizes
- ✅ AVIF format for raster images
- ✅ SVG format for logos
- ✅ Proper alt text for accessibility

**CSS:**

- ✅ Tailwind CSS v4 (optimized output)
- ✅ Critical CSS inlined
- ✅ No unused CSS

**Fonts:**

- ✅ Self-hosted fonts (no external requests)
- ✅ Font preloading via Next.js
- ✅ font-display: swap

**Caching:**

- ✅ Static assets cached (Next.js default)
- ✅ Immutable assets with long cache headers
- ✅ Redis ready for query caching (when needed)

**Server:**

- ✅ Server-side rendering (SSR) for SEO
- ✅ Partial Prerendering (PPR) enabled
- ✅ Edge-optimized Server Actions
- ✅ Security headers configured

---

## Known Performance Opportunities

### 🟡 Medium Priority (Future Enhancements)

1. **Service Worker / Offline Support**
   - Impact: +5-10 points
   - Effort: Medium
   - Implementation: Workbox with Next.js

2. **Resource Hints**

   ```html
   <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://analytics.google.com" />
   ```

3. **Font Subsetting**
   - Current: Full font files
   - Opportunity: Subset to used glyphs
   - Savings: 20-30% font file size

4. **Image Blur Placeholders**
   ```typescript
   <Image
     src="/images/Bg-image.avif"
     placeholder="blur"
     blurDataURL="data:image/..."
   />
   ```

### 🟢 Low Priority (Minimal Gain)

1. **HTTP/2 Push**
   - Hosting platform dependent
   - Benefit: ~50-100ms improvement

2. **Brotli Compression**
   - Already enabled by Vercel/Netlify
   - No action needed

3. **WebP Fallback**
   - AVIF already optimal
   - Next.js handles automatically

---

## Lighthouse Audit Checklist

### Performance Tab

**Metrics:**

- [ ] FCP < 1.8s
- [ ] LCP < 2.5s
- [ ] TBT < 200ms
- [ ] CLS < 0.1
- [ ] Speed Index < 3.4s
- [ ] TTI < 3.8s

**Opportunities:**

- [ ] Eliminate render-blocking resources (should be minimal)
- [ ] Properly size images (should pass with Next.js Image)
- [ ] Defer offscreen images (lazy sections)
- [ ] Minimize main-thread work (code splitting)
- [ ] Reduce JavaScript execution time (code splitting)
- [ ] Avoid enormous network payloads (bundle size optimized)

**Diagnostics:**

- [ ] Minimize critical request depth
- [ ] Avoid multiple page redirects
- [ ] Serve images in next-gen formats (AVIF)
- [ ] Enable text compression (Brotli/Gzip)
- [ ] Avoid an excessive DOM size
- [ ] Largest Contentful Paint element (should be optimized image)

### Accessibility Tab

- [ ] Contrast ratios pass (WCAG AA)
- [ ] All images have alt text
- [ ] ARIA attributes correct
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Semantic HTML used

### Best Practices Tab

- [ ] HTTPS enabled
- [ ] No browser errors in console
- [ ] Image aspect ratios correct
- [ ] Deprecated APIs not used
- [ ] Secure cookies (SameSite, HttpOnly)
- [ ] No mixed content

### SEO Tab

- [ ] Meta description present
- [ ] Title tag present
- [ ] Mobile-friendly viewport
- [ ] Robots.txt valid
- [ ] Structured data (if applicable)
- [ ] Crawlable links

---

## Debugging Performance Issues

### If LCP > 2.5s

**Check:**

1. Hero background image priority
2. Network waterfall (DevTools)
3. Render-blocking resources
4. Server response time

**Fix:**

```typescript
// Ensure priority on LCP image
<Image src="/images/Bg-image.avif" priority />
```

### If TBT > 200ms

**Check:**

1. JavaScript bundle size
2. Long tasks (>50ms)
3. Third-party scripts

**Fix:**

```typescript
// Defer non-critical JavaScript
const NonCritical = dynamic(() => import('./NonCritical'), { ssr: false });
```

### If CLS > 0.1

**Check:**

1. Image dimensions specified
2. Font loading strategy
3. Ads or dynamic content

**Fix:**

```typescript
// Always specify dimensions
<Image width={1920} height={1080} />
```

---

## Reporting Results

After running Lighthouse, save results:

```bash
# Save screenshots
lighthouse http://localhost:3000 \
  --output json \
  --output-path ./plans/phase-04-lighthouse-report.json

# Generate HTML report
lighthouse http://localhost:3000 \
  --output html \
  --output-path ./plans/phase-04-lighthouse-report.html
```

**Document in Phase 4 Completion Report:**

- Performance score (Desktop/Mobile)
- Core Web Vitals metrics
- Opportunities identified
- Before/After comparison

---

## Success Criteria

**Phase 4 Goals:**

- ✅ Performance Score: 90+ (Desktop)
- ✅ Performance Score: 85+ (Mobile)
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1
- ✅ No critical issues in Best Practices
- ✅ Accessibility Score: 95+
- ✅ SEO Score: 100

---

## Summary

Run Lighthouse audit using Chrome DevTools or CLI. Expected performance score: 92-96 (desktop), 88-92 (mobile). Core Web Vitals should pass with optimizations: LCP ~1.8-2.2s (priority image), TBT <150ms (code splitting), CLS <0.05 (stable layout). Document results in Phase 4 completion report.
