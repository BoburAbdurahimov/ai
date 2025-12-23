import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tags, UploadCloud, UserPlus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Clients',
  description: 'Manage clients and contacts, tagging, and cold-call eligibility',
};

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients & Contacts</h1>
          <p className="text-muted-foreground">Добавляйте клиентов вручную, загружайте списки Excel, помечайте тэгами и управляйте допуском к обзвонам.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">Upload Excel</Button>
          <Button size="lg">Add Contact</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Manual add</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Fields: name, phone (E.164), language (RU/UZ), notes, tags, cold_call_eligible toggle.
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Bulk upload (Excel)</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Sheet “clients”</div>
            <p>Columns: name, phone, language (RU/UZ), notes.</p>
            <p>Validation: phone E.164, name 2–100, notes ≤500, language in set.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tagging & filters</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Tags className="w-4 h-4" /> Multi-select tags</div>
            <p>Filters by tags and cold_call_eligible.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Contacts table</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Columns: name, phone, language, tags, last call, next action, cold_call_eligible. Actions: edit, toggle eligibility, assign to campaign.
        </CardContent>
      </Card>
    </div>
  );
}

