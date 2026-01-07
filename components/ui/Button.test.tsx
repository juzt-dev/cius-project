/**
 * Button Component Tests
 * Tests for button variants, sizes, states, and interactions
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/lib/test-utils';
import { Button } from './Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with default variant and size', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('should render with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('custom-class');
    });

    it('should render children correctly', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Destructive</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
    });

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('border', 'border-input');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
    });

    it('should render link variant', () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('underline-offset-4', 'text-primary');
    });
  });

  describe('Sizes', () => {
    it('should render default size', () => {
      render(<Button size="default">Default Size</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('h-10', 'py-2', 'px-4');
    });

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('h-9', 'px-3');
    });

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('h-11', 'px-8');
    });

    it('should render icon size', () => {
      render(<Button size="icon">🔥</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('States', () => {
    it('should handle disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none');
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole('button');

      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should have focus-visible ring classes', () => {
      render(<Button>Focus</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });
  });

  describe('Interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');

      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick multiple times', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should handle keyboard interaction (Enter)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Press Enter</Button>);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard interaction (Space)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Press Space</Button>);
      const button = screen.getByRole('button');

      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTML Attributes', () => {
    it('should support type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      const button = screen.getByRole('button', { name: 'Close dialog' });

      expect(button).toBeInTheDocument();
    });

    it('should support data attributes', () => {
      render(<Button data-testid="custom-button">Button</Button>);
      const button = screen.getByTestId('custom-button');

      expect(button).toBeInTheDocument();
    });

    it('should support id attribute', () => {
      render(<Button id="submit-button">Submit</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('id', 'submit-button');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = { current: null };

      render(<Button ref={ref}>Button</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Button');
    });

    it('should allow ref to access button methods', () => {
      const ref = { current: null };

      render(<Button ref={ref}>Button</Button>);

      expect(ref.current?.focus).toBeDefined();
      expect(ref.current?.blur).toBeDefined();
    });
  });

  describe('Variant and Size Combinations', () => {
    it('should combine destructive variant with small size', () => {
      render(
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      );
      const button = screen.getByRole('button');

      expect(button).toHaveClass('bg-destructive');
      expect(button).toHaveClass('h-9', 'px-3');
    });

    it('should combine outline variant with large size', () => {
      render(
        <Button variant="outline" size="lg">
          Large Outline
        </Button>
      );
      const button = screen.getByRole('button');

      expect(button).toHaveClass('border');
      expect(button).toHaveClass('h-11', 'px-8');
    });

    it('should combine ghost variant with icon size', () => {
      render(
        <Button variant="ghost" size="icon">
          🔍
        </Button>
      );
      const button = screen.getByRole('button');

      expect(button).toHaveClass('hover:bg-accent');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Display Name', () => {
    it('should have correct displayName', () => {
      expect(Button.displayName).toBe('Button');
    });
  });
});
