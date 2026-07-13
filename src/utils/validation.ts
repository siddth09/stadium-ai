/**
 * @fileoverview Input validation utilities using Zod schemas.
 * Validates all user inputs before processing.
 */

import { z } from 'zod';
import { VALIDATION } from '@/config/constants';
import { Language, UserRole } from '@/types';

/** Schema for chat message input. */
export const chatMessageSchema = z.object({
  content: z
    .string()
    .min(VALIDATION.MIN_MESSAGE_LENGTH, 'Message cannot be empty')
    .max(VALIDATION.MAX_MESSAGE_LENGTH, `Message must be under ${VALIDATION.MAX_MESSAGE_LENGTH} characters`)
    .trim(),
  language: z.nativeEnum(Language).optional().default(Language.English),
});

/** Schema for search queries. */
export const searchQuerySchema = z.object({
  query: z
    .string()
    .max(VALIDATION.MAX_SEARCH_LENGTH, `Search must be under ${VALIDATION.MAX_SEARCH_LENGTH} characters`)
    .trim(),
});

/** Schema for user role selection. */
export const userRoleSchema = z.nativeEnum(UserRole);

/** Schema for emergency report submission. */
export const emergencyReportSchema = z.object({
  type: z.enum(['medical', 'security', 'weather', 'evacuation', 'fire']),
  message: z
    .string()
    .min(5, 'Please provide more detail')
    .max(500, 'Message too long')
    .trim(),
  zone: z.string().min(1, 'Zone is required'),
});

/** Schema for volunteer task update. */
export const taskUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['pending', 'in-progress', 'completed']),
});

/**
 * Validates input against a Zod schema.
 * @param schema - The Zod schema to validate against.
 * @param data - The data to validate.
 * @returns A result object with either the validated data or error messages.
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map((e: { message: string }) => e.message),
  };
}
