/**
 * Sidebar Navigation Component
 * Main navigation for dashboard
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AnimatedLogo3D } from '@/components/3d/AnimatedLogo3D';
import {
  LayoutDashboard,
  Phone,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Suspense } from 'react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Calls',
    href: '/calls',
    icon: Phone,
    badge: 'Live',
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass border border-border/50 flex items-center justify-center"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-64 glass border-r border-border/50 z-40 transition-transform duration-300',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Suspense fallback={<div className="w-12 h-12 bg-muted/20 rounded-xl animate-pulse" />}>
              <div className="w-12 h-12">
                <AnimatedLogo3D size={48} />
              </div>
            </Suspense>
            <div>
              <h1 className="text-xl font-bold gradient-text-primary">VoiceOps AI</h1>
              <p className="text-xs text-muted-foreground">Healthcare AI</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  'hover:bg-primary/10 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                <span>{item.name}</span>
                
                {item.badge && (
                  <span className="ml-auto">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {item.badge}
                    </span>
                  </span>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-r" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <Link
            href="/help"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Help & Support</span>
          </Link>

          {/* Upgrade Prompt */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Upgrade Plan</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock unlimited calls and advanced features
            </p>
            <Link
              href="/billing"
              className="block w-full py-2 px-4 text-center text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              View Plans
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
