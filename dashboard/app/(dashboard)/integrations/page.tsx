import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Sheet, KeyRound, Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Integrations',
  description: 'Telegram, Google Sheets, API keys, usage links',
};

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Подключайте Telegram и Google Sheets, управляйте API ключами и лимитами.</p>
        </div>
        <Button size="lg">Add API Key</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Telegram</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Bot className="w-4 h-4" /> Bot token + chat ID</div>
            <p>Alerts: new booking, missed call, human transfer, payment past_due.</p>
            <p>Daily summary 07:00 local: totals, AI/Human, bookings, missed, avg duration, top number/agent.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Google Sheets</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Sheet className="w-4 h-4" /> Auto-create per workspace</div>
            <p>Read-only link for client; edits via app.</p>
            <p>Columns: call_id, timestamp, caller_number, language, handled_by, outcome, duration_sec, agent, number, booking, notes.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>API Keys</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><KeyRound className="w-4 h-4" /> Providers: Yandex, OpenAI</div>
            <p>Fields: label, key, payer (BYO/platform), cap/day, usage today.</p>
            <p>Alerts at 80%/100%; external usage links to provider dashboards.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Integration actions</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Buttons: Connect Telegram, Create Sheet, Add API Key. Status badges for each integration.</p>
        </CardContent>
      </Card>
    </div>
  );
}

