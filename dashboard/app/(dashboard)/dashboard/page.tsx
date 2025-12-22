/**
 * Dashboard Home Page
 * Main overview with key metrics and quick actions
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Clock, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Activity,
  Zap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'VoiceOps AI Dashboard - Overview of your AI call center',
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text-primary mb-2">
          Welcome back, John 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your AI call center today
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 glass hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Phone className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Calls</p>
              <p className="text-3xl font-bold">42</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Minutes Used</p>
              <p className="text-3xl font-bold">1,234</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Growth</p>
              <p className="text-3xl font-bold">+12%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-3xl font-bold">5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-8 glass hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Recent Calls</h3>
              <p className="text-sm text-muted-foreground">View call history and analytics</p>
            </div>
          </div>
          <Link href="/calls">
            <Button className="w-full group">
              View Calls
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </Card>

        <Card className="p-8 glass hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Upgrade Plan</h3>
              <p className="text-sm text-muted-foreground">Unlock more features and capacity</p>
            </div>
          </div>
          <Link href="/billing/plans">
            <Button className="w-full group">
              View Plans
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
