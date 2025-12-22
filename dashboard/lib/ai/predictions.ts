/**
 * AI Predictions for Backup Management
 * Predictive analytics and forecasting
 */

import { logger } from '@/lib/logger';

export interface PredictionResult {
  prediction: number;
  confidence: number;
  reasoning: string;
  timeline: Array<{ date: string; value: number }>;
}

/**
 * Predict future storage needs
 */
export async function predictStorageNeeds(
  backups: any[],
  daysAhead: number = 30
): Promise<PredictionResult> {
  try {
    // Calculate historical growth rate
    const sizes = backups.map(b => ({
      date: new Date(b.created_at),
      size: b.size_bytes || 0,
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    if (sizes.length < 2) {
      return {
        prediction: 0,
        confidence: 0,
        reasoning: 'Not enough data for prediction',
        timeline: [],
      };
    }

    // Linear regression
    const days = sizes.map((s, i) => i);
    const sizesArray = sizes.map(s => s.size);

    const { slope, intercept } = linearRegression(days, sizesArray);

    // Predict future
    const futureDays = Array.from({ length: daysAhead }, (_, i) => sizes.length + i);
    const timeline = futureDays.map(day => ({
      date: new Date(Date.now() + (day - sizes.length) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.max(0, slope * day + intercept),
    }));

    const prediction = timeline[timeline.length - 1].value;
    const confidence = calculateConfidence(sizes, slope);

    logger.info('Storage prediction calculated', {
      prediction: (prediction / 1024 / 1024).toFixed(2) + 'MB',
      confidence,
    });

    return {
      prediction,
      confidence,
      reasoning: `Based on ${sizes.length} historical backups, storage is ${slope > 0 ? 'growing' : 'stable'}`,
      timeline,
    };
  } catch (error) {
    logger.error('Storage prediction failed', error as any);
    return {
      prediction: 0,
      confidence: 0,
      reasoning: 'Prediction unavailable',
      timeline: [],
    };
  }
}

/**
 * Predict backup failure risk
 */
export function predictFailureRisk(backups: any[]): {
  risk: 'low' | 'medium' | 'high';
  score: number;
  factors: string[];
} {
  const factors: string[] = [];
  let score = 0;

  const recentBackups = backups.slice(0, 10);
  const failureRate = recentBackups.filter(b => b.status === 'failed').length / recentBackups.length;

  // Factor 1: Recent failures
  if (failureRate > 0.3) {
    score += 40;
    factors.push('High recent failure rate (>30%)');
  } else if (failureRate > 0.1) {
    score += 20;
    factors.push('Moderate failure rate (>10%)');
  }

  // Factor 2: Consecutive failures
  const consecutiveFailures = countConsecutiveFailures(recentBackups);
  if (consecutiveFailures >= 3) {
    score += 30;
    factors.push(`${consecutiveFailures} consecutive failures`);
  }

  // Factor 3: Size anomalies
  const sizes = backups.map(b => b.size_bytes || 0);
  const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
  const lastSize = sizes[0];

  if (lastSize > avgSize * 2) {
    score += 15;
    factors.push('Unusual backup size (>2x average)');
  }

  // Factor 4: Duration increases
  const durations = backups.slice(0, 5).map(b => b.duration_seconds || 0);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

  if (durations[0] > avgDuration * 1.5) {
    score += 15;
    factors.push('Backup duration increasing');
  }

  const risk = score > 50 ? 'high' : score > 25 ? 'medium' : 'low';

  return { risk, score, factors };
}

// Helper functions
function linearRegression(x: number[], y: number[]) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function calculateConfidence(data: any[], slope: number): number {
  if (data.length < 3) return 0.3;
  if (data.length < 10) return 0.6;

  // Higher confidence for more data and consistent trends
  const consistencyScore = Math.abs(slope) > 1000 ? 0.8 : 0.9;
  return Math.min(0.95, consistencyScore);
}

function countConsecutiveFailures(backups: any[]): number {
  let count = 0;
  for (const backup of backups) {
    if (backup.status === 'failed') {
      count++;
    } else {
      break;
    }
  }
  return count;
}
