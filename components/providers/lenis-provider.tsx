'use client';

import { type ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';

type LenisProviderProps = {
  children: ReactNode;
};

export const LenisProvider = ({ children }: LenisProviderProps) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
};
