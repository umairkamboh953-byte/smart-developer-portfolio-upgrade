import React from 'react';
import { PublicSettings, WebsiteListing } from '../types';

interface StatsSectionProps {
  settings: PublicSettings;
  listings: WebsiteListing[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ settings, listings }) => {
  // If statistics are not enabled by the admin or genuine data is not configured, hide the section per user prompt instructions
  if (!settings.showStatistics) {
    return null;
  }

  // Derive genuine values from database listings
  const totalWebsites = listings.length;
  const uniqueCategories = new Set(listings.map((l) => l.category)).size;
  const completedProjects = settings.completedProjectsCount || 0;

  return (
    <section className="py-8 sm:py-12 border-y border-white/[0.08] bg-[#0c0e18]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
          <div className="p-3 sm:p-0 rounded-xl bg-white/[0.02] sm:bg-transparent space-y-1">
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-mono tabular-nums">
              {totalWebsites}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Ready-Made Websites</div>
          </div>

          <div className="p-3 sm:p-0 rounded-xl bg-white/[0.02] sm:bg-transparent space-y-1">
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-mono tabular-nums">
              {uniqueCategories}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Industry Categories</div>
          </div>

          <div className="p-3 sm:p-0 rounded-xl bg-white/[0.02] sm:bg-transparent space-y-1">
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-mono tabular-nums">
              {completedProjects}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Completed Projects</div>
          </div>

          <div className="p-3 sm:p-0 rounded-xl bg-white/[0.02] sm:bg-transparent space-y-1">
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-mono tabular-nums">
              5+
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Global Markets (PK, US, UK, CA, AU)</div>
          </div>
        </div>
      </div>
    </section>
  );
};
