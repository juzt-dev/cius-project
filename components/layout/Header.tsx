'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { DropdownMenu, type MenuSection, type MenuItem } from './DropdownMenu';
import { cn } from '@/lib/utils';

// Type for menu items with sections or flat items
interface NavMenuItem {
  label: string;
  sections?: MenuSection[];
  items?: MenuItem[];
}

// Navigation menu structure
const NAV_MENU_ITEMS: NavMenuItem[] = [
  {
    label: 'Services',
    sections: [
      {
        label: 'Design',
        items: [
          { label: 'UI/UX', href: '/services/design/ui-ux' },
          { label: 'Brand Identity', href: '/services/design/brand-identity' },
          { label: 'Interaction', href: '/services/design/interaction' },
        ],
      },
      {
        label: 'Development',
        items: [
          { label: 'Web & Mobile App', href: '/services/development/web-mobile' },
          { label: 'Backend Systems', href: '/services/development/backend' },
          { label: 'Creative Coding', href: '/services/development/creative-coding' },
        ],
      },
    ],
  },
  {
    label: 'Our Products',
    items: [
      {
        label: 'Shop',
        href: '/products/shop',
        description: 'UI Kits, Icon Sets',
        badge: 'Coming soon',
      },
      {
        label: 'Showcase',
        href: '/products/showcase',
        badge: 'Coming soon',
      },
    ],
  },
  {
    label: 'Explore',
    items: [
      {
        label: 'About Us',
        href: '/about',
        description: 'Our Story & Philosophy',
      },
      {
        label: 'Careers',
        href: '/careers',
        description: 'Join the Squad',
      },
      {
        label: 'Journal',
        href: '/journal',
        description: 'Insights & News',
      },
    ],
  },
];

const LOGO_CONFIG = {
  width: 140,
  height: 40,
  className: 'h-7 w-auto',
} as const;

// Mobile Menu Component
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

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
        <div className="mx-4 mt-2 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="px-4 py-6">
            <div className="flex flex-col space-y-1">
              {/* Menu Items with Accordion */}
              {NAV_MENU_ITEMS.map((menu) => {
                const isExpanded = expandedMenu === menu.label;
                const hasSubItems = menu.sections || menu.items;

                return (
                  <div key={menu.label}>
                    <button
                      className={cn(
                        'w-full flex items-center justify-between py-3 px-4 rounded-xl',
                        'text-base font-medium transition-all duration-200',
                        'hover:bg-primary/10',
                        isExpanded ? 'text-primary bg-primary/10' : 'text-foreground'
                      )}
                      onClick={() => toggleMenu(menu.label)}
                    >
                      {menu.label}
                      {hasSubItems && (
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform duration-200',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      )}
                    </button>

                    {/* Expanded Sub-items */}
                    {isExpanded && hasSubItems && (
                      <div className="ml-4 mt-1 space-y-1">
                        {/* Render sections (for Services) */}
                        {menu.sections &&
                          menu.sections.map((section) => (
                            <div key={section.label} className="mb-3">
                              <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {section.label}
                              </div>
                              {section.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={cn(
                                    'block py-2 px-4 rounded-lg text-sm transition-colors',
                                    'hover:bg-primary/10',
                                    pathname === item.href
                                      ? 'text-primary font-medium'
                                      : 'text-foreground'
                                  )}
                                  onClick={onClose}
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          ))}

                        {/* Render flat items (for Our Products, Explore) */}
                        {menu.items &&
                          menu.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                'block py-2 px-4 rounded-lg text-sm transition-colors',
                                'hover:bg-primary/10',
                                pathname === item.href
                                  ? 'text-primary font-medium'
                                  : 'text-foreground'
                              )}
                              onClick={onClose}
                            >
                              <div className="flex items-center gap-2">
                                <span>{item.label}</span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-muted text-muted-foreground">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Divider */}
              <div className="my-3 h-px bg-border/50" />

              {/* CTA Button */}
              <Link
                href="/contact"
                className={cn(
                  'flex items-center justify-center gap-2',
                  'w-full px-4 py-3 rounded-xl',
                  'text-base font-medium',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90 active:scale-[0.98]',
                  'transition-all duration-200'
                )}
                onClick={onClose}
              >
                <MessageCircle className="w-4 h-4" />
                Let's Talk
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

// Main Header Component
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Use dark logo for dark mode theme
  const logoSrc = '/Logo-dark mode.svg';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {logoSrc ? (
              <Image src={logoSrc} alt="CIUSLABS Logo" {...LOGO_CONFIG} priority />
            ) : (
              <div className="h-7 w-[140px]" aria-hidden="true" />
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {NAV_MENU_ITEMS.map((menu) => (
              <DropdownMenu
                key={menu.label}
                trigger={menu.label}
                sections={menu.sections}
                items={menu.items}
                pathname={pathname}
              />
            ))}
          </nav>

          {/* Right Side: Let's Talk Button + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden md:inline-flex">
              <button
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full',
                  'text-sm font-medium',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90 active:scale-[0.98]',
                  'transition-all duration-200'
                )}
              >
                <MessageCircle className="w-4 h-4" />
                Let's Talk
              </button>
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
        <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} pathname={pathname} />
      </div>
    </header>
  );
}

export default Header;
