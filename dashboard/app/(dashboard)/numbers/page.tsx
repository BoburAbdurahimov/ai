import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Link as LinkIcon, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Phone Numbers',
  description: 'Manage numbers, assign to agents, configure forwarding',
};

export default function NumbersPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phone Numbers</h1>
          <p className="text-muted-foreground">Назначайте номера агентам, настраивайте переадресацию на оператора, просматривайте логи.</p>
        </div>
        <Button size="lg">Add Number</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Assignments</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Assign number → agent</p>
            <p>RU → AI, UZ → forward</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Forwarding</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Forwarding number (human operator)</p>
            <p>Blind transfer, timeout, retries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Logs</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Calls per number, outcomes, last activity</p>
            <p>Quick link to call history</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Numbers table</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Columns: number, agent, forwarding number, status, calls (7d). Actions: reassign, change forwarding, enable/disable, view logs.
        </CardContent>
      </Card>
    </div>
  );
}

