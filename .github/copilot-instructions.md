# GitHub Copilot Instructions

You are assisting with the CIUS Web Application, a Next.js 16 project with TypeScript, TailwindCSS, and Prisma.

## Architecture Overview

**Data Flow**: Client → API Route → Zod Validation → Prisma/Redis → Email Service  
**Key Pattern**: Graceful degradation - external services (Redis, Resend) optional at build time

### Service Boundaries

- **`lib/prisma.ts`**: Database access (singleton pattern with dev logging)
- **`lib/redis.ts`**: Caching layer (optional, null-safe helpers)
- **`lib/email.ts`**: Email service (optional, logs in dev mode)
- **`app/api/*/route.ts`**: API endpoints (validate → persist → notify)

### Component Architecture

```
components/
├── animations/     # Complex effects with CSS keyframes (ShimmerButton, ShinyText)
├── ui/             # CVA-based primitives (Button, Card, Input)
├── layout/         # Theme-aware structural (Header with logo switching)
└── common/         # Cross-cutting (theme-toggle)
```

**Critical**: Import from `index.ts` files (`@/components/animations` not `@/components/animations/ShimmerButton`)

## Development Workflows

### Database Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Push to dev DB (no migrations in dev)
pnpm prisma:push
# 3. Open Studio to verify
pnpm prisma:studio
```

### Animation System

1. Create component in `components/animations/`
2. Add keyframes to `styles/animations.css` (NOT in component)
3. Export through `components/animations/index.ts`
4. Document in `components/animations/README.md`

**Why separate CSS?** Animations shared across components, avoids duplication, better caching.

### API Endpoint Pattern

```typescript
// app/api/contact/route.ts - ACTUAL pattern from codebase
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body); // Throws on validation error

    const record = await prisma.contact.create({ data });

    await sendEmail({
      to: data.email,
      subject: 'Confirmation',
      html: emailTemplates.contactConfirmation(data.name),
    });

    return NextResponse.json({ success: true, id: record.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    console.error('API error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
```

**Pattern**: Zod validation → Prisma create → Email send → JSON response with status codes

## Project-Specific Conventions

### Service Initialization (Graceful Degradation)

```typescript
// lib/redis.ts - ACTUAL pattern
export const redis = process.env.UPSTASH_REDIS_REST_URL ? new Redis({...}) : null;
export const cache = {
  get: async <T>(key: string) => {
    if (!redis) { console.log('Redis not configured'); return null; }
    // ... actual logic
  }
};
```

**Why?** Build succeeds without Redis/Resend in CI/CD, enables local dev without full stack.

### Theme System

- Logo switches based on `resolvedTheme` (see `components/layout/Header.tsx`)
- Use CSS variables: `bg-background text-foreground` (NOT `bg-white dark:bg-black`)
- Primary color: `hsl(var(--primary))` = Orange #F95E1E

### Class Composition (MANDATORY)

```typescript
import { cn } from '@/lib/utils'; // clsx wrapper
<div className={cn('base-class', isActive && 'active', className)} />
```

**Never**: `className={'base ' + (isActive ? 'active' : '')}` or template literals

### Button Styling

- All buttons: `rounded-full` (pill shape, NOT `rounded-md` or `rounded-lg`)
- Cards/Inputs: `rounded-lg`
- Use CVA for variants (see `components/ui/Button.tsx`)

## Integration Points

### Prisma Models (3 models in production)

```prisma
// prisma/schema.prisma
model Contact { id, name, email, message, createdAt }
model Career { id, name, email, position, message?, createdAt }
model ReportDownload { id, email, downloadedAt }
```

**All use**: `@id @default(cuid())` + indexes on `[createdAt]` and `[email]`

### External Services

- **Redis**: Optional cache (use `cache.get/set/del` helpers, not raw `redis.*`)
- **Resend**: Email via `sendEmail()` (auto-logs in dev if unconfigured)
- **Cloudinary**: Image uploads (setup in `lib/cloudinary.ts`)

### Environment Variables (Critical for Build)

```env
# Required for build
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional (gracefully degrade)
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
RESEND_API_KEY
CLOUDINARY_CLOUD_NAME
```

**Key Insight**: `pnpm build` runs `prisma generate`, so DB must be accessible at build time.

## Commands That Matter

```bash
pnpm dev                    # Dev server (uses Turbopack in Next.js 16)
pnpm build                  # Runs `prisma generate` THEN builds
pnpm prisma:push            # Push schema (no migrations in dev)
pnpm prisma:studio          # GUI database browser
pnpm format                 # Prettier (includes .cursorrules)
```

**Build Order**: `prisma generate` → TypeScript types available → Next.js build

## Critical Rules

1. **Named exports only** (except `page.tsx`, `layout.tsx`, `route.ts`)
2. **Import from index**: `@/components/ui` not `@/components/ui/Button`
3. **Strict TypeScript**: No `any`, explicit prop types
4. **cn() for classes**: Composition over concatenation
5. **Zod validation**: All API routes validate with `.parse()` (throws on error)
6. **Error handling**: Catch Zod errors separately from general errors
7. **CSS keyframes**: In `styles/animations.css`, NOT component files
8. **Transform-gpu**: Add to animated elements for performance

## Examples from Codebase

**ShimmerButton** (see `components/animations/ShimmerButton.tsx`):

- Uses CSS custom properties (`--shimmer-color`, `--speed`)
- Keyframes in `styles/animations.css` (`shimmer-slide`, `spin-around`)
- Exported through `components/animations/index.ts`

**Header** (see `components/layout/Header.tsx`):

- Theme-aware logo: `resolvedTheme === 'dark' ? '/Logo-dark mode.svg' : '/Logo-Light mode.svg'`
- Mobile menu with `isMenuOpen` state
- ShimmerButton for CTA with ShinyText inside

**API Routes** (see `app/api/contact/route.ts`):

- Zod schema → parse → Prisma create → email → response
- Status codes: 201 (created), 400 (validation), 500 (server error)
- Return shape: `{ success: boolean, id?: string, errors?: ZodError[], message?: string }`

---

For comprehensive details, see `.cursorrules`. For quick lookup, see `QUICK_START.md`.
