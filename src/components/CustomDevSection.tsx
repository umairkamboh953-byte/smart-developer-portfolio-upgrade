import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Clock, Laptop } from 'lucide-react';

interface CustomDevSectionProps {
  onOpenCustomQuote: () => void;
}

export const CustomDevSection: React.FC<CustomDevSectionProps> = ({ onOpenCustomQuote }) => {
  return (
    <section className="py-20 border-b border-white/[0.08] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-80 bg-blue-600/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e1224] via-[#0b0e1b] to-[#070912] p-8 md:p-14 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400">
                <span>Bespoke Engineering Services</span>
                <span aria-hidden="true">·</span>
                <span>Tailored for Global Brands</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Need Something Unique?
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                If your business requires a customized architecture, bespoke brand identity, private database integration, or specialized functionality not covered in ready-made templates, we engineer complete tailored solutions from scratch.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Custom UI / UX Design</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Full Database & API Integration</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Guaranteed Milestones & Delivery</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center space-y-4">
              <button
                onClick={onOpenCustomQuote}
                className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Get a Custom Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-slate-400 text-left lg:text-right">
                Inquiries reviewed directly by the lead developer. Fast response within 4–12 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
