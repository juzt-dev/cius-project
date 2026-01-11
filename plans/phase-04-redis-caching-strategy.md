# Phase 4: Redis Caching Strategy

**Status:** ✅ N/A - No Read Queries to Cache
**Date:** 2026-01-11
**Decision:** Defer caching until read operations are introduced

---

## Analysis

### Current Database Operations

All Prisma queries in the codebase are **write operations** (CREATE):

| Operation                      | File                        | Purpose                   |
| ------------------------------ | --------------------------- | ------------------------- |
| `prisma.contact.create`        | `lib/actions/contact.ts:67` | Submit contact form       |
| `prisma.career.create`         | `lib/actions/careers.ts:69` | Submit career application |
| `prisma.reportDownload.create` | `lib/actions/report.ts:61`  | Log report download       |

**No read operations found:**

- ❌ No `prisma.*.findMany` (list queries)
- ❌ No `prisma.*.findUnique` (detail queries)
- ❌ No `prisma.*.findFirst` (search queries)
- ❌ No `prisma.*.aggregate` (analytics queries)

### Why Caching Is Not Applicable

**Write-Only Operations:**

- Contact form submissions create unique records each time
- Career applications are one-time writes
- Report downloads are logged (not queried)

**No Read-Heavy Scenarios:**

- No public listing of contacts/careers
- No dashboard showing statistics
- No user-facing data retrieval
- No repeated queries to cache

**Current Optimization:**

- ✅ Rate limiting prevents abuse (Upstash Redis)
- ✅ Database indexed on primary keys
- ✅ Efficient writes via Prisma
- ✅ Connection pooling (pg adapter)

---

## Redis Infrastructure Already in Place

### Existing Redis Setup (`lib/redis.ts`)

```typescript
export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    /* ... */
  },
  set: async <T>(key: string, value: T, expirationInSeconds?: number): Promise<void> => {
    /* ... */
  },
  del: async (key: string): Promise<void> => {
    /* ... */
  },
  invalidatePattern: async (pattern: string): Promise<void> => {
    /* ... */
  },
};
```

**Ready for future use:**

- ✅ Cache helpers implemented
- ✅ Error handling in place
- ✅ Graceful degradation (works without Redis)
- ✅ Logging integrated (Pino)

---

## When to Implement Caching

### Future Use Cases

Implement Redis caching when these features are added:

**1. Admin Dashboard**

```typescript
// Example: Cache recent submissions
async function getRecentContacts() {
  const cacheKey = 'admin:contacts:recent';
  const cached = await cache.get<Contact[]>(cacheKey);
  if (cached) return cached;

  const contacts = await prisma.contact.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  await cache.set(cacheKey, contacts, 300); // 5 min TTL
  return contacts;
}
```

**2. Public Blog/News**

```typescript
// Example: Cache blog posts
async function getBlogPosts() {
  const cacheKey = 'blog:posts:all';
  const cached = await cache.get<Post[]>(cacheKey);
  if (cached) return cached;

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  await cache.set(cacheKey, posts, 600); // 10 min TTL
  return posts;
}
```

**3. Analytics/Statistics**

```typescript
// Example: Cache aggregated data
async function getContactStats() {
  const cacheKey = 'stats:contacts:count';
  const cached = await cache.get<number>(cacheKey);
  if (cached !== null) return cached;

  const count = await prisma.contact.count();
  await cache.set(cacheKey, count, 3600); // 1 hour TTL
  return count;
}
```

---

## Caching Best Practices (For Future Implementation)

### 1. Cache Key Naming Convention

```typescript
// Pattern: entity:operation:identifier:variant
'contact:list:recent';
'contact:detail:abc123';
'blog:post:slug-example';
'stats:contacts:count:daily';
```

### 2. TTL Strategy

| Data Type              | TTL            | Reason                         |
| ---------------------- | -------------- | ------------------------------ |
| **Frequently Updated** | 1-5 min        | Recent submissions, live stats |
| **Moderate Updates**   | 10-30 min      | Blog posts, product listings   |
| **Rarely Changes**     | 1-24 hours     | Static pages, configuration    |
| **Session Data**       | 30 min - 1 day | User sessions, shopping carts  |

### 3. Cache Invalidation

```typescript
// Invalidate on write operations
async function createContact(data: ContactData) {
  const contact = await prisma.contact.create({ data });

  // Invalidate related caches
  await cache.invalidatePattern('contact:list:*');
  await cache.del('stats:contacts:count:daily');

  return contact;
}
```

### 4. Stale-While-Revalidate Pattern

```typescript
async function getWithSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number,
  staleTime: number
) {
  const data = await cache.get<{ value: T; timestamp: number }>(key);
  const now = Date.now();

  // Return stale data while revalidating in background
  if (data && now - data.timestamp < staleTime) {
    // Async revalidation
    fetcher().then((fresh) => cache.set(key, { value: fresh, timestamp: now }, ttl));
    return data.value;
  }

  // Fetch fresh data
  const fresh = await fetcher();
  await cache.set(key, { value: fresh, timestamp: now }, ttl);
  return fresh;
}
```

---

## Current Performance

### Without Query Caching

**Database Performance:**

- ✅ Prisma connection pooling (pg adapter)
- ✅ Indexed primary keys (fast writes)
- ✅ PostgreSQL optimized for writes
- ✅ No N+1 query issues (no reads)

**Server Performance:**

- ✅ Server Actions (edge-optimized)
- ✅ Rate limiting via Redis
- ✅ Input validation with Zod
- ✅ Structured logging (Pino)

**Current Bottlenecks:**

- None identified (write-only app)

---

## Decision Rationale

**Why Skip Implementation Now:**

1. **No Read Queries:** All operations are writes; nothing to cache
2. **Premature Optimization:** Caching without reads adds complexity without benefit
3. **Infrastructure Ready:** Redis helpers in place for future use
4. **YAGNI Principle:** "You Aren't Gonna Need It" until read queries exist

**When to Revisit:**

- Admin dashboard with contact/career listings
- Public blog or news section
- User-facing data displays
- Analytics dashboards

---

## Recommendation

**Document caching strategy ✅** (this file)
**Defer implementation** until read queries are introduced
**Monitor database performance** via Prisma logging
**Add caching when needed** using existing `cache` helpers

---

## Summary

Current application is write-only (contact forms, applications, download logs). No database read operations to cache. Redis infrastructure ready for future use when read queries are added (admin dashboards, blog listings, analytics). Caching implementation deferred to avoid premature optimization.
