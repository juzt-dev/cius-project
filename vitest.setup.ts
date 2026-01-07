/**
 * Vitest Setup File
 * Global test configuration and setup
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Auto-cleanup after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});

// Mock environment variables for testing
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
