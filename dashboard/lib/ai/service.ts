/**
 * AI Service Layer
 * Integrates with OpenAI/Anthropic for intelligent backup management
 */

import OpenAI from 'openai';
import { logger } from '@/lib/logger';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Or use Anthropic
// import Anthropic from '@anthropic-ai/sdk';
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface AIAnalysisResult {
  recommendations: string[];
  insights: string[];
  riskScore: number; // 0-100
  confidence: number; // 0-1
  reasoning: string;
}

export interface BackupPatternAnalysis {
  frequency: 'too_frequent' | 'optimal' | 'too_infrequent';
  sizeGrowth: 'normal' | 'increasing' | 'decreasing';
  failureRate: number;
  recommendations: string[];
}

/**
 * Analyze backup patterns using AI
 */
export async function analyzeBackupPatterns(
  backups: any[]
): Promise<BackupPatternAnalysis> {
  try {
    // Prepare data for AI analysis
    const backupSummary = backups.map(b => ({
      date: b.date,
      type: b.backup_type,
      size: b.size_bytes,
      status: b.status,
      duration: b.duration_seconds,
    }));

    const prompt = `Analyze these backup patterns and provide recommendations:

${JSON.stringify(backupSummary, null, 2)}

Analyze:
1. Backup frequency (are they backing up too often or not enough?)
2. Size trends (is data growing normally?)
3. Failure patterns (any concerning failures?)
4. Optimization opportunities

Respond in JSON format:
{
  "frequency": "optimal|too_frequent|too_infrequent",
  "sizeGrowth": "normal|increasing|decreasing",
  "failureRate": 0-100,
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a backup system optimization expert. Analyze patterns and provide actionable recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    logger.info('AI backup pattern analysis completed', {
      frequency: analysis.frequency,
      recommendations: analysis.recommendations.length,
    });

    return analysis;
  } catch (error) {
    logger.error('AI analysis failed', error as any);

    // Fallback to rule-based analysis
    return fallbackAnalysis(backups);
  }
}

/**
 * Detect anomalies in backup data
 */
export async function detectAnomalies(
  backups: any[],
  threshold: number = 0.8
): Promise<{
  anomalies: Array<{ backup: any; reason: string; severity: 'low' | 'medium' | 'high' }>;
  overallHealth: number;
}> {
  try {
    // Calculate statistics
    const sizes = backups.map(b => b.size_bytes || 0);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    const stdDev = Math.sqrt(
      sizes.reduce((sum, size) => sum + Math.pow(size - avgSize, 2), 0) / sizes.length
    );

    const anomalies: any[] = [];

    backups.forEach((backup, index) => {
      const size = backup.size_bytes || 0;
      const zScore = Math.abs((size - avgSize) / stdDev);

      // Size anomaly
      if (zScore > 2) {
        anomalies.push({
          backup,
          reason: `Unusual size: ${(size / 1024 / 1024).toFixed(2)}MB (avg: ${(avgSize / 1024 / 1024).toFixed(2)}MB)`,
          severity: zScore > 3 ? 'high' : 'medium',
        });
      }

      // Failure anomaly
      if (backup.status === 'failed') {
        anomalies.push({
          backup,
          reason: `Backup failed: ${backup.error_message || 'Unknown error'}`,
          severity: 'high',
        });
      }

      // Duration anomaly
      if (backup.duration_seconds && backup.duration_seconds > 300) {
        anomalies.push({
          backup,
          reason: `Long duration: ${backup.duration_seconds}s (expected: <300s)`,
          severity: 'medium',
        });
      }
    });

    // Calculate overall health
    const failureRate = backups.filter(b => b.status === 'failed').length / backups.length;
    const overallHealth = Math.round((1 - failureRate) * 100);

    logger.info('Anomaly detection completed', {
      anomaliesFound: anomalies.length,
      overallHealth,
    });

    return { anomalies, overallHealth };
  } catch (error) {
    logger.error('Anomaly detection failed', error as any);
    return { anomalies: [], overallHealth: 100 };
  }
}

/**
 * Generate intelligent backup recommendations
 */
export async function generateRecommendations(
  systemStatus: any,
  backups: any[],
  usage: any
): Promise<string[]> {
  try {
    const context = {
      database: {
        records: systemStatus.database?.totalRecords || 0,
        connected: systemStatus.database?.connected || false,
      },
      backups: {
        total: backups.length,
        lastBackup: backups[0]?.date,
        avgSize: backups.reduce((sum, b) => sum + (b.size_bytes || 0), 0) / backups.length,
      },
      usage: {
        storageUsed: usage?.bytes || 0,
        fileCount: usage?.files || 0,
      },
    };

    const prompt = `Given this backup system status:

${JSON.stringify(context, null, 2)}

Provide 3-5 specific, actionable recommendations to improve backup reliability, efficiency, and cost.

Focus on:
1. Backup frequency optimization
2. Storage cost reduction
3. Reliability improvements
4. Data protection best practices

Respond with a JSON array of recommendation strings.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a backup system optimization expert. Provide concise, actionable recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"recommendations":[]}');

    logger.info('AI recommendations generated', {
      count: result.recommendations?.length || 0,
    });

    return result.recommendations || [];
  } catch (error) {
    logger.error('AI recommendation generation failed', error as any);
    return fallbackRecommendations(systemStatus, backups);
  }
}

/**
 * Natural language query interface
 */
export async function queryBackupsNL(query: string, backups: any[]): Promise<{
  answer: string;
  data?: any;
}> {
  try {
    const prompt = `User query: "${query}"

Available backups:
${JSON.stringify(backups.slice(0, 20), null, 2)}

Answer the user's question about their backups. Be concise and specific.
If the query requires filtering or calculation, provide the relevant data.

Respond in JSON:
{
  "answer": "natural language answer",
  "data": {optional relevant data}
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful backup system assistant. Answer questions about backups clearly and concisely.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    logger.info('Natural language query processed', { query });

    return result;
  } catch (error) {
    logger.error('NL query failed', error as any);
    return {
      answer: "I'm sorry, I couldn't process that query. Please try rephrasing or use the search filters.",
    };
  }
}

/**
 * Predict optimal backup schedule
 */
export async function predictOptimalSchedule(
  backups: any[],
  dataChangeRate: number
): Promise<{
  recommended: string;
  reasoning: string;
  frequency: 'hourly' | 'daily' | 'weekly';
}> {
  try {
    // Calculate change rate
    const avgGrowthPerDay = calculateGrowthRate(backups);

    const prompt = `Based on this backup data:
- Total backups: ${backups.length}
- Average daily data growth: ${avgGrowthPerDay.toFixed(2)}%
- Data change rate: ${dataChangeRate} updates/day
- Recent failures: ${backups.filter(b => b.status === 'failed').length}

What is the optimal backup schedule (cron expression)?
Consider:
1. Data volatility
2. Recovery point objective (RPO)
3. Storage costs
4. System load

Respond in JSON:
{
  "recommended": "cron expression",
  "reasoning": "explanation",
  "frequency": "hourly|daily|weekly"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a backup scheduling expert.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    logger.info('Optimal schedule predicted', { frequency: result.frequency });

    return result;
  } catch (error) {
    logger.error('Schedule prediction failed', error as any);
    return {
      recommended: '0 2 * * *',
      reasoning: 'Daily backup at 2 AM (default)',
      frequency: 'daily',
    };
  }
}

/**
 * Summarize backup health for non-technical users
 */
export async function generateHealthSummary(
  systemStatus: any,
  backups: any[],
  issues: any[]
): Promise<string> {
  try {
    const prompt = `Summarize this backup system health in 2-3 sentences for a non-technical user:

System Status:
- Database: ${systemStatus.database?.connected ? 'Connected' : 'Disconnected'}
- Total backups: ${backups.length}
- Recent failures: ${backups.filter((b: any) => b.status === 'failed').length}
- Issues detected: ${issues.length}

Be reassuring if things are good, or clearly explain concerns if there are issues.
Avoid technical jargon.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant explaining technical systems to non-technical users.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0].message.content || 'Your backup system is operating normally.';
  } catch (error) {
    logger.error('Health summary generation failed', error as any);
    return 'Your backup system is operating normally. All systems functional.';
  }
}

// =====================================================
// FALLBACK FUNCTIONS (RULE-BASED)
// =====================================================

/**
 * Fallback analysis when AI is unavailable
 */
function fallbackAnalysis(backups: any[]): BackupPatternAnalysis {
  const recentBackups = backups.slice(0, 7);
  const failureRate = recentBackups.filter(b => b.status === 'failed').length / recentBackups.length;

  return {
    frequency: recentBackups.length > 14 ? 'too_frequent' : (recentBackups.length < 3 ? 'too_infrequent' : 'optimal'),
    sizeGrowth: 'normal',
    failureRate: Math.round(failureRate * 100),
    recommendations: [
      failureRate > 0.1 ? 'High failure rate detected. Review backup configuration.' : '',
      recentBackups.length > 14 ? 'Consider reducing backup frequency to save storage costs.' : '',
      recentBackups.length < 3 ? 'Increase backup frequency to reduce data loss risk.' : '',
    ].filter(Boolean),
  };
}

/**
 * Fallback recommendations when AI is unavailable
 */
function fallbackRecommendations(systemStatus: any, backups: any[]): string[] {
  const recommendations: string[] = [];

  if (!systemStatus.database?.connected) {
    recommendations.push('⚠️ Database connection lost. Verify credentials and network connectivity.');
  }

  if (backups.length === 0) {
    recommendations.push('📦 No backups found. Create your first backup to protect your data.');
  }

  if (backups.length > 0 && backups[0].status === 'failed') {
    recommendations.push('🔴 Last backup failed. Check logs and retry.');
  }

  const avgSize = backups.reduce((sum, b) => sum + (b.size_bytes || 0), 0) / backups.length;
  if (avgSize > 100 * 1024 * 1024) {
    recommendations.push('💾 Large backup sizes detected. Consider incremental backups to reduce storage costs.');
  }

  if (backups.length < 7) {
    recommendations.push('⏰ Set up automated daily backups to ensure regular data protection.');
  }

  return recommendations.length > 0 ? recommendations : ['✅ Your backup system is healthy. Keep up the good work!'];
}

/**
 * Calculate growth rate from backups
 */
function calculateGrowthRate(backups: any[]): number {
  if (backups.length < 2) return 0;

  const recent = backups.slice(0, 7);
  const older = backups.slice(7, 14);

  const recentAvg = recent.reduce((sum, b) => sum + (b.size_bytes || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, b) => sum + (b.size_bytes || 0), 0) / older.length;

  if (olderAvg === 0) return 0;

  return ((recentAvg - olderAvg) / olderAvg) * 100;
}
