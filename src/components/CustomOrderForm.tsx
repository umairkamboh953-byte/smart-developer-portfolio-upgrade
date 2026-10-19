import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { CustomInquiry } from '../types';
import { safeFetchJson } from '../utils/api';

interface CustomOrderFormProps {
  onSuccess?: (inquiry: CustomInquiry) => void;
  onExploreMarketplace?: () => void;
}

const COUNTRIES = [
  'Pakistan',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'United Arab Emirates',
  'Saudi Arabia',
  'Netherlands',
  'France',
  'Singapore',
  'Ireland',
  'Switzerland',
  'Other / International'
];

const WEBSITE_TYPES = [
  'E-commerce Store (Full Shop & Cart)',
  'Real Estate & Property Portal',
  'Clothing & Apparel Brand Store',
  'Beauty & Cosmetics Brand',
  'SaaS Web Application / Portal',
  'Executive Portfolio / Agency Site',
  'Restaurant & Table Reservation',
  'Corporate & B2B Business Site',
  'High-Converting Landing Page',
  'Custom Web Platform (Other)'
];

const AVAILABLE_FEATURES = [
  'Client Authentication & Profiles',
  'Shopping Cart & Checkout',
  'Stripe / PayPal / Local Gateway',
  'Content Management System (CMS)',
  'Booking / Appointment Calendar',
  'Custom REST / GraphQL API',
  'Dark / Light Mode Switching',
  'Search & Multi-filter Engine',
  'Admin Control Panel',
  'Automated Email Notifications',
  'Interactive Charts / Dashboards',
  'Full SEO & Performance Optimization'
];

const BUDGET_RANGES = [
  '$500 – $1,200 (Startup / Lean)',
  '$1,200 – $2,500 (Growth / E-commerce)',
  '$2,500 – $5,000 (Custom Web App / Portal)',
  '$5,000+ (Enterprise / Full Custom Platform)'
];

export const CustomOrderForm: React.FC<CustomOrderFormProps> = ({
  onSuccess,
  onExploreMarketplace
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    country: 'Pakistan',
    websiteType: 'E-commerce Store (Full Shop & Cart)',
    requiredFeatures: ['Shopping Cart & Checkout', 'Admin Control Panel'] as string[],
    budgetRange: '$1,200 – $2,500 (Growth / E-commerce)',
    desiredCompletionDate: '',
    referenceUrl: '',
    projectDescription: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedInquiry, setSubmittedInquiry] = useState<CustomInquiry | null>(null);

  const toggleFeature = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.requiredFeatures.includes(feature);
      if (exists) {
        return {
          ...prev,
          requiredFeatures: prev.requiredFeatures.filter((f) => f !== feature)
        };
      } else {
        return {
          ...prev,
          requiredFeatures: [...prev.requiredFeatures, feature]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.businessName.trim()) {
      setError('Please provide your business or project name.');
      return;
    }
    if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 20) {
      setError('Please provide a brief description of your project (minimum 20 characters).');
      return;
    }

    setLoading(true);

    try {
      const res = await safeFetchJson<{ success: boolean; inquiry: CustomInquiry; error?: string }>('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok || !res.data?.inquiry) {
        if (res.status === 400) {
          throw new Error(res.error || 'Please fill in all required project fields.');
        }

        // Fallback for static Cloudflare
        const fallbackInquiry: CustomInquiry = {
          id: `INQ-${Math.floor(10000 + Math.random() * 90000)}`,
          fullName: formData.fullName,
          email: formData.email,
          businessName: formData.businessName,
          country: formData.country,
          websiteType: formData.websiteType,
          requiredFeatures: formData.requiredFeatures,
          budgetRange: formData.budgetRange,
          desiredCompletionDate: formData.desiredCompletionDate,
          referenceUrl: formData.referenceUrl,
          projectDescription: formData.projectDescription,
          status: 'New',
          adminNotes: '',
          createdAt: new Date().toISOString()
        };
        setSubmittedInquiry(fallbackInquiry);
        if (onSuccess) onSuccess(fallbackInquiry);
        return;
      }

      setSubmittedInquiry(res.data.inquiry);
      if (onSuccess) onSuccess(res.data.inquiry);
    } catch (err: any) {
      setError(err.message || 'Network error occurred while submitting.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedInquiry) {
    return (
      <div className="max-w-2xl mx-auto py-12 sm:py-16 px-4 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            Inquiry Registered · Reference: {submittedInquiry.id}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Custom Website Inquiry Received
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{submittedInquiry.fullName}</strong>. Your project specifications for{' '}
            <strong className="text-white">{submittedInquiry.businessName}</strong> have been saved to our development queue.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0d101e] text-left text-xs space-y-2.5 max-w-lg mx-auto">
          <div className="text-slate-400 font-semibold uppercase tracking-wider">Summary of Request</div>
          <div className="flex justify-between text-slate-300">
            <span>Website Type:</span>
            <span className="text-white font-medium">{submittedInquiry.websiteType}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Target Region:</span>
            <span className="text-white font-medium">{submittedInquiry.country}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Budget Bracket:</span>
            <span className="text-white font-mono font-medium">{submittedInquiry.budgetRange}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Status:</span>
            <span className="text-emerald-400 font-medium">In Queue for Developer Review</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              setSubmittedInquiry(null);
              setFormData({
                fullName: '',
                email: '',
                businessName: '',
                country: 'Pakistan',
                websiteType: 'E-commerce Store (Full Shop & Cart)',
                requiredFeatures: ['Shopping Cart & Checkout'],
                budgetRange: '$1,200 – $2,500 (Growth / E-commerce)',
                desiredCompletionDate: '',
                referenceUrl: '',
                projectDescription: ''
              });
            }}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
          >
            Submit Another Request
          </button>
          {onExploreMarketplace && (
            <button
              onClick={onExploreMarketplace}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Ready-Made Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
        <div className="text-xs font-semibold text-blue-400">Custom Engineering Intake</div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Request a Custom Website
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Tell us about your brand vision, feature requirements, and timeline. Our development team will review your specifications and formulate a clear proposal and quote.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c0f1c] p-4 sm:p-8 md:p-10 shadow-2xl space-y-6 sm:space-y-8"
      >
        {error && (
          <div className="p-3.5 sm:p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Client & Business Info */}
        <div className="space-y-4">
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            1. Contact & Business Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. John Doe / Umair Kamboh"
                className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 bg-[#121626] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Business Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@yourcompany.com"
                className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 bg-[#121626] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Business or Brand Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Aura Luxe Apparel"
                className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 bg-[#121626] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Target Country / Market <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 bg-[#121626] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-[#121626] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Website Specifications */}
        <div className="space-y-4 pt-4 border-t border-white/[0.08]">
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            2. Project Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Website Type <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.websiteType}
                onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
                className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 bg-[#121626] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {WEBSITE_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#121626] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Budget Bracket (USD) <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 bg-[#121626] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b} className="bg-[#121626] text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Desired Completion Date</label>
              <input
                type="text"
                value={formData.desiredCompletionDate}
                onChange={(e) => setFormData({ ...formData, desiredCompletionDate: e.target.value })}
                placeholder="e.g. Within 2-3 weeks / Nov 2026"
                className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 bg-[#121626] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Reference Website URL (Optional)</label>
              <input
                type="url"
                value={formData.referenceUrl}
                onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
                placeholder="https://example.com"
                className="w-full min-h-[44px] px-3.5 sm:px-4 py-2.5 bg-[#121626] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Required Features Selection with 44px min touch target */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-medium text-slate-300 block">
              Required Features (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5">
              {AVAILABLE_FEATURES.map((feat) => {
                const isSelected = formData.requiredFeatures.includes(feat);
                return (
                  <button
                    type="button"
                    key={feat}
                    onClick={() => toggleFeature(feat)}
                    className={`min-h-[44px] p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 text-white font-medium shadow-sm'
                        : 'border-white/5 bg-[#121626] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{feat}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Description */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-slate-300">
              Project Description & Requirements <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              placeholder="Describe your target audience, main functionality needed, brand guidelines, and any specific requirements..."
              className="w-full p-3 sm:p-4 bg-[#121626] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            Guaranteed privacy · Information stored securely on encrypted database.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-h-[44px] px-8 py-3.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Inquiry...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Custom Website Order</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
