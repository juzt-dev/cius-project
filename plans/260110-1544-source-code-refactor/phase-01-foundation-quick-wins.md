# Phase 1: Foundation & Quick Wins

**Parent Plan:** [Source Code Refactoring](./plan.md)
**Dependencies:** None (blocking phase for others)
**Related Docs:** [Scout Report](./scout/scout-01-codebase-analysis.md) | [Code Standards](/Users/Chuo/CODE/Code Learn/docs/code-standards.md)

---

## Overview

**Date:** 2026-01-10
**Description:** Restore deleted files, setup structured logging, configure bundle analyzer, add rate limiting, clean git status
**Priority:** P0 (Critical - blocks other phases)
**Implementation Status:** ✅ Complete (2026-01-11)
**Review Status:** ✅ Approved (Score: 9.6/10, 0 critical, 2 high, 3 medium)
**Review Report:** [code-reviewer-260111-1322-phase01-foundation.md](../reports/code-reviewer-260111-1322-phase01-foundation.md)
**Effort:** 8 hours (actual: ~7h)

---

## Key Insights from Research

- **Deleted files in git:** app/layout.tsx, components/layout/Header.tsx, 76 font files must be restored or committed
- **Console logging issue:** 19 files using console.log/error—replace with structured logging (Pino recommended for Next.js)
- **Bundle monitoring:** @next/bundle-analyzer installed but not in package.json scripts—quick win to enable
- **Security gap:** No rate limiting on API routes (contact, careers, report)—critical vulnerability
- **Quick wins deliver immediate value:** Structured logging, bundle monitoring, rate limiting are low-effort, high-impact

---

## Requirements & Acceptance Criteria

### 1. Restore Deleted Files

- [ ] Verify if app/layout.tsx deletion was intentional (check git history)
- [ ] If unintentional: `git restore app/layout.tsx components/layout/Header.tsx`
- [ ] If intentional: Commit deletions with clear message
- [ ] Clean up font file deletions (commit or restore)

**Acceptance:** `git status` shows clean working directory (no staged deletions)

### 2. Structured Logging

- [ ] Install Pino: `pnpm add pino pino-pretty`
- [ ] Create `lib/logger.ts` with log levels (debug, info, warn, error)
- [ ] Replace all console.log in lib/auth.ts (5 instances)
- [ ] Replace console statements in lib/email.ts, lib/redis.ts
- [ ] Replace console in API routes (app/api/\*/route.ts)
- [ ] Add environment-based config (pretty logs in dev, JSON in prod)

**Acceptance:** Zero console.log/error in lib/ and app/api/ directories (verified by `grep -r "console\." lib/ app/api/`)

### 3. Bundle Analyzer Configuration

- [ ] Add script to package.json: `"analyze": "ANALYZE=true next build"`
- [ ] Configure next.config.mjs with @next/bundle-analyzer
- [ ] Run baseline analysis: `pnpm analyze`
- [ ] Document baseline bundle sizes (client, server, shared)
- [ ] Setup GitHub Action to track bundle size on PRs

**Acceptance:** `pnpm analyze` generates bundle report, baseline documented

### 4. Rate Limiting Middleware

- [ ] Install upstash/ratelimit: `pnpm add @upstash/ratelimit`
- [ ] Create `lib/rate-limit.ts` using existing Redis client
- [ ] Add rate limiter to app/api/contact/route.ts (10 req/hour per IP)
- [ ] Add rate limiter to app/api/careers/route.ts (5 req/hour per IP)
- [ ] Add rate limiter to app/api/report/route.ts (20 req/hour per IP)
- [ ] Test with curl: verify 429 responses after limit

**Acceptance:** All API routes return 429 when rate limit exceeded, tests pass

### 5. Git Cleanup

- [ ] Review deleted files list (76 fonts + config files)
- [ ] Commit font deletions if intentional
- [ ] Update .gitignore if needed
- [ ] Ensure no sensitive files in deletions

**Acceptance:** `git status` clean, no unintended deletions

---

## Architecture Decisions

### Logging Strategy

**Decision:** Use Pino for structured logging
**Rationale:**

- 5x faster than Winston, Next.js-friendly
- JSON output for production (log aggregation)
- Pretty output for development (DX)
- Built-in log levels, child loggers

**Alternative considered:** Winston (heavier, more complex)

### Rate Limiting Strategy

**Decision:** Use Upstash Rate Limit with existing Redis
**Rationale:**

- Already using Upstash Redis—no new service
- Sliding window algorithm
- Simple API: `await ratelimit.limit(identifier)`
- Supports different limits per endpoint

**Alternative considered:** Custom Redis implementation (more maintenance)

---

## Related Code Files

1. **lib/auth.ts** (lines 45, 67, 82, 95, 101) - 5 console.error statements
2. **lib/email.ts** (lines 38, 56) - Error logging
3. **lib/redis.ts** (lines 15, 22) - Debug logging
4. **app/api/contact/route.ts** - Add rate limiting
5. **app/api/careers/route.ts** - Add rate limiting
6. **app/api/report/route.ts** - Add rate limiting
7. **next.config.mjs** - Configure bundle analyzer
8. **package.json** - Add analyze script
9. **app/layout.tsx** - Restore if needed
10. **components/layout/Header.tsx** - Restore if needed

---

## Implementation Steps

### Step 1: Git Status Assessment (30 min)

```bash
# Review deleted files
git status

# Check if deletions intentional (recent commits)
git log --oneline -10

# Restore if needed
git restore app/layout.tsx components/layout/Header.tsx

# Or commit deletions
git add -u && git commit -m "chore: remove deprecated fonts and config files"
```

### Step 2: Setup Structured Logging (2h)

```bash
pnpm add pino pino-pretty
```

Create `lib/logger.ts`:

```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});

export const authLogger = logger.child({ module: 'auth' });
export const emailLogger = logger.child({ module: 'email' });
export const redisLogger = logger.child({ module: 'redis' });
```

Replace console.log in lib/auth.ts:

```typescript
// Before: console.error('Auth error:', error)
// After:  authLogger.error({ error }, 'Auth error occurred')
```

### Step 3: Configure Bundle Analyzer (1h)

Add to `next.config.mjs`:

```javascript
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
```

Add to `package.json`:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

Run baseline:

```bash
pnpm analyze
# Document output: client bundle size, server bundle size
```

### Step 4: Implement Rate Limiting (3h)

```bash
pnpm add @upstash/ratelimit
```

Create `lib/rate-limit.ts`:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  prefix: 'ratelimit:contact',
});

export const careersRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  prefix: 'ratelimit:careers',
});

export const reportRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  prefix: 'ratelimit:report',
});
```

Add to `app/api/contact/route.ts`:

```typescript
import { contactRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await contactRateLimit.limit(ip);

  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }

  // Existing logic...
}
```

### Step 5: Write Tests (1h)

```typescript
// app/api/contact/route.test.ts - add rate limit tests
it('should return 429 after rate limit exceeded', async () => {
  // Make 11 requests rapidly
  const requests = Array(11)
    .fill(null)
    .map(() => POST(mockRequest));
  const responses = await Promise.all(requests);

  const rateLimited = responses.filter((r) => r.status === 429);
  expect(rateLimited.length).toBeGreaterThan(0);
});
```

### Step 6: Documentation (30 min)

- Update README.md with logging usage
- Document rate limits in API documentation
- Add bundle size baseline to project docs

---

## Todo Checklist

- [x] Assess git status and restore/commit deletions
- [x] Install Pino and Pino-pretty
- [x] Create lib/logger.ts with child loggers
- [x] Replace console.log in lib/auth.ts
- [x] Replace console.log in lib/email.ts, lib/redis.ts
- [x] Replace console.log in app/api/\*/route.ts
- [x] Configure @next/bundle-analyzer in next.config.mjs
- [x] Add "analyze" script to package.json
- [ ] Run baseline bundle analysis (M3 - defer to before Phase 4)
- [x] Install @upstash/ratelimit
- [x] Create lib/rate-limit.ts
- [x] Add rate limiting to contact API
- [x] Add rate limiting to careers API
- [x] Add rate limiting to report API
- [x] Write rate limit tests
- [ ] Update documentation (M3 - bundle baseline, README logging section)
- [x] Run all tests: `pnpm test`
- [x] Verify git status clean

**Completion:** 16/18 = 88.9%
**Outstanding:** M3 (bundle baseline doc), deferred to before Phase 4

---

## Success Criteria (Measurable)

1. **Git Status:** Clean working directory (verified by `git status`)
2. **Logging:** Zero console.log/error in lib/ and app/api/ (verified by grep)
3. **Bundle Analyzer:** `pnpm analyze` generates report, baseline documented
4. **Rate Limiting:** All API routes return 429 when limit exceeded (verified by tests)
5. **Tests Passing:** All existing + new tests pass (`pnpm test`)
6. **Documentation:** README updated with logging and rate limit info

---

## Risk Assessment

**Low Risk:** All changes are additive or replacements with direct equivalents

- Logging: Drop-in replacement for console.\*
- Rate limiting: Adds protection without changing existing logic
- Bundle analyzer: Dev tool, no production impact
- Git cleanup: Standard housekeeping

**Mitigation:**

- Test rate limiting thoroughly to avoid blocking legitimate users
- Keep console.log in development mode via Pino pretty transport
- Monitor logs post-deployment to ensure no missing critical logs

---

## Security Considerations

- **Rate limiting:** Prevents abuse of API endpoints (DDoS protection)
- **Logging:** Ensure no sensitive data logged (passwords, tokens, PII)
  - Use structured logging with safe fields: `logger.error({ userId }, 'Login failed')`
  - Never log: passwords, session tokens, credit card data
- **IP-based limiting:** Use x-forwarded-for header (trusted proxies only)

---

## Next Steps

After Phase 1 completion:

1. Create PR with changes
2. Review bundle analysis baseline
3. Monitor rate limit metrics in Redis
4. Proceed to Phase 2: Next.js 16 Modernization
