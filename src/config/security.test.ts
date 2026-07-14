/**
 * @fileoverview Tests for the security module — validates CSP
 * string generation and trusted origin checks.
 */

import { describe, it, expect } from 'vitest';
import { buildCSPString, isTrustedOrigin, TRUSTED_ORIGINS } from './security';

describe('security', () => {
  describe('isTrustedOrigin', () => {
    it('returns true for trusted Gemini API origin', () => {
      expect(isTrustedOrigin('https://generativelanguage.googleapis.com/v1/models')).toBe(true);
    });

    it('returns true for Google Fonts origin', () => {
      expect(isTrustedOrigin('https://fonts.googleapis.com/css2')).toBe(true);
    });

    it('returns true for Google Fonts static origin', () => {
      expect(isTrustedOrigin('https://fonts.gstatic.com/s/inter/v18')).toBe(true);
    });

    it('returns false for untrusted origin', () => {
      expect(isTrustedOrigin('https://evil.example.com/malware')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isTrustedOrigin('')).toBe(false);
    });

    it('returns false for malformed URL', () => {
      expect(isTrustedOrigin('not-a-url')).toBe(false);
    });

    it('returns false for similar but different origin', () => {
      expect(isTrustedOrigin('https://generativelanguage.googleapis.com.evil.com')).toBe(false);
    });
  });

  describe('buildCSPString', () => {
    it('returns a non-empty CSP string', () => {
      const csp = buildCSPString();
      expect(csp.length).toBeGreaterThan(0);
    });

    it('includes all required CSP directives', () => {
      const csp = buildCSPString();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain('connect-src');
      expect(csp).toContain('generativelanguage.googleapis.com');
    });
  });

  describe('TRUSTED_ORIGINS', () => {
    it('contains exactly the expected trusted origins', () => {
      expect(TRUSTED_ORIGINS).toHaveLength(3);
      expect(TRUSTED_ORIGINS).toContain('https://generativelanguage.googleapis.com');
      expect(TRUSTED_ORIGINS).toContain('https://fonts.googleapis.com');
      expect(TRUSTED_ORIGINS).toContain('https://fonts.gstatic.com');
    });
  });
});
