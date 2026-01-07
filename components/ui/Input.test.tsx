/**
 * Input Component Tests
 * Tests for input rendering, states, types, and interactions
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, userEvent } from '@/lib/test-utils';
import { Input } from './Input';

describe('Input', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');

      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md');
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter your name" />);
      const input = screen.getByPlaceholderText('Enter your name');

      expect(input).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveClass('custom-input');
    });

    it('should render with default value', () => {
      render(<Input defaultValue="Default text" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      expect(input.value).toBe('Default text');
    });
  });

  describe('Input Types', () => {
    it('should render as text input by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      // When type is not specified, input defaults to text (browser default)
      // The type attribute might not be explicitly set in DOM
      expect(input.type).toBe('text');
    });

    it('should render as email input', () => {
      render(<Input type="email" placeholder="Email" />);
      const input = screen.getByPlaceholderText('Email');

      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render as password input', () => {
      render(<Input type="password" placeholder="Password" />);
      const input = screen.getByPlaceholderText('Password');

      expect(input).toHaveAttribute('type', 'password');
    });

    it('should render as number input', () => {
      render(<Input type="number" placeholder="Age" />);
      const input = screen.getByPlaceholderText('Age');

      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render as search input', () => {
      render(<Input type="search" placeholder="Search" />);
      const input = screen.getByPlaceholderText('Search') as HTMLInputElement;

      expect(input).toHaveAttribute('type', 'search');
    });

    it('should render as tel input', () => {
      render(<Input type="tel" placeholder="Phone" />);
      const input = screen.getByPlaceholderText('Phone');

      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should render as url input', () => {
      render(<Input type="url" placeholder="Website" />);
      const input = screen.getByPlaceholderText('Website');

      expect(input).toHaveAttribute('type', 'url');
    });
  });

  describe('States', () => {
    it('should handle disabled state', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');

      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('should handle readonly state', () => {
      render(<Input readOnly value="Read only text" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      expect(input).toHaveAttribute('readonly');
      expect(input.value).toBe('Read only text');
    });

    it('should handle required attribute', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');

      expect(input).toBeRequired();
    });

    it('should have focus-visible ring classes', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });
  });

  describe('User Interactions', () => {
    it('should handle value changes', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Type here" />);
      const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;

      await user.type(input, 'Hello World');

      expect(input.value).toBe('Hello World');
    });

    it('should handle clearing value', async () => {
      const user = userEvent.setup();
      render(<Input defaultValue="Initial value" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      expect(input.value).toBe('Initial value');

      await user.clear(input);

      expect(input.value).toBe('');
    });

    it('should handle typing and deleting', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.type(input, 'Test');
      expect(input.value).toBe('Test');

      await user.type(input, '{Backspace}{Backspace}');
      expect(input.value).toBe('Te');
    });

    it('should not allow typing when disabled', async () => {
      const user = userEvent.setup();
      render(<Input disabled />);
      const input = screen.getByRole('textbox') as HTMLInputElement;

      await user.type(input, 'Should not type');

      expect(input.value).toBe('');
    });

    it('should handle focus and blur', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      expect(input).toHaveFocus();

      await user.tab();
      expect(input).not.toHaveFocus();
    });
  });

  describe('HTML Attributes', () => {
    it('should support name attribute', () => {
      render(<Input name="username" />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('name', 'username');
    });

    it('should support id attribute', () => {
      render(<Input id="email-input" />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('should support aria-label', () => {
      render(<Input aria-label="Search input" />);
      const input = screen.getByRole('textbox', { name: 'Search input' });

      expect(input).toBeInTheDocument();
    });

    it('should support aria-describedby', () => {
      render(<Input aria-describedby="input-error" />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('aria-describedby', 'input-error');
    });

    it('should support maxLength attribute', () => {
      render(<Input maxLength={10} />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('maxLength', '10');
    });

    it('should support pattern attribute', () => {
      render(<Input pattern="[0-9]*" />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('pattern', '[0-9]*');
    });

    it('should support autoComplete attribute', () => {
      render(<Input autoComplete="email" />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('autoComplete', 'email');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should allow ref to access input methods', () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Input ref={ref} />);

      expect(ref.current?.focus).toBeDefined();
      expect(ref.current?.blur).toBeDefined();
      expect(ref.current?.select).toBeDefined();
    });

    it('should allow programmatic focus via ref', () => {
      const ref = React.createRef<HTMLInputElement>();

      render(<Input ref={ref} />);

      ref.current?.focus();

      expect(ref.current).toHaveFocus();
    });
  });

  describe('Display Name', () => {
    it('should have correct displayName', () => {
      expect(Input.displayName).toBe('Input');
    });
  });

  describe('Placeholder Styling', () => {
    it('should have placeholder styling classes', () => {
      render(<Input placeholder="Placeholder text" />);
      const input = screen.getByPlaceholderText('Placeholder text');

      expect(input).toHaveClass('placeholder:text-muted-foreground');
    });
  });

  describe('File Input', () => {
    it('should render file input with correct classes', () => {
      render(<Input type="file" data-testid="file-input" />);
      const input = screen.getByTestId('file-input');

      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveClass('file:border-0', 'file:bg-transparent');
    });
  });
});
