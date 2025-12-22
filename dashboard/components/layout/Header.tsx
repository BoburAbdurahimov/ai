/**
 * Header Component
 * Top navigation bar with user menu and notifications
 */

'use client';

import { Bell, Search, User, ChevronDown, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ActivityPulse } from '@/components/custom/BrandedElements';

export function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-border/50 backdrop-blur-xl">
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search calls, analytics, settings..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/30 border border-border/50 focus:border-primary/50 focus:bg-muted/50 transition-all outline-none text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-border/50">
            <ActivityPulse active label="System Live" />
          </div>

          {/* Notifications */}
          <button className="relative w-10 h-10 rounded-xl glass border border-border/50 flex items-center justify-center hover:border-primary/50 transition-all group">
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl glass border border-border/50 hover:border-primary/50 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs text-muted-foreground">Professional Plan</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 glass border border-border/50 rounded-xl p-2 z-50 shadow-xl">
                  <div className="p-3 border-b border-border/50">
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-muted-foreground">john@clinic.uz</p>
                    <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
                      Professional Plan
                    </Badge>
                  </div>

                  <div className="py-2 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/20 transition-all text-left">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/20 transition-all text-left">
                      <SettingsIcon className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all text-left">
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
