import React from 'react';
import { Compass, Eye, Tag, Send, PackageCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Compass,
      title: 'Explore Collection',
      desc: 'Browse our categorized marketplace of production-ready websites and choose the layout matching your business goals.'
    },
    {
      num: '02',
      icon: Eye,
      title: 'Preview Website',
      desc: 'Test the live interactive preview across desktop, tablet, and mobile to inspect responsive behavior and workflows.'
    },
    {
      num: '03',
      icon: Tag,
      title: 'Review Price & Features',
      desc: 'Check transparent pricing in your local currency, included pages, technology stack, and optional customization services.'
    },
    {
      num: '04',
      icon: Send,
      title: 'Submit Purchase Request',
      desc: 'Choose your preferred payment method (Bank Wire, Wise, Payoneer, Crypto USDT, or Card Invoice) and place your order.'
    },
    {
      num: '05',
      icon: PackageCheck,
      title: 'Receive Deliverables',
      desc: 'Once your order is verified by our team, your unminified source code ZIP, setup guides, and support access are delivered to your email.'
    }
  ];

  return (
    <section className="py-20 border-b border-white/[0.08] bg-[#090b14]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold text-blue-400">Streamlined Process</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            A transparent and secure acquisition process from initial inspection to final repository handover.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-5 rounded-2xl border border-white/[0.08] bg-[#0c0f1c] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-blue-400">{s.num}</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
