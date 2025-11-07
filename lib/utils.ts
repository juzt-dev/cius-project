import { type ClassValue, clsx } from 'clsx';

/**
 * Combines class names using clsx
 * @param inputs - Class values to combine
 * @returns Combined class string
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Formats a date to a readable string
 * @param date - Date object or string to format
 * @returns Formatted date string (e.g., "November 5, 2025")
 */
export function formatDate(date: Date | string): string {
  try {
  const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      throw new Error('Invalid date');
    }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Converts a string to a URL-friendly slug
 * @param text - Text to slugify
 * @returns URL-friendly slug string
 */
export function slugify(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

/**
 * Truncates text to a specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, length: number): string {
  if (typeof text !== 'string' || length < 0) {
    return '';
  }
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Creates a debounced version of a function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  if (wait < 0) {
    throw new Error('Wait time must be non-negative');
  }

  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
    clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

/**
 * Creates a throttled version of a function
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  if (limit < 0) {
    throw new Error('Limit must be non-negative');
  }

  let inThrottle = false;
  let lastResult: ReturnType<T>;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      lastResult = func(...args) as ReturnType<T>;
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}

/**
 * Type-safe fetch wrapper with error handling
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns Parsed JSON response
 * @throws Error if fetch fails or response is not ok
 */
export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  try {
  const response = await fetch(url, options);

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
  }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch failed: ${error.message}`);
    }
    throw new Error('Unknown fetch error occurred');
  }
}
