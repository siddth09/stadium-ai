/**
 * @fileoverview Application-wide constants.
 * Centralizes all magic values for maintainability.
 */

/** Rate limiter configuration for AI API calls. */
export const RATE_LIMIT = {
  /** Maximum tokens in the bucket. */
  MAX_TOKENS: 10,
  /** Tokens refilled per second. */
  REFILL_RATE: 1,
  /** Tokens consumed per AI request. */
  COST_PER_REQUEST: 1,
} as const;

/** Input validation constraints. */
export const VALIDATION = {
  /** Maximum chat message length in characters. */
  MAX_MESSAGE_LENGTH: 500,
  /** Minimum chat message length. */
  MIN_MESSAGE_LENGTH: 1,
  /** Maximum search query length. */
  MAX_SEARCH_LENGTH: 200,
} as const;

/** Debounce delays in milliseconds. */
export const DEBOUNCE = {
  /** Delay for AI query submission. */
  AI_QUERY: 300,
  /** Delay for search input. */
  SEARCH: 250,
} as const;

/** FIFA World Cup 2026 venue data. */
export const VENUES = [
  'MetLife Stadium, New Jersey',
  'AT&T Stadium, Dallas',
  'Hard Rock Stadium, Miami',
  'SoFi Stadium, Los Angeles',
  'Lumen Field, Seattle',
  'Estadio Azteca, Mexico City',
  'Estadio BBVA, Monterrey',
  'Estadio Akron, Guadalajara',
  'BMO Field, Toronto',
  'BC Place, Vancouver',
] as const;

/** Accessibility related constants. */
export const A11Y = {
  /** Minimum color contrast ratio (WCAG AA). */
  MIN_CONTRAST_RATIO: 4.5,
  /** Focus visible outline width in pixels. */
  FOCUS_OUTLINE_WIDTH: 3,
  /** Reduced motion media query. */
  REDUCED_MOTION_QUERY: '(prefers-reduced-motion: reduce)',
} as const;

/** Application metadata. */
export const APP_META = {
  NAME: 'StadiumAI',
  VERSION: '1.0.0',
  DESCRIPTION: 'GenAI-powered Smart Stadium Operations for FIFA World Cup 2026',
} as const;
