/**
 * @fileoverview Security configuration and Content Security Policy.
 * Defines trusted origins, CSP directives, and security headers.
 */

/** Trusted origins for API calls and resource loading. */
export const TRUSTED_ORIGINS = [
  'https://generativelanguage.googleapis.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
] as const;

/**
 * Content Security Policy directives.
 * Applied via <meta> tag in index.html.
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://generativelanguage.googleapis.com'],
  'img-src': ["'self'", 'data:', 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
} as const;

/**
 * Generates a CSP meta tag content string from directives.
 * @returns Formatted CSP string.
 */
export function buildCSPString(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/**
 * Validates that a URL belongs to a trusted origin.
 * @param url - The URL to validate.
 * @returns True if the URL origin is trusted.
 */
export function isTrustedOrigin(url: string): boolean {
  try {
    const parsed = new URL(url);
    return TRUSTED_ORIGINS.some((origin) => parsed.origin === new URL(origin).origin);
  } catch {
    return false;
  }
}
