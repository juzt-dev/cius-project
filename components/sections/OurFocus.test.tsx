/**
 * OurFocus Section Tests
 * Tests for focus areas showcase section
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OurFocus } from './OurFocus';

describe('OurFocus', () => {
  it('renders section badge', () => {
    render(<OurFocus />);

    expect(screen.getByText('Our Focus')).toBeInTheDocument();
  });

  it('displays section heading', () => {
    render(<OurFocus />);

    expect(screen.getByRole('heading', { name: /What Drives Us/i })).toBeInTheDocument();
  });

  it('shows section description', () => {
    render(<OurFocus />);

    expect(screen.getByText(/Three pillars that define our approach/i)).toBeInTheDocument();
  });

  it('renders focus area cards', () => {
    const { container } = render(<OurFocus />);

    // Should render 3 focus areas from constants
    const cards = container.querySelectorAll('h3');
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });

  it('renders as semantic section element', () => {
    const { container } = render(<OurFocus />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
