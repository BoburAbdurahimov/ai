'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Voice Operations?
          </h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses using AI to automate their call centers. Start your free 14-day trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="group bg-white text-blue-900 hover:bg-slate-100 px-8 py-6 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
              Schedule Demo
            </Button>
          </div>

          <p className="text-sm text-slate-300 mt-6">
            No credit card required • Setup in minutes • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
