/**
 * Design Tokens inspired by Geist Design System
 * https://vercel.com/geist/colors
 */

export const SPACING = {
  // Page sections
  section: {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-24 md:py-32',
  },
  
  // Container
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  
  // Content max widths
  content: {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  },
} as const;

export const TYPOGRAPHY = {
  // Display (Hero titles)
  display: {
    sm: 'text-4xl md:text-5xl font-bold tracking-tight',
    md: 'text-5xl md:text-6xl font-bold tracking-tight',
    lg: 'text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight',
  },
  
  // Headings
  h1: 'text-4xl md:text-5xl font-bold tracking-tight',
  h2: 'text-3xl md:text-4xl font-bold tracking-tight',
  h3: 'text-2xl md:text-3xl font-semibold tracking-tight',
  h4: 'text-xl md:text-2xl font-semibold',
  h5: 'text-lg md:text-xl font-semibold',
  h6: 'text-base md:text-lg font-semibold',
  
  // Body text
  body: {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
  },
  
  // Labels
  label: 'text-sm font-medium',
  
  // Captions
  caption: 'text-xs text-muted-foreground',
  
  // Code
  code: 'font-mono text-sm',
} as const;

export const TRANSITIONS = {
  fast: 'transition-all duration-150 ease-in-out',
  base: 'transition-all duration-200 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
} as const;
