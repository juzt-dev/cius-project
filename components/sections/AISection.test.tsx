/**
 * AISection Tests
 * Tests for AI capabilities showcase section
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AISection } from './AISection';

describe('AISection', () => {
  it('renders section heading', () => {
    const { container } = render(<AISection />);

    expect(container.textContent).toMatch(/AI/i);
  });

  it('displays section content', () => {
    const { container } = render(<AISection />);

    // Just verify it renders without errors
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders as semantic section element', () => {
    const { container } = render(<AISection />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
