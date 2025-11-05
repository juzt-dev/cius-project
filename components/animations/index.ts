/**
 * Animation Components
 *
 * Centralized exports for all animation and effect components.
 * Import from here instead of individual files for better maintainability.
 *
 * @example
 * import { ShimmerButton, ShinyText } from '@/components/animations';
 */

export { ShimmerButton } from './ShimmerButton';
export { default as ShinyText } from './ShinyText';

// Re-export types if needed
export type { ShimmerButtonProps } from './ShimmerButton';
