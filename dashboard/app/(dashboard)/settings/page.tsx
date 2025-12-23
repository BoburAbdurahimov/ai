import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Company, language, webhooks, security',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Company info, language defaults, webhooks, security.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Company</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">name, domain, timezone.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Language routing</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Default RU/UZ routing, DTMF options.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Webhooks</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Endpoints + secret, events: call.start, call.end, payment.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">2FA toggle, session limits, audit log link.</CardContent>
        </Card>
      </div>
    </div>
  );
}

