'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Download } from '@geist-ui/react-icons';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { ShimmerButton, ShinyText } from '@/components/animations';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { name: 'Products', href: '/product' },
  { name: 'Offers', href: '/offer' },
  { name: 'About', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
] as const;

const SHIMMER_BUTTON_CONFIG = {
  shimmerColor: '#ffffff',
  shimmerSize: '0.1em',
  borderRadius: '100px',
  shimmerDuration: '2s',
  background: 'hsl(var(--primary))',
} as const;

const LOGO_CONFIG = {
  width: 140,
  height: 40,
  className: 'h-7 w-auto',
} as const;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}

function MobileMenu({ isOpen, onClose, pathname, isHovered, onHoverChange }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <nav className="fixed left-0 right-0 top-16 md:hidden z-50 animate-in slide-in-from-top-4 duration-300">
        <div className="mx-4 mt-2 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="px-4 py-6">
            <div className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative py-3 px-4 rounded-xl text-base font-medium transition-all duration-200',
                      'hover:bg-primary/10 hover:pl-6',
                      isActive
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-foreground'
                    )}
                    onClick={onClose}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
                    )}

                    {/* Hover Indicator */}
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full opacity-0 group-hover:opacity-50 transition-opacity" />

                    {item.name}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="my-3 h-px bg-border/50" />

              {/* CTA Button */}
              <Link href="/report" className="block" onClick={onClose}>
                <ShimmerButton
                  {...SHIMMER_BUTTON_CONFIG}
                  borderRadius="12px"
                  className="w-full px-4 py-3 text-base font-medium flex items-center justify-center gap-2"
                  onMouseEnter={() => onHoverChange(true)}
                  onMouseLeave={() => onHoverChange(false)}
                >
                  <ShinyText text="Get Report" speed={2} disabled={!isHovered} />
                  <Download className="w-4 h-4 !text-black transition-transform duration-200" strokeWidth={2.5} />
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const logoSrc = mounted
    ? resolvedTheme === 'dark'
      ? '/Logo-dark mode.svg'
      : '/Logo-Light mode.svg'
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt="CIUSLABS Logo"
                {...LOGO_CONFIG}
                priority
              />
            ) : (
              <div className="h-7 w-[140px]" aria-hidden="true" />
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
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
                {...SHIMMER_BUTTON_CONFIG}
                className="px-4 py-2 text-sm font-medium flex items-center gap-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <ShinyText text="Get Report" speed={3} disabled={!isHovered} />
                <Download
                  className={cn(
                    'w-4 h-4 !text-black transition-transform duration-300',
                    isHovered && 'translate-y-0.5'
                  )}
                  strokeWidth={2.5}
                />
              </ShimmerButton>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
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
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          pathname={pathname}
          isHovered={isHovered}
          onHoverChange={setIsHovered}
        />
      </div>
    </header>
  );
}
