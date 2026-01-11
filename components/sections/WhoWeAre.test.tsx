/**
 * WhoWeAre Section Tests
 * Tests for about/introduction section
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhoWeAre } from './WhoWeAre';

describe('WhoWeAre', () => {
  it('renders introduction badge', () => {
    render(<WhoWeAre />);

    expect(screen.getByText('Introduction')).toBeInTheDocument();
  });

  it('displays company description heading', () => {
    render(<WhoWeAre />);

    expect(screen.getByText(/C\.Labs is a/i)).toBeInTheDocument();
    expect(screen.getByText(/leading tech studio/i)).toBeInTheDocument();
    expect(screen.getByText(/innovation meets execution/i)).toBeInTheDocument();
  });

  it('mentions key service areas', () => {
    render(<WhoWeAre />);

    expect(screen.getByText(/AI tools/i)).toBeInTheDocument();
    expect(screen.getByText(/Web3 platforms/i)).toBeInTheDocument();
  });

  it('highlights company values', () => {
    render(<WhoWeAre />);

    expect(screen.getByText(/technical skill/i)).toBeInTheDocument();
    expect(screen.getByText(/design passion/i)).toBeInTheDocument();
    expect(screen.getByText(/powerful, intuitive, and accessible/i)).toBeInTheDocument();
  });

  it('renders as semantic section element', () => {
    const { container } = render(<WhoWeAre />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('contains h2 heading for hierarchy', () => {
    render(<WhoWeAre />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
