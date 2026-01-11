/**
 * Lazy Motion Section Loader
 *
 * For below-fold sections using Framer Motion animations,
 * lazy-load the entire section to reduce initial bundle size
 *
 * Strategy: Don't lazy-load Framer Motion itself (causes complexity)
 * Instead: Lazy-load sections that use Framer Motion and are below fold
 *
 * Impact: ~50KB gzipped per section deferred
 */

export { motion, AnimatePresence } from 'framer-motion';

// Common animation variants for reuse
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 },
};

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

/**
 * Section Loading Skeleton
 * Placeholder shown while section component loads
 */
export function SectionSkeleton({ height = '400px' }: { height?: string }) {
  return (
    <section className="py-24 md:py-32 lg:py-40" style={{ minHeight: height }}>
      <div className="container mx-auto px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded-lg w-1/3 mx-auto" />
          <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </div>
      </div>
    </section>
  );
}
