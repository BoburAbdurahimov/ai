/**
 * API Endpoint Validation Schemas
 * 
 * Complete Zod schemas for all API endpoints
 * Addresses gaps: Call management, AI config, knowledge base, phone numbers, analytics
 */

import { z } from 'zod';

// ============================================
// SHARED VALIDATORS
// ============================================

/**
 * E.164 Phone Number Format
 * International format: +[country code][number]
 * Examples: +998901234567, +12025551234
 */
export const phoneNumberSchema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g., +998901234567)')
  .min(8, 'Phone number is too short')
  .max(16, 'Phone number is too long');

/**
 * ISO 8601 Date String
 */
export const dateStringSchema = z
  .string()
  .datetime({ message: 'Invalid date format. Use ISO 8601 (e.g., 2024-12-22T10:30:00Z)' });

/**
 * CUID (Collision-resistant Unique ID)
 */
export const cuidSchema = z
  .string()
  .cuid('Invalid ID format');

/**
 * Pagination parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * Date range parameters
 */
export const dateRangeSchema = z.object({
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.startDate) <= new Date(data.endDate);
  },
  {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  }
).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 90;
  },
  {
    message: 'Date range cannot exceed 90 days',
    path: ['endDate'],
  }
);

export type DateRangeInput = z.infer<typeof dateRangeSchema>;

// ============================================
// CALL MANAGEMENT SCHEMAS
// ============================================

/**
 * GET /calls
 * List calls with filtering and pagination
 */
export const listCallsSchema = z.object({
  ...paginationSchema.shape,
  ...dateRangeSchema.shape,
  language: z.enum(['RU', 'UZ', 'EN']).optional(),
  handledBy: z.enum(['AI', 'HUMAN', 'HYBRID']).optional(),
  outcome: z.enum(['INFO', 'BOOKING', 'TRANSFER', 'MISSED', 'VOICEMAIL']).optional(),
  search: z.string().min(3, 'Search query must be at least 3 characters').max(50).optional(),
  phoneNumberId: cuidSchema.optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
});

export type ListCallsInput = z.infer<typeof listCallsSchema>;

/**
 * GET /calls/:id
 * Get call details (validation for URL param)
 */
export const getCallSchema = z.object({
  id: cuidSchema,
});

export type GetCallInput = z.infer<typeof getCallSchema>;

/**
 * POST /calls/:id/notes
 * Add note to call
 */
export const addCallNoteSchema = z.object({
  callId: cuidSchema,
  content: z.string().min(1, 'Note content is required').max(5000, 'Note must not exceed 5000 characters'),
  isInternal: z.boolean().optional().default(false),
});

export type AddCallNoteInput = z.infer<typeof addCallNoteSchema>;

/**
 * POST /calls/:id/tags
 * Add tags to call
 */
export const addCallTagsSchema = z.object({
  callId: cuidSchema,
  tags: z.array(
    z.string().min(1).max(50, 'Tag must not exceed 50 characters')
  ).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
});

export type AddCallTagsInput = z.infer<typeof addCallTagsSchema>;

/**
 * DELETE /calls/:id/tags/:tagId
 * Remove tag from call
 */
export const removeCallTagSchema = z.object({
  callId: cuidSchema,
  tagId: cuidSchema,
});

export type RemoveCallTagInput = z.infer<typeof removeCallTagSchema>;

/**
 * PATCH /calls/:id
 * Update call (rating, outcome)
 */
export const updateCallSchema = z.object({
  callId: cuidSchema,
  outcome: z.enum(['INFO', 'BOOKING', 'TRANSFER', 'MISSED', 'VOICEMAIL']).optional(),
  outcomeDetails: z.string().max(1000).optional(),
  callQuality: z.number().int().min(1).max(5).optional(),
  customerFeedback: z.string().max(1000).optional(),
});

export type UpdateCallInput = z.infer<typeof updateCallSchema>;

// ============================================
// AI CONFIGURATION SCHEMAS
// ============================================

/**
 * PATCH /ai/config
 * Update AI assistant configuration
 */
export const updateAIConfigSchema = z.object({
  assistantName: z.string().min(2).max(50).optional(),
  tone: z.enum(['professional', 'friendly', 'formal', 'casual']).optional(),
  speakingStyle: z.enum(['balanced', 'fast', 'slow', 'expressive']).optional(),
  greetingMessage: z.string().min(10).max(500).optional(),
  closingMessage: z.string().min(10).max(500).optional(),
  transferRules: z.object({
    enabled: z.boolean(),
    confidenceThreshold: z.number().min(0).max(100).default(70),
    durationThreshold: z.number().int().min(0).max(600).default(120), // seconds
    keywords: z.array(z.string()).max(50).optional(),
    timeBasedRules: z.object({
      enabled: z.boolean(),
      businessHours: z.object({
        monday: z.object({ open: z.string(), close: z.string() }).optional(),
        tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
        wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
        thursday: z.object({ open: z.string(), close: z.string() }).optional(),
        friday: z.object({ open: z.string(), close: z.string() }).optional(),
        saturday: z.object({ open: z.string(), close: z.string() }).optional(),
        sunday: z.object({ open: z.string(), close: z.string() }).optional(),
      }).optional(),
    }).optional(),
  }).optional(),
  transferDestination: phoneNumberSchema.optional(),
  safetyRules: z.object({
    forbiddenTopics: z.array(z.string()).max(50).optional(),
    requiredDisclaimers: z.array(z.string()).max(20).optional(),
    profanityFilter: z.boolean().default(true),
  }).optional(),
  enableSentiment: z.boolean().optional(),
  enableIntent: z.boolean().optional(),
});

export type UpdateAIConfigInput = z.infer<typeof updateAIConfigSchema>;

/**
 * POST /ai/test
 * Test AI assistant with sample input
 */
export const testAISchema = z.object({
  message: z.string().min(1).max(500),
  language: z.enum(['ru', 'uz', 'en']).default('ru'),
  useCurrentConfig: z.boolean().default(true),
});

export type TestAIInput = z.infer<typeof testAISchema>;

// ============================================
// KNOWLEDGE BASE SCHEMAS
// ============================================

/**
 * GET /knowledge
 * List knowledge items
 */
export const listKnowledgeSchema = z.object({
  ...paginationSchema.shape,
  category: z.string().max(50).optional(),
  search: z.string().min(3).max(100).optional(),
  isActive: z.coerce.boolean().optional(),
  isPriority: z.coerce.boolean().optional(),
});

export type ListKnowledgeInput = z.infer<typeof listKnowledgeSchema>;

/**
 * POST /knowledge
 * Create knowledge item
 */
export const createKnowledgeSchema = z.object({
  category: z.string().min(1).max(50),
  question: z.string().min(10, 'Question must be at least 10 characters').max(500),
  answer: z.string().min(10, 'Answer must be at least 10 characters').max(5000),
  questionVariations: z.array(z.string().min(10).max(500)).max(10).optional(),
  isPriority: z.boolean().default(false),
  requiresFollowup: z.boolean().default(false),
});

export type CreateKnowledgeInput = z.infer<typeof createKnowledgeSchema>;

/**
 * PATCH /knowledge/:id
 * Update knowledge item
 */
export const updateKnowledgeSchema = z.object({
  id: cuidSchema,
  category: z.string().min(1).max(50).optional(),
  question: z.string().min(10).max(500).optional(),
  answer: z.string().min(10).max(5000).optional(),
  questionVariations: z.array(z.string().min(10).max(500)).max(10).optional(),
  isPriority: z.boolean().optional(),
  requiresFollowup: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateKnowledgeInput = z.infer<typeof updateKnowledgeSchema>;

/**
 * DELETE /knowledge/:id
 * Delete knowledge item (soft delete)
 */
export const deleteKnowledgeSchema = z.object({
  id: cuidSchema,
  reason: z.string().max(500).optional(),
});

export type DeleteKnowledgeInput = z.infer<typeof deleteKnowledgeSchema>;

/**
 * POST /knowledge/bulk-import
 * Bulk import knowledge items
 */
export const bulkImportKnowledgeSchema = z.object({
  items: z.array(createKnowledgeSchema).min(1).max(100, 'Maximum 100 items per bulk import'),
  overwriteExisting: z.boolean().default(false),
});

export type BulkImportKnowledgeInput = z.infer<typeof bulkImportKnowledgeSchema>;

// ============================================
// PHONE NUMBER SCHEMAS
// ============================================

/**
 * GET /phone-numbers
 * List phone numbers
 */
export const listPhoneNumbersSchema = z.object({
  ...paginationSchema.shape,
  isActive: z.coerce.boolean().optional(),
  country: z.string().length(2).optional(), // ISO 3166-1 alpha-2
});

export type ListPhoneNumbersInput = z.infer<typeof listPhoneNumbersSchema>;

/**
 * POST /phone-numbers
 * Add phone number to organization
 */
export const addPhoneNumberSchema = z.object({
  number: phoneNumberSchema,
  displayName: z.string().max(50).optional(),
  country: z.string().length(2).default('UZ'), // ISO 3166-1 alpha-2
  provider: z.enum(['vapi', 'twilio']).default('vapi'),
  forwardingNumber: phoneNumberSchema.optional(),
  businessHours: z.object({
    monday: z.object({ open: z.string(), close: z.string() }).optional(),
    tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
    wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
    thursday: z.object({ open: z.string(), close: z.string() }).optional(),
    friday: z.object({ open: z.string(), close: z.string() }).optional(),
    saturday: z.object({ open: z.string(), close: z.string() }).optional(),
    sunday: z.object({ open: z.string(), close: z.string() }).optional(),
  }).optional(),
  afterHoursAction: z.enum(['voicemail', 'forward', 'message']).default('voicemail'),
});

export type AddPhoneNumberInput = z.infer<typeof addPhoneNumberSchema>;

/**
 * PATCH /phone-numbers/:id
 * Update phone number configuration
 */
export const updatePhoneNumberSchema = z.object({
  id: cuidSchema,
  displayName: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
  forwardingNumber: phoneNumberSchema.optional(),
  businessHours: z.object({
    monday: z.object({ open: z.string(), close: z.string() }).optional(),
    tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
    wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
    thursday: z.object({ open: z.string(), close: z.string() }).optional(),
    friday: z.object({ open: z.string(), close: z.string() }).optional(),
    saturday: z.object({ open: z.string(), close: z.string() }).optional(),
    sunday: z.object({ open: z.string(), close: z.string() }).optional(),
  }).optional(),
  afterHoursAction: z.enum(['voicemail', 'forward', 'message']).optional(),
});

export type UpdatePhoneNumberInput = z.infer<typeof updatePhoneNumberSchema>;

/**
 * DELETE /phone-numbers/:id
 * Remove phone number
 */
export const deletePhoneNumberSchema = z.object({
  id: cuidSchema,
  reason: z.string().max(500).optional(),
});

export type DeletePhoneNumberInput = z.infer<typeof deletePhoneNumberSchema>;

// ============================================
// ANALYTICS SCHEMAS
// ============================================

/**
 * GET /analytics/overview
 * Get analytics overview
 */
export const analyticsOverviewSchema = z.object({
  ...dateRangeSchema.shape,
  compareWith: z.enum(['previous_period', 'previous_month', 'previous_year']).optional(),
});

export type AnalyticsOverviewInput = z.infer<typeof analyticsOverviewSchema>;

/**
 * GET /analytics/calls
 * Get call analytics with grouping
 */
export const analyticsCallsSchema = z.object({
  ...dateRangeSchema.shape,
  groupBy: z.enum(['hour', 'day', 'week', 'month']).default('day'),
  metrics: z.array(z.enum([
    'total_calls',
    'avg_duration',
    'ai_handled',
    'transferred',
    'sentiment',
    'outcomes'
  ])).optional(),
});

export type AnalyticsCallsInput = z.infer<typeof analyticsCallsSchema>;

/**
 * GET /analytics/ai-performance
 * Get AI performance metrics
 */
export const analyticsAIPerformanceSchema = z.object({
  ...dateRangeSchema.shape,
  groupBy: z.enum(['hour', 'day', 'week', 'month']).default('day'),
});

export type AnalyticsAIPerformanceInput = z.infer<typeof analyticsAIPerformanceSchema>;

/**
 * POST /analytics/export
 * Export analytics data
 */
export const exportAnalyticsSchema = z.object({
  ...dateRangeSchema.shape,
  format: z.enum(['csv', 'json', 'xlsx']).default('csv'),
  metrics: z.array(z.string()).optional(),
  email: z.string().email().optional(), // Send to email instead of download
});

export type ExportAnalyticsInput = z.infer<typeof exportAnalyticsSchema>;

// ============================================
// INTEGRATION SCHEMAS
// ============================================

/**
 * POST /integrations
 * Create integration
 */
export const createIntegrationSchema = z.object({
  type: z.enum(['webhook', 'zapier', 'make', 'custom']),
  name: z.string().min(1).max(100),
  url: z.string().url('Invalid webhook URL').optional(),
  events: z.array(z.enum([
    'call.started',
    'call.ended',
    'call.transferred',
    'call.transcription_ready',
    'call.analysis_ready'
  ])).min(1, 'At least one event is required'),
  headers: z.record(z.string()).optional(),
  secret: z.string().min(16, 'Secret must be at least 16 characters').optional(),
  isActive: z.boolean().default(true),
});

export type CreateIntegrationInput = z.infer<typeof createIntegrationSchema>;

/**
 * PATCH /integrations/:id
 * Update integration
 */
export const updateIntegrationSchema = z.object({
  id: cuidSchema,
  name: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  events: z.array(z.enum([
    'call.started',
    'call.ended',
    'call.transferred',
    'call.transcription_ready',
    'call.analysis_ready'
  ])).optional(),
  headers: z.record(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateIntegrationInput = z.infer<typeof updateIntegrationSchema>;

