'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            VoiceOps AI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-slate-300 hover:text-white transition">Features</Link>
            <Link href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</Link>
            <Link href="/docs" className="text-slate-300 hover:text-white transition">Docs</Link>
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-4">
              <Link href="#features" className="text-slate-300 hover:text-white transition py-2">Features</Link>
              <Link href="#pricing" className="text-slate-300 hover:text-white transition py-2">Pricing</Link>
              <Link href="/docs" className="text-slate-300 hover:text-white transition py-2">Docs</Link>
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition py-2">Dashboard</Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
                <Button variant="ghost" className="w-full">Sign In</Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
