/**
 * Hero Section Tests
 * Tests for main landing page hero section
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders hero heading text', () => {
    const { container } = render(<Hero />);

    // Check for main headings - text is split across BlurReveal components
    expect(container.textContent).toMatch(/Ship.*with.*Confidence/i);
    expect(container.textContent).toMatch(/Not.*with.*Crossed.*Fingers/i);
  });

  it('displays subheading paragraph', () => {
    render(<Hero />);

    expect(
      screen.getByText(/Your next enterprise application, built with production infrastructure/i)
    ).toBeInTheDocument();
  });

  it('displays eyebrow badge with test coverage', () => {
    render(<Hero />);

    expect(screen.getByText(/100% API Test Coverage/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero Type-Unsafe Code/i)).toBeInTheDocument();
  });

  it('renders View Projects CTA button', () => {
    render(<Hero />);

    const ctaButton = screen.getByRole('link', { name: /View Projects/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/contact');
  });

  it('renders Talk to Us secondary button', () => {
    render(<Hero />);

    const secondaryButton = screen.getByRole('link', { name: /Talk to Us/i });
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).toHaveAttribute('href', '/contact');
  });

  it('displays trust strip with tech stack info', () => {
    const { container } = render(<Hero />);

    // Check for trust indicators in the component
    expect(container.textContent).toMatch(/Tests Passing/i);
    expect(container.textContent).toMatch(/TypeScript Strict Mode/i);
    expect(container.textContent).toMatch(/API Coverage/i);
    expect(container.textContent).toMatch(/Next\.?js/i);
  });

  it('renders with correct semantic structure', () => {
    const { container } = render(<Hero />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('contains h1 heading for SEO', () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
