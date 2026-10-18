import React from 'react';
import { Code2, Cpu, Globe, CheckCircle2, ShieldCheck, Terminal, Award, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onExplore: () => void;
  onRequestCustom: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExplore, onRequestCustom }) => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-in fade-in duration-300">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="text-xs font-semibold text-blue-400">Developer Profile</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Architecting High-Performance Websites with Modern AI Tooling
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Smart Developer is an independent web engineering studio founded to bridge high-end architectural web design, rapid AI-assisted development workflows, and clean unminified source code delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Engineering Philosophy
          </h2>
          <p>
            Modern businesses need more than cookie-cutter site builders. They need fast, responsive, and maintainable web applications with zero vendor lock-in. By leveraging modern AI-assisted engineering tools alongside rigorous software design principles, we produce production-grade websites in a fraction of traditional agency timelines without compromising on code quality.
          </p>
          <p>
            Whether you are purchasing a complete ready-made website package or contracting a bespoke development solution, you receive unminified, clean TypeScript and React source code that your team can run, customize, and deploy anywhere.
          </p>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Full unminified code ownership</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>No proprietary dependencies</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Zero bloated page builders</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Direct engineer communication</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#0c0f1c] space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Primary Technology Ecosystem
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'React 19',
                'TypeScript',
                'Tailwind CSS v4',
                'Node.js & Express',
                'Vite Bundler',
                'Stripe Checkout API',
                'REST & WebSockets',
                'Cloud Run & Vercel'
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-[#14182a] border border-white/10 text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-3">
            <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
              International Delivery
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Serving businesses across Pakistan, the United States, United Kingdom, Canada, Australia, and worldwide with multi-currency payment workflows and direct WhatsApp support.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-3xl border border-white/10 bg-[#0c0f1c] text-center space-y-4 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-white">Ready to elevate your online presence?</h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Browse our collection of turnkey website templates or schedule a custom quote today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
          >
            Explore Ready-Made Catalog
          </button>
          <button
            onClick={onRequestCustom}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            Request Custom Development
          </button>
        </div>
      </div>
    </div>
  );
};
