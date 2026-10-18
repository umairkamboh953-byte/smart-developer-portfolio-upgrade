import React from 'react';
import {
  ShoppingBag,
  Building2,
  Shirt,
  Sparkles,
  Briefcase,
  Utensils,
  Globe,
  Rocket,
  Layers,
  ArrowRight
} from 'lucide-react';
import { WebsiteListing } from '../types';

interface CategoriesSectionProps {
  onSelectCategory: (category: string) => void;
  listings: WebsiteListing[];
}

export const CATEGORIES_LIST = [
  {
    id: 'E-commerce Stores',
    title: 'E-commerce Stores',
    description: 'High-converting luxury stores, cart drawers, Stripe ready checkout architectures.',
    icon: ShoppingBag,
  },
  {
    id: 'Real Estate Websites',
    title: 'Real Estate Websites',
    description: 'Architectural property search portals, immersive luxury villa listings, viewing inquiry capture.',
    icon: Building2,
  },
  {
    id: 'Clothing Brand Websites',
    title: 'Clothing Brand Websites',
    description: 'High-fashion streetwear drops, seasonal lookbooks, variant size pickers, rapid bag flows.',
    icon: Shirt,
  },
  {
    id: 'Beauty and Cosmetics Stores',
    title: 'Beauty and Cosmetics Stores',
    description: 'Skincare formulations, ingredient accordions, beauty routine selectors, authentic customer reviews.',
    icon: Sparkles,
  },
  {
    id: 'Portfolio Websites',
    title: 'Portfolio Websites',
    description: 'Impactful editorial portfolios for developers, creative directors, and digital agencies.',
    icon: Briefcase,
  },
  {
    id: 'Restaurant Websites',
    title: 'Restaurant Websites',
    description: 'Culinary menus, private dining reservation workflows, fine dining aesthetic layouts.',
    icon: Utensils,
  },
  {
    id: 'Business Websites',
    title: 'Business Websites',
    description: 'Corporate B2B presentation, multi-tier service pricing matrices, client intake pipelines.',
    icon: Globe,
  },
  {
    id: 'SaaS Websites',
    title: 'SaaS Websites',
    description: 'High-tech developer tool interfaces, interactive pricing toggles, documentation layouts.',
    icon: Rocket,
  },
  {
    id: 'Landing Pages',
    title: 'Landing Pages',
    description: 'Ultra-fast focused campaign landers engineered for maximum conversion with zero distractions.',
    icon: Layers,
  }
];

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSelectCategory,
  listings
}) => {
  return (
    <section className="py-12 sm:py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="text-xs font-semibold text-blue-400">Curated Specializations</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Industry-Specific Website Solutions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Every template is tailored for industry workflows, from responsive product carousels to multi-tier booking engines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CATEGORIES_LIST.map((cat) => {
            const Icon = cat.icon;
            const count = listings.filter((l) => l.category === cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group p-4 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#0c0f1a] hover:border-blue-500/40 hover:bg-[#111526] transition-all duration-300 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                        {cat.title}
                      </h3>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono shrink-0">
                        {count > 0 ? `${count} available` : 'Custom build'}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition-colors min-h-[36px]">
                  <span className="font-medium">Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
