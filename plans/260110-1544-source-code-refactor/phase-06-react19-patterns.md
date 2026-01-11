# Phase 6: React 19 & Advanced Patterns

**Parent Plan:** [Source Code Refactoring](./plan.md)
**Dependencies:** Phases 1-5 (All previous phases)
**Related Docs:** [Research: Modern Patterns](./research/researcher-01-modern-patterns.md) | [React 19 Release](https://react.dev/blog/2024/12/05/react-19)

---

## Overview

**Date:** 2026-01-10
**Description:** Implement useTransition/useOptimistic, optimize Server/Client boundaries, document components
**Priority:** P2 (Medium Impact)
**Implementation Status:** Pending
**Review Status:** Not Started
**Effort:** 4 hours

---

## Key Insights from Research

- **useTransition:** Manages async state updates without blocking UI—auto pending states
- **useOptimistic:** Shows instant UI feedback while server action processes—auto revert on error
- **Server/Client boundaries:** Hero and Header are fully client—can split for smaller bundles
- **Component documentation:** Missing JSDoc for props, making reuse harder
- **Form UX:** Can improve with React 19 hooks (instant feedback, pending states)

---

## Requirements & Acceptance Criteria

### 1. Implement useTransition for Forms

- [ ] Add useTransition to contact form (pending state)
- [ ] Add useTransition to careers form
- [ ] Add useTransition to report form
- [ ] Show loading spinners during submission
- [ ] Disable submit button while pending

**Acceptance:** All forms show pending state, users can't double-submit

### 2. Add useOptimistic for Instant Feedback

- [ ] Implement optimistic updates for form success messages
- [ ] Add optimistic state for like/favorite features (if any)
- [ ] Show instant UI changes, revert on error
- [ ] Test error scenarios (network failure, validation error)

**Acceptance:** Forms show instant success, revert to form on error

### 3. Optimize Server/Client Boundaries

- [ ] Split Hero: Server shell + Client particles/animations
- [ ] Split Header: Server nav structure + Client mobile menu
- [ ] Extract client-only logic to minimal components
- [ ] Verify bundle size reduction

**Acceptance:** Hero/Header bundles reduced by ≥30%

### 4. Document Component Props

- [ ] Add JSDoc to all reusable components (ui/, common/)
- [ ] Document prop types, examples, usage notes
- [ ] Add @example blocks for complex components
- [ ] Generate component documentation with Storybook

**Acceptance:** All reusable components have JSDoc, Storybook docs auto-generated

---

## Architecture Decisions

### useTransition vs useOptimistic

**Decision:** Use both—useTransition for pending states, useOptimistic for instant UI updates
**Rationale:**

- useTransition: Shows loading indicator, prevents double-submit
- useOptimistic: Instant feedback (like submitted form), better UX
- Combined: Best of both worlds

**Pattern:**

```typescript
const [isPending, startTransition] = useTransition();
const [optimisticState, setOptimistic] = useOptimistic(state);

function handleSubmit(data) {
  setOptimistic(data); // Show instant success
  startTransition(async () => {
    const result = await serverAction(data);
    if (result.error) {
      // Optimistic state auto-reverts
      showError(result.error);
    }
  });
}
```

### Server/Client Boundary Optimization

**Decision:** Server Components for structure, Client for interactivity only
**Rationale:**

- Server: Static layout, SEO content, data fetching
- Client: Animations, mobile menu, interactive widgets
- Smaller client bundles = faster load

**Pattern:**

```typescript
// Server Component (default)
export function Hero() {
  return (
    <section>
      <HeroContent /> {/* Server */}
      <ClientParticles /> {/* "use client" */}
    </section>
  )
}

// Client boundary (minimal)
'use client'
export function ClientParticles() {
  return <Particles />
}
```

---

## Related Code Files

1. **app/contact/ContactForm.tsx** - Add useTransition, useOptimistic
2. **app/careers/CareersForm.tsx** - Add useTransition
3. **components/sections/Hero.tsx** - Split Server/Client
4. **components/layout/Header.tsx** - Split Server/Client
5. **components/ui/Button.tsx** - Add JSDoc
6. **components/ui/Card.tsx** - Add JSDoc
7. **components/ui/Input.tsx** - Add JSDoc

---

## Implementation Steps

### Step 1: Add useTransition to Forms (1.5h)

```typescript
// app/contact/ContactForm.tsx
'use client'

import { useTransition } from 'react'
import { submitContact } from '@/lib/actions/contact'

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await submitContact(formData)

      if (result.error) {
        setMessage('Error: ' + result.error)
      } else {
        setMessage('Success! We will contact you soon.')
        e.currentTarget.reset()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input name="name" required />
      <Input name="email" type="email" required />
      <Textarea name="message" required />

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Message'}
      </Button>

      {message && <p>{message}</p>}
    </form>
  )
}
```

### Step 2: Add useOptimistic (1h)

```typescript
// app/contact/ContactForm.tsx
'use client'

import { useOptimistic, useTransition } from 'react'

type FormState = {
  status: 'idle' | 'success' | 'error'
  message: string | null
}

export function ContactForm() {
  const [state, setState] = useState<FormState>({ status: 'idle', message: null })
  const [optimisticState, setOptimisticState] = useOptimistic(state)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Show instant success (optimistic)
    setOptimisticState({
      status: 'success',
      message: 'Message sent! We will reply soon.',
    })

    startTransition(async () => {
      const result = await submitContact(formData)

      // Update to actual state (optimistic auto-reverts on error)
      if (result.error) {
        setState({ status: 'error', message: result.error })
      } else {
        setState({ status: 'success', message: 'Message sent!' })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}

      {optimisticState.status === 'success' && (
        <p className="text-green-600">{optimisticState.message}</p>
      )}

      {optimisticState.status === 'error' && (
        <p className="text-red-600">{optimisticState.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send'}
      </Button>
    </form>
  )
}
```

### Step 3: Optimize Server/Client Boundaries (1h)

```typescript
// components/sections/Hero.tsx (Server Component - default)
import { HeroContent } from './HeroContent'
import { ClientParticles } from './ClientParticles'

export function Hero() {
  return (
    <section className="relative min-h-screen">
      <HeroContent />
      <ClientParticles />
    </section>
  )
}

// components/sections/Hero/HeroContent.tsx (Server)
export function HeroContent() {
  return (
    <div className="z-10">
      <h1>Welcome to CIUS</h1>
      <p>Enterprise solutions...</p>
    </div>
  )
}

// components/sections/Hero/ClientParticles.tsx (Client)
'use client'

import dynamic from 'next/dynamic'

const Particles = dynamic(() => import('@/components/magicui/particles'), {
  ssr: false,
})

export function ClientParticles() {
  return <Particles className="absolute inset-0" />
}
```

Verify bundle reduction:

```bash
pnpm analyze
# Check Hero chunk size before/after split
```

### Step 4: Add JSDoc to Components (30 min)

````typescript
// components/ui/Button.tsx
/**
 * Button component with variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">Click me</Button>
 * ```
 *
 * @param variant - Visual style: 'primary' | 'secondary' | 'outline'
 * @param size - Size: 'sm' | 'md' | 'lg'
 * @param disabled - Disable button interaction
 * @param children - Button content
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  // ...
}
````

Generate docs:

```bash
# Storybook auto-generates docs from JSDoc
pnpm storybook
```

---

## Todo Checklist

- [ ] Add useTransition to ContactForm
- [ ] Add useTransition to CareersForm
- [ ] Add useTransition to ReportForm
- [ ] Implement useOptimistic for instant success messages
- [ ] Test optimistic revert on error scenarios
- [ ] Split Hero into Server/Client components
- [ ] Split Header into Server/Client components
- [ ] Verify bundle size reduction (≥30%)
- [ ] Add JSDoc to Button component
- [ ] Add JSDoc to Card component
- [ ] Add JSDoc to Input component
- [ ] Add JSDoc to all reusable components
- [ ] Generate Storybook docs
- [ ] Write tests for useTransition behavior
- [ ] Write tests for useOptimistic revert
- [ ] Update documentation

---

## Success Criteria (Measurable)

1. **Forms:** All forms use useTransition (verified by pending states shown)
2. **Optimistic Updates:** Contact form shows instant success, reverts on error
3. **Bundle Size:** Hero/Header bundles reduced by ≥30% (verified by analyzer)
4. **Documentation:** All reusable components have JSDoc (verified by Storybook)
5. **Tests Passing:** Tests verify useTransition prevents double-submit, useOptimistic reverts
6. **UX Improvement:** Form submission feels instant (measured by user feedback)

---

## Risk Assessment

**Low Risk:**

- useTransition/useOptimistic: Built-in React hooks, well-tested
- Server/Client split: Non-breaking refactor, improves performance
- JSDoc: Documentation only, no runtime changes

**Minimal Risk:**

- **Over-optimism:** Optimistic updates may confuse if reverted too often
  - **Mitigation:** Only use for high-success-rate actions (forms, not payments)

---

## Security Considerations

- **Client state manipulation:** useOptimistic only affects UI, server validates
- **Double-submit prevention:** useTransition disables button while pending
- **Error exposure:** Don't show detailed errors to users (log server-side)

---

## Next Steps

After Phase 6 completion:

1. Gather user feedback on form UX improvements
2. Monitor bundle sizes in production
3. Iterate on optimistic update patterns
4. Document React 19 patterns for team
5. **All phases complete—refactoring done!**

---

## Post-Refactoring Checklist

- [ ] All 6 phases completed
- [ ] Documentation updated
- [ ] Team trained on new patterns
- [ ] Performance metrics tracked (before/after)
- [ ] CI quality gates passing
- [ ] Production deployment successful
- [ ] User feedback collected
- [ ] Retrospective held (what went well, what to improve)
