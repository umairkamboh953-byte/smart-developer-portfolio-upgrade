import React from 'react';
import { Smartphone, Layout, FileCode2, Sliders, Headset, CheckCircle2 } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Smartphone,
      title: 'Responsive Architecture',
      description: 'Tested across mobile viewports, high-density tablets, and ultra-wide desktop displays with zero layout breaks.'
    },
    {
      icon: Layout,
      title: 'Modern UI & Design Precision',
      description: 'Crafted with premium typography, refined dark-mode contrast ratios, and purposeful micro-interactions.'
    },
    {
      icon: FileCode2,
      title: 'Organized, Modular Source Code',
      description: 'Clean TypeScript structures, reusable React components, and zero tangled dependencies or messy spaghetti scripts.'
    },
    {
      icon: Sliders,
      title: 'Ready for Customization',
      description: 'Adapt logos, colors, typography, payment providers, and content without breaking underlying mechanics.'
    },
    {
      icon: Headset,
      title: 'Direct Developer Support',
      description: 'Receive direct assistance from the developer who built the codebase, including setup guidance and deployment tips.'
    }
  ];

  return (
    <section className="py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold text-blue-400">Engineering Standards</div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Why Choose Smart Developer?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Every website is designed and coded with commercial grade rigor, ensuring your business launches on a dependable foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/[0.08] bg-[#0d101d] space-y-3 hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}

          {/* Guarantee card */}
          <div className="p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-slate-900/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Client Assurance
              </div>
              <h3 className="text-base font-bold text-white">Deliverable Integrity</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No obscured files or locked libraries. You own the code completely for personal or client commercial projects.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Full commercial rights included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
