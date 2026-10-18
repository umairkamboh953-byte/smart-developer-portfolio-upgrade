import React, { useState } from 'react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/currency';
import { Code2, Globe, Menu, X, ArrowUpRight, Search, FileCheck, Lock } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  onOpenOrderStatus: () => void;
  onOpenAdminLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currency,
  onCurrencyChange,
  onOpenOrderStatus,
  onOpenAdminLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    setMobileMenuOpen(false);
    if (onOpenAdminLogin) {
      onOpenAdminLogin();
    } else {
      window.history.pushState(null, '', '/admin/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090E]/95 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2 sm:gap-2.5 text-left font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer min-h-[44px] py-1"
          aria-label="Smart Developer Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
            Smart Developer
          </span>
        </button>

        {/* Zone 2: Desktop 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleLinkClick('home')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-2 ${
              currentView === 'home' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleLinkClick('marketplace')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-2 ${
              currentView === 'marketplace' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Explore Websites
          </button>
          <button
            onClick={() => handleLinkClick('categories')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-2 ${
              currentView === 'categories' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => handleLinkClick('custom')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-2 ${
              currentView === 'custom' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Custom Development
          </button>
          <button
            onClick={() => handleLinkClick('about')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-2 ${
              currentView === 'about' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            About
          </button>
          <button
            onClick={() => handleLinkClick('contact')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-2 ${
              currentView === 'contact' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Desktop Action Buttons & Currency */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="relative flex items-center bg-[#131625] border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="bg-transparent border-none text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              aria-label="Select Currency"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                <option key={c} value={c} className="bg-[#121626] text-slate-200">
                  {c} ({CURRENCIES[c].symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => handleLinkClick('marketplace')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm hover:shadow-blue-500/25 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Browse Websites</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View: Hamburger Menu Button with 44x44px touch area */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-w-[44px] min-h-[44px] p-2 text-slate-300 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              /* Three Lines Hamburger Icon */
              <div className="w-5 h-4 flex flex-col justify-between items-center">
                <span className="w-5 h-0.5 bg-white rounded-full transition-transform"></span>
                <span className="w-5 h-0.5 bg-white rounded-full transition-transform"></span>
                <span className="w-5 h-0.5 bg-white rounded-full transition-transform"></span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with ALL buttons inside & auto-close on selection */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b border-white/10 bg-[#0a0c16]/98 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Prominent Primary CTA inside mobile drawer */}
          <button
            onClick={() => handleLinkClick('marketplace')}
            className="w-full min-h-[44px] py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Browse All Websites</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* Navigation Links List with accessible min 44px touch target */}
          <nav className="space-y-1 pt-1 border-t border-white/5" aria-label="Mobile menu links">
            <button
              onClick={() => handleLinkClick('home')}
              className={`w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentView === 'home'
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>Home</span>
              <span className="text-slate-600 text-xs">/</span>
            </button>

            <button
              onClick={() => handleLinkClick('marketplace')}
              className={`w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentView === 'marketplace'
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>Explore Websites</span>
              <span className="text-slate-600 text-xs">/</span>
            </button>

            <button
              onClick={() => handleLinkClick('categories')}
              className={`w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentView === 'categories'
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>Categories</span>
              <span className="text-slate-600 text-xs">/</span>
            </button>

            <button
              onClick={() => handleLinkClick('custom')}
              className={`w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentView === 'custom'
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>Request Custom Development</span>
              <span className="text-slate-600 text-xs">/</span>
            </button>

            <button
              onClick={() => handleLinkClick('about')}
              className={`w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentView === 'about'
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>About Developer</span>
              <span className="text-slate-600 text-xs">/</span>
            </button>

            <button
              onClick={() => handleLinkClick('contact')}
              className={`w-full text-left min-h-[44px] py-2.5 px-3.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                currentView === 'contact'
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>Contact Us</span>
              <span className="text-slate-600 text-xs">/</span>
            </button>
          </nav>

          {/* Action Tools Section Inside Drawer */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">
            {/* Order Status Checker Button */}
            <button
              onClick={() => {
                onOpenOrderStatus();
                setMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] py-2.5 px-3.5 bg-[#121629] hover:bg-[#1a203b] border border-white/10 text-slate-200 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span>Track Order / Access Code</span>
              </div>
              <span className="text-[11px] text-blue-400 font-semibold">Track →</span>
            </button>

            {/* Currency Switcher in Mobile Drawer */}
            <div className="p-3 bg-[#121629] border border-white/10 rounded-xl flex items-center justify-between min-h-[44px]">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Display Currency</span>
              </div>

              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-[#191e36] text-white border border-white/10 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none cursor-pointer"
                aria-label="Select Currency"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                  <option key={c} value={c} className="bg-[#121626] text-slate-200">
                    {c} ({CURRENCIES[c].symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Login Link in Mobile Navigation */}
            <button
              onClick={handleAdminClick}
              className="w-full min-h-[44px] py-2 px-3 text-slate-400 hover:text-slate-200 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Administrator Portal Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
