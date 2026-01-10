# Database Authentication Setup

This document explains the database-backed authentication system implemented to replace hardcoded credentials (P0 security fix).

## Overview

- **Authentication**: NextAuth.js with Credentials provider
- **Password Hashing**: bcryptjs with salt rounds = 12
- **Database**: PostgreSQL via Prisma ORM
- **Session**: JWT-based, 30-day expiry

## Database Schema

### User Model

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         String   @default("user")
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([email])
  @@index([role])
}
```

## Setup Instructions

### 1. Run Database Migration

When your PostgreSQL database is available, apply the migration:

```bash
NODE_OPTIONS='--experimental-require-module' pnpm prisma migrate deploy
```

Or for development with migration name:

```bash
NODE_OPTIONS='--experimental-require-module' pnpm prisma migrate dev
```

### 2. Seed Initial Admin User

Create the first admin user with:

```bash
pnpm prisma db seed
```

**Default credentials** (change immediately):

- Email: `admin@ciuslabs.com` (or set `ADMIN_EMAIL` env var)
- Password: `ChangeMe123!` (or set `ADMIN_PASSWORD` env var)
- Name: `Admin User` (or set `ADMIN_NAME` env var)

The seed script is idempotent - it will skip if the admin user already exists.

### 3. Environment Variables

Ensure these are set in `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"  # Update for production
```

## Authentication Flow

1. User submits credentials via sign-in form
2. NextAuth.js `authorize()` function:
   - Validates email and password exist
   - Looks up user in database by email
   - Checks if user account is active
   - Verifies password with bcrypt
   - Returns user object (without password hash)
3. JWT token generated with user ID and role
4. Session created with 30-day expiry

## Security Features

✅ Passwords hashed with bcryptjs (12 rounds)
✅ Active/inactive user accounts
✅ Role-based access control (RBAC) ready
✅ Password never exposed in session/JWT
✅ Database indexes on email and role for performance
✅ Comprehensive error logging

## Adding New Users

### Via Seed Script

Modify `prisma/seed.ts` to add more users.

### Via Code

```typescript
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const passwordHash = await bcrypt.hash('user-password', 12);

await prisma.user.create({
  data: {
    email: 'user@example.com',
    passwordHash,
    name: 'User Name',
    role: 'user',
    isActive: true,
  },
});
```

## Files Modified

- ✅ `prisma/schema.prisma` - Added User model
- ✅ `prisma/migrations/20260110_add_user_model/migration.sql` - Database migration
- ✅ `lib/auth.ts` - Database authentication logic
- ✅ `prisma/seed.ts` - Admin user seed script
- ✅ `package.json` - Added tsx, prisma seed config, fixed build script

## Testing

Build verification passed:

```bash
pnpm build  # ✓ Compiled successfully
pnpm type-check  # ✓ No TypeScript errors
```

## Next Steps

When database is available:

1. Apply migration: `pnpm prisma migrate deploy`
2. Seed admin user: `pnpm prisma db seed`
3. Test sign-in at `/auth/signin` with admin credentials
4. Change default admin password immediately
5. Create additional users as needed

## Troubleshooting

**Q: Migration fails with "database not running"**
A: Start PostgreSQL and ensure `DATABASE_URL` is correct in `.env`

**Q: Prisma generate fails with ERR_REQUIRE_ESM**
A: Use `NODE_OPTIONS='--experimental-require-module' prisma generate` (already in build script)

**Q: Seed script fails**
A: Ensure database is running and migration has been applied first

## Related Documentation

- [System Architecture](./system-architecture.md)
- [Deployment Guide](./deployment-guide.md)
- NextAuth.js: https://next-auth.js.org/
- Prisma ORM: https://www.prisma.io/docs
