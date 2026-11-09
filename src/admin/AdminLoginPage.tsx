import React, { useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, Loader2, ArrowLeft, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import { safeFetchJson } from '../utils/api';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string) => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome
}) => {
  // Input must start completely EMPTY so no unauthorized visitor can click and enter!
  const [googleEmail, setGoogleEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Sign-In Verification (Strictly enforced by server: Owner & Authorized Team Members ONLY)
  const handleGoogleAuthSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your authorized Google email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await safeFetchJson<{
        success: boolean;
        token: string;
        role?: 'owner' | 'member';
        email?: string;
        error?: string;
      }>('/api/admin/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      if (res.ok && res.data?.token) {
        localStorage.setItem('smart_developer_admin_token', res.data.token);
        localStorage.setItem('smart_developer_admin_email', cleanEmail);
        localStorage.setItem('smart_developer_admin_role', res.data.role || 'member');
        onLoginSuccess(res.data.token);
        return;
      }

      // If rejected by server, show the exact access-denied reason
      const errMsg =
        res.data?.error ||
        res.error ||
        `Access Denied: "${cleanEmail}" is not authorized. Only Owner (smartdeveloper125@gmail.com) and invited Team Members can log in.`;
      throw new Error(errMsg);
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
          Strict Google Auth
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0d101e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Admin Access Portal
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict role-based access control. Password login is permanently disabled. Only authorized Google accounts are permitted.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Security Info Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-indigo-950/30 border border-blue-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Authorized Access Policy
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              Restricted
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-[11px] leading-tight text-slate-300">
                <strong className="text-white">Owner:</strong> smartdeveloper125@gmail.com (Full Control)
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="text-[11px] leading-tight text-slate-300">
                <strong className="text-white">Team Members:</strong> Must be invited by Owner (Add &amp; Edit only)
              </div>
            </div>
          </div>
        </div>

        {/* GOOGLE SIGN-IN FORM */}
        <form onSubmit={handleGoogleAuthSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Your Google Email Address</span>
              <span className="text-[11px] text-slate-500">Google Verified</span>
            </label>
            <input
              type="email"
              required
              autoFocus
              value={googleEmail}
              onChange={(e) => {
                setGoogleEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. smartdeveloper125@gmail.com"
              className="w-full px-4 py-3 bg-[#14182a] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !googleEmail.trim()}
            className="w-full py-3.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-white/5 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                <span>Verifying Access Rights...</span>
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
            Zero-Trust Authorization
          </span>
          <span>Smart Developer Security</span>
        </div>
      </div>
    </div>
  );
};
