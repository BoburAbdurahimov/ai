import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, CalendarClock, RefreshCw, ListChecks } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cold Calling',
  description: 'Upload lists, schedule campaigns, track outcomes',
};

export default function ColdCallingPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cold Calling</h1>
          <p className="text-muted-foreground">Загружайте списки, назначайте агента, настраивайте окна дозвона, отслеживайте результаты.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">Upload Cold List</Button>
          <Button size="lg">New Campaign</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>List format</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Sheet “cold_calls”</div>
            <p>Columns: phone (E.164), name, preferred_time (HH:MM), tags (comma, ≤5, ≤20 chars).</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Campaign setup</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Name, agent, contact list, schedule window, max attempts, retry delay.</p>
            <p>States: pending, in-progress, completed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Outcomes</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><ListChecks className="w-4 h-4" /> connected, voicemail, wrong number, no answer</div>
            <p>Edit per-contact outcome, attempt count, last_attempt_at.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Campaign board</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Kanban-style columns: pending, in-progress, completed; show contact counts, success rate, next attempt time.
        </CardContent>
      </Card>
    </div>
  );
}

