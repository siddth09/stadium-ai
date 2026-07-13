/**
 * @fileoverview Input sanitization utilities using DOMPurify.
 * Prevents XSS attacks by sanitizing all user-provided input
 * before rendering or sending to external APIs.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes a string by removing all HTML tags and potentially dangerous content.
 * @param input - The raw user input string.
 * @returns A sanitized plain-text string safe for rendering and API transmission.
 * @example
 * sanitizeInput('<script>alert("xss")</script>Hello') // → 'Hello'
 * sanitizeInput('Normal text') // → 'Normal text'
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  return String(DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [], KEEP_CONTENT: true }));
}

/**
 * Sanitizes a string while preserving limited safe HTML formatting.
 * Allows only basic inline formatting (bold, italic, links).
 * @param input - The raw HTML string.
 * @returns A sanitized HTML string with only safe tags.
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  return String(DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  }));
}

/**
 * Escapes HTML entities in a string for safe text rendering.
 * Use this when you need to display raw user input as text, not HTML.
 * @param input - The raw input string.
 * @returns A string with HTML entities escaped.
 */
export function escapeHTML(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return input.replace(/[&<>"']/g, (char) => map[char] ?? char);
}
