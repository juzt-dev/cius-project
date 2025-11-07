# CIUS Web Application

A professional enterprise web application built with Next.js 16, TypeScript, TailwindCSS, Prisma, and PostgreSQL.

## 🚀 Features

- ⚡ Next.js 16 with App Router & Turbopack
- 🎨 TailwindCSS + Custom Design System
- 🔐 NextAuth.js authentication
- 💾 PostgreSQL + Prisma ORM
- 🌓 Dark/Light mode with next-themes
- ✨ Advanced animations (ShimmerButton, ShinyText)
- 📱 Fully responsive design
- ♿ Accessibility-first approach
- 🚀 Redis caching (Upstash)
- 📧 Email integration (Resend)
- 🖼️ Cloudinary image optimization

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Fast reference for common tasks
- **[.cursorrules](.cursorrules)** - Comprehensive development guidelines
- **[Animation Guide](ANIMATION_GUIDE.md)** - Animation system documentation
- **[Copilot Instructions](.github/copilot-instructions.md)** - GitHub Copilot setup

## 🎯 Tech Stack

### Core

- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5.6** - Type safety
- **TailwindCSS 3.4** - Utility-first CSS

### Database & Caching

- **PostgreSQL** - Primary database
- **Prisma 5.20** - ORM
- **Upstash Redis** - Caching layer

### Styling & UI

- **Inter** - Sans-serif font (next/font)
- **Geist Mono** - Monospace font
- **CVA** - Component variants
- **Tailwind Animate** - Animation utilities
- **Framer Motion** - Advanced animations
- **Lenis** - Smooth scroll

### State & Forms

- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Infrastructure

- **NextAuth.js** - Authentication
- **Resend** - Email service
- **Cloudinary** - Image management

## 📦 Installation

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd cius-web-app
pnpm install
```

2. Setup environment variables:

```bash
cp .env.example .env
# Fill in your environment variables
```

3. Setup database:

```bash
pnpm prisma:generate
pnpm prisma:push
```

4. Start development server:

```bash
pnpm dev
```

## 🛠️ Commands

```bash
# Development
pnpm dev                 # Start dev server (http://localhost:3000)
pnpm build               # Build for production
pnpm start               # Start production server

# Database
pnpm prisma:generate     # Generate Prisma Client
pnpm prisma:push         # Push schema to database
pnpm prisma:studio       # Open Prisma Studio GUI

# Code Quality
pnpm lint                # Run ESLint
pnpm format              # Format with Prettier
```

## 📁 Project Structure

```
cius-web-app/
├── app/                      # Next.js App Router
│   ├── (routes)/            # Route groups
│   ├── api/                 # API endpoints
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
│
├── components/
│   ├── animations/          # Animation components
│   │   ├── ShimmerButton.tsx
│   │   ├── ShinyText.tsx
│   │   └── index.ts
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── common/              # Utilities (theme-toggle)
│   ├── layout/              # Layout components
│   └── providers/           # Context providers
│
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── prisma.ts            # Prisma client
│   ├── redis.ts             # Redis client
│   ├── auth.ts              # Auth config
│   └── constants/           # Constants & tokens
│
├── styles/
│   ├── globals.css          # Global styles
│   └── animations.css       # Animation keyframes
│
├── prisma/
│   └── schema.prisma        # Database schema
│
└── public/                  # Static assets
```

## 🎨 Design System

### Colors

- **Primary**: Orange #F95E1E (HSL: 16 95% 54%)
- **Theme**: Dark/Light mode support
- **Semantic**: success, error, warning, destructive

### Typography

- **Sans**: Inter (Google Fonts)
- **Mono**: Geist Mono

### Components

- **Buttons**: rounded-full with variants (default, outline, ghost)
- **Cards**: rounded-lg with shadow
- **Inputs**: rounded-lg with focus states

## 🎭 Animation System

Complex animations are organized in `components/animations/`:

- **ShimmerButton** - Button with rotating conic-gradient shimmer
- **ShinyText** - Text with shine gradient effect
- **FadeIn, FadeUp, SlideIn** - Entrance animations

CSS keyframes are centralized in `styles/animations.css`.

See [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) for details.

## � Configuration

### Environment Variables

See `.env.example` for required variables:

- Database connection (PostgreSQL)
- Redis connection (Upstash)
- NextAuth configuration
- API keys (Resend, Cloudinary, etc.)

### TypeScript

Strict mode enabled with path aliases:

- `@/` → Root directory
- `@/components/*` → Components
- `@/lib/*` → Utilities

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Strict mode, no `any` types
- **Components**: Named exports, explicit types
- **Styling**: Tailwind-first, use `cn()` utility
- **Imports**: Use `@/` aliases, import from index files

### Best Practices

1. No default exports (except pages)
2. Mobile-first responsive design
3. Dark mode support by default
4. Accessibility attributes (ARIA)
5. Error handling with try-catch
6. Performance optimization (Image, transform-gpu)

See [.cursorrules](.cursorrules) for comprehensive guidelines.

## 🤝 Contributing

1. Follow the guidelines in `.cursorrules`
2. Write TypeScript types
3. Add tests for new features
4. Update documentation
5. Format code with Prettier

## 📄 License

MIT

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Project Guidelines](.cursorrules)

---

**Built with ❤️ by CIUS Team**
