'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Sparkles, Waves } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const AnimatedBackground = dynamic(
  () => import('@/components/3d/AnimatedBackground').then(mod => mod.AnimatedBackground),
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <AnimatedBackground />

      <div className="container mx-auto px-4 relative z-10 pt-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20"
            >
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-sm text-blue-200">RU → AI · UZ → Human · 24/7</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-200 bg-clip-text text-transparent"
            >
              Голосовой AI для бизнеса в Узбекистане
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-slate-300 max-w-2xl"
            >
              Русские звонки обрабатывает ИИ на базе Yandex SpeechKit. Узбекские — мгновенно
              переводятся на оператора. Телеграм-оповещения, Google Sheets, аналитика и биллинг в одном месте.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Начать пробный период
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 hover:bg-slate-800 px-8 py-6 text-lg">
                Смотреть демо
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              <FeaturePill icon={<Waves className="w-4 h-4" />} title="RU → AI" desc="ASR/TTS + LLM" />
              <FeaturePill icon={<Shield className="w-4 h-4" />} title="UZ → Human" desc="Мгновенный перевод" />
              <FeaturePill icon={<Sparkles className="w-4 h-4" />} title="Sheets + Telegram" desc="Автосинхронизация" />
              <FeaturePill icon={<ArrowRight className="w-4 h-4" />} title="Click Billing" desc="Подписки + перерасход" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative h-[420px] lg:h-[520px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl" />
            <div className="relative h-full w-full rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 w-fit">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <div>
                    <p className="text-sm text-slate-200">Входящий звонок</p>
                    <p className="text-xs text-slate-400">+998 90 123 45 67</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <CallCard title="RU → AI" desc="SpeechKit + LLM" accent="from-blue-500 to-cyan-400" />
                  <CallCard title="UZ → Human" desc="Transfer to operator" accent="from-purple-500 to-pink-400" />
                </div>
                <div className="flex items-center gap-2 text-slate-200 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  Реальное время · 24/7 · SLA 99.9%
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-start gap-3">
      <div className="text-blue-200 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-white font-semibold">{title}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

function CallCard({ title, desc, accent }: { title: string; desc: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${accent} mb-3`} />
      <p className="text-white font-semibold">{title}</p>
      <p className="text-sm text-slate-300">{desc}</p>
    </div>
  );
}
