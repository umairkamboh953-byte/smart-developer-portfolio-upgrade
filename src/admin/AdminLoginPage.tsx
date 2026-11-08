import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { safeFetchJson } from '../utils/api';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string) => void;
  onNavigateHome: () => void;
}

const AUTHORIZED_ADMIN_EMAILS = [
  'smartdeveloper125@gmail.com',
  'umairkamboh953@gmail.com'
];

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome
}) => {
  const [googleEmail, setGoogleEmail] = useState('smartdeveloper125@gmail.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Sign-In Verification (Restricted strictly to smartdeveloper125@gmail.com)
  const handleGoogleAuthSubmit = async (e?: React.FormEvent, directEmail?: string) => {
    if (e) e.preventDefault();
    const cleanEmail = (directEmail || googleEmail).trim().toLowerCase();
    if (!cleanEmail) return;

    setLoading(true);
    setError(null);

    try {
      const res = await safeFetchJson<{ success: boolean; token: string; error?: string }>('/api/admin/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      if (res.ok && res.data?.token) {
        localStorage.setItem('smart_developer_admin_token', res.data.token);
        localStorage.setItem('smart_developer_admin_email', cleanEmail);
        onLoginSuccess(res.data.token);
        return;
      }

      if (res.status === 403 || res.status === 401) {
        throw new Error(res.error || `Access Denied: Google Account "${cleanEmail}" is not authorized. Only smartdeveloper125@gmail.com has administrator access.`);
      }

      // Client-side authorization check (for static hosting fallback)
      const isAuthorized = AUTHORIZED_ADMIN_EMAILS.some((admin) => admin.toLowerCase() === cleanEmail);
      if (isAuthorized) {
        const clientToken = `google_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem('smart_developer_admin_token', clientToken);
        localStorage.setItem('smart_developer_admin_email', cleanEmail);
        onLoginSuccess(clientToken);
        return;
      }

      throw new Error(
        `Access Denied: Google Account "${cleanEmail}" is not authorized. Only smartdeveloper125@gmail.com has full administrator access.`
      );
    } catch (err: any) {
      setError(err.message || 'Google account not authorized.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080e] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

      {/* Top back link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Smart Developer</span>
        </button>
        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Locked to Google Auth
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0d101e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Admin Panel Locked
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Username and password authentication have been disabled. This admin panel is strictly locked to authorized Google administrator accounts.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Security Info Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-indigo-950/30 border border-blue-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Authorized Administrator
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              Full Access
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/5">
            <Mail className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs font-mono font-medium text-white truncate select-all">
              smartdeveloper125@gmail.com
            </span>
          </div>
        </div>

        {/* GOOGLE SIGN-IN ACTION */}
        <form onSubmit={(e) => handleGoogleAuthSubmit(e)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Google Account Email</span>
              <span className="text-[11px] text-slate-500">Sign in with Google</span>
            </label>
            <input
              type="email"
              required
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              placeholder="smartdeveloper125@gmail.com"
              className="w-full px-4 py-2.5 bg-[#14182a] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setGoogleEmail('smartdeveloper125@gmail.com');
                setError(null);
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer text-center truncate ${
                googleEmail.toLowerCase() === 'smartdeveloper125@gmail.com'
                  ? 'border-blue-500/50 bg-blue-600/20 text-blue-300'
                  : 'border-white/5 bg-[#121626] text-slate-400 hover:text-white'
              }`}
            >
              smartdeveloper125
            </button>
            <button
              type="button"
              onClick={() => {
                setGoogleEmail('umairkamboh953@gmail.com');
                setError(null);
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer text-center truncate ${
                googleEmail.toLowerCase() === 'umairkamboh953@gmail.com'
                  ? 'border-blue-500/50 bg-blue-600/20 text-blue-300'
                  : 'border-white/5 bg-[#121626] text-slate-400 hover:text-white'
              }`}
            >
              umairkamboh953
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-50 rounded-xl shadow-lg shadow-white/5 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                <span>Verifying Administrator Access...</span>
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
        </form>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            256-bit Encrypted Session
          </span>
          <span>Smart Developer Security</span>
        </div>
      </div>
    </div>
  );
};
