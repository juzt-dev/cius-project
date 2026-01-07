/**
 * Test Utilities
 * Centralized testing utilities and custom render function
 */

// Re-export @testing-library/react
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Import for custom render
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * Custom render function with providers
 * Currently returns standard render, but can be extended with ThemeProvider, etc.
 *
 * @param ui - React component to render
 * @param options - Render options
 * @returns Render result
 *
 * @example
 * ```tsx
 * import { renderWithProviders, screen } from '@/lib/test-utils';
 * import { MyComponent } from './MyComponent';
 *
 * renderWithProviders(<MyComponent />);
 * expect(screen.getByText('Hello')).toBeInTheDocument();
 * ```
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  // Future: Wrap with ThemeProvider, QueryClientProvider, etc.
  // const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  //   return <ThemeProvider>{children}</ThemeProvider>;
  // };
  //
  // return render(ui, { wrapper: AllTheProviders, ...options });

  return render(ui, options);
}
