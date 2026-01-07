import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, formatDate, slugify, truncate, debounce, throttle, fetcher } from './utils';

describe('cn (classNames utility)', () => {
  it('should combine multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('should return empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate', () => {
  it('should format a Date object correctly', () => {
    const date = new Date('2025-11-05');
    expect(formatDate(date)).toBe('November 5, 2025');
  });

  it('should format a date string correctly', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
  });

  it('should return "Invalid date" for invalid date', () => {
    expect(formatDate('invalid')).toBe('Invalid date');
  });
});

describe('slugify', () => {
  it('should convert text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('should handle empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('should handle null/undefined gracefully', () => {
    expect(slugify(null as unknown as string)).toBe('');
    expect(slugify(undefined as unknown as string)).toBe('');
  });
});

describe('truncate', () => {
  it('should truncate text longer than specified length', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('should not truncate text shorter than specified length', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('should handle exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('should handle negative length', () => {
    expect(truncate('Hello', -1)).toBe('');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toBeCalled();

    vi.advanceTimersByTime(100);

    expect(fn).toBeCalledTimes(1);
  });

  it('should pass arguments to debounced function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2');

    vi.advanceTimersByTime(100);

    expect(fn).toBeCalledWith('arg1', 'arg2');
  });

  it('should throw error for negative wait time', () => {
    const fn = vi.fn();
    expect(() => debounce(fn, -1)).toThrow('Wait time must be non-negative');
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throttle function calls', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(fn).toBeCalledTimes(1);

    vi.advanceTimersByTime(100);

    throttled();

    expect(fn).toBeCalledTimes(2);
  });

  it('should throw error for negative limit', () => {
    const fn = vi.fn();
    expect(() => throttle(fn, -1)).toThrow('Limit must be non-negative');
  });
});

describe('fetcher', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should fetch and return JSON data', async () => {
    const mockData = { message: 'success' };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const result = await fetcher<typeof mockData>('https://api.example.com/data');

    expect(result).toEqual(mockData);
  });

  it('should throw error for non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);

    await expect(fetcher('https://api.example.com/data')).rejects.toThrow(
      'Fetch failed: HTTP error! status: 404 - Not Found'
    );
  });

  it('should throw error for network failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetcher('https://api.example.com/data')).rejects.toThrow(
      'Fetch failed: Network error'
    );
  });
});
