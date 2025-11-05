import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - CIUS',
  description: 'Welcome to CIUS - Your trusted business partner',
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to CIUS
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Professional enterprise web application built with Next.js 15, TypeScript, TailwindCSS,
          Prisma, Redis, and more.
        </p>
        <div className="flex gap-4">
          <a
            href="/product"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
          >
            Explore Products
          </a>
          <a
            href="/contact"
            className="px-6 py-3 border border-border rounded-full hover:bg-muted transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
