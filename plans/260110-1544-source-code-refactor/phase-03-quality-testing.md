# Phase 3: Code Quality & Testing

**Parent Plan:** [Source Code Refactoring](./plan.md)
**Dependencies:** Phase 1 (Foundation), Phase 2 (Next.js 16 Modernization)
**Related Docs:** [Research: Quality Tools](./research/researcher-02-quality-tools.md) | [Scout Report](./scout/scout-01-codebase-analysis.md)

---

## Overview

**Date:** 2026-01-10
**Description:** Increase test coverage to 80%+, replace `any` types, add runtime validation, setup quality tools
**Priority:** P1 (High Impact)
**Implementation Status:** Pending
**Review Status:** Not Started
**Effort:** 8 hours

---

## Key Insights from Research

- **Current coverage:** ~30-40% (only API routes, UI components, lib utilities tested)
- **Type safety gaps:** 10 files with `any` types (Storybook, test mocks, Cloudinary, canvas APIs)
- **Missing runtime validation:** API routes don't validate with Zod schemas
- **Enterprise tools:** SonarQube (gold standard), Codecov (coverage tracking), TypeScript strict mode already enabled
- **Dead code detection:** ts-prune, knip can find unused exports

---

## Requirements & Acceptance Criteria

### 1. Increase Test Coverage to 80%+

- [ ] Write tests for sections components (Hero, WhoWeAre, OurFocus, OurProducts, AISection)
- [ ] Write tests for layout components (Header, Footer, DropdownMenu)
- [ ] Write tests for animations (FadeIn, FadeUp, SlideIn)
- [ ] Write tests for Server Actions (contact, careers, report)
- [ ] Configure Vitest coverage reporter
- [ ] Setup Codecov for CI coverage tracking

**Acceptance:** Codecov reports ≥80% line coverage, ≥70% branch coverage

### 2. Replace `any` Types

- [ ] Add Cloudinary SDK type definitions to lib/cloudinary.ts
- [ ] Add proper event handler types to components/layout/DropdownMenu.tsx
- [ ] Add canvas context types to components/animations/LiquidEther.tsx
- [ ] Strengthen test mock types in lib/test-utils/mocks.tsx
- [ ] Document why `any` needed in Storybook files (external API limitation)

**Acceptance:** Zero `any` in src code (lib/, components/, app/), acceptable in tests/Storybook

### 3. Add Runtime Validation

- [ ] Create Zod schemas for all API request bodies
- [ ] Add schema validation to Server Actions
- [ ] Validate environment variables with Zod at startup
- [ ] Add type-safe parsing for external API responses

**Acceptance:** All API inputs validated with Zod, runtime errors caught early

### 4. Setup Quality Tools

- [ ] Configure Codecov in GitHub Actions
- [ ] Setup SonarQube or CodeScene (decide based on budget)
- [ ] Configure complexity thresholds in ESLint
- [ ] Add pre-commit hooks with Husky + lint-staged
- [ ] Setup CI quality gates (coverage, lint, type-check)

**Acceptance:** CI fails if coverage <80%, ESLint errors, or TypeScript errors

---

## Architecture Decisions

### Test Strategy

**Decision:** Focus on integration tests for components, unit tests for utilities
**Rationale:**

- React Testing Library encourages testing user behavior (integration)
- Unit tests for pure functions (utils, formatters, validators)
- Avoid testing implementation details (state, internal methods)

**Coverage priorities:**

1. Critical user paths (forms, navigation)
2. Business logic (auth, email, payment)
3. UI components (buttons, cards, inputs)
4. Utilities (date formatting, string manipulation)

### Type Safety Exceptions

**Decision:** Allow `any` only for external APIs with poor types (Cloudinary, canvas)
**Rationale:**

- Third-party libraries may not provide types
- Better to use `any` with comment than incorrect types
- Focus type safety on our code, not vendor code

**Pattern:**

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const canvasCtx = canvas.getContext('2d') as any; // Canvas API types incomplete
```

---

## Related Code Files

**Untested files:**

1. **components/sections/Hero.tsx** - Main landing section
2. **components/sections/WhoWeAre.tsx** - About section
3. **components/sections/OurFocus.tsx** - Focus areas
4. **components/sections/OurProducts.tsx** - Products showcase
5. **components/layout/Header.tsx** - Navigation header
6. **components/layout/Footer.tsx** - Site footer
7. **components/animations/FadeIn.tsx** - Animation wrapper
8. **lib/actions/\*** - New Server Actions from Phase 2

**Files with `any`:** 9. **lib/cloudinary.ts** (lines 23, 45) - Cloudinary response types 10. **components/layout/DropdownMenu.tsx** (line 15) - Event handler 11. **components/animations/LiquidEther.tsx** (line 42) - Canvas context

---

## Implementation Steps

### Step 1: Configure Coverage Reporting (1h)

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/', '.next/', '*.config.ts', '**/*.stories.tsx'],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 75,
        statements: 80,
      },
    },
  },
});
```

```bash
pnpm add -D @vitest/coverage-v8
```

### Step 2: Write Component Tests (3h)

```typescript
// components/sections/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders hero heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument()
  })

  it('displays CTA button', () => {
    render(<Hero />)
    const button = screen.getByRole('button', { name: /get started/i })
    expect(button).toBeInTheDocument()
  })
})
```

Repeat for:

- WhoWeAre, OurFocus, OurProducts sections
- Header, Footer layout components
- Animation wrappers (test they render children)

### Step 3: Write Server Action Tests (2h)

```typescript
// lib/actions/contact.test.ts
import { submitContact } from './contact';
import { sendEmail } from '@/lib/email';

vi.mock('@/lib/email');

describe('submitContact', () => {
  it('validates required fields', async () => {
    const formData = new FormData();
    formData.set('name', '');
    formData.set('email', 'invalid');

    const result = await submitContact(formData);

    expect(result.error).toBeDefined();
    expect(result.error.email).toContain('Invalid email');
  });

  it('sends email on valid submission', async () => {
    const formData = new FormData();
    formData.set('name', 'John Doe');
    formData.set('email', 'john@example.com');
    formData.set('message', 'Hello world');

    const result = await submitContact(formData);

    expect(result.success).toBe(true);
    expect(sendEmail).toHaveBeenCalled();
  });
});
```

### Step 4: Fix Type Safety Issues (1h)

```typescript
// lib/cloudinary.ts
import type { UploadApiResponse } from 'cloudinary';

export async function uploadImage(file: File): Promise<UploadApiResponse> {
  const response = await cloudinary.uploader.upload(file);
  return response as UploadApiResponse; // Typed, not any
}
```

```typescript
// components/layout/DropdownMenu.tsx
import type { MouseEvent } from 'react';

function handleClick(e: MouseEvent<HTMLButtonElement>) {
  // Properly typed event
}
```

### Step 5: Add Runtime Validation (1h)

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  REDIS_URL: z.string().url(),
  RESEND_API_KEY: z.string().startsWith('re_'),
  CLOUDINARY_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

```typescript
// next.config.mjs
import './lib/env.js'; // Validates env vars at build time
```

---

## Todo Checklist

- [ ] Add @vitest/coverage-v8
- [ ] Configure coverage thresholds in vitest.config.ts
- [ ] Write tests for Hero component
- [ ] Write tests for WhoWeAre component
- [ ] Write tests for OurFocus component
- [ ] Write tests for OurProducts component
- [ ] Write tests for Header component
- [ ] Write tests for Footer component
- [ ] Write tests for animation wrappers
- [ ] Write tests for Server Actions (contact, careers, report)
- [ ] Fix Cloudinary types in lib/cloudinary.ts
- [ ] Fix event handler types in DropdownMenu.tsx
- [ ] Fix canvas types in LiquidEther.tsx
- [ ] Create lib/env.ts for env validation
- [ ] Setup Codecov in GitHub Actions
- [ ] Add Husky + lint-staged for pre-commit hooks
- [ ] Configure CI quality gates
- [ ] Run coverage: `pnpm test --coverage`
- [ ] Verify coverage ≥80%

---

## Success Criteria (Measurable)

1. **Coverage:** Codecov reports ≥80% line coverage, ≥70% branch coverage
2. **Type Safety:** Zero `any` in lib/, components/, app/ (verified by `grep -r ": any" --include="*.ts" --include="*.tsx" lib/ components/ app/`)
3. **Runtime Validation:** All env vars validated at startup, API inputs validated with Zod
4. **CI Gates:** CI fails if coverage <80% or linting errors
5. **Tests Passing:** `pnpm test --coverage` passes all tests
6. **Quality Score:** SonarQube/CodeScene reports <5% code smells

---

## Risk Assessment

**Low Risk:** Testing improves code quality, unlikely to introduce bugs

- Writing tests may discover existing bugs (good)
- Type safety improvements catch errors at compile time
- Runtime validation prevents runtime crashes

**Medium Risk:**

- **Coverage pressure:** May encourage shallow tests just for coverage
  - **Mitigation:** Focus on meaningful tests (user behavior, edge cases)
- **Env validation:** May fail in CI if env vars not set
  - **Mitigation:** Document required env vars, provide .env.example

---

## Security Considerations

- **Input validation:** Zod schemas prevent injection attacks (SQL, XSS)
- **Env validation:** Catches misconfigured secrets before runtime
- **Type safety:** Prevents type confusion vulnerabilities
- **Test mocks:** Ensure mocks don't leak real credentials

---

## Next Steps

After Phase 3 completion:

1. Review coverage report, identify remaining gaps
2. Document testing patterns for team
3. Setup automated coverage reports on PRs
4. Proceed to Phase 4: Performance Optimization
