import React from 'react';
import { WebsiteListing, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { Eye, ShoppingBag, ArrowRight, Code } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface WebsiteCardProps {
  listing: WebsiteListing;
  currency: CurrencyCode;
  onLiveDemo: (listing: WebsiteListing) => void;
  onViewDetails: (listing: WebsiteListing) => void;
  onBuy: (listing: WebsiteListing) => void;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({
  listing,
  currency,
  onLiveDemo,
  onViewDetails,
  onBuy
}) => {
  return (
    <div className="group rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0e111d] hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-black/60">
      {/* Top Preview Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <ImageWithFallback
          src={listing.thumbnail}
          alt={listing.title}
          category={listing.category}
          title={listing.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Subtle dark gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e111d] via-transparent to-transparent opacity-50" />

        {/* Hover Quick-Demo Overlay (Desktop) */}
        <div className="hidden sm:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3 backdrop-blur-xs">
          <button
            onClick={() => onLiveDemo(listing)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Demo</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400">
            <span className="text-blue-400 font-medium">{listing.category}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.techStack[0]}</span>
            {listing.techStack[1] && (
              <>
                <span aria-hidden="true">·</span>
                <span className="hidden sm:inline">{listing.techStack[1]}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(listing)}
            className="text-sm sm:text-base font-bold text-white hover:text-blue-400 transition-colors cursor-pointer line-clamp-2"
          >
            {listing.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {listing.shortDescription}
          </p>
        </div>

        {/* Footer Area: Price & Functional Action Controls */}
        <div className="pt-3 sm:pt-4 border-t border-white/[0.06] space-y-2.5 sm:space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 block uppercase tracking-wider">
                Source Code
              </span>
              <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                {formatPrice(listing.priceUSD, currency)}
              </span>
            </div>
            <button
              onClick={() => onViewDetails(listing)}
              className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer py-1"
            >
              <span>View Specs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Action Buttons Row with 44px min touch height on mobile */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLiveDemo(listing)}
              className="w-full min-h-[44px] py-2 px-2.5 sm:px-3 text-xs font-medium text-slate-200 bg-[#15192c] hover:bg-[#1f253e] hover:text-white border border-white/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>Live Demo</span>
            </button>

            <button
              onClick={() => onBuy(listing)}
              className="w-full min-h-[44px] py-2 px-2.5 sm:px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>Buy Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
