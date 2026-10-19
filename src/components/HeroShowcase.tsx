import React from 'react';
import { ArrowRight, Code, ShieldCheck, Sparkles, Layers, Globe2, Zap } from 'lucide-react';

interface HeroShowcaseProps {
  onExplore: () => void;
  onRequestCustom: () => void;
}

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({
  onExplore,
  onRequestCustom
}) => {
  return (
    <section className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background radial gradients clamped strictly within container */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[350px] sm:h-[450px] bg-gradient-to-b from-blue-600/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Minimalist kicker */}
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-blue-400 bg-blue-950/40 border border-blue-800/40 px-3 py-1 rounded-full">
              <span>Full-Stack Web Engineering</span>
              <span aria-hidden="true">·</span>
              <span>Global Client Deliveries</span>
            </div>

            {/* Main Heading with clamp fluid scaling */}
            <h1
              className="font-extrabold tracking-tight text-white leading-[1.15] text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ fontSize: 'clamp(1.85rem, 5.5vw, 3.75rem)' }}
            >
              Premium Websites.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
                Built to Grow Your Business.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover ready-made websites and professional custom web solutions designed to help businesses establish a powerful online presence.
            </p>

            {/* CTAs with 44px min touch target */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto min-h-[44px] px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.98]"
              >
                <span>Explore Websites</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onRequestCustom}
                className="w-full sm:w-auto min-h-[44px] px-6 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-[#131627] hover:bg-[#1a1f35] border border-white/10 hover:border-white/20 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Request a Custom Website</span>
              </button>
            </div>

            {/* Sub-hero trust attributes - responsive grid for small phones */}
            <div className="pt-4 sm:pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left">
              <div className="p-2 sm:p-0 rounded-lg sm:rounded-none bg-white/[0.02] sm:bg-transparent">
                <div className="text-xs font-semibold text-white">Full Source Code</div>
                <div className="text-[11px] text-slate-400">100% clean & unminified</div>
              </div>
              <div className="p-2 sm:p-0 rounded-lg sm:rounded-none bg-white/[0.02] sm:bg-transparent">
                <div className="text-xs font-semibold text-white">Live Web Demos</div>
                <div className="text-[11px] text-slate-400">Desktop & mobile ready</div>
              </div>
              <div className="p-2 sm:p-0 rounded-lg sm:rounded-none bg-white/[0.02] sm:bg-transparent">
                <div className="text-xs font-semibold text-white">Global Delivery</div>
                <div className="text-[11px] text-slate-400">US, UK, PK, CA, AU</div>
              </div>
            </div>
          </div>

          {/* Right Column: Layered 3D-style Website Showcase Mockup */}
          <div className="lg:col-span-6 relative flex items-center justify-center w-full mt-2 lg:mt-0">
            {/* Perspective wrapper */}
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none group">
              {/* Back ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-violet-600/20 rounded-2xl blur-2xl transform -rotate-2 scale-95 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              {/* Main Primary Mockup Card */}
              <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0e111d] shadow-2xl transition-transform duration-500 group-hover:-translate-y-1">
                {/* Window header */}
                <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#141829] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate max-w-[170px] sm:max-w-none">
                    smartdeveloper.io/portfolio/showcase
                  </span>
                  <div className="text-[10px] sm:text-[11px] font-mono text-blue-400 font-semibold">
                    v2.0
                  </div>
                </div>

                {/* Hero Showcase Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src="/assets/images/hero_showcase_dark_1792311614014.jpg"
                    alt="Smart Developer Website Showcase"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090b14] via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Floating layered preview chip */}
                <div className="p-3 sm:p-4 bg-[#111422] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Instant Deployment Ready</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400">TypeScript · Tailwind · React 19</div>
                    </div>
                  </div>
                  <button
                    onClick={onExplore}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-end sm:self-auto cursor-pointer"
                  >
                    <span>View Stack</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Offset floating card 1: Luxury E-commerce preview (Hidden on small mobile to avoid overflow, visible on tablet/desktop) */}
              <div className="hidden md:block absolute -bottom-6 -left-6 w-56 lg:w-60 rounded-xl overflow-hidden border border-white/15 bg-[#121628]/95 backdrop-blur-md p-3 shadow-2xl transform -rotate-1 group-hover:rotate-0 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-[11px] font-semibold text-slate-200">E-Commerce Ready</span>
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-800 mb-2">
                  <img
                    src="/assets/images/ecommerce_luxury_store_1792311614226.jpg"
                    alt="E-commerce sample"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[10px] text-slate-400">Cart & Checkout Engineered</div>
              </div>

              {/* Offset floating card 2: Real estate / SaaS preview */}
              <div className="hidden md:block absolute -top-5 -right-5 w-52 lg:w-56 rounded-xl overflow-hidden border border-white/15 bg-[#121628]/95 backdrop-blur-md p-3 shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-white">SaaS Analytics</span>
                  <span className="text-[10px] text-blue-400 font-mono">100% Score</span>
                </div>
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-800">
                  <img
                    src="/assets/images/saas_analytics_platform_1792311615607.jpg"
                    alt="SaaS Analytics sample"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
