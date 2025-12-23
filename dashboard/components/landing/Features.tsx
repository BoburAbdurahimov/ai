'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneCall, CalendarClock, Headphones, Bot, BarChart3, Link2 } from 'lucide-react';

const features = [
  {
    icon: PhoneCall,
    title: '24/7 приём звонков',
    description: 'Русские звонки — ИИ, узбекские — к оператору. SLA 99.9%.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: CalendarClock,
    title: 'Бронирование и расписания',
    description: 'Запись через голос, подтверждение слотов, напоминания.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Headphones,
    title: 'Human fallback',
    description: 'Мгновенный перевод на оператора для узбекского потока.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Link2,
    title: 'Telegram + Google Sheets',
    description: 'Авто-создание Sheets, алерты в Telegram, дневные сводки.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: BarChart3,
    title: 'Аналитика и стоимость',
    description: 'Дашборды: исходы, конверсия, стоимость на звонок, SLA.',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Bot,
    title: 'Настройка агентов',
    description: 'Скрипты, голосовые файлы, приветствия, правила fallback.',
    color: 'from-slate-500 to-slate-700'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Powerful features designed to transform your voice operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 group"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
