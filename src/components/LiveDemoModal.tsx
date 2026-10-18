import React, { useState } from 'react';
import { WebsiteListing, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import {
  Monitor,
  Tablet,
  Smartphone,
  X,
  ExternalLink,
  ShoppingBag,
  RotateCcw,
  Check,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Heart,
  SlidersHorizontal
} from 'lucide-react';

interface LiveDemoModalProps {
  listing: WebsiteListing;
  currency: CurrencyCode;
  onClose: () => void;
  onBuy: (listing: WebsiteListing) => void;
}

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  listing,
  currency,
  onClose,
  onBuy
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'code-structure'>('preview');

  // Interactive mock state inside preview
  const [cartCount, setCartCount] = useState(2);
  const [addedItem, setAddedItem] = useState(false);
  const [selectedPropCategory, setSelectedPropCategory] = useState('All');
  const [saasTimeframe, setSaasTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  const handleSimulatedAction = () => {
    setCartCount((c) => c + 1);
    setAddedItem(true);
    setTimeout(() => setAddedItem(false), 2000);
  };

  const viewportWidthClass = {
    desktop: 'w-full max-w-6xl h-[78vh]',
    tablet: 'w-[768px] max-w-full h-[78vh]',
    mobile: 'w-[375px] max-w-full h-[78vh]'
  }[viewport];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Top Bar Control */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0c0e17] text-slate-200 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-tight text-sm md:text-base truncate max-w-xs md:max-w-md">
              {listing.title}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">· Live Interactive Preview</span>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-[#161a29] p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewport === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 1440px"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewport === 'tablet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewport === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBuy(listing)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy Code ({formatPrice(listing.priceUSD, currency)})</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Preview (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 flex items-center justify-center p-3 md:p-6 overflow-hidden bg-[#06070b]">
        <div
          className={`${viewportWidthClass} transition-all duration-300 rounded-xl overflow-hidden border border-white/10 bg-[#0d0f18] shadow-2xl flex flex-col relative`}
        >
          {/* Simulated Browser Bar */}
          <div className="px-4 py-2.5 bg-[#121624] border-b border-white/5 flex items-center justify-between text-xs text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-slate-500 ml-2 font-mono text-[11px] truncate hidden sm:inline">
                https://demo.smartdeveloper.io/{listing.slug}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span className="font-mono text-emerald-400">SSL 256-bit</span>
              <span>·</span>
              <span className="font-medium text-slate-300">{listing.category}</span>
            </div>
          </div>

          {/* Interactive Screen Content Based on Type */}
          <div className="flex-1 overflow-y-auto bg-[#0a0c14] text-slate-200">
            {listing.demoType === 'ecommerce' && (
              <div className="p-4 md:p-8 space-y-8">
                {/* Simulated Ecom Nav */}
                <header className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="font-serif tracking-widest text-lg md:text-xl font-bold text-white">
                    AURORA & CO.
                  </div>
                  <nav className="hidden sm:flex items-center gap-6 text-xs text-slate-300">
                    <span className="hover:text-white cursor-pointer font-medium">New Arrivals</span>
                    <span className="hover:text-white cursor-pointer">Collections</span>
                    <span className="hover:text-white cursor-pointer">Living</span>
                    <span className="hover:text-white cursor-pointer">Journal</span>
                  </nav>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSimulatedAction}
                      className="relative p-2 text-slate-300 hover:text-white transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] flex items-center justify-center font-bold text-white">
                        {cartCount}
                      </span>
                    </button>
                  </div>
                </header>

                {/* Hero Banner */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 aspect-[21/9] flex items-center px-6 md:px-12">
                  <img
                    src={listing.thumbnail}
                    alt={listing.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                  <div className="relative z-10 max-w-lg space-y-3">
                    <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
                      Spring Architectural Edition
                    </span>
                    <h2 className="text-xl md:text-3xl font-light tracking-tight text-white font-serif">
                      Designed Simplicity for Modern Living
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300">
                      Explore our hand-finished furniture and sculptural lighting series.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={handleSimulatedAction}
                        className="px-4 py-2 text-xs font-medium text-slate-900 bg-white hover:bg-slate-100 rounded transition-all"
                      >
                        Explore Drop
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white">Curated Essentials</h3>
                      <p className="text-xs text-slate-400">Available for global shipping</p>
                    </div>
                    {addedItem && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                        <Check className="w-3 h-3" /> Added to cart
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'The Iso Dining Chair', price: '$2,850', tag: 'Black Oak' },
                      { name: 'Lyra Minimal Lamp', price: '$1,150', tag: 'Matte Brass' },
                      { name: 'Sculptural Moss Bowl', price: '$640', tag: 'Ceramic' },
                      { name: 'Brutalist Travertine Tray', price: '$480', tag: 'Stone' }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="group bg-[#121522] rounded-lg p-3 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between"
                      >
                        <div className="aspect-square bg-slate-800/80 rounded-md overflow-hidden relative mb-2">
                          <img
                            src={listing.thumbnail}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-400">{item.tag}</span>
                          <h4 className="text-xs font-medium text-white truncate">{item.name}</h4>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-semibold text-slate-200">{item.price}</span>
                            <button
                              onClick={handleSimulatedAction}
                              className="text-[11px] px-2 py-1 bg-white/10 hover:bg-blue-600 text-white rounded transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {listing.demoType === 'realestate' && (
              <div className="p-4 md:p-8 space-y-6">
                <header className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="font-serif tracking-widest text-lg font-bold text-white">
                    AVANT-GARDE ESTATES
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <span className="hover:text-white cursor-pointer font-medium">Properties</span>
                    <span className="hover:text-white cursor-pointer">Advisory</span>
                    <span className="hover:text-white cursor-pointer">Private Sales</span>
                  </div>
                </header>

                {/* Filter Toolbar */}
                <div className="p-3 bg-[#131728] rounded-xl border border-white/10 flex flex-wrap items-center gap-2 text-xs">
                  {['All', 'Villas', 'Mansions', 'Penthouses', 'Coastal'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedPropCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        selectedPropCategory === cat
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-slate-400 hover:text-white bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Villa Azure — Lake Como Waterfront',
                      location: 'Lake Como, Italy',
                      beds: '6 Beds · 7 Baths · 8,400 sqft',
                      price: '$14,500,000'
                    },
                    {
                      title: 'The Ridge — Aspen Mountain Estate',
                      location: 'Aspen, Colorado',
                      beds: '5 Beds · 6 Baths · 7,200 sqft',
                      price: '$18,800,000'
                    }
                  ].map((prop, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden border border-white/10 bg-[#121524] group"
                    >
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <img
                          src={listing.thumbnail}
                          alt={prop.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold text-emerald-400">
                          {prop.price}
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <span className="text-xs text-slate-400">{prop.location}</span>
                        <h4 className="text-sm font-semibold text-white">{prop.title}</h4>
                        <p className="text-xs text-slate-300">{prop.beds}</p>
                        <button
                          onClick={handleSimulatedAction}
                          className="w-full mt-2 py-2 text-xs font-medium text-center bg-white/10 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          Request Private Brochure
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.demoType === 'fashion' && (
              <div className="p-4 md:p-8 space-y-6">
                <header className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="font-mono tracking-widest text-lg font-bold text-white">
                    VOID ARCHIVES // EST 2026
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                    <span>COLLECTION 04</span>
                    <span>·</span>
                    <button
                      onClick={handleSimulatedAction}
                      className="hover:text-white text-white underline underline-offset-4"
                    >
                      BAG ({cartCount})
                    </button>
                  </div>
                </header>

                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-[21/9] flex items-end p-6">
                  <img
                    src={listing.thumbnail}
                    alt={listing.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-75"
                  />
                  <div className="relative z-10 space-y-2">
                    <span className="font-mono text-xs text-slate-300">AUTUMN / WINTER DROP</span>
                    <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-sans">
                      The Onyx Matrix
                    </h2>
                    <button
                      onClick={handleSimulatedAction}
                      className="px-4 py-2 bg-white text-black font-semibold text-xs rounded uppercase hover:bg-slate-200 transition-colors"
                    >
                      Shop Collection
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { title: 'Neo Cargo Pant', price: '$180', sizes: 'S · M · L · XL' },
                    { title: "Graphic Tee 'Chaos'", price: '$95', sizes: 'S · M · L' },
                    { title: "Tech Jacket 'Void'", price: '$275', sizes: 'M · L · XL' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#11131f] border border-white/10 rounded-lg space-y-2"
                    >
                      <div className="aspect-square bg-slate-900 rounded overflow-hidden">
                        <img
                          src={listing.thumbnail}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white">{item.title}</span>
                        <span className="font-mono text-slate-300">{item.price}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.sizes}</div>
                      <button
                        onClick={handleSimulatedAction}
                        className="w-full py-1.5 text-[11px] bg-white/10 hover:bg-white hover:text-black font-medium rounded transition-colors text-slate-200"
                      >
                        Quick Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.demoType === 'saas' && (
              <div className="p-4 md:p-8 space-y-6">
                <header className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                      AE
                    </div>
                    <span className="font-semibold text-sm text-white">Aether Cloud Console</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['24h', '7d', '30d'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSaasTimeframe(t)}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                          saasTimeframe === t
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white bg-white/5'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Active Projects', val: '128', sub: '+5.2% this week' },
                    { label: 'API Requests', val: '8.4M', sub: '+12.1% throughput' },
                    { label: 'Query Latency', val: '24ms', sub: '99.8% within SLA' },
                    { label: 'Uptime', val: '99.98%', sub: 'Zero critical outages' }
                  ].map((stat, idx) => (
                    <div key={idx} className="p-3 bg-[#131627] rounded-xl border border-white/5 space-y-1">
                      <span className="text-xs text-slate-400">{stat.label}</span>
                      <div className="text-lg md:text-xl font-bold text-white font-mono">{stat.val}</div>
                      <span className="text-[11px] text-emerald-400 block">{stat.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Chart Container */}
                <div className="p-4 bg-[#121626] rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">System Throughput & Edge Latency</span>
                    <span className="text-slate-400 font-mono">Simulated Live Stream</span>
                  </div>
                  <div className="h-44 w-full flex items-end gap-1 pt-4">
                    {[45, 62, 58, 80, 72, 90, 85, 94, 60, 75, 88, 92, 70, 85, 95, 80, 65, 89, 94, 78].map(
                      (h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t hover:from-blue-500 hover:to-indigo-300 transition-all cursor-pointer"
                          title={`Throughput: ${h * 10} req/s`}
                        ></div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Default / Fallback Demo view for other types */}
            {['portfolio', 'restaurant', 'generic'].includes(listing.demoType) && (
              <div className="p-4 md:p-8 space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-3 pt-6">
                  <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                    {listing.category}
                  </span>
                  <h2 className="text-2xl font-bold text-white">{listing.title}</h2>
                  <p className="text-xs text-slate-300">{listing.shortDescription}</p>
                </div>

                <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900 aspect-video relative">
                  <img
                    src={listing.thumbnail}
                    alt={listing.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 bg-[#121626] rounded-xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-semibold text-white">Included Modules & Pages</h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.includedPages.map((pg, i) => (
                      <span key={i} className="text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded">
                        {pg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Dock inside iframe container */}
          <div className="p-3 bg-[#0d101a] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full clean source code with developer handover documentation included</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white font-mono">
                {formatPrice(listing.priceUSD, currency)}
              </span>
              <button
                onClick={() => onBuy(listing)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                Buy Source Code
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
