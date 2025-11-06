'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Download } from '@geist-ui/react-icons';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { ShimmerButton, ShinyText } from '@/components/animations';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

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
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
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
                className="px-4 py-2 text-sm font-medium flex items-center gap-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <ShinyText text="Get Report" speed={3} disabled={!isHovered} />
                <Download
                  className={`w-4 h-4 !text-black transition-transform duration-300 ${isHovered ? 'translate-y-0.5' : ''}`}
                  strokeWidth={2.5}
                />
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
          <nav className="absolute left-0 right-0 top-full md:hidden backdrop-blur-xl bg-background/90 border-b border-border shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col items-center justify-center space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'block py-2 px-4 text-sm font-medium transition-colors hover:text-primary relative text-center',
                        isActive ? 'text-primary font-semibold' : 'text-foreground'
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
                      )}
                    </Link>
                  );
                })}
                <Link
                  href="/report"
                  className="block mt-4 w-full max-w-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShimmerButton
                    shimmerColor="#ffffff"
                    shimmerSize="0.1em"
                    borderRadius="100px"
                    shimmerDuration="2s"
                    background="hsl(var(--primary))"
                    className="w-full px-4 py-2 text-sm font-medium text-center flex items-center justify-center gap-2"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <ShinyText text="Get Report" speed={2} disabled={!isHovered} />
                    <Download
                      className={`w-4 h-4 !text-black transition-transform duration-100 ${isHovered ? 'translate-y-0.01' : ''}`}
                      strokeWidth={2.5}
                    />
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
