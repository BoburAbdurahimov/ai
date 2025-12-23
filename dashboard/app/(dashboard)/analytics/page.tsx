import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Calls by day, outcomes, cost per call, conversion',
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Графики по дням, исходы, стоимость, конверсия. Фильтры: даты, агент, номер, кампания.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle>Calls by day</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Supabase view: calls_by_day (date, total_calls, ai_calls, human_calls).</CardContent></Card>
        <Card><CardHeader><CardTitle>Outcomes</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Supabase view: outcomes (connected, missed, booking, transfer).</CardContent></Card>
        <Card><CardHeader><CardTitle>Cost per call</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Estimate: STT/TTS + LLM; view: cost_per_call (avg, p90).</CardContent></Card>
        <Card><CardHeader><CardTitle>Conversion</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Bookings / connected; chart with trend.</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Exports</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Export CSV for filtered ranges. Optional PostHog tracking snippet available.</CardContent>
      </Card>
    </div>
  );
}

