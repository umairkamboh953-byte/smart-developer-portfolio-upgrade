import React from 'react';
import { PublicSettings } from '../types';
import { Code2, Mail, MessageSquare, Lock, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  settings: PublicSettings;
  onNavigate: (view: string) => void;
  onSelectCategory: (cat: string) => void;
  onOpenAdminLogin: () => void;
  onOpenPolicy: (type: 'terms' | 'privacy' | 'refund') => void;
  onOpenOrderStatus: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onSelectCategory,
  onOpenAdminLogin,
  onOpenPolicy,
  onOpenOrderStatus
}) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#06070c] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Smart Developer
              </span>
            </div>

            <p className="text-slate-400 max-w-sm leading-relaxed">
              Premium website portfolio and code marketplace for modern businesses. Providing ready-to-deploy web solutions, unminified source code, and custom software development.
            </p>

            {/* Configured Contact Info */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${settings.businessEmail || 'smartbuy9@gmail.com'}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.businessEmail || 'smartbuy9@gmail.com'}
                </a>
              </div>

              {settings.whatsappEnabled && settings.whatsappNumber && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-300 transition-colors"
                  >
                    WhatsApp Support ({settings.whatsappNumber})
                  </a>
                </div>
              )}
            </div>

            {/* Optional Social Links if configured */}
            {(settings.socialLinks?.github || settings.socialLinks?.linkedin || settings.socialLinks?.twitter) && (
              <div className="flex items-center gap-4 pt-2 text-slate-400">
                {settings.socialLinks.github && (
                  <a
                    href={settings.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {settings.socialLinks.linkedin && (
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {settings.socialLinks.twitter && (
                  <a
                    href={settings.socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Twitter/X
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-white transition-colors"
                >
                  Explore Websites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('custom')}
                  className="hover:text-white transition-colors"
                >
                  Custom Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About the Developer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Form
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenOrderStatus}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>Track Order Status</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Popular Categories
            </h4>
            <ul className="space-y-2">
              {[
                'E-commerce Stores',
                'Real Estate Websites',
                'Clothing Brand Websites',
                'SaaS and Web Applications',
                'Portfolio Websites',
                'Landing Pages'
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigate('marketplace');
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Legal & Admin Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Policies & Portal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('refund')}
                  className="hover:text-white transition-colors"
                >
                  Refund Policy
                </button>
              </li>
              <li className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin Login</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-12 mt-12 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Smart Developer. All commercial rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Serving Pakistan, USA, UK, Canada, Australia & Worldwide</span>
            <span aria-hidden="true">·</span>
            <span>Unminified Clean Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
