import { Building2, Truck, Home, ShoppingBag, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const useCases = [
  { icon: Building2, title: 'Клиники', desc: 'Запись, напоминания, перевод на врача.' },
  { icon: Truck, title: 'Доставка', desc: 'Статусы заказов, адресные уточнения.' },
  { icon: Home, title: 'Недвижимость', desc: 'Показы, встречи, фильтр лидов.' },
  { icon: ShoppingBag, title: 'Онлайн-магазины', desc: 'Статусы, возвраты, поддержка.' },
];

export function UseCases() {
  return (
    <section id="trust" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">Доверяют компаниям с реальными звонками</h2>
          <p className="text-slate-300">Подходит для разных отраслей: медицина, доставка, недвижимость, e-commerce.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/70 to-purple-500/70 flex items-center justify-center text-white">
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-white font-semibold">{item.title}</p>
              <p className="text-sm text-slate-300">{item.desc}</p>
              <div className="flex items-center gap-2 text-xs text-green-300">
                <Check className="w-4 h-4" />
                Готово к продакшн-нагрузке
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

