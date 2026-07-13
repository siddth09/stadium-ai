import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from './rateLimiter';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter(2, 1000); // 2 requests per 1000ms
    vi.useFakeTimers();
  });

  it('allows requests within limit', () => {
    expect(limiter.tryConsume(1)).toBe(true);
    expect(limiter.tryConsume(1)).toBe(true);
  });

  it('blocks requests exceeding limit', () => {
    limiter.tryConsume(1);
    limiter.tryConsume(1);
    expect(limiter.tryConsume(1)).toBe(false);
  });

  it('resets limit after time window', () => {
    limiter.tryConsume(1);
    limiter.tryConsume(1);
    expect(limiter.tryConsume(1)).toBe(false);

    vi.advanceTimersByTime(1001);
    expect(limiter.tryConsume(1)).toBe(true);
  });
});
