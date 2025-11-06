'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface GlareTextProps {
  text: string;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  transitionDuration?: number;
  className?: string;
}

export function GlareText({
  text,
  glareColor = '#ffffff',
  glareOpacity = 0.5,
  glareAngle = -45,
  transitionDuration = 650,
  className = '',
}: GlareTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Convert hex to rgba
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(${glareAngle}deg,
      transparent 0%,
      transparent 40%,
      ${rgba} 50%,
      transparent 60%,
      transparent 100%)`,
    backgroundSize: '200% 100%',
    backgroundPosition: isHovered ? '100% 0' : '-100% 0',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: `background-position ${transitionDuration}ms ease`,
    display: 'inline-block',
  };

  return (
    <span
      className={cn('relative inline-block cursor-pointer', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base text (visible) */}
      <span className="relative z-10">{text}</span>

      {/* Glare overlay */}
      <span className="absolute inset-0 z-20 pointer-events-none" style={gradientStyle}>
        {text}
      </span>
    </span>
  );
}
