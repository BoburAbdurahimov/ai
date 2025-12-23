'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Brain, BarChart3, Clock, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Phone,
    title: 'Smart Call Handling',
    description: 'AI agents handle calls naturally with advanced speech recognition and natural language understanding',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Brain,
    title: 'Intelligent Analysis',
    description: 'Real-time conversation analysis with sentiment detection and automatic summarization',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: BarChart3,
    title: 'Powerful Analytics',
    description: 'Comprehensive dashboards with insights on call performance, trends, and customer behavior',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Never miss a call with AI agents that work around the clock without breaks',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with GDPR, HIPAA, and industry standards',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-50ms response times ensure natural, flowing conversations without delays',
    color: 'from-yellow-500 to-yellow-600'
  }
];

export function Features() {
  return (
    <section className="py-24 bg-slate-900">
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
