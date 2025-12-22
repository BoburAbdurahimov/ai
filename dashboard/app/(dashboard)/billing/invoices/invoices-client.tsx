/**
 * Invoices Client Component
 * List and manage invoices
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Receipt, Calendar } from 'lucide-react';

interface Invoice {
  id: string;
  stripe_invoice_id: string;
  amount_paid: number;
  currency: string;
  status: string;
  invoice_pdf: string | null;
  created_at: string;
  period_start: string;
  period_end: string;
}

export function InvoicesClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/billing/invoices')
      .then(res => res.json())
      .then(data => {
        setInvoices(data.invoices || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load invoices:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="p-6 glass">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-muted/20 rounded-xl animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card className="p-12 glass text-center">
        <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No invoices yet</h3>
        <p className="text-muted-foreground">
          Your invoices will appear here once you start your subscription
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="p-6 glass hover:shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {new Date(invoice.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' - '}
                    {new Date(invoice.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold gradient-text-primary">
                  ${(invoice.amount_paid / 100).toFixed(2)}
                </p>
                <Badge 
                  className={
                    invoice.status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }
                >
                  {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </div>

              {invoice.invoice_pdf && (
                <Button variant="outline" size="sm" asChild>
                  <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
