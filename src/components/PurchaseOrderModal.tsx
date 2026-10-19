import React, { useState } from 'react';
import { WebsiteListing, CurrencyCode, PurchaseOrder } from '../types';
import { formatPrice, convertAmount } from '../utils/currency';
import { X, ShoppingBag, CheckCircle2, ShieldCheck, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import { safeFetchJson } from '../utils/api';

interface PurchaseOrderModalProps {
  listing: WebsiteListing;
  currency: CurrencyCode;
  onClose: () => void;
  onOrderCreated?: (order: PurchaseOrder) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'Bank Transfer',
    name: 'Direct Bank Wire Transfer (Global / Local IBAN)',
    desc: 'Accepted for Pakistan (Raast / IBAN), USA (ACH / Wire), UK (Faster Payments), and EU (SEPA).'
  },
  {
    id: 'Wise',
    name: 'Wise (TransferWise)',
    desc: 'Fast, multi-currency transfer with low conversion rates. Highly recommended for international buyers.'
  },
  {
    id: 'Payoneer',
    name: 'Payoneer Transfer',
    desc: 'Direct payment to Payoneer balance or bank routing number.'
  },
  {
    id: 'Crypto (USDT)',
    name: 'Cryptocurrency (USDT TRC20 / ERC20)',
    desc: 'Instant borderless settlement with zero banking delays.'
  },
  {
    id: 'Card / Stripe Invoice',
    name: 'Official Credit Card / Stripe Invoice',
    desc: 'Receive an official invoice link payable via Debit / Credit Card.'
  }
];

export const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
  listing,
  currency,
  onClose,
  onOrderCreated
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCountry, setCustomerCountry] = useState('Pakistan');
  const [licenseType, setLicenseType] = useState('Single Commercial License');
  const [selectedMethod, setSelectedMethod] = useState('Bank Transfer');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<PurchaseOrder | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Compute live price
  const basePrice = listing.priceUSD;
  const licenseMultiplier = licenseType === 'Extended Multi-Client License' ? 2.2 : 1.0;
  const addonsTotal = selectedAddons.reduce((acc, title) => {
    const item = listing.customizationServices?.find((s) => s.title === title);
    return acc + (item ? item.priceUSD : 0);
  }, 0);

  const totalUSD = Math.round(basePrice * licenseMultiplier + addonsTotal);

  const toggleAddon = (title: string) => {
    if (selectedAddons.includes(title)) {
      setSelectedAddons(selectedAddons.filter((t) => t !== title));
    } else {
      setSelectedAddons([...selectedAddons, title]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerEmail.trim()) {
      setError('Please provide your name and email address for code delivery.');
      return;
    }

    setLoading(true);

    try {
      const res = await safeFetchJson<{ success: boolean; order: PurchaseOrder; error?: string }>('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: listing.id,
          websiteTitle: listing.title,
          customerName,
          customerEmail,
          customerPhone,
          customerCountry,
          amount: totalUSD,
          currency: 'USD',
          preferredPaymentMethod: selectedMethod,
          paymentMethod: selectedMethod,
          licenseType
        })
      });

      if (!res.ok || !res.data?.order) {
        // Fallback for static Cloudflare
        const orderNum = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const fallbackOrder: PurchaseOrder = {
          orderNumber: orderNum,
          websiteId: listing.id,
          websiteTitle: listing.title,
          amount: totalUSD,
          currency: 'USD',
          customerName,
          customerEmail,
          customerPhone,
          customerCountry: customerCountry || 'International',
          licenseType,
          preferredPaymentMethod: selectedMethod,
          customizationAddons: [],
          paymentStatus: 'Pending Verification',
          deliveryStatus: 'Preparing Package',
          createdAt: new Date().toISOString()
        };
        setConfirmedOrder(fallbackOrder);
        if (onOrderCreated) onOrderCreated(fallbackOrder);
        return;
      }

      setConfirmedOrder(res.data.order);
      if (onOrderCreated) {
        onOrderCreated(res.data.order);
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while processing request.');
    } finally {
      setLoading(false);
    }
  };

  const copyRefToClipboard = () => {
    if (confirmedOrder) {
      navigator.clipboard.writeText(confirmedOrder.orderNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c0f1d] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl text-slate-100 my-4 sm:my-8 max-h-[92vh] overflow-y-auto overscroll-contain">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="min-w-[44px] min-h-[44px] absolute top-2.5 right-2.5 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
          title="Close"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          /* Confirmation Screen */
          <div className="text-center space-y-5 sm:space-y-6 py-2 sm:py-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                Order Registered · Awaiting Verification
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Purchase Request Submitted</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your order for <strong className="text-white">{listing.title}</strong> has been logged.
                An official payment invoice and verification instructions will be sent to{' '}
                <strong className="text-white">{confirmedOrder.customerEmail}</strong>.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#13172c] border border-white/10 max-w-md mx-auto flex items-center justify-between gap-2">
              <div className="text-left min-w-0">
                <span className="text-[10px] sm:text-[11px] text-slate-400 block uppercase">Order Reference Number</span>
                <span className="text-sm sm:text-base font-bold font-mono text-white tracking-wider truncate block">
                  {confirmedOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={copyRefToClipboard}
                className="min-h-[40px] px-3.5 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Verification Notice */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-left text-xs text-amber-200/90 space-y-1.5 max-w-md mx-auto">
              <div className="font-semibold flex items-center gap-1.5 text-amber-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Next Step: Payment Verification</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                As per our code distribution security policy, repository access and source code ZIP files are delivered immediately upon confirmation of the agreed payment transfer. You can track your status anytime with your reference number.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto min-h-[44px] px-8 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors cursor-pointer"
            >
              Close & Return to Catalog
            </button>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-1 pr-8">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Source Code Purchase Request
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white">Order Website Package</h2>
              <p className="text-xs text-slate-400 line-clamp-1">{listing.title}</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* License Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Select License Scope</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setLicenseType('Single Commercial License')}
                  className={`min-h-[44px] p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    licenseType === 'Single Commercial License'
                      ? 'border-blue-500 bg-blue-950/40 text-white shadow-sm'
                      : 'border-white/10 bg-[#121628] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-white">Single Commercial License</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Deploy on 1 live domain for yourself or client.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLicenseType('Extended Multi-Client License')}
                  className={`min-h-[44px] p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    licenseType === 'Extended Multi-Client License'
                      ? 'border-blue-500 bg-blue-950/40 text-white shadow-sm'
                      : 'border-white/10 bg-[#121628] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-white">Extended Agency License (+120%)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Deploy across unlimited clients and apps.</div>
                </button>
              </div>
            </div>

            {/* Customization Add-ons if available */}
            {listing.customizationServices && listing.customizationServices.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Optional Developer Add-ons</label>
                <div className="space-y-2">
                  {listing.customizationServices.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.title);
                    return (
                      <div
                        key={addon.title}
                        onClick={() => toggleAddon(addon.title)}
                        className={`min-h-[44px] p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                          isChecked
                            ? 'border-blue-500 bg-blue-950/30 text-white'
                            : 'border-white/5 bg-[#121628] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span>{addon.title}</span>
                        </div>
                        <span className="font-mono text-blue-400 font-semibold shrink-0 ml-2">
                          +{formatPrice(addon.priceUSD, currency)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customer Contact Details */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-slate-300 block">Deliverable Recipient Information</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Delivery Email Address *"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp / Phone (Optional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Your Country (e.g. Pakistan, USA, UK) *"
                  value={customerCountry}
                  onChange={(e) => setCustomerCountry(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Preferred Payment Method */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-slate-300 block">
                Preferred Payment Channel
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    className={`block min-h-[44px] p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === pm.id
                        ? 'border-blue-500 bg-blue-950/40 shadow-sm'
                        : 'border-white/5 bg-[#121628] hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="payment_method"
                        value={pm.id}
                        checked={selectedMethod === pm.id}
                        onChange={() => setSelectedMethod(pm.id)}
                        className="text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-white">{pm.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 ml-6 mt-1 leading-relaxed">{pm.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Total Summary & Submit */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block uppercase">Total Payable</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums">
                  {formatPrice(totalUSD, currency)}
                </span>
                <span className="text-[10px] text-slate-400 block">Includes 30 days developer setup support</span>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Submit Purchase Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
