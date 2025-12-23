import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { UseCases } from '@/components/landing/UseCases';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { Navigation } from '@/components/landing/Navigation';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <UseCases />
      <CTA />
      <Footer />
    </main>
  );
}
