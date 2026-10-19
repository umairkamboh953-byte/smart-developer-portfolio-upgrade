import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle, Download, FileText, Loader2 } from 'lucide-react';
import { safeFetchJson } from '../utils/api';

interface OrderStatusModalProps {
  onClose: () => void;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ onClose }) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const res = await safeFetchJson<{ success: boolean; order: any; error?: string }>(
        `/api/orders/${encodeURIComponent(orderQuery.trim().toUpperCase())}`
      );
      if (!res.ok || !res.data?.order) {
        throw new Error(res.error || 'Order reference not found.');
      }
      setOrderData(res.data.order);
    } catch (err: any) {
      setError(err.message || 'Unable to find order matching that reference code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0c0f1d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Verification & Deliverables Portal
            </span>
            <h2 className="text-xl font-bold text-white">Track Order & Package</h2>
            <p className="text-xs text-slate-400">
              Enter your Order Reference Number (e.g. ORD-2026-XXXX) to view payment verification and access authorized source code downloads.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. ORD-2026-7842"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-2.5 bg-[#121628] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Track</span>
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {orderData && (
            <div className="pt-4 border-t border-white/10 space-y-4 text-xs animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-[#13172c] border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Website Package:</span>
                  <span className="text-white font-semibold text-right">{orderData.websiteTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Order Reference:</span>
                  <span className="text-white font-mono">{orderData.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Payment Status:</span>
                  <span
                    className={`font-semibold ${
                      orderData.paymentStatus === 'Verified & Paid'
                        ? 'text-emerald-400'
                        : orderData.paymentStatus === 'Rejected'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {orderData.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Delivery Status:</span>
                  <span className="text-slate-200 font-medium">{orderData.deliveryStatus}</span>
                </div>
              </div>

              {/* Verified Deliverables state */}
              {orderData.paymentStatus === 'Verified & Paid' && orderData.downloadLink ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/50 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Deliverable Package Ready for Download</span>
                  </div>
                  {orderData.deliveryPackageNotes && (
                    <p className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                      {orderData.deliveryPackageNotes}
                    </p>
                  )}
                  <a
                    href={orderData.downloadLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Source Code (ZIP)</span>
                  </a>
                </div>
              ) : orderData.paymentStatus === 'Verified & Paid' ? (
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800 text-blue-200 space-y-1">
                  <div className="font-semibold text-white">Payment Verified</div>
                  <p className="text-[11px] text-slate-300">
                    The developer is preparing the unminified source code ZIP and setup documentation. It will be made available here and emailed to you shortly.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200/90 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending Bank / Transfer Verification</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Your purchase request is registered. If you haven't completed the transfer or need assistance, email <strong className="text-white">smartbuy9@gmail.com</strong> with your order reference.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
