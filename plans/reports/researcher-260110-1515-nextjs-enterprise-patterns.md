# TypeScript/Next.js Enterprise Scalability & Maintainability Patterns

## Research Report | 2026-01-10

---

## Executive Summary

CIUS Web App has solid foundation (Prisma pooling, strict TypeScript, Zod validation, CVA components, error boundaries). Key gaps exist in production patterns: missing error standardization, sparse logging infrastructure, weak auth implementation, and limited API contract documentation. This report outlines **8 critical patterns** to scale maintainably.

---

## 1. CODE ORGANIZATION & MODULE BOUNDARIES

**Current State:** Good separation (components/, lib/, app/api/). Module files average 100-150 lines.

**Enterprise Pattern:**

```
lib/
├── services/          # Business logic isolation
│   ├── contact.service.ts
│   ├── auth.service.ts
│   └── index.ts       # Barrel export
├── repositories/      # Data access layer
│   ├── contact.repo.ts
│   └── index.ts
├── errors/           # Custom error types
├── validators/       # Zod schemas
└── utils/            # Utilities
```

**Why:** Separates concerns, enables testing, reduces coupling. Service layer = business logic, Repository = data access.

**CIUS Gaps:**

- Auth logic mixed with config in `/lib/auth.ts` (duplicate with `next-auth`)
- No service/repository abstraction—API routes directly touch Prisma
- Email sending coupled to route handlers

**Fix:** Extract `ContactService`, `AuthService` → enables mocking, reuse, monitoring.

---

## 2. ERROR HANDLING & STANDARDIZATION

**Current State:** Basic try-catch, Zod errors recognized, but inconsistent responses.

**Enterprise Pattern:**

```typescript
// lib/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors: any[]) {
    super('VALIDATION_ERROR', message, 400, { errors });
  }
}

// API route handler
try {
  // ...
} catch (error) {
  if (error instanceof ZodError) {
    throw new ValidationError('Invalid input', error.issues);
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw new DatabaseError(...);
  }
  throw new AppError('INTERNAL_ERROR', 'Server error', 500);
}
```

**Response Standardization:**

```typescript
// Consistent API response
{
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    context?: Record<string, any>;
  };
  timestamp: string;
  traceId: string; // For debugging
}
```

**Benefits:** Client-side error handling, logging correlation, debugging.

---

## 3. LOGGING & OBSERVABILITY

**Current:** `console.error()` scattered, no structure.

**Enterprise Pattern:**

```typescript
// lib/logger.ts
interface LogContext {
  userId?: string;
  traceId: string;
  endpoint?: string;
  duration?: number;
}

export const logger = {
  info: (msg: string, context: LogContext) => {
    console.log(JSON.stringify({ level: 'INFO', msg, ...context }));
  },
  error: (msg: string, error: Error, context: LogContext) => {
    console.error(
      JSON.stringify({
        level: 'ERROR',
        msg,
        error: error.message,
        ...context,
      })
    );
  },
};

// API route
const traceId = crypto.randomUUID();
try {
  logger.info('Contact form received', { traceId });
  const start = Date.now();
  // ... logic
  logger.info('Contact saved', {
    traceId,
    duration: Date.now() - start,
  });
} catch (error) {
  logger.error('Contact form failed', error, { traceId });
}
```

**Why:** Correlate requests across microservices, parse logs easily (JSON), measure performance.

---

## 4. SECURITY: OWASP Top 10 PREVENTION

**CIUS Gaps:**

| OWASP Risk           | Current                                     | Fix                                         |
| -------------------- | ------------------------------------------- | ------------------------------------------- |
| **A01: Broken Auth** | Hardcoded creds (admin@cius.com/admin123)   | Use bcrypt, verify DB users, rotate secrets |
| **A03: Injection**   | Prisma prevents SQL, Zod validates input    | Add rate limiting, sanitize file uploads    |
| **A04: SSRF**        | Cloudinary config not validated             | Validate URLs, whitelist endpoints          |
| **A05: XSS**         | React auto-escapes, but stored XSS possible | Sanitize user input before DB storage       |
| **A07: CORS**        | No CORS config visible                      | Add origin whitelist for API endpoints      |

**Minimum Fixes:**

```typescript
// 1. Rate limiting (Upstash Redis available)
import { Ratelimit } from '@upstash/ratelimit';
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 reqs/hour
});

// 2. Input sanitization
const sanitize = (input: string) => input.trim().slice(0, 1000);

// 3. CORS
export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!['https://cius.com'].includes(origin!)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

// 4. Replace hardcoded auth
const user = await prisma.user.findUnique({
  where: { email: credentials.email },
});
const valid = await bcrypt.compare(credentials.password, user.passwordHash);
```

---

## 5. API DESIGN & VERSIONING

**Current:** Basic POST endpoints, mixed response formats.

**Enterprise Pattern:**

```typescript
// app/api/v1/contacts/route.ts
export async function POST(request: NextRequest) {
  const { data, error } = await validateRequest(request, contactSchema);
  if (error) {
    return errorResponse(400, 'VALIDATION_ERROR', error.issues);
  }

  const result = await contactService.create(data);
  return jsonResponse(201, result, 'Contact created');
}

// Middleware for versioning
export const runtime = 'nodejs';
export const apiVersion = 'v1';
```

**Response Envelope:**

```typescript
// util/response.ts
export function jsonResponse<T>(status: number, data: T, message?: string) {
  return NextResponse.json(
    {
      success: status < 400,
      data,
      message,
      version: '1.0.0',
    },
    { status }
  );
}
```

**Benefits:** Gradual migration (v1/v2), clear contract, frontend decoupling.

---

## 6. DATABASE PATTERNS

**Current Strength:** Prisma pool + PrismaPg adapter (production-ready).

**Add These Patterns:**

```typescript
// 1. Soft deletes for auditing
model Contact {
  id String @id @default(cuid())
  name String
  email String
  createdAt DateTime @default(now())
  deletedAt DateTime? // NULL = not deleted
  @@index([deletedAt])
}

// 2. Optimistic locking
model Contact {
  version Int @default(1)
  @@version
}

// 3. Connection pool monitoring
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected pool error', err, { component: 'db' });
});
```

---

## 7. TESTING STRATEGY

**Current:** Unit tests exist (Button, Card, Badge). API routes have tests.

**Enterprise Patterns:**

```typescript
// test/integration/contact-form.test.ts
describe('Contact Form API', () => {
  it('should reject invalid email', async () => {
    const res = await POST(mockRequest({ email: 'invalid' }));
    expect(res.status).toBe(400);
    expect(res.json()).toHaveProperty('error.code', 'VALIDATION_ERROR');
  });

  it('should rate limit after 10 requests', async () => {
    for (let i = 0; i < 11; i++) {
      const res = await POST(mockRequest());
      if (i === 10) expect(res.status).toBe(429);
    }
  });
});

// lib/test-utils/mocks.ts → expand this
export const mockPrisma = {
  contact: { create: vi.fn(), findUnique: vi.fn() },
};
```

**Coverage Target:** 80% for critical paths (auth, API, database).

---

## 8. MONOREPO VS. SINGLE REPO

**Current:** Single repo with clear folder structure.

**Decision Tree:**

| Scenario                    | Pattern                         |
| --------------------------- | ------------------------------- |
| **Single team, 1-2 apps**   | Single repo (current state ✓)   |
| **Multiple teams, >3 apps** | Monorepo (pnpm workspaces)      |
| **Public + Private APIs**   | Monorepo with API isolation     |
| **Separate scaling needs**  | Multi-repo (complex deployment) |

**CIUS Recommendation:** Stay single-repo unless:

- Adding admin dashboard, mobile app, or microservices
- Team size > 5 people
- Shared component library needed across orgs

**If moving to monorepo:**

```json
{
  "workspaces": ["apps/web", "apps/api", "packages/ui", "packages/validators"]
}
```

---

## 9. TECHNICAL DEBT PREVENTION

**Early Symptoms:**

- ✗ API routes > 100 lines
- ✗ Shared component variants > 5 sizes
- ✗ Utility files > 200 lines
- ✗ Missing error types
- ✗ Hardcoded env values

**Prevention Checklist:**

- [ ] Code review enforces file size limits
- [ ] Add ESLint rule: `max-lines: [warn, 150]`
- [ ] Weekly debt backlog review
- [ ] Unit test new APIs before using
- [ ] Document why (not just what) in comments

---

## 10. CI/CD & DEPLOYMENT

**Current:** Build script (`pnpm build`) exists.

**Enterprise Pipeline:**

```yaml
# .github/workflows/ci.yml
- Test: pnpm test:coverage (80% target)
- Lint: pnpm lint
- Type: pnpm type-check
- Build: pnpm build (fail if warnings)
- Security: audit dependencies, scan secrets
- Deploy to staging if all pass
```

**Environment Management:**

```
.env.local          # Development (git-ignored)
.env.staging        # Staging secrets (GitHub Secrets)
.env.production     # Production secrets (locked down)
```

---

## CIUS Web App: PRIORITY IMPROVEMENTS (Next 4 Weeks)

| Priority | Task                                          | Impact               | Effort |
| -------- | --------------------------------------------- | -------------------- | ------ |
| **P0**   | Replace hardcoded auth with DB check + bcrypt | Security             | 4h     |
| **P0**   | Add error standardization + logging           | Debugging            | 6h     |
| **P1**   | Implement rate limiting on API routes         | DoS prevention       | 3h     |
| **P1**   | Extract ContactService from route handler     | Testability          | 4h     |
| **P2**   | Add response envelope to all APIs             | Frontend consistency | 5h     |
| **P2**   | Document API contracts (OpenAPI/Swagger)      | Developer DX         | 6h     |
| **P3**   | Add integration test for auth flow            | Coverage             | 4h     |
| **P3**   | Migrate logs to structured JSON format        | Observability        | 3h     |

---

## Key Takeaways

1. **Services > Routes:** Extract business logic into services for reuse, testability, monitoring
2. **Errors = Data:** Standardize error responses; every error tells a story
3. **Logging = Debugging:** Structured logs with trace IDs solve 80% of production issues
4. **Security ≠ Afterthought:** Implement OWASP patterns now, not after breach
5. **API Contracts:** Document endpoints; they're contracts between frontend & backend
6. **Stay Single Repo:** Until team or app complexity demands monorepo trade-offs

---

## Unresolved Questions

1. **Authentication provider choice:** Migrate to OAuth (GitHub, Google) or build custom session management?
2. **Caching strategy:** Should responses cache at edge (Cloudflare Workers) or app-level?
3. **Monitoring service:** Use Sentry (errors), Datadog (logs), or open-source (Grafana + Loki)?
4. **Prisma scaling:** At what transaction volume should we consider read replicas?

---

**Report Generated:** 2026-01-10 15:15 UTC
**Tech Stack:** Next.js 16.1.1, TypeScript 5.9, Prisma 7.2.0, PostgreSQL, TailwindCSS v4
**Audience:** CIUS Development Team
