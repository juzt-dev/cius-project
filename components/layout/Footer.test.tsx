/**
 * Footer Component Tests
 * Tests for site footer with navigation links
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders footer navigation sections', () => {
    render(<Footer />);

    expect(screen.getByRole('heading', { name: /Product/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Company/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Support/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Legal/i })).toBeInTheDocument();
  });

  it('displays product links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /Nova/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Orbit/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Linkr/i })).toBeInTheDocument();
  });

  it('displays company links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /About Us/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Careers/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /News/i })).toBeInTheDocument();
  });

  it('displays support links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /Contact/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Documentation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /FAQ/i })).toBeInTheDocument();
  });

  it('displays legal links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Terms of Service/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Cookie Policy/i })).toBeInTheDocument();
  });

  it('displays copyright notice with current year', () => {
    render(<Footer />);

    expect(screen.getByText(/© 2026 CIUSLABS. All rights reserved./i)).toBeInTheDocument();
  });

  it('displays company tagline', () => {
    render(<Footer />);

    expect(screen.getByText(/Technology · Universe · AI · Mars/i)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);

    const socialLinks = screen.getAllByRole('link', { name: /Twitter|GitHub|LinkedIn/i });
    expect(socialLinks.length).toBe(3);
  });

  it('renders as semantic footer element', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });
});
