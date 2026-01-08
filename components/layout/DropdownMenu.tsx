'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for menu structure
export interface MenuItem {
  label: string;
  href: string;
  description?: string;
  badge?: 'Coming soon';
}

export interface MenuSection {
  label: string;
  items: MenuItem[];
}

export interface DropdownMenuProps {
  trigger: string;
  sections?: MenuSection[];
  items?: MenuItem[];
  pathname: string;
}

const HOVER_DELAY = 150; // milliseconds

export function DropdownMenu({ trigger, sections, items, pathname }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverTimeoutId, setHoverTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle hover with delay
  const handleMouseEnter = () => {
    const timeoutId = setTimeout(() => {
      setIsOpen(true);
    }, HOVER_DELAY);
    setHoverTimeoutId(timeoutId);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
      setHoverTimeoutId(null);
    }
    setIsOpen(false);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutId) {
        clearTimeout(hoverTimeoutId);
      }
    };
  }, [hoverTimeoutId]);

  // Check if current path matches any menu item
  const isActiveMenu = sections
    ? sections.some((section) => section.items.some((item) => pathname === item.href))
    : items?.some((item) => pathname === item.href);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        className={cn(
          'flex items-center gap-1 text-sm font-medium transition-colors',
          'hover:text-primary',
          isActiveMenu ? 'text-primary' : 'text-foreground'
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
        <ChevronDown
          className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'absolute left-0 top-full mt-2 z-60',
              'min-w-[280px] rounded-lg',
              'border border-border bg-background/95 backdrop-blur-md',
              'shadow-lg'
            )}
            role="menu"
          >
            <div className="py-2">
              {/* Render sections (for Services menu) */}
              {sections &&
                sections.map((section, sectionIdx) => (
                  <div key={section.label} className={cn(sectionIdx > 0 && 'mt-4')}>
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {section.label}
                    </div>
                    {section.items.map((item) => (
                      <MenuItemLink key={item.href} item={item} pathname={pathname} />
                    ))}
                  </div>
                ))}

              {/* Render flat items (for Our Products, Explore) */}
              {items &&
                items.map((item) => (
                  <MenuItemLink key={item.href} item={item} pathname={pathname} />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Menu item link component
function MenuItemLink({ item, pathname }: { item: MenuItem; pathname: string }) {
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-start gap-2 px-4 py-2.5',
        'text-sm transition-colors',
        'hover:bg-primary/10',
        isActive ? 'text-primary font-medium' : 'text-foreground'
      )}
      role="menuitem"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span>{item.label}</span>
          {item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-muted text-muted-foreground">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
        )}
      </div>
    </Link>
  );
}
