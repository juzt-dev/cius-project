'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BlurRevealProps extends React.HTMLAttributes<HTMLElement> {
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}

export const BlurReveal: React.FC<BlurRevealProps> = ({
  delay = 0,
  as = 'span',
  className,
  style,
  children,
  ...rest
}) => {
  const Component = as as any;

  return (
    <Component
      className={cn('blur-reveal inline-block', className)}
      style={{
        animationDelay: `${delay}s`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default BlurReveal;
