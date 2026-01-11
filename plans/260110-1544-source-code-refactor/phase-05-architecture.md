# Phase 5: Architecture Improvements

**Parent Plan:** [Source Code Refactoring](./plan.md)
**Dependencies:** Phases 1-4 (Foundation through Performance)
**Related Docs:** [Research: Modern Patterns](./research/researcher-01-modern-patterns.md) | [System Architecture](/Users/Chuo/CODE/Code Learn/docs/system-architecture.md)

---

## Overview

**Date:** 2026-01-10
**Description:** Standardize error handling, split large components, add error boundaries, organize features
**Priority:** P2 (Medium Impact)
**Implementation Status:** Pending
**Review Status:** Not Started
**Effort:** 6 hours

---

## Key Insights from Research

- **Large utils.ts:** 145 lines mixing formatters, validators, class utils—should split by domain
- **Error handling:** Inconsistent across API routes, no centralized formatting
- **Error boundaries:** Only app/error.tsx—missing granular boundaries for sections
- **Feature organization:** Mix of layer-based and feature-based—should standardize
- **Barrel exports:** Can reduce bundle if used carefully (feature-level only)

---

## Requirements & Acceptance Criteria

### 1. Standardize Error Handling

- [ ] Create centralized error types (AppError, ValidationError, AuthError)
- [ ] Standardize API error responses (consistent JSON format)
- [ ] Add error formatter for Server Actions
- [ ] Replace generic try-catch with typed error handling
- [ ] Add error logging with context (user ID, request ID)

**Acceptance:** All errors follow consistent format, logged with context

### 2. Split Large Components/Files

- [ ] Split lib/utils.ts into utils/formatters.ts, utils/validators.ts, utils/cn.ts
- [ ] Extract Hero subcomponents (HeroContent, HeroBackground, HeroParticles)
- [ ] Split Header into HeaderDesktop, HeaderMobile if >150 lines
- [ ] Move section data to dedicated files (sections/data/)

**Acceptance:** No file >150 lines except complex animations

### 3. Add Error Boundaries

- [ ] Create reusable ErrorBoundary component
- [ ] Add error boundary to each section (Hero, WhoWeAre, etc.)
- [ ] Add error boundary to layout components (Header, Footer)
- [ ] Add error boundary to form components
- [ ] Log errors to monitoring service (Sentry or similar)

**Acceptance:** All sections isolated—one section error doesn't crash page

### 4. Feature-Based Organization (New Features)

- [ ] Create features/ directory structure template
- [ ] Document feature organization pattern
- [ ] Migrate one existing feature as example (e.g., contact form)
- [ ] Add barrel exports for feature public APIs

**Acceptance:** New features follow feature-based pattern, documented

---

## Architecture Decisions

### Error Handling Strategy

**Decision:** Three-tier error system (App errors, HTTP errors, System errors)
**Rationale:**

- App errors: Business logic failures (validation, authorization)
- HTTP errors: Network/API failures (404, 500)
- System errors: Unexpected crashes (DB down, OOM)

**Pattern:**

```typescript
class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
  }
}

class ValidationError extends AppError {
  constructor(
    message: string,
    public fields: Record<string, string>
  ) {
    super('VALIDATION_ERROR', message, 400);
  }
}
```

### Component Splitting Strategy

**Decision:** Split when >150 lines or 3+ responsibilities
**Rationale:**

- Readability: Easier to understand focused components
- Testability: Smaller components easier to test
- Reusability: Extracted components can be reused

**Pattern:**

```typescript
// Before: Hero.tsx (200 lines)
export function Hero() {
  /* everything */
}

// After: Hero/index.tsx (50 lines)
export { Hero } from './Hero';
export { HeroContent } from './HeroContent';
export { HeroBackground } from './HeroBackground';
```

### Feature Organization (Future)

**Decision:** Hybrid approach—existing layer-based, new features feature-based
**Rationale:**

- Don't refactor working code unnecessarily (YAGNI)
- New features get feature-based structure
- Gradual migration as features evolve

**Pattern:**

```
features/
  contact/
    actions/      # submitContact
    components/   # ContactForm, ContactSuccess
    schemas/      # contactSchema
    types/        # ContactFormData
    index.ts      # Public API
```

---

## Related Code Files

1. **lib/utils.ts** (145 lines) - Split into utils/formatters, validators, cn
2. **components/sections/Hero.tsx** - Extract subcomponents
3. **components/layout/Header.tsx** - Check size, split if needed
4. **app/error.tsx** - Enhance for better error reporting
5. **lib/errors.ts** - Create new file for error types
6. **lib/actions/contact.ts** - Update to use typed errors
7. **components/common/ErrorBoundary.tsx** - Create new component

---

## Implementation Steps

### Step 1: Split lib/utils.ts (1h)

```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```typescript
// lib/utils/formatters.ts
export function formatDate(date: Date): string {
  /* ... */
}
export function formatCurrency(amount: number): string {
  /* ... */
}
```

```typescript
// lib/utils/validators.ts
export function isValidEmail(email: string): boolean {
  /* ... */
}
export function isValidPhone(phone: string): boolean {
  /* ... */
}
```

```typescript
// lib/utils/index.ts (barrel export)
export { cn } from './cn';
export * from './formatters';
export * from './validators';
```

Update imports:

```bash
# Find all imports of lib/utils
grep -r "from '@/lib/utils'" components/ app/

# Update to import specific utilities
# from '@/lib/utils' → from '@/lib/utils/formatters'
```

### Step 2: Create Error System (1.5h)

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.context && { context: this.context }),
      },
    };
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields: Record<string, string[]>
  ) {
    super('VALIDATION_ERROR', message, 400, { fields });
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('AUTH_ERROR', message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}
```

Use in Server Actions:

```typescript
// lib/actions/contact.ts
import { ValidationError } from '@/lib/errors';

export async function submitContact(formData: FormData) {
  const parsed = contactSchema.safeParse(/* ... */);

  if (!parsed.success) {
    throw new ValidationError('Invalid form data', parsed.error.flatten().fieldErrors);
  }

  // ... rest
}
```

### Step 3: Add Error Boundaries (2h)

```typescript
// components/common/ErrorBoundary.tsx
'use client'

import { Component, type ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: unknown) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    logger.error({ error, errorInfo }, 'ErrorBoundary caught error')
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">Something went wrong. Please try again.</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

Wrap sections:

```typescript
// app/page.tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

export default function HomePage() {
  return (
    <>
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>

      <ErrorBoundary>
        <WhoWeAre />
      </ErrorBoundary>

      {/* ... other sections */}
    </>
  )
}
```

### Step 4: Split Hero Component (1h)

```typescript
// components/sections/Hero/HeroContent.tsx
export function HeroContent() {
  return (
    <div className="z-10 space-y-6">
      <h1>Welcome to CIUS</h1>
      <p>Description...</p>
      <Button>Get Started</Button>
    </div>
  )
}

// components/sections/Hero/HeroBackground.tsx
import Image from 'next/image'

export function HeroBackground() {
  return (
    <Image
      src="/hero-bg.avif"
      alt="Hero background"
      fill
      sizes="100vw"
      priority
      className="object-cover -z-10"
    />
  )
}

// components/sections/Hero/Hero.tsx
import { HeroContent } from './HeroContent'
import { HeroBackground } from './HeroBackground'

export function Hero() {
  return (
    <section className="relative min-h-screen">
      <HeroBackground />
      <HeroContent />
    </section>
  )
}

// components/sections/Hero/index.ts
export { Hero } from './Hero'
```

### Step 5: Document Feature Pattern (30 min)

```markdown
<!-- docs/architecture/feature-organization.md -->

# Feature-Based Organization

New features should follow this structure:

features/
{feature-name}/
actions/ # Server Actions
components/ # Feature-specific UI
hooks/ # Custom hooks
schemas/ # Zod schemas
types/ # TypeScript types
utils/ # Feature-specific utilities
index.ts # Public API (barrel export)

Example:
features/
contact/
actions/submitContact.ts
components/ContactForm.tsx
schemas/contactSchema.ts
types/index.ts
index.ts # export { ContactForm } from './components/ContactForm'
```

---

## Todo Checklist

- [ ] Split lib/utils.ts into utils/cn, formatters, validators
- [ ] Update all imports of lib/utils
- [ ] Create lib/errors.ts with error types
- [ ] Update Server Actions to use typed errors
- [ ] Create ErrorBoundary component
- [ ] Wrap sections in error boundaries
- [ ] Split Hero into subcomponents (HeroContent, HeroBackground)
- [ ] Check Header size, split if >150 lines
- [ ] Move section data to sections/data/
- [ ] Create feature organization template
- [ ] Document feature pattern in docs/
- [ ] Migrate contact form to features/ as example
- [ ] Write tests for error handling
- [ ] Write tests for ErrorBoundary
- [ ] Update documentation

---

## Success Criteria (Measurable)

1. **File Size:** No file >150 lines (except complex animations, documented exceptions)
2. **Error Handling:** All Server Actions use typed errors (AppError, ValidationError, etc.)
3. **Error Boundaries:** All sections wrapped, errors don't crash entire page
4. **Utils Split:** lib/utils.ts replaced by utils/cn, formatters, validators
5. **Documentation:** Feature pattern documented, example feature migrated
6. **Tests Passing:** Error handling tests verify correct error types, boundaries work

---

## Risk Assessment

**Low Risk:**

- File splitting: Non-breaking refactor (imports updated automatically)
- Error boundaries: Additive change (catches errors, doesn't introduce them)
- Typed errors: Improves error handling, doesn't change behavior

**Medium Risk:**

- **Over-engineering:** Feature pattern may be overkill for small app
  - **Mitigation:** Use for new features only, don't force migration
- **Error boundary overhead:** Small performance cost per boundary
  - **Mitigation:** Use strategically (section-level, not component-level)

---

## Security Considerations

- **Error messages:** Don't expose internal details in production
  - Development: Full stack traces
  - Production: Generic messages, log details server-side
- **Error logging:** Sanitize sensitive data before logging
- **Error boundaries:** Prevent error stacks from leaking via client

---

## Next Steps

After Phase 5 completion:

1. Monitor error logs for new patterns
2. Iterate on error messages based on user feedback
3. Gradually migrate existing features to feature-based pattern (if valuable)
4. Proceed to Phase 6: React 19 & Advanced Patterns
