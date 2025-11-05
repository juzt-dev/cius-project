'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeUp = ({ children, delay = 0, duration = 0.5 }: FadeUpProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: 'easeOut', delay }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};
