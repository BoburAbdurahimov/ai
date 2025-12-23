import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Mic, Link as LinkIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agents',
  description: 'Manage AI agents, scripts, voices, greetings, and fallback rules',
};

export default function AgentsPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground">Создавайте агентов, загружайте скрипты и голосовые файлы, настраивайте приветствия и fallback.</p>
        </div>
        <Button size="lg">New Agent</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Agent fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>name, description, language focus (RU/UZ), greeting, rules, fallback phrases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Uploads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Script upload (text → Supabase Storage)</div>
            <div className="flex items-center gap-2"><Mic className="w-4 h-4" /> Voice upload (audio → Storage)</div>
            <div className="flex items-center gap-2"><Upload className="w-4 h-4" /> Attach to agent record</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Assign phone number</div>
            <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Test call action</div>
            <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Activate / Deactivate</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agents table</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Columns: name, language, assigned number, status, last updated. Actions: edit, upload script, upload voice, test call, deactivate.
        </CardContent>
      </Card>
    </div>
  );
}

