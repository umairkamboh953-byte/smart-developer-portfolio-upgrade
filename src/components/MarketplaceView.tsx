import React, { useState, useMemo } from 'react';
import { WebsiteListing, CurrencyCode } from '../types';
import { WebsiteCard } from './WebsiteCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Sparkles, X } from 'lucide-react';
import { CATEGORIES_LIST } from './CategoriesSection';

interface MarketplaceViewProps {
  listings: WebsiteListing[];
  currency: CurrencyCode;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onLiveDemo: (listing: WebsiteListing) => void;
  onViewDetails: (listing: WebsiteListing) => void;
  onBuy: (listing: WebsiteListing) => void;
  onRequestCustom: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  currency,
  selectedCategory,
  onSelectCategory,
  onLiveDemo,
  onViewDetails,
  onBuy,
  onRequestCustom
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [techFilter, setTechFilter] = useState<string | null>(null);

  // Available unique technologies
  const allTechs = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((l) => l.techStack.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 8);
  }, [listings]);

  // Filter and sort logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => {
        if (selectedCategory && l.category !== selectedCategory) return false;
        if (techFilter && !l.techStack.includes(techFilter)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = l.title.toLowerCase().includes(q);
          const matchDesc = l.shortDescription.toLowerCase().includes(q);
          const matchTech = l.techStack.some((t) => t.toLowerCase().includes(q));
          const matchCat = l.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTech && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
        if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // Default: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [listings, selectedCategory, techFilter, searchQuery, sortBy]);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 animate-in fade-in duration-300">
      {/* Page Title & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-400">Production Code Catalog</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Explore Ready-Made Websites
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Browse our full-stack website packages. Inspect live interactive demos, examine included tech stacks, and purchase clean unminified source code.
          </p>
        </div>

        {/* Custom Request Callout */}
        <button
          onClick={onRequestCustom}
          className="self-start md:self-auto min-h-[44px] px-4 py-2.5 text-xs font-semibold text-blue-400 hover:text-white bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Need a custom website? Get a quote →</span>
        </button>
      </div>

      {/* Search, Category Filter & Sorting Toolbar */}
      <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0c0f1d]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by keywords, tech (e.g. React, Stripe), or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="min-w-[40px] min-h-[40px] absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full min-h-[44px] px-3 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              aria-label="Sort websites"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Releases</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills (Touch-friendly horizontal scrollbar with smooth momentum swipe) */}
        <div className="pt-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs -mx-1 px-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium shrink-0 cursor-pointer flex items-center ${
              selectedCategory === null
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            All Categories ({listings.length})
          </button>

          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = listings.filter((l) => l.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                <span>{cat.title}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Tech Stack Filter if present */}
        {allTechs.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400 overflow-x-auto pb-1 scrollbar-none">
            <span className="shrink-0 font-medium text-slate-500 mr-1">Tech filter:</span>
            {allTechs.map((t) => (
              <button
                key={t}
                onClick={() => setTechFilter(techFilter === t ? null : t)}
                className={`min-h-[32px] px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center ${
                  techFilter === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#141829] text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
            {techFilter && (
              <button
                onClick={() => setTechFilter(null)}
                className="text-xs text-rose-400 hover:text-rose-300 ml-1 underline cursor-pointer shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid of Website Cards */}
      {filteredListings.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-white/10 bg-[#0c0f1c] space-y-4 px-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No websites match your filter</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or clearing the selected category.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory(null);
              setTechFilter(null);
            }}
            className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredListings.map((listing) => (
            <WebsiteCard
              key={listing.id}
              listing={listing}
              currency={currency}
              onLiveDemo={onLiveDemo}
              onViewDetails={onViewDetails}
              onBuy={onBuy}
            />
          ))}
        </div>
      )}
    </div>
  );
};
