/**
 * AI Chatbot for Backup Management
 * Natural language interface for backup operations
 */

import OpenAI from 'openai';
import { logger } from '@/lib/logger';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  message: string;
  suggestedActions?: Array<{
    label: string;
    action: string;
    params?: Record<string, any>;
  }>;
  intent?: string;
}

/**
 * Process chat message and generate response
 */
export async function processChatMessage(
  message: string,
  conversationHistory: ChatMessage[],
  systemContext: {
    backupCount: number;
    lastBackup?: string;
    systemStatus: any;
  }
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are a helpful AI assistant for a backup management system.

Current System Context:
- Total backups: ${systemContext.backupCount}
- Last backup: ${systemContext.lastBackup || 'Never'}
- Database status: ${systemContext.systemStatus?.database?.connected ? 'Connected' : 'Disconnected'}

You can help users with:
1. Creating backups (suggest: "create backup")
2. Restoring from backups (suggest: "restore from [backup name]")
3. Checking system status
4. Understanding backup health
5. Troubleshooting issues
6. Best practices

Be concise, helpful, and proactive. Suggest actions when appropriate.
Always respond in JSON format:
{
  "message": "your response",
  "suggestedActions": [
    {"label": "Create Backup", "action": "create_backup", "params": {"type": "full"}},
    {"label": "View Status", "action": "view_status"}
  ],
  "intent": "create_backup|restore|status|help|other"
}`;

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');

    logger.info('Chat message processed', {
      intent: response.intent,
      hasActions: !!response.suggestedActions,
    });

    return response;
  } catch (error) {
    logger.error('Chat processing failed', error as any);
    return {
      message: "I'm having trouble processing that request. Please try rephrasing or use the dashboard buttons.",
      intent: 'error',
    };
  }
}

/**
 * Extract intent from user message (lightweight)
 */
export function extractIntent(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('create') || msg.includes('backup') || msg.includes('new backup')) {
    return 'create_backup';
  }

  if (msg.includes('restore') || msg.includes('recover')) {
    return 'restore';
  }

  if (msg.includes('status') || msg.includes('health') || msg.includes('how is')) {
    return 'status';
  }

  if (msg.includes('list') || msg.includes('show') || msg.includes('view')) {
    return 'list_backups';
  }

  if (msg.includes('delete') || msg.includes('remove')) {
    return 'delete_backup';
  }

  if (msg.includes('help') || msg.includes('what can')) {
    return 'help';
  }

  return 'other';
}

/**
 * Generate quick reply suggestions
 */
export function generateQuickReplies(
  systemContext: any
): Array<{ label: string; message: string }> {
  const replies = [
    { label: '📦 Create backup', message: 'Create a new backup' },
    { label: '📊 System status', message: 'What is the system status?' },
    { label: '📋 List backups', message: 'Show me all backups' },
  ];

  if (systemContext.backupCount > 0) {
    replies.push({
      label: '🔄 Latest backup',
      message: 'Tell me about the latest backup',
    });
  }

  if (!systemContext.systemStatus?.database?.connected) {
    replies.push({
      label: '🚨 Database issue',
      message: 'Why is the database disconnected?',
    });
  }

  return replies;
}

/**
 * Explain technical error in simple terms
 */
export async function explainError(
  error: string,
  context?: string
): Promise<string> {
  try {
    const prompt = `Explain this technical error to a non-technical user in simple terms:

Error: ${error}
${context ? `Context: ${context}` : ''}

Provide:
1. What happened (1 sentence)
2. Why it might have happened (1 sentence)
3. What to do next (1 sentence)

Be reassuring but honest.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful technical support assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0].message.content || error;
  } catch (err) {
    return `An error occurred: ${error}. Please check the system status and try again.`;
  }
}
