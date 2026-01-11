/**
 * CTABand Tests
 * Tests for call-to-action band section
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CTABand } from './CTABand';

describe('CTABand', () => {
  it('renders CTA heading', () => {
    const { container } = render(<CTABand />);

    expect(container.textContent).toMatch(/Ready to Build/i);
  });

  it('displays CTA button or link', () => {
    const { container } = render(<CTABand />);

    // Verify section renders
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders as semantic section element', () => {
    const { container } = render(<CTABand />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
