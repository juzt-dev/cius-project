/**
 * OurProducts Section Tests
 * Tests for products showcase section
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OurProducts } from './OurProducts';

describe('OurProducts', () => {
  it('renders section heading', () => {
    render(<OurProducts />);

    expect(screen.getByText(/Our Products/i)).toBeInTheDocument();
  });

  it('displays section description', () => {
    const { container } = render(<OurProducts />);

    expect(container.textContent).toMatch(/Built for the Future/i);
  });

  it('renders as semantic section element', () => {
    const { container } = render(<OurProducts />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
