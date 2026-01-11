# Next.js 16 Implementation Cookbook

**Quick Reference** | Production-Ready Code Patterns | CIUS Web App

---

## 1. SERVER COMPONENT WITH PRISMA + REDIS CACHE

```typescript
// app/contacts/page.tsx (Server Component)
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { ContactsTable } from './contacts-table';

const CACHE_KEY = 'contacts:all';
const CACHE_TTL = 3600;

async function fetchContacts() {
  // Try cache first
  const cached = await redis.get(CACHE_KEY);
  if (cached) return JSON.parse(cached as string);

  // Fallback to database
  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  // Cache result
  await redis.set(CACHE_KEY, JSON.stringify(contacts), { ex: CACHE_TTL });
  return contacts;
}

export default async function ContactsPage() {
  return (
    <div>
      <h1>Contacts</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <ContactsList />
      </Suspense>
    </div>
  );
}

async function ContactsList() {
  const contacts = await fetchContacts();
  return <ContactsTable data={contacts} />;
}

function LoadingSkeleton() {
  return <div className="space-y-4">Loading...</div>;
}
```

---

## 2. SERVER ACTION WITH FORM VALIDATION + CACHE INVALIDATION

```typescript
// app/contact/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof ContactSchema>;

export async function submitContact(formData: FormData) {
  try {
    // Parse and validate
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    const validated = ContactSchema.parse(data);

    // Create in database
    const contact = await prisma.contact.create({
      data: validated,
    });

    // Invalidate caches
    await redis.del('contacts:all');
    revalidatePath('/contacts');

    // Send email (if needed)
    // await sendEmail({ to: contact.email, subject: '...' });

    return { success: true, id: contact.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to submit contact form' };
  }
}
```

```typescript
// app/contact/page.tsx
import { submitContact } from './actions';

export default function ContactPage() {
  return (
    <form action={submitContact} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
        className="w-full px-4 py-2 border rounded-lg"
      />

      <input
        type="email"
        name="email"
        placeholder="Your email"
        required
        className="w-full px-4 py-2 border rounded-lg"
      />

      <textarea
        name="message"
        placeholder="Your message"
        required
        rows={5}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <button
        type="submit"
        className="px-6 py-2 bg-primary text-white rounded-full"
      >
        Send Message
      </button>
    </form>
  );
}
```

---

## 3. CLIENT COMPONENT WITH STATE + FORM HANDLING

```typescript
// components/filters/product-filter.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FilterSchema = z.object({
  category: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
});

type FilterFormData = z.infer<typeof FilterSchema>;

export function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, watch } = useForm<FilterFormData>({
    defaultValues: {
      category: searchParams.get('category') ?? undefined,
      priceMin: searchParams.get('priceMin')
        ? Number(searchParams.get('priceMin'))
        : undefined,
    },
  });

  const formData = watch();

  const handleFilter = (data: FilterFormData) => {
    const params = new URLSearchParams();

    if (data.category) params.set('category', data.category);
    if (data.priceMin) params.set('priceMin', String(data.priceMin));
    if (data.priceMax) params.set('priceMax', String(data.priceMax));

    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleFilter(formData);
    }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select {...register('category')} className="w-full px-4 py-2 border rounded-lg">
          <option value="">All</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Min Price</label>
          <input
            type="number"
            {...register('priceMin')}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Price</label>
          <input
            type="number"
            {...register('priceMax')}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary text-white rounded-lg"
      >
        Apply Filters
      </button>
    </form>
  );
}
```

---

## 4. ERROR BOUNDARY AT ROUTE SEGMENT

```typescript
// app/(dashboard)/error.tsx
'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-gray-600">{error.message}</p>
      {error.digest && (
        <p className="text-sm text-gray-500">Error ID: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="px-6 py-2 bg-primary text-white rounded-full"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## 5. DYNAMIC IMPORT FOR CODE SPLITTING

```typescript
// components/sections/analytics.tsx
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Heavy chart library - load only on demand
const AnalyticsChart = dynamic(
  () => import('./charts/analytics-chart'),
  {
    loading: () => (
      <div className="h-80 bg-gray-100 animate-pulse rounded-lg" />
    ),
    ssr: false, // Only render on client (if using heavy browser APIs)
  }
);

export function AnalyticsSection() {
  return (
    <div>
      <h2>Analytics</h2>
      <Suspense fallback={<div>Loading chart...</div>}>
        <AnalyticsChart />
      </Suspense>
    </div>
  );
}
```

---

## 6. MIDDLEWARE FOR AUTH PROTECTION

```typescript
// middleware.ts (root level)
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/login' && session?.user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
```

---

## 7. API ROUTE WITH PROPER ERROR HANDLING

```typescript
// app/api/contacts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json();
    const validated = ContactSchema.parse(body);

    // Save to database
    const contact = await prisma.contact.create({
      data: validated,
      select: { id: true, email: true, createdAt: true },
    });

    // Return success
    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Handle database errors
    console.error('Contact creation error:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') ?? '10';
    const offset = request.nextUrl.searchParams.get('offset') ?? '0';

    const contacts = await prisma.contact.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    return NextResponse.json({ data: contacts });
  } catch (error) {
    console.error('Contact fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
```

---

## 8. UTILITY FUNCTION FOR TYPED FETCH

```typescript
// lib/api-client.ts
import { z } from 'zod';

interface FetchOptions extends RequestInit {
  baseURL?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  schema?: z.Schema<T>,
  options: FetchOptions = {}
): Promise<T> {
  const { baseURL = process.env.NEXT_PUBLIC_API_URL ?? '', ...init } = options;

  const url = `${baseURL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  // Validate response with schema if provided
  if (schema) {
    return schema.parse(data);
  }

  return data as T;
}

// Usage:
const ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const contact = await apiFetch('/api/contacts/1', ResponseSchema);
```

---

## 9. TYPE-SAFE ENVIRONMENT VARIABLES

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

// Usage anywhere:
import { env } from '@/lib/env';
console.log(env.DATABASE_URL); // Fully typed + validated
```

---

## 10. COMPONENT TEST TEMPLATE

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('respects disabled state', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="outline">Click</Button>);
    expect(container.querySelector('button')).toHaveClass('border');
  });
});
```

---

## Quick Decision Matrix

```
When to use what?

Data fetching?
  → Use Server Component (direct Prisma)
  → Use Server Action (form submissions)
  → Use API route (external integrations)

User interaction?
  → Use Client Component ('use client')
  → Use useState/useContext (simple state)
  → Use Zustand (complex state)

Performance critical?
  → Use dynamic() for heavy components
  → Use Image from next/image
  → Use Suspense for streaming

Type safety?
  → Use Zod for runtime validation
  → Use TypeScript interfaces for props
  → Use as const for literal types

Caching?
  → Use Redis for frequently accessed data
  → Use next/cache for ISR-like behavior
  → Use browser cache for static assets
```

---

**Version**: 1.0 | **Last Updated**: 2026-01-10
