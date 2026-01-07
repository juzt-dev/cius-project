/**
 * Card Component Tests
 * Tests for Card compound components (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@/lib/test-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';

describe('Card', () => {
  describe('Card Container', () => {
    it('should render card element', () => {
      render(<Card>Card content</Card>);

      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should have default card styling classes', () => {
      render(<Card data-testid="card">Card</Card>);
      const card = screen.getByTestId('card');

      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'shadow-sm');
    });

    it('should render with custom className', () => {
      render(
        <Card className="custom-card" data-testid="card">
          Card
        </Card>
      );
      const card = screen.getByTestId('card');

      expect(card).toHaveClass('custom-card');
    });

    it('should support HTML attributes', () => {
      render(
        <Card id="user-card" data-testid="card">
          Card
        </Card>
      );
      const card = screen.getByTestId('card');

      expect(card).toHaveAttribute('id', 'user-card');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };

      render(<Card ref={ref}>Card</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have correct displayName', () => {
      expect(Card.displayName).toBe('Card');
    });
  });

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(<CardHeader>Header content</CardHeader>);

      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('should have default header styling classes', () => {
      render(<CardHeader data-testid="card-header">Header</CardHeader>);
      const header = screen.getByTestId('card-header');

      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });

    it('should render with custom className', () => {
      render(
        <CardHeader className="custom-header" data-testid="card-header">
          Header
        </CardHeader>
      );
      const header = screen.getByTestId('card-header');

      expect(header).toHaveClass('custom-header');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };

      render(<CardHeader ref={ref}>Header</CardHeader>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have correct displayName', () => {
      expect(CardHeader.displayName).toBe('CardHeader');
    });
  });

  describe('CardTitle', () => {
    it('should render card title as h3', () => {
      render(<CardTitle>Card Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });

      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Card Title');
    });

    it('should have default title styling classes', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByRole('heading');

      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('should render with custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = screen.getByRole('heading');

      expect(title).toHaveClass('custom-title');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };

      render(<CardTitle ref={ref}>Title</CardTitle>);

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should have correct displayName', () => {
      expect(CardTitle.displayName).toBe('CardTitle');
    });
  });

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(<CardDescription>Card description text</CardDescription>);

      expect(screen.getByText('Card description text')).toBeInTheDocument();
    });

    it('should render as paragraph element', () => {
      render(<CardDescription data-testid="description">Description</CardDescription>);
      const description = screen.getByTestId('description');

      expect(description.tagName).toBe('P');
    });

    it('should have default description styling classes', () => {
      render(<CardDescription data-testid="description">Description</CardDescription>);
      const description = screen.getByTestId('description');

      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('should render with custom className', () => {
      render(
        <CardDescription className="custom-desc" data-testid="description">
          Desc
        </CardDescription>
      );
      const description = screen.getByTestId('description');

      expect(description).toHaveClass('custom-desc');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };

      render(<CardDescription ref={ref}>Description</CardDescription>);

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });

    it('should have correct displayName', () => {
      expect(CardDescription.displayName).toBe('CardDescription');
    });
  });

  describe('CardContent', () => {
    it('should render card content', () => {
      render(<CardContent>Main content here</CardContent>);

      expect(screen.getByText('Main content here')).toBeInTheDocument();
    });

    it('should have default content styling classes', () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      const content = screen.getByTestId('content');

      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('should render with custom className', () => {
      render(
        <CardContent className="custom-content" data-testid="content">
          Content
        </CardContent>
      );
      const content = screen.getByTestId('content');

      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };

      render(<CardContent ref={ref}>Content</CardContent>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have correct displayName', () => {
      expect(CardContent.displayName).toBe('CardContent');
    });
  });

  describe('CardFooter', () => {
    it('should render card footer', () => {
      render(<CardFooter>Footer content</CardFooter>);

      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('should have default footer styling classes', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      const footer = screen.getByTestId('footer');

      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('should render with custom className', () => {
      render(
        <CardFooter className="custom-footer" data-testid="footer">
          Footer
        </CardFooter>
      );
      const footer = screen.getByTestId('footer');

      expect(footer).toHaveClass('custom-footer');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };

      render(<CardFooter ref={ref}>Footer</CardFooter>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have correct displayName', () => {
      expect(CardFooter.displayName).toBe('CardFooter');
    });
  });

  describe('Complete Card Structure', () => {
    it('should render full card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Profile information goes here</p>
          </CardContent>
          <CardFooter>
            <button>Save Changes</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('User Profile');
      expect(screen.getByText('Manage your account settings')).toBeInTheDocument();
      expect(screen.getByText('Profile information goes here')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });

    it('should render card with only title and content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Simple Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Basic content</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByRole('heading')).toHaveTextContent('Simple Card');
      expect(screen.getByText('Basic content')).toBeInTheDocument();
      expect(screen.queryByText(/footer/i)).not.toBeInTheDocument();
    });

    it('should render card with custom content structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Product Card</CardTitle>
            <CardDescription>$99.99</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </CardContent>
          <CardFooter>
            <button>Add to Cart</button>
            <button>View Details</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Product Card')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('should handle nested elements correctly', () => {
      render(
        <Card>
          <CardContent>
            <div data-testid="nested">
              <span>Nested span</span>
              <strong>Bold text</strong>
            </div>
          </CardContent>
        </Card>
      );

      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByText('Nested span')).toBeInTheDocument();
      expect(screen.getByText('Bold text')).toBeInTheDocument();
    });
  });

  describe('Semantic HTML', () => {
    it('should use semantic HTML elements', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );

      // Check semantic structure
      const title = container.querySelector('h3');
      const description = container.querySelector('p');
      const divs = container.querySelectorAll('div');

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(divs.length).toBeGreaterThan(0);
    });
  });
});
