import React from 'react';
import { X, Shield, FileText, RotateCcw } from 'lucide-react';

interface PolicyModalProps {
  type: 'terms' | 'privacy' | 'refund' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c0f1e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'terms' && (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <FileText className="w-5 h-5" />
              <span>Terms of Service — Smart Developer</span>
            </div>
            <p className="text-slate-400">Effective Date: October 2026</p>
            <h4 className="text-sm font-semibold text-white">1. Overview and Agreement</h4>
            <p>
              Smart Developer provides ready-made website templates, complete source code packages, and custom website development services. By purchasing website source code or contracting custom development, you agree to these terms.
            </p>
            <h4 className="text-sm font-semibold text-white">2. Source Code License Grant</h4>
            <p>
              - <strong>Single Commercial License:</strong> Grants you a non-exclusive right to install, modify, and run the website source code for a single production domain (for yourself or one commercial client).
            </p>
            <p>
              - <strong>Extended Multi-Client License:</strong> Grants you the right to deploy and customize the website across multiple client installations and commercial projects.
            </p>
            <p>
              You may not sub-license, resell, or distribute the raw source code as a competing marketplace template without written authorization.
            </p>
            <h4 className="text-sm font-semibold text-white">3. Custom Development Agreements</h4>
            <p>
              Custom projects are delivered according to specifications agreed upon following inquiry submission. Final deliverables are transferred upon full milestone verification.
            </p>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Shield className="w-5 h-5" />
              <span>Privacy Policy</span>
            </div>
            <p className="text-slate-400">Effective Date: October 2026</p>
            <h4 className="text-sm font-semibold text-white">1. Information Collection</h4>
            <p>
              We collect contact information (such as your full name, email address, country, and phone/WhatsApp number) solely for the purpose of communicating regarding your purchase orders, custom development inquiries, and source code delivery.
            </p>
            <h4 className="text-sm font-semibold text-white">2. Data Security & Storage</h4>
            <p>
              Your contact details and order logs are securely stored on our backend database. We do not sell, rent, or lease customer data to third-party advertisers or telemarketers.
            </p>
            <h4 className="text-sm font-semibold text-white">3. Payment Information</h4>
            <p>
              We do not store credit card numbers or private banking credentials on this server. All transactions are processed through verified direct invoices, Wise, Payoneer, or direct bank settlement channels.
            </p>
          </div>
        )}

        {type === 'refund' && (
          <div className="space-y-4 text-xs leading-relaxed">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <RotateCcw className="w-5 h-5" />
              <span>Refund & Handover Policy</span>
            </div>
            <p className="text-slate-400">Effective Date: October 2026</p>
            <h4 className="text-sm font-semibold text-white">1. Digital Source Code Deliverables</h4>
            <p>
              Due to the open and irrevocable nature of digital source code (unminified code packages, assets, and documentation), digital source code purchases are generally non-refundable once the download link or repository has been officially delivered to the verified buyer.
            </p>
            <h4 className="text-sm font-semibold text-white">2. Pre-Verification Cancellation</h4>
            <p>
              If an order request has been submitted but payment has not yet been processed or verified, you may cancel the purchase at any time with zero obligation.
            </p>
            <h4 className="text-sm font-semibold text-white">3. Defect & Support Guarantee</h4>
            <p>
              If a codebase contains critical bugs or fails to compile contrary to the live demo specifications, our developer will provide immediate technical assistance to resolve the issue within the included 30-day support window.
            </p>
          </div>
        )}

        <div className="pt-6 border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
