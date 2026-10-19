import React, { useState } from 'react';
import { WebsiteListing, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import {
  Eye,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Smartphone,
  ShieldCheck,
  Code2,
  FileCode,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface WebsiteDetailViewProps {
  listing: WebsiteListing;
  allListings: WebsiteListing[];
  currency: CurrencyCode;
  onBack: () => void;
  onLiveDemo: (listing: WebsiteListing) => void;
  onBuy: (listing: WebsiteListing) => void;
  onSelectListing: (listing: WebsiteListing) => void;
  onRequestCustom: () => void;
}

export const WebsiteDetailView: React.FC<WebsiteDetailViewProps> = ({
  listing,
  allListings,
  currency,
  onBack,
  onLiveDemo,
  onBuy,
  onSelectListing,
  onRequestCustom
}) => {
  const [activeImage, setActiveImage] = useState<string>(listing.thumbnail);

  const relatedListings = allListings
    .filter((l) => l.id !== listing.id && (l.category === listing.category || l.featured))
    .slice(0, 3);

  return (
    <div className="py-6 sm:py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[40px] py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Main Grid: Left Media & Specs / Right Purchase Card (Stacked cleanly on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left Column: Media & Deep Details */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-10">
          {/* Main Visual Preview */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0c0f1c] shadow-2xl relative">
            <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
              <ImageWithFallback
                src={activeImage || listing.thumbnail}
                alt={listing.title}
                category={listing.category}
                title={listing.title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick Action Bar under main preview */}
            <div className="p-3 sm:p-4 bg-[#111424] border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="font-semibold text-white">{listing.category}</span>
                <span aria-hidden="true">·</span>
                <span>{listing.techStack[0]}</span>
              </div>

              <button
                onClick={() => onLiveDemo(listing)}
                className="min-h-[44px] px-4 py-2.5 text-xs font-semibold text-white bg-[#1a1f38] hover:bg-[#252c4e] border border-white/10 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Eye className="w-4 h-4" />
                <span>Launch Interactive Live Demo</span>
              </button>
            </div>
          </div>

          {/* Screenshots Gallery if available */}
          {listing.screenshots && listing.screenshots.length > 1 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Page Previews & Mockups
              </h4>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
                {listing.screenshots.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                      activeImage === img ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      category={listing.category}
                      title={listing.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Overview */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Project Overview</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.fullDescription || listing.shortDescription}
            </p>
          </div>

          {/* Included Pages & Views */}
          <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-2xl border border-white/10 bg-[#0d101e]">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Included Modules & Screens</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {listing.includedPages.map((page, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{page}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack & Responsive Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-[#0d101e] space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Technology Stack</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {listing.techStack.map((tech, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-[#0d101e] space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>Responsive Viewport Specs</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {listing.responsiveSpecs}
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                100% fluid CSS grid and flexbox logic without hardcoded device widths.
              </div>
            </div>
          </div>

          {/* What the Buyer Receives */}
          <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-[#0d101e] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>What You Receive (Deliverables Package)</span>
            </div>
            <ul className="space-y-2.5 sm:space-y-3">
              {listing.whatYouReceive.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Sticky Purchase Box & Customization */}
        <div className="lg:col-span-4 space-y-6">
          <div className="lg:sticky lg:top-24 rounded-2xl border border-white/15 bg-[#0f1324] p-5 sm:p-6 shadow-2xl space-y-5 sm:space-y-6">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-blue-400">{listing.category}</div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white">{listing.title}</h1>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                Full Source Code License
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                {formatPrice(listing.priceUSD, currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Single commercial project usage with unlimited end-users.
              </p>
            </div>

            {/* CTAs with 44px min touch height */}
            <div className="space-y-3 pt-1">
              <button
                onClick={() => onBuy(listing)}
                className="w-full min-h-[44px] py-3.5 px-4 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Source Code ({formatPrice(listing.priceUSD, currency)})</span>
              </button>

              <button
                onClick={() => onLiveDemo(listing)}
                className="w-full min-h-[44px] py-3 px-4 text-xs font-medium text-slate-200 bg-[#161a2e] hover:bg-[#202642] hover:text-white border border-white/10 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Eye className="w-4 h-4" />
                <span>Interactive Live Demo</span>
              </button>
            </div>

            {/* Security Notice */}
            <div className="pt-3 sm:pt-4 border-t border-white/10 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Handover & Unminified Code</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Code files are delivered in an encrypted download bundle following official payment verification.
              </p>
            </div>

            {/* Customization Add-ons */}
            {listing.customizationServices && listing.customizationServices.length > 0 && (
              <div className="pt-3 sm:pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>Available Customization</span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="space-y-2">
                  {listing.customizationServices.map((service, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#141829] border border-white/5 flex items-center justify-between text-xs gap-2"
                    >
                      <span className="text-slate-300 text-[11px] sm:text-xs">{service.title}</span>
                      <span className="font-mono text-blue-400 font-semibold shrink-0">
                        +{formatPrice(service.priceUSD, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Need Custom Changes Callout */}
            <div className="pt-3 sm:pt-4 border-t border-white/10">
              <button
                onClick={onRequestCustom}
                className="w-full min-h-[40px] py-2 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Need tailored custom development?</span>
                <span className="text-blue-400 font-medium">Inquire →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Websites */}
      {relatedListings.length > 0 && (
        <div className="pt-8 sm:pt-12 border-t border-white/10 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white">Related Website Templates</h3>
            <button
              onClick={onBack}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer py-1"
            >
              Browse All ({allListings.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {relatedListings.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectListing(rel)}
                className="group rounded-xl overflow-hidden border border-white/10 bg-[#0d101d] hover:border-white/20 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={rel.thumbnail}
                    alt={rel.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[11px] text-blue-400 font-medium">{rel.category}</span>
                  <h4 className="text-sm font-semibold text-white truncate">{rel.title}</h4>
                  <div className="text-xs font-bold text-slate-200 font-mono pt-1">
                    {formatPrice(rel.priceUSD, currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
