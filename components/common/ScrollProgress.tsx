'use client';

import { motion, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export function ScrollProgress({ className, ref, ...props }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      ref={ref}
      className={cn(
        'fixed top-16 left-0 right-0 z-[100] h-[1px] origin-left bg-gradient-to-r from-primary via-orange-500 to-primary pointer-events-none',
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
}
