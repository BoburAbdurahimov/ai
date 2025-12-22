'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

interface AIInsightsProps {
  userId?: string;
}

export function AIInsights({ userId }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeSystem() {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisType: 'full', userId }),
      });

      const data = await res.json();
      if (data.success) {
        setInsights(data.analysis);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!insights && !loading) {
    return (
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <CardContent className="py-8 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get intelligent recommendations and anomaly detection
          </p>
          <Button onClick={analyzeSystem} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Analyze System
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">AI is analyzing your backups...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Anomalies */}
      {insights.anomalies && insights.anomalies.anomalies.length > 0 && (
        <Card className="border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Anomalies Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.anomalies.anomalies.slice(0, 5).map((anomaly: any, i: number) => (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm">{anomaly.backup.backup_name}</span>
                    <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'warning'}>
                      {anomaly.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{anomaly.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pattern Analysis */}
      {insights.patterns && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Pattern Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Frequency</p>
                <Badge variant={insights.patterns.frequency === 'optimal' ? 'default' : 'warning'}>
                  {insights.patterns.frequency}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Size Growth</p>
                <Badge>{insights.patterns.sizeGrowth}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Failure Rate</p>
                <Badge variant={insights.patterns.failureRate > 10 ? 'destructive' : 'default'}>
                  {insights.patterns.failureRate}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Health */}
      {insights.anomalies && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Overall System Health</p>
                <p className="text-xs text-muted-foreground">Based on AI analysis</p>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {insights.anomalies.overallHealth}%
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button variant="outline" onClick={analyzeSystem} className="w-full">
        Refresh Analysis
      </Button>
    </div>
  );
}
