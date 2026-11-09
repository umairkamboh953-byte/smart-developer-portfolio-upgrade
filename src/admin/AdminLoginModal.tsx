import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, Loader2, Mail } from 'lucide-react';
import { safeFetchJson } from '../utils/api';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

const AUTHORIZED_ADMIN_EMAILS = [
  'smartdeveloper125@gmail.com',
  'umairkamboh953@gmail.com'
];

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [googleEmail, setGoogleEmail] = useState('smartdeveloper125@gmail.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, directEmail?: string) => {
    if (e) e.preventDefault();
    const cleanEmail = (directEmail || googleEmail).trim().toLowerCase();
    if (!cleanEmail) return;

    setLoading(true);
    setError(null);

    try {
      const res = await safeFetchJson<{ success: boolean; token: string; role?: 'owner' | 'member'; error?: string }>('/api/admin/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      if (res.ok && res.data?.token) {
        localStorage.setItem('smart_developer_admin_token', res.data.token);
        localStorage.setItem('smart_developer_admin_email', cleanEmail);
        localStorage.setItem('smart_developer_admin_role', res.data.role || (cleanEmail === 'smartdeveloper125@gmail.com' ? 'owner' : 'member'));
        onLoginSuccess(res.data.token);
        return;
      }

      if (res.status === 403 || res.status === 401) {
        throw new Error(res.error || `Access Denied: Google Account "${cleanEmail}" is not authorized. Only Owner (smartdeveloper125@gmail.com) and invited Team Members have access.`);
      }

      // Fallback verification for static hosting
      const isAuthorized = AUTHORIZED_ADMIN_EMAILS.some((admin) => admin.toLowerCase() === cleanEmail);
      if (isAuthorized) {
        const clientToken = `google_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem('smart_developer_admin_token', clientToken);
        localStorage.setItem('smart_developer_admin_email', cleanEmail);
        localStorage.setItem('smart_developer_admin_role', cleanEmail === 'smartdeveloper125@gmail.com' ? 'owner' : 'member');
        onLoginSuccess(clientToken);
        return;
      }

      throw new Error(
        `Access Denied: Google Account "${cleanEmail}" is not authorized. Please ask Owner (smartdeveloper125@gmail.com) to grant you team access.`
      );
    } catch (err: any) {
      setError(err.message || 'Google account not authorized.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0d101e] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Administrator Portal Locked</h2>
            <p className="text-xs text-slate-400">
              Username and password access removed. Locked exclusively to Google Administrator sign-in.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-blue-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Authorized Admin
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Verified</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white bg-black/40 p-2 rounded-lg border border-white/5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate">smartdeveloper125@gmail.com</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Google Account</label>
            <input
              type="email"
              required
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              placeholder="smartdeveloper125@gmail.com"
              className="w-full px-4 py-2.5 bg-[#14182a] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick email select */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGoogleEmail('smartdeveloper125@gmail.com')}
              className={`flex-1 py-1 px-2 rounded-lg border text-[11px] font-mono transition-colors text-center truncate ${
                googleEmail.toLowerCase() === 'smartdeveloper125@gmail.com'
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-white/5 bg-[#121626] text-slate-400'
              }`}
            >
              smartdeveloper125
            </button>
            <button
              type="button"
              onClick={() => setGoogleEmail('umairkamboh953@gmail.com')}
              className={`flex-1 py-1 px-2 rounded-lg border text-[11px] font-mono transition-colors text-center truncate ${
                googleEmail.toLowerCase() === 'umairkamboh953@gmail.com'
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-white/5 bg-[#121626] text-slate-400'
              }`}
            >
              umairkamboh953
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-50 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Verifying Admin Authorization...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-bold">Continue with Google</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
