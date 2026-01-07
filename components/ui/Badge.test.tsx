/**
 * Badge Component Tests
 * Tests for badge variants and rendering
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import { Badge } from './Badge';

describe('Badge', () => {
  describe('Rendering', () => {
    it('should render badge element', () => {
      render(<Badge>New</Badge>);

      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('should have default badge styling classes', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border');
    });

    it('should render with custom className', () => {
      render(
        <Badge className="custom-badge" data-testid="badge">
          Badge
        </Badge>
      );
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveClass('custom-badge');
    });

    it('should render children correctly', () => {
      render(
        <Badge>
          <span>Icon</span>
          Text
        </Badge>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText(/Text/)).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(
        <Badge variant="default" data-testid="badge">
          Default
        </Badge>
      );
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('should render secondary variant', () => {
      render(
        <Badge variant="secondary" data-testid="badge">
          Secondary
        </Badge>
      );
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('should render destructive variant', () => {
      render(
        <Badge variant="destructive" data-testid="badge">
          Destructive
        </Badge>
      );
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground');
    });

    it('should render outline variant', () => {
      render(
        <Badge variant="outline" data-testid="badge">
          Outline
        </Badge>
      );
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveClass('text-foreground');
    });

    it('should use default variant when not specified', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveClass('bg-primary');
    });
  });

  describe('HTML Attributes', () => {
    it('should support id attribute', () => {
      render(
        <Badge id="status-badge" data-testid="badge">
          Active
        </Badge>
      );
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveAttribute('id', 'status-badge');
    });

    it('should support data attributes', () => {
      render(
        <Badge data-status="active" data-testid="badge">
          Badge
        </Badge>
      );
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveAttribute('data-status', 'active');
    });

    it('should support aria attributes', () => {
      render(
        <Badge aria-label="Status indicator" data-testid="badge">
          Live
        </Badge>
      );
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveAttribute('aria-label', 'Status indicator');
    });
  });

  describe('Content Types', () => {
    it('should render with text content', () => {
      render(<Badge>Text Badge</Badge>);

      expect(screen.getByText('Text Badge')).toBeInTheDocument();
    });

    it('should render with number content', () => {
      render(<Badge>99+</Badge>);

      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('should render with emoji content', () => {
      render(<Badge>✨ Featured</Badge>);

      expect(screen.getByText(/Featured/)).toBeInTheDocument();
    });

    it('should render with mixed content', () => {
      render(
        <Badge>
          <span>🔥</span> Hot
        </Badge>
      );

      expect(screen.getByText('🔥')).toBeInTheDocument();
      expect(screen.getByText(/Hot/)).toBeInTheDocument();
    });
  });

  describe('Focus States', () => {
    it('should have focus ring classes', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      const badge = screen.getByTestId('badge');

      expect(badge).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-ring');
    });
  });

  describe('Use Cases', () => {
    it('should render as status indicator', () => {
      render(<Badge variant="default">Online</Badge>);

      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('should render as notification count', () => {
      render(<Badge variant="destructive">3</Badge>);

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render as category tag', () => {
      render(<Badge variant="secondary">Technology</Badge>);

      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('should render multiple badges', () => {
      render(
        <div>
          <Badge>Tag 1</Badge>
          <Badge>Tag 2</Badge>
          <Badge>Tag 3</Badge>
        </div>
      );

      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
      expect(screen.getByText('Tag 3')).toBeInTheDocument();
    });
  });
});
