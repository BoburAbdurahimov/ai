'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(
  () => import('@/components/3d/AnimatedBackground').then(mod => mod.AnimatedBackground),
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">AI-Powered Call Automation</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-fade-in-up">
            Transform Your Voice Operations with AI
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Automate calls, analyze conversations, and scale your business with intelligent voice AI that works 24/7
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animation-delay-400">
            <Button size="lg" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 hover:bg-slate-800 px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-slate-700 animate-fade-in-up animation-delay-600">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">99.9%</div>
              <div className="text-sm text-slate-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-1">50ms</div>
              <div className="text-sm text-slate-400">Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-1">24/7</div>
              <div className="text-sm text-slate-400">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
