---
title: 'CIUS Web App Source Code Refactoring'
description: 'Comprehensive refactoring to modernize Next.js 16, React 19, TypeScript 5.9 patterns and improve code quality'
status: pending
priority: P1
effort: 42h
branch: main
tags: [refactoring, next.js-16, react-19, typescript-5.9, performance, code-quality]
created: 2026-01-10
---

# CIUS Web App Source Code Refactoring Plan

## Executive Summary

This plan refactors CIUS Web App to leverage Next.js 16, React 19, TypeScript 5.9 modern patterns while addressing technical debt identified through codebase analysis. Current state: modern stack (Next.js 16.1.1, React 19.2, TS 5.9) but underutilizing new features—no "use cache" directive, minimal Server Actions, console logging instead of structured logs, ~30-40% test coverage, and no bundle monitoring.

Refactoring prioritizes P0 critical fixes (restore deleted files, implement caching, add rate limiting), then P1 high-impact improvements (structured logging, bundle analysis, Server Actions adoption, error standardization). Approach follows YAGNI/KISS/DRY principles with incremental rollout to minimize risk.

Expected outcomes: 50%+ bundle size reduction via code splitting, 80%+ test coverage, improved Core Web Vitals through PPR/caching, enhanced DX via React 19 hooks (useTransition, useOptimistic), and enterprise-grade quality through automated tooling (SonarQube, bundle analyzer, strict linting).

## Current State Assessment

### Strengths

- Modern stack: Next.js 16.1.1, React 19.2, TypeScript 5.9, Prisma 7
- Proper Server/Client Component boundaries (25 client vs ~50 server components)
- TypeScript strict mode enabled
- Security headers configured (X-Frame-Options, CSP, etc.)
- Test foundation established (Vitest, Testing Library)
- 75 components organized (animations/, sections/, ui/, layout/)

### Critical Issues

- **Deleted files in git status:** app/layout.tsx, components/layout/Header.tsx, 76 font files
- **No "use cache" directive:** Breaking change in Next.js 16—explicit caching required
- **Low test coverage:** ~30-40% (only API routes, UI components, lib utilities tested)
- **Console logging:** 19 files using console.log/error instead of structured logs
- **No bundle monitoring:** @next/bundle-analyzer installed but not configured
- **Missing Next.js 16 features:** No PPR, minimal Server Actions (2 files only)
- **Security gaps:** No rate limiting on API routes, no error standardization

### Architecture Patterns

- Mix of layer-based (lib/, ui/) and feature-based (sections/) organization
- REST API routes (no tRPC/GraphQL)
- NextAuth.js with database (credentials provider only)
- React Hook Form + Zod for forms
- Framer Motion for animations (extensive usage)
- Zustand for state (installed but limited usage visible)

## Refactoring Goals

1. **Adopt Next.js 16 patterns:** Implement "use cache" directive, enable PPR, increase Server Actions usage
2. **Leverage React 19 hooks:** useTransition/useOptimistic for better form UX
3. **Improve code quality:** Structured logging, error standardization, 80%+ test coverage
4. **Optimize performance:** Bundle analysis, code splitting, reduce bundle 50%+, improve Core Web Vitals
5. **Enhance type safety:** Replace `any` types, add runtime validation with Zod
6. **Enterprise tooling:** Setup SonarQube/CodeScene, Codecov, pre-commit hooks, CI quality gates

## Success Criteria

- [ ] Zero console.log statements in production code
- [ ] Test coverage ≥80% (measured by Codecov)
- [ ] Bundle size reduced by ≥50% for client components
- [ ] Lighthouse score ≥90 (Performance, Accessibility, Best Practices, SEO)
- [ ] All P0/P1 issues resolved
- [ ] All API routes have rate limiting
- [ ] TypeScript strict mode with zero `any` in src code (test mocks acceptable)
- [ ] Automated CI quality gates passing (ESLint, tests, bundle size)

## Phase Breakdown

### [Phase 1: Foundation & Quick Wins](./phase-01-foundation-quick-wins.md)

**Priority:** P0 | **Effort:** 8h | **Status:** ✅ Complete (2026-01-11)
**Review:** Approved 9.6/10 | 0 critical | [Report](../reports/code-reviewer-260111-1322-phase01-foundation.md)

- ✅ Restore deleted files (76 fonts committed as deletions)
- ✅ Setup structured logging (Pino, lib/logger.ts, 4 modules migrated)
- ✅ Configure bundle analyzer (next.config.mjs, analyze script)
- ✅ Add rate limiting middleware (3 API routes protected, @upstash/ratelimit)
- ✅ Clean git working directory (all deletions committed)

### [Phase 2: Next.js 16 Modernization](./phase-02-nextjs-modernization.md)

**Priority:** P1 | **Effort:** 10h | **Status:** Pending

- Implement "use cache" directive for expensive operations
- Enable Partial Prerendering (PPR)
- Migrate API routes to Server Actions
- Add Suspense boundaries for streaming
- Optimize data fetching patterns

### [Phase 3: Code Quality & Testing](./phase-03-quality-testing.md)

**Priority:** P1 | **Effort:** 8h | **Status:** Pending

- Increase test coverage to 80%+ (sections, layout, animations)
- Replace `any` types with proper definitions
- Add Zod runtime validation to API routes
- Setup SonarQube/CodeScene for debt tracking
- Configure Codecov for coverage monitoring

### [Phase 4: Performance Optimization](./phase-04-performance.md)

**Priority:** P1 | **Effort:** 6h | **Status:** Pending

- Analyze bundle with @next/bundle-analyzer
- Implement code splitting for heavy components (LiquidEther, Particles)
- Optimize images (sizes prop, priority for LCP)
- Add caching strategy (Redis for expensive computations)
- Reduce Framer Motion usage where possible

### [Phase 5: Architecture Improvements](./phase-05-architecture.md)

**Priority:** P2 | **Effort:** 6h | **Status:** Pending

- Standardize error handling across app
- Split large components (Hero, utils.ts)
- Add error boundaries for critical sections
- Implement feature-based organization for new features
- Extract barrel exports for public APIs

### [Phase 6: React 19 & Advanced Patterns](./phase-06-react19-patterns.md)

**Priority:** P2 | **Effort:** 4h | **Status:** Pending

- Implement useTransition for form submissions
- Add useOptimistic for instant UI feedback
- Optimize Server/Client boundaries (split Hero, Header)
- Document component props with JSDoc
- Add prop validation for reusable components

## Risk Assessment

### High Risk

- **"use cache" migration:** Breaking change—may affect existing data fetching behavior
  - Mitigation: Test thoroughly in staging, feature flag rollout
- **PPR enablement:** Experimental feature—may have edge cases
  - Mitigation: Enable per-route with `export const experimental_ppr = true`
- **Bundle size changes:** Code splitting may break assumptions
  - Mitigation: Monitor with CI, gradual rollout

### Medium Risk

- **Server Actions migration:** Different error handling than API routes
  - Mitigation: Keep API routes as backup, migrate incrementally
- **Test coverage increase:** May discover existing bugs
  - Mitigation: Good—fix bugs proactively
- **Logging changes:** May miss critical logs during transition
  - Mitigation: Parallel logging during migration phase

### Low Risk

- **Type safety improvements:** TypeScript catches issues at compile time
- **Component splitting:** Isolated changes, easy rollback
- **Tooling setup:** Non-invasive (SonarQube, Codecov)

## Timeline Estimate

**Total effort:** 42 hours (~6 weeks at 1 dev, 3 weeks at 2 devs)

- **Week 1-2:** Phase 1 (Foundation) + Phase 2 (Next.js 16) - 18h
- **Week 3-4:** Phase 3 (Testing) + Phase 4 (Performance) - 14h
- **Week 5-6:** Phase 5 (Architecture) + Phase 6 (React 19) - 10h

**Milestones:**

- End of Week 2: All P0 issues resolved, bundle monitoring active
- End of Week 4: 60%+ test coverage, bundle size reduced 30%+
- End of Week 6: 80%+ coverage, all phases complete, quality gates passing

## Dependencies

- **External:** None (all dependencies already installed)
- **Internal:** Phases should execute sequentially (1→2→3→4→5→6)
- **Blocker:** Phase 1 must complete before others (restores deleted files)

## Related Documents

- [Research: Modern Patterns](./research/researcher-01-modern-patterns.md)
- [Research: Quality Tools](./research/researcher-02-quality-tools.md)
- [Scout: Codebase Analysis](./scout/scout-01-codebase-analysis.md)
- [Project Overview](/Users/Chuo/CODE/Code Learn/docs/project-overview-pdr.md)
- [Code Standards](/Users/Chuo/CODE/Code Learn/docs/code-standards.md)
- [Development Rules](/Users/Chuo/CODE/Code Learn/.claude/workflows/development-rules.md)

## Next Steps

1. Review and approve this plan
2. Create feature branch: `refactor/phase-01-foundation`
3. Execute Phase 1 (8h effort)
4. After Phase 1 validation, proceed to Phase 2
5. Weekly progress review against success criteria
