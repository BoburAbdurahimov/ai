import { z } from 'zod';

export const clientUploadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+\d{8,15}$/, 'E.164 phone required'),
  language: z.enum(['RU', 'UZ']),
  notes: z.string().max(500).optional().or(z.literal('')).transform((v) => v || undefined),
});

export const coldCallUploadSchema = z.object({
  phone: z.string().regex(/^\+\d{8,15}$/, 'E.164 phone required'),
  name: z.string().min(2).max(100).optional(),
  preferred_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  tags: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(',').map((t) => t.trim()).filter(Boolean) : []))
    .refine((tags) => !tags || (Array.isArray(tags) && tags.length <= 5 && tags.every((t) => t.length <= 20)), {
      message: 'Up to 5 tags, each ≤20 chars',
    }),
});

