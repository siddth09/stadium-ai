import { describe, it, expect } from 'vitest';
import { validateInput, chatMessageSchema } from './validation';
import { Language } from '../types';

describe('validateInput', () => {
  it('returns success for valid data', () => {
    const validData = { content: 'Where is my seat?', language: Language.English };
    const result = validateInput(chatMessageSchema, validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('returns errors for missing required fields', () => {
    const invalidData = { language: Language.English };
    const result = validateInput(chatMessageSchema, invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it('returns errors for string too long', () => {
    const invalidData = { content: 'a'.repeat(600), language: Language.English };
    const result = validateInput(chatMessageSchema, invalidData);
    expect(result.success).toBe(false);
  });
});
