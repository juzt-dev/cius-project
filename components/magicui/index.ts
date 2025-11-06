/**
 * Magic UI Components - Optimized Animations
 * This file re-exports animation components with cleaner interfaces
 */

// Named exports
export { ShimmerButton } from '../animations/ShimmerButton';
export type { ShimmerButtonProps } from '../animations/ShimmerButton';

export { GlareText } from '../animations/GlareText';
export type { GlareTextProps } from '../animations/GlareText';

export { FadeIn } from '../animations/FadeIn';
export { FadeUp } from '../animations/FadeUp';
export { SlideIn } from '../animations/SlideIn';

export { Meteors } from './meteors';

// Default exports
export { default as ShinyText } from '../animations/ShinyText';
export { default as Particles } from '../animations/LiquidEther';
export type { LiquidEtherProps as ParticlesProps } from '../animations/LiquidEther';
