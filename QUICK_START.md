# 🚀 Quick Start Guide

Hướng dẫn nhanh cho developers và AI assistants.

## 📁 Tìm file nào?

```
Need...                         Go to...
───────────────────────────────────────────────────────────
Button, Card, Input            → components/ui/
ShimmerButton, animations      → components/animations/
Header, Footer                 → components/layout/
Theme toggle, utilities        → components/common/
Utility functions              → lib/utils.ts
Database queries               → lib/prisma.ts
API endpoints                  → app/api/
CSS animations                 → styles/animations.css
Global styles                  → styles/globals.css
Design tokens                  → lib/constants/
```

## 🎨 Styling Quick Reference

```typescript
// ✅ DO
<button className="px-4 py-2 bg-primary text-primary-foreground rounded-full">

// ❌ DON'T
<button style={{ padding: '8px 16px', backgroundColor: '#F95E1E' }}>

// Class composition
<div className={cn('base', isActive && 'active', className)} />

// Responsive
<div className="px-4 md:px-6 lg:px-8">

// Dark mode
<div className="bg-background text-foreground">
```

## 📦 Import Patterns

```typescript
// Components
import { Button, Card } from '@/components/ui';
import { ShimmerButton, ShinyText } from '@/components/animations';
import { Header } from '@/components/layout';

// Utils
import { cn, formatDate } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

// Always use @/ alias
```

## 🔧 Component Template

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

export interface ComponentProps {
  variant?: 'default' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({
  variant = 'default',
  className,
  children,
}) => {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  );
};
```

## 🎭 Animation Workflow

1. Create component → `components/animations/ComponentName.tsx`
2. Add CSS keyframes → `styles/animations.css`
3. Export → `components/animations/index.ts`
4. Document → `components/animations/README.md`

## 📝 Naming

```
Components    → PascalCase.tsx     (Button.tsx, ShimmerButton.tsx)
Files         → kebab-case.ts      (api-client.ts, design-tokens.ts)
Functions     → camelCase          (formatDate, handleClick)
Constants     → UPPER_SNAKE_CASE   (API_URL, MAX_RETRIES)
CSS Classes   → kebab-case         (.btn-primary, .animate-fade)
```

## 🚫 Common Mistakes

```typescript
// ❌ Default exports (except pages)
export default function Button() {}

// ✅ Named exports
export const Button = () => {}

// ❌ Any types
function handle(data: any) {}

// ✅ Explicit types
function handle(data: UserData) {}

// ❌ Inline styles
<div style={{ color: 'red' }}>

// ✅ Tailwind classes
<div className="text-red-500">

// ❌ Direct imports from file
import { Button } from '@/components/ui/Button';

// ✅ Import from index
import { Button } from '@/components/ui';
```

## 🏃 Common Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Database
pnpm prisma:generate        # Generate Prisma Client
pnpm prisma:push            # Push schema to DB
pnpm prisma:studio          # Open Prisma Studio

# Code quality
pnpm lint                   # Run ESLint
pnpm format                 # Format with Prettier
```

## 🔗 Quick Links

- **Full Guidelines**: `.cursorrules`
- **Animation Guide**: `ANIMATION_GUIDE.md`
- **Project Summary**: `PROJECT_SUMMARY.md`
- **Component Docs**: `components/animations/README.md`

## 💡 Tips for AI Assistants

1. Check `.cursorrules` for detailed guidelines
2. Look at similar existing components before creating new ones
3. Use `cn()` for all className composition
4. Support dark mode by default
5. Add TypeScript types always
6. Export through index.ts files
7. Follow mobile-first responsive design
8. Include accessibility attributes

---

**Need help?** Check `.cursorrules` for comprehensive guidelines.
