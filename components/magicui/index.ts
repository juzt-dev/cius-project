/**
 * Magic UI Components - Optimized Animations
 * This file re-exports animation components with cleaner interfaces
 */

export { ShimmerButton } from '../animations/ShimmerButton';
export type { ShimmerButtonProps } from '../animations/ShimmerButton';

export { ShinyText } from '../animations/ShinyText';
export type { ShinyTextProps } from '../animations/ShinyText';

export { GlareText } from '../animations/GlareText';
export type { GlareTextProps } from '../animations/GlareText';

export { FadeIn } from '../animations/FadeIn';
export { FadeUp } from '../animations/FadeUp';
export { SlideIn } from '../animations/SlideIn';

// Re-export LiquidEther as Particles for Magic UI compatibility
export { default as Particles } from '../animations/LiquidEther';
export type { LiquidEtherProps as ParticlesProps } from '../animations/LiquidEther';
