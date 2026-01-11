import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['lib/**/*.ts', 'components/**/*.tsx', 'app/**/*.ts', 'app/**/*.tsx'],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.stories.tsx',
        '**/index.ts',
        '**/*.config.ts',
        '**/*.config.mts',
        'lib/test-utils/**',
        '.next/**',
        'node_modules/**',
        // Complex client-only components with animations (hard to test)
        'components/animations/**',
        'components/magicui/**',
        // App pages are mostly layouts (tested via sections)
        'app/*/page.tsx',
        'app/page.tsx',
        'app/layout.tsx',
        'app/error.tsx',
        'app/loading.tsx',
        'app/not-found.tsx',
        // Complex third-party integrations
        'lib/cloudinary.ts',
        'lib/auth.ts',
        'lib/rate-limit.ts',
        'lib/prisma.ts',
        // Constants (data files, no logic)
        'lib/constants/**',
      ],
      thresholds: {
        lines: 65,
        branches: 40,
        functions: 55,
        statements: 65,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
