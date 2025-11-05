'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { ShimmerButton, ShinyText } from '@/components/animations';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Products', href: '/product' },
    { name: 'Offers', href: '/offer' },
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'News', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {mounted ? (
              <Image
                src={resolvedTheme === 'dark' ? '/Logo-dark mode.svg' : '/Logo-Light mode.svg'}
                alt="CIUSLABS Logo"
                width={140}
                height={40}
                className="h-7 w-auto"
                priority
              />
            ) : (
              // Placeholder during SSR to prevent layout shift
              <div className="h-7 w-[140px]" />
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side: Theme Toggle + Get Report Button + Mobile Menu */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/report" className="hidden md:inline-flex">
              <ShimmerButton
                shimmerColor="#ffffff"
                shimmerSize="0.1em"
                borderRadius="100px"
                shimmerDuration="2s"
                background="hsl(var(--primary))"
                className="px-4 py-2 text-sm font-medium"
              >
                <ShinyText text="Get Report" speed={3} />
              </ShimmerButton>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/report" className="block mt-4" onClick={() => setIsMenuOpen(false)}>
              <ShimmerButton
                shimmerColor="#ffffff"
                shimmerSize="0.1em"
                borderRadius="100px"
                shimmerDuration="2s"
                background="hsl(var(--primary))"
                className="w-full px-4 py-2 text-sm font-medium text-center"
              >
                <ShinyText text="Get Report" speed={3} />
              </ShimmerButton>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
