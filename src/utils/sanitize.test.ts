import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeHTML, escapeHTML } from './sanitize';

describe('sanitizeInput', () => {
  it('removes all HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('Hello');
    expect(sanitizeInput('<b>Bold</b> text')).toBe('Bold text');
  });

  it('handles non-strings safely', () => {
    // @ts-expect-error Testing invalid input
    expect(sanitizeInput(null)).toBe('');
    // @ts-expect-error Testing invalid input
    expect(sanitizeInput(123)).toBe('');
  });
});

describe('sanitizeHTML', () => {
  it('preserves allowed tags', () => {
    expect(sanitizeHTML('<b>Bold</b> text')).toBe('<b>Bold</b> text');
  });

  it('removes disallowed tags and attributes', () => {
    expect(sanitizeHTML('<a href="javascript:alert(1)">Click</a>')).toBe('Click');
    expect(sanitizeHTML('<script>alert("xss")</script>')).toBe('');
  });
});

describe('escapeHTML', () => {
  it('escapes special characters', () => {
    expect(escapeHTML('<script>')).toBe('&lt;script&gt;');
    expect(escapeHTML('Tom & Jerry')).toBe('Tom &amp; Jerry');
    expect(escapeHTML('"Quotes"')).toBe('&quot;Quotes&quot;');
  });
});
