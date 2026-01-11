/**
 * LoadingFallback Components Tests
 * Tests for Suspense loading skeleton components
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ParticlesSkeleton, ContentSkeleton, CardSkeleton } from './LoadingFallback';

describe('ParticlesSkeleton', () => {
  it('renders with pulsing animation', () => {
    const { container } = render(<ParticlesSkeleton />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('has gradient background', () => {
    const { container } = render(<ParticlesSkeleton />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('bg-gradient-to-br');
  });

  it('has aria-label for accessibility', () => {
    render(<ParticlesSkeleton />);

    expect(
      document.querySelector('[aria-label="Loading particles animation"]')
    ).toBeInTheDocument();
  });
});

describe('ContentSkeleton', () => {
  it('renders multiple skeleton lines', () => {
    const { container } = render(<ContentSkeleton />);

    const lines = container.querySelectorAll('.h-4');
    expect(lines.length).toBe(3);
  });

  it('renders with varying widths', () => {
    const { container } = render(<ContentSkeleton />);

    expect(container.querySelector('.w-3\\/4')).toBeInTheDocument();
    expect(container.querySelector('.w-1\\/2')).toBeInTheDocument();
    expect(container.querySelector('.w-5\\/6')).toBeInTheDocument();
  });
});

describe('CardSkeleton', () => {
  it('renders card structure', () => {
    const { container } = render(<CardSkeleton />);

    const card = container.querySelector('.border');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg');
  });

  it('contains header and content skeletons', () => {
    const { container } = render(<CardSkeleton />);

    const elements = container.querySelectorAll('.bg-gray-200, .dark\\:bg-gray-700');
    expect(elements.length).toBeGreaterThan(0);
  });
});
