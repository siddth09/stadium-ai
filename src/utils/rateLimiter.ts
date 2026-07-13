/**
 * @fileoverview Token-bucket rate limiter for AI API calls.
 * Prevents excessive API usage and protects against abuse.
 */

import { RATE_LIMIT } from '@/config/constants';

/**
 * A token-bucket rate limiter.
 * Tokens are consumed on each request and refilled over time.
 */
export class RateLimiter {
  private tokens: number;
  private readonly maxTokens: number;
  private readonly refillRate: number;
  private lastRefill: number;

  /**
   * Creates a new RateLimiter instance.
   * @param maxTokens - Maximum tokens in the bucket.
   * @param refillRate - Tokens added per second.
   */
  constructor(
    maxTokens: number = RATE_LIMIT.MAX_TOKENS,
    refillRate: number = RATE_LIMIT.REFILL_RATE,
  ) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  /** Refills tokens based on elapsed time since last refill. */
  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  /**
   * Attempts to consume a token. Returns true if the request is allowed.
   * @param cost - Number of tokens to consume (default: 1).
   * @returns Whether the request is permitted.
   */
  tryConsume(cost: number = RATE_LIMIT.COST_PER_REQUEST): boolean {
    this.refill();
    if (this.tokens >= cost) {
      this.tokens -= cost;
      return true;
    }
    return false;
  }

  /**
   * Returns the number of tokens currently available.
   * @returns Available token count.
   */
  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }

  /**
   * Calculates time in milliseconds until a token becomes available.
   * @returns Wait time in ms, or 0 if tokens are available.
   */
  getWaitTime(): number {
    this.refill();
    if (this.tokens >= RATE_LIMIT.COST_PER_REQUEST) {
      return 0;
    }
    const deficit = RATE_LIMIT.COST_PER_REQUEST - this.tokens;
    return Math.ceil((deficit / this.refillRate) * 1000);
  }

  /** Resets the rate limiter to full capacity. */
  reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }
}

/** Singleton rate limiter instance for AI API calls. */
export const aiRateLimiter = new RateLimiter();
