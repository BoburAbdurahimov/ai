'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">VoiceOps AI</h3>
            <p className="text-slate-400 text-sm">
              AI-powered call center automation for modern businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="text-slate-400 hover:text-white transition">Features</Link></li>
              <li><Link href="#pricing" className="text-slate-400 hover:text-white transition">Pricing</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition">Dashboard</Link></li>
              <li><Link href="/docs" className="text-slate-400 hover:text-white transition">Documentation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition">About</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-white transition">Blog</Link></li>
              <li><Link href="/careers" className="text-slate-400 hover:text-white transition">Careers</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" />
                support@voiceops.ai
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © 2024 VoiceOps AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-white transition">Terms of Service</Link>
            <Link href="/security" className="text-slate-400 hover:text-white transition">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
