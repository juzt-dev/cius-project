'use client';

import React from 'react';
import { motion, useScroll, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ScrollProgressProps = Omit<HTMLMotionProps<'div'>, 'ref'>;

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(
  function ScrollProgress({ className, ...props }, ref) {
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
);

ScrollProgress.displayName = 'ScrollProgress';
