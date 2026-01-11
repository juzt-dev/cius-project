# Code Review Report: Phase 2 Next.js 16 Modernization

**Review Date:** 2026-01-11
**Reviewer:** Code Review Agent
**Phase:** Phase 2 - Next.js 16 Modernization
**Plan:** [Source Code Refactoring](../260110-1544-source-code-refactor/plan.md)
**Related:** [Phase 2 Plan](../260110-1544-source-code-refactor/phase-02-nextjs-modernization.md)

---

## Executive Summary

Phase 2 implementation partially complete with **Server Actions migration successfully executed** but **PPR and caching features not implemented**. Code quality is strong with comprehensive test coverage and proper error handling. However, the phase deviates from plan by maintaining API routes alongside Server Actions rather than migrating exclusively.

**Overall Quality Score: 7.8/10**

**Status:** Partial Implementation - Server Actions delivered with high quality, but PPR/caching milestones unmet.

---

## Code Review Summary

### Scope

**Files Reviewed:** 16 implementation files + 3 test suites
**Lines Analyzed:** ~1,900 LOC (Server Actions, client components, tests, config)
**Focus:** Server Actions implementation, test coverage, type safety, error handling, rate limiting
**Updated Plans:** Phase 2 status requires update to reflect partial completion

### Architecture Assessment

**What Was Delivered:**

- ✅ 3 Server Actions created (contact, careers, report) with full type safety
- ✅ 3 client components migrated to use Server Actions
- ✅ Comprehensive test suites (44 tests covering Server Actions)
- ✅ Rate limiting integrated into Server Actions
- ✅ Suspense boundaries added to Hero component
- ✅ Loading fallback components created
- ✅ Structured logging integrated

**What Was NOT Delivered:**

- ❌ PPR (Partial Prerendering) not enabled
- ❌ "use cache" directive not implemented
- ❌ Cache invalidation strategy (revalidateTag, updateTag) not implemented
- ❌ API routes still active (not deprecated as planned)

**Architectural Deviation:** Plan specified migrating FROM API routes TO Server Actions. Implementation created Server Actions but kept API routes active, resulting in dual endpoints for same functionality.

---

## Detailed Findings

### 1. Server Actions Implementation

**Location:** `lib/actions/*.ts` (contact.ts, careers.ts, report.ts, index.ts)

#### Strengths (Score: 9.2/10)

✅ **Excellent Type Safety:**

```typescript
// Proper discriminated unions for result types
export type ContactActionResult =
  | { success: true; message: string; id: string }
  | { success: false; message: string; errors?: z.ZodIssue[]; ... }
```

✅ **Comprehensive Zod Validation:**

```typescript
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
```

✅ **Proper Error Handling:**

- Zod validation errors returned with field-level details
- Database errors caught and logged without exposing internals
- Email failures handled gracefully
- Rate limit errors return metadata (limit, remaining, reset)

✅ **Rate Limiting Integration:**

```typescript
if (contactRateLimit) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const { success, limit, remaining, reset } = await contactRateLimit.limit(ip);
  // Early return if rate limited
}
```

✅ **Structured Logging:**

```typescript
apiLogger.info({ contactId: contact.id, email: validatedData.email }, 'Contact form submitted');
apiLogger.warn({ ip, limit, remaining, reset }, 'Rate limit exceeded');
apiLogger.error({ error }, 'Contact form error');
```

✅ **Barrel Export Pattern:**

```typescript
// lib/actions/index.ts
export { submitContactAction } from './contact';
export type { ContactFormData, ContactActionResult } from './contact';
```

#### Issues Identified

**P2 - Medium Priority:**

1. **Email Service Failure Not Atomic** (Lines 72-76 in contact.ts)
   - Database record created before email sent
   - If email fails, user data saved but no confirmation sent
   - **Recommendation:** Use database transaction or implement retry queue

   ```typescript
   // Current flow (problematic):
   const contact = await prisma.contact.create({ data }); // ✅ Saved
   await sendEmail({ ... }); // ❌ Fails - but DB already committed

   // Better approach:
   const [contact] = await prisma.$transaction([
     prisma.contact.create({ data }),
     // Or use event queue for email
   ]);
   ```

2. **IP Extraction Duplicated** (Lines 40-42 in all actions)
   - Same IP extraction logic in 3 files
   - **Recommendation:** Extract to utility function in rate-limit.ts

   ```typescript
   // Already exists in lib/rate-limit.ts!
   export function getClientIp(request: Request): string;

   // Should use:
   const ip = getClientIp(request);
   ```

**P3 - Low Priority:**

3. **Missing Input Sanitization**
   - User input (name, message) not sanitized for XSS
   - Email templates not shown but should escape user content
   - **Recommendation:** Add DOMPurify or use templating that auto-escapes

4. **Optional Message Field Inconsistency** (careers.ts line 62)
   ```typescript
   message: formData.get('message') || undefined,
   ```

   - Empty string "" converts to undefined
   - Could use `.optional().transform()` for clarity

---

### 2. Client Components (Form Pages)

**Location:** `app/contact/page.tsx`, `app/careers/page.tsx`, `app/report/page.tsx`

#### Strengths (Score: 8.5/10)

✅ **Proper useState for Loading/Error States:**

```typescript
const [isPending, setIsPending] = useState(false);
const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
```

✅ **Form Reset on Success:**

```typescript
if (result.success) {
  event.currentTarget.reset();
  setSelectedPosition(''); // careers page clears select
}
```

✅ **Loading UI During Submission:**

```typescript
<button disabled={isPending}>
  {isPending ? 'Sending...' : 'Send Message'}
</button>
```

✅ **Accessible Form Structure:**

- Proper label/input associations
- Required field validation
- Disabled state during submission

#### Issues Identified

**P0 - Critical:**

None.

**P1 - High Priority:**

1. **Missing Error Granularity Display** (Lines 82-92 in contact/page.tsx)

   ```typescript
   {message && (
     <div className={...}>
       {message.text} {/* Only shows generic message */}
     </div>
   )}
   ```

   - Server returns `errors?: z.ZodIssue[]` but client doesn't display field-level errors
   - User sees "Validation failed" but not which field
   - **Recommendation:** Map `result.errors` to field-level error messages

2. **No useTransition Hook** (React 19 feature not used)
   - Plan specified using `useTransition` for better UX
   - Current implementation uses manual `isPending` state
   - **Recommendation:**

   ```typescript
   import { useTransition } from 'react';
   const [isPending, startTransition] = useTransition();

   startTransition(async () => {
     const result = await submitContactAction(formData);
     // React 19 handles pending state automatically
   });
   ```

**P2 - Medium Priority:**

3. **Metadata Export Removed** (contact/page.tsx line 5)

   ```typescript
   import type { Metadata } from 'next';
   // But no export const metadata: Metadata = { ... }
   ```

   - Import unused, should remove or add metadata

4. **No Rate Limit Feedback**
   - Server returns `limit`, `remaining`, `reset` on 429
   - Client doesn't show "Try again in X minutes"
   - **Recommendation:** Calculate retry time from `reset` timestamp

---

### 3. Configuration (next.config.mjs)

**Location:** `next.config.mjs`

#### Analysis (Score: 7.0/10)

✅ **cacheComponents Enabled:**

```javascript
cacheComponents: true, // Moved from experimental in Next.js 16.1.1
```

✅ **Security Headers Configured:**

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy restricts camera/mic/geolocation

✅ **Server Actions Body Size Limit:**

```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '2mb';
  }
}
```

✅ **Bundle Analyzer Setup:**

```javascript
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
```

#### Issues Identified

**P1 - High Priority:**

1. **PPR Not Enabled** (Plan requirement)

   ```javascript
   experimental: {
     ppr: true, // ❌ MISSING
     serverActions: { bodySizeLimit: '2mb' }
   }
   ```

   - Plan specified enabling PPR globally
   - **Recommendation:** Add `ppr: true` to experimental config

2. **CSP Header Missing**
   - Content-Security-Policy not configured
   - Vulnerable to XSS if user content not sanitized
   - **Recommendation:**
   ```javascript
   { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'" }
   ```

**P2 - Medium Priority:**

3. **HSTS Header Missing**
   ```javascript
   { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }
   ```

---

### 4. Components (Hero, LoadingFallback)

**Location:** `components/sections/Hero.tsx`, `components/common/LoadingFallback.tsx`

#### Strengths (Score: 9.0/10)

✅ **Suspense Boundaries Implemented:**

```typescript
<Suspense fallback={<ParticlesSkeleton />}>
  <Particles {...PARTICLES_CONFIG} />
</Suspense>
```

✅ **Dynamic Import with Code Splitting:**

```typescript
const Particles = dynamic(() => import('@/components/magicui').then((mod) => mod.Particles), {
  ssr: false,
  loading: () => <ParticlesSkeleton />,
});
```

✅ **Accessibility Labels:**

```typescript
<div aria-label="Loading particles animation" />
<div aria-hidden="true" /> // For decorative gradient
```

✅ **Multiple Loading Skeleton Variants:**

- ParticlesSkeleton for Hero particles
- ContentSkeleton for text content
- CardSkeleton for card layouts

✅ **Proper Constants Extraction:**

```typescript
const PARTICLES_CONFIG = { mouseForce: 12, ... };
const PARALLAX_OFFSET: ['start start', 'end start'] = ['start start', 'end start'];
```

#### Issues Identified

**P3 - Low Priority:**

1. **Nested Suspense Boundaries** (Lines 66-68)
   - Suspense inside Suspense (dynamic import already has loading state)
   - Redundant boundary
   - **Recommendation:** Remove inner Suspense or outer dynamic loading prop

---

### 5. Tests

**Location:** `lib/actions/*.test.ts`

#### Strengths (Score: 9.5/10)

✅ **Comprehensive Coverage:**

- Contact: 12 tests (success, validation, DB errors, email failures, rate limiting)
- Careers: 14 tests (includes optional message field scenarios)
- Report: 18 tests (includes edge cases like uppercase emails)
- **Total: 44 Server Action tests**

✅ **Proper Mocking Strategy:**

```typescript
const mockContactRateLimit = vi.hoisted(() => ({ limit: vi.fn() }));
vi.mock('@/lib/rate-limit', () => ({ contactRateLimit: mockContactRateLimit }));
```

✅ **Edge Case Coverage:**

- Various email formats (user+tag@example.com, user.name@example.co.uk)
- Empty vs missing fields
- Long position titles
- Case sensitivity (uppercase emails)

✅ **Rate Limiting Tests:**

- Verifies rate limit response structure
- Ensures DB/email not called when rate limited
- Checks metadata (limit, remaining, reset)

✅ **Before/After Hooks:**

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  mockContactRateLimit.limit.mockResolvedValue({ success: true, ... });
});
```

#### Issues Identified

**P2 - Medium Priority:**

1. **Missing Integration Tests**
   - All tests are unit tests with mocks
   - No end-to-end tests of Server Action + DB + Email
   - **Recommendation:** Add integration tests with test DB

2. **No Test Coverage for Client Components**
   - Form pages not tested
   - No tests for form submission flow
   - **Recommendation:** Add React Testing Library tests

---

### 6. API Routes (Still Active)

**Location:** `app/api/*/route.ts`

#### Critical Finding (Score: 6.0/10)

**Architectural Mismatch:**

- Plan specified **migrating** API routes to Server Actions
- Implementation **duplicated** logic across both
- 3 API routes still active + 3 Server Actions = 6 endpoints for 3 features

**Code Duplication:**

```typescript
// app/api/contact/route.ts (66 lines)
// lib/actions/contact.ts (101 lines)
// Nearly identical logic (validation, rate limiting, DB, email)
```

**Issues:**

1. **Maintenance Burden**
   - Bug fixes need updating in 2 places
   - Schema changes require dual updates

2. **Inconsistent Error Responses**
   - API route returns `{ success: false, errors: [...] }` with 400 status
   - Server Action returns `{ success: false, errors: [...] }` in result
   - Different contract for same operation

3. **Rate Limiting Duplication**
   - API route uses `getClientIp(request)` helper
   - Server Action manually extracts IP with `headers().get()`
   - Should standardize

**Recommendation:**

**Option A (Align with Plan):**

- Deprecate API routes entirely
- Update external integrations to use Server Actions via form posts
- Remove API route code and tests

**Option B (Pragmatic):**

- Keep API routes for external webhooks/integrations
- Server Actions call internal service functions
- Extract shared logic to `lib/services/contact-service.ts`

```typescript
// lib/services/contact-service.ts
export async function createContact(data: ContactFormData) {
  const contact = await prisma.contact.create({ data });
  await sendEmail({ ... });
  return contact;
}

// lib/actions/contact.ts
export async function submitContactAction(formData: FormData) {
  const parsed = contactSchema.parse(extractFormData(formData));
  return await createContact(parsed);
}

// app/api/contact/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.parse(body);
  return await createContact(parsed);
}
```

---

## Performance Analysis

### Build Performance

✅ **Successful Production Build:**

```
✓ Compiled successfully in 2.5s
✓ Generating static pages using 9 workers (13/13) in 335.5ms
```

✅ **Static Generation:**

- All form pages prerendered as static: ○ (Static)
- API routes marked as dynamic: ƒ (Server)

✅ **Code Splitting Verified:**

- Particles component dynamically imported
- Reduces initial bundle size

### Runtime Performance

⚠️ **No Performance Metrics Available:**

- Lighthouse score not measured
- Core Web Vitals not tracked
- Bundle size not analyzed (ANALYZE=true not run)

**Recommendation:** Run `ANALYZE=true pnpm build` to measure bundle impact.

---

## Security Audit

### Strengths

✅ **CSRF Protection:**

- Server Actions automatically CSRF-protected by Next.js
- No additional tokens needed

✅ **Rate Limiting:**

- All endpoints protected (10/hr contact, 5/hr careers, 20/hr report)
- IP-based limiting with Upstash Redis
- Proper logging of rate limit violations

✅ **Input Validation:**

- Zod schemas enforce type safety and constraints
- Email validation prevents malformed addresses
- Min length requirements prevent spam

✅ **Error Message Safety:**

- Internal errors return generic "Internal server error"
- Stack traces not exposed to client
- Structured logging captures details server-side

### Vulnerabilities

**P1 - High Priority:**

1. **XSS Risk in Email Templates**
   - User input (name, message) inserted into HTML emails
   - Email template implementation not reviewed but likely vulnerable
   - **Recommendation:** Verify emailTemplates.contactConfirmation() escapes HTML

2. **No CSRF Token for API Routes**
   - Server Actions have built-in CSRF protection
   - API routes do NOT (can be called from any origin)
   - **Recommendation:** Add CORS restrictions or deprecate API routes

**P2 - Medium Priority:**

3. **IP Spoofing Risk**

   ```typescript
   const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
   ```

   - X-Forwarded-For can be spoofed by attackers
   - Should validate headers set by trusted proxy only
   - **Recommendation:** Configure trusted proxy in production

4. **No Input Length Limits**
   - Message field has min length but no max
   - Could enable DoS with huge messages
   - **Recommendation:**
   ```typescript
   message: z.string().min(10).max(5000);
   ```

---

## Type Safety Assessment

### Strengths (Score: 9.8/10)

✅ **Zero TypeScript Errors:**

```bash
> tsc --noEmit
# No output = success
```

✅ **Discriminated Unions:**

```typescript
type Result = { success: true; ... } | { success: false; ... }
if (result.success) {
  result.id // ✅ TypeScript knows this exists
} else {
  result.errors // ✅ TypeScript knows this exists
}
```

✅ **Zod Integration:**

```typescript
export type ContactFormData = z.infer<typeof contactSchema>;
// Type automatically derived from schema
```

✅ **Proper Type Exports:**

```typescript
export type { ContactFormData, ContactActionResult } from './contact';
```

### Issues

**P3 - Low Priority:**

1. **Unused Type Import** (contact/page.tsx line 5)
   ```typescript
   import type { Metadata } from 'next';
   // Not used - should remove
   ```

---

## Test Coverage Analysis

### Current Coverage

✅ **296 Tests Passing:**

- Server Actions: 44 tests
- API Routes: 55 tests
- UI Components: 121 tests
- Utilities: 76 tests

✅ **Test Distribution:**

```
lib/actions/contact.test.ts    12 tests
lib/actions/careers.test.ts    14 tests
lib/actions/report.test.ts     18 tests
app/api/contact/route.test.ts  20 tests
app/api/careers/route.test.ts  17 tests
app/api/report/route.test.ts   18 tests
```

### Coverage Gaps

**P1 - High Priority:**

1. **No Client Component Tests**
   - app/contact/page.tsx (0% coverage)
   - app/careers/page.tsx (0% coverage)
   - app/report/page.tsx (0% coverage)
   - **Recommendation:** Add React Testing Library tests for form submission

2. **No E2E Tests**
   - All tests are unit/integration with mocks
   - No tests of full user flow (form submit → DB save → email send)
   - **Recommendation:** Add Playwright/Cypress tests

**P2 - Medium Priority:**

3. **Loading Components Not Tested**
   - ParticlesSkeleton, ContentSkeleton, CardSkeleton (0% coverage)
   - **Recommendation:** Add snapshot tests

---

## Phase Completion Status

### Completed Requirements ✅

1. ✅ **Server Actions Created:**
   - contact.ts, careers.ts, report.ts
   - Proper type safety, validation, error handling

2. ✅ **Client Components Updated:**
   - All 3 form pages use Server Actions
   - Loading states implemented

3. ✅ **Rate Limiting in Server Actions:**
   - IP extraction from headers()
   - Proper error responses

4. ✅ **Suspense Boundaries:**
   - Hero component wraps Particles
   - LoadingFallback components created

5. ✅ **Tests Written:**
   - 44 Server Action tests
   - Comprehensive edge case coverage

### Incomplete Requirements ❌

1. ❌ **PPR Not Enabled:**
   - `experimental.ppr = true` not in next.config.mjs
   - No `export const experimental_ppr = true` in pages

2. ❌ **"use cache" Not Implemented:**
   - No cache directives in codebase
   - No unstable_cache() usage
   - No revalidateTag() or updateTag() calls

3. ❌ **API Routes Not Deprecated:**
   - All 3 API routes still active
   - Creates dual endpoint problem

4. ❌ **No Cache Invalidation Strategy:**
   - No tag-based caching
   - No cache monitoring

### Success Criteria Evaluation

| Criterion      | Target                    | Actual          | Status |
| -------------- | ------------------------- | --------------- | ------ |
| PPR Enabled    | Homepage chunked encoding | Not implemented | ❌     |
| Caching        | <50ms cache hits          | Not implemented | ❌     |
| Server Actions | All 3 forms migrated      | ✅ Done         | ✅     |
| Suspense       | All async wrapped         | ✅ Hero done    | ✅     |
| Tests          | Server Action tests       | ✅ 44 tests     | ✅     |
| Performance    | Lighthouse ≥85            | Not measured    | ⚠️     |

**Overall Phase Status:** **60% Complete** (3/5 major requirements)

---

## Priority Issues Summary

### P0 - Critical (0 issues)

None. Code is production-ready for Server Actions.

### P1 - High Priority (4 issues)

1. **PPR Not Enabled** (next.config.mjs)
   - Add `experimental: { ppr: true }`
   - Add `experimental_ppr = true` to routes

2. **"use cache" Not Implemented** (lib/data/\*.ts)
   - Wrap expensive DB queries with unstable_cache()
   - Add cache tags for invalidation

3. **Missing Field-Level Error Display** (Form pages)
   - Map `result.errors` to field error messages
   - Show validation errors per field

4. **No useTransition Hook** (Form pages)
   - Replace manual isPending with useTransition
   - Leverage React 19 automatic transitions

### P2 - Medium Priority (8 issues)

1. Email failure not atomic (Server Actions)
2. IP extraction duplicated (Server Actions)
3. CSP header missing (next.config.mjs)
4. API routes not deprecated (Architectural)
5. No rate limit retry feedback (Form pages)
6. Missing integration tests (Test suite)
7. IP spoofing risk (Rate limiting)
8. No input length limits (Validation)

### P3 - Low Priority (4 issues)

1. Missing input sanitization (XSS)
2. Unused type import (contact/page.tsx)
3. Nested Suspense redundancy (Hero.tsx)
4. Optional message field inconsistency (careers.ts)

---

## Recommendations

### Immediate Actions (Complete Phase 2)

1. **Enable PPR:**

   ```javascript
   // next.config.mjs
   experimental: { ppr: true, serverActions: { bodySizeLimit: '2mb' } }

   // app/page.tsx
   export const experimental_ppr = true;
   ```

2. **Implement Caching:**

   ```typescript
   // lib/data/content.ts
   import { unstable_cache } from 'next/cache';

   export const getCachedHomepageContent = unstable_cache(
     async () => prisma.content.findMany(),
     ['homepage-content'],
     { revalidate: 3600, tags: ['content'] }
   );
   ```

3. **Add Field-Level Errors:**

   ```typescript
   // app/contact/page.tsx
   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

   if (!result.success && result.errors) {
     const errors = result.errors.reduce(
       (acc, err) => ({
         ...acc,
         [err.path[0]]: err.message,
       }),
       {}
     );
     setFieldErrors(errors);
   }
   ```

4. **Adopt useTransition:**

   ```typescript
   import { useTransition } from 'react';
   const [isPending, startTransition] = useTransition();

   startTransition(async () => {
     const result = await submitContactAction(formData);
     // ...
   });
   ```

### Architectural Cleanup

5. **Deprecate API Routes OR Extract Shared Logic:**
   - If keeping API routes: Extract to `lib/services/*.ts`
   - If deprecating: Remove API route files and update docs

6. **Add Security Headers:**
   ```javascript
   { key: 'Content-Security-Policy', value: "default-src 'self'" },
   { key: 'Strict-Transport-Security', value: 'max-age=31536000' }
   ```

### Testing Improvements

7. **Add Client Component Tests:**

   ```typescript
   // app/contact/__tests__/page.test.tsx
   import { render, fireEvent, waitFor } from '@testing-library/react';
   import ContactPage from '../page';

   test('submits form with valid data', async () => {
     const { getByLabelText, getByText } = render(<ContactPage />);
     // ...
   });
   ```

8. **Measure Performance:**
   ```bash
   ANALYZE=true pnpm build
   pnpm lighthouse http://localhost:3000
   ```

---

## Positive Observations

### Excellent Practices

1. **Structured Logging Integration:**
   - All Server Actions use apiLogger
   - Proper log levels (info, warn, error)
   - Contextual data in logs

2. **Type-Safe Error Handling:**
   - Discriminated unions for result types
   - Zod error details preserved
   - No `any` types in implementation

3. **Comprehensive Test Coverage:**
   - Edge cases covered (email formats, case sensitivity)
   - Rate limiting verified
   - Mock strategy follows best practices

4. **Accessibility:**
   - Proper ARIA labels
   - Loading states communicated
   - Form labels associated with inputs

5. **Code Organization:**
   - Barrel exports for clean imports
   - Constants extracted
   - Separation of concerns (actions vs UI)

---

## Metrics

### Code Quality

- **Type Coverage:** 100% (0 TypeScript errors)
- **Linting Issues:** 0 (ESLint passing)
- **Test Pass Rate:** 296/296 (100%)
- **Build Success:** ✅ Production build successful

### Test Coverage (Estimated)

- **Server Actions:** 100% (44 tests for 4 files)
- **API Routes:** 100% (55 tests for 3 files)
- **Client Components:** 0% (no tests)
- **Overall:** ~40% (UI components drag down average)

### Performance (Not Measured)

- **Bundle Size:** Unknown (ANALYZE not run)
- **Lighthouse Score:** Unknown
- **Core Web Vitals:** Unknown

---

## Next Steps

### To Complete Phase 2

1. ✅ Server Actions - **DONE**
2. ❌ Enable PPR - **TODO**
3. ❌ Implement "use cache" - **TODO**
4. ⚠️ Deprecate API routes - **DECISION NEEDED**

### Before Proceeding to Phase 3

- Decide API route strategy (deprecate or refactor)
- Enable PPR and verify streaming
- Implement caching for expensive queries
- Add client component tests
- Measure baseline performance metrics

---

## Plan Update Required

**Phase 2 Status:** Change from "Pending" to "Partial - Server Actions Complete"

**Checklist Update:**

```markdown
- ✅ Create lib/actions/ directory
- ✅ Migrate contact form to Server Action
- ✅ Migrate careers form to Server Action
- ✅ Migrate report form to Server Action
- ✅ Update client components to use Server Actions
- ✅ Add Suspense around Hero particles
- ✅ Create LoadingFallback components
- ✅ Write tests for Server Actions
- ❌ Add `experimental.ppr = true` to next.config.mjs
- ❌ Add `experimental_ppr = true` to app/page.tsx
- ❌ Audit all async Server Components
- ❌ Implement unstable_cache for expensive queries
- ❌ Add cache tags for invalidation
- ❌ Test cache invalidation with revalidateTag()
```

---

## Unresolved Questions

1. **API Route Deprecation:** Should API routes be removed or maintained for external integrations?
2. **PPR Readiness:** Are all components PPR-compatible (no client-only hooks in server components)?
3. **Caching Strategy:** Which queries are "expensive" and need caching? (DB query analysis needed)
4. **Performance Baseline:** What are current bundle size and Lighthouse scores before optimization?
5. **Email Template Security:** Are email templates escaping user input properly? (Code not reviewed)

---

**Review Completed:** 2026-01-11 13:54 UTC
**Recommendation:** Address P1 issues to fully complete Phase 2, then proceed to Phase 3.
