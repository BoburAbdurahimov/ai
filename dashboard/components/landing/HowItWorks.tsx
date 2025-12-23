import { ArrowRight, PhoneIncoming, Languages, Bot, UserRound, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { icon: PhoneIncoming, title: 'Входящий звонок', desc: 'Клиент набирает ваш номер.' },
  { icon: Languages, title: 'Выбор языка', desc: 'DTMF/intent: RU → AI, UZ → оператор.' },
  { icon: Bot, title: 'RU → AI', desc: 'Yandex STT/TTS + LLM отвечает и бронирует.' },
  { icon: UserRound, title: 'UZ → Human', desc: 'Мгновенная переадресация на оператора.' },
  { icon: Database, title: 'Логирование', desc: 'Supabase + Sheets + Telegram уведомления.' },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
            Как это работает
          </h2>
          <p className="text-lg text-slate-300">
            RU звонки обслуживает ИИ. UZ звонки переводятся человеку. Всё логируется автоматически.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl border border-white/10 bg-slate-800/50 p-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/70 to-cyan-500/70 flex items-center justify-center text-white mb-3">
                <step.icon className="w-6 h-6" />
              </div>
              <p className="text-white font-semibold mb-1">{step.title}</p>
              <p className="text-sm text-slate-300">{step.desc}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

