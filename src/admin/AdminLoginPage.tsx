import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, Loader2, ShieldCheck, ArrowLeft, CheckCircle2, Info } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (token: string) => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome
}) => {
  const [password, setPassword] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleAuthMode, setGoogleAuthMode] = useState(false);

  // Standard Master Key Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      localStorage.setItem('smart_developer_admin_token', data.token);
      onLoginSuccess(data.token);
    } catch (err: any) {
      setError(err.message || 'Invalid password.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Verification (Restricted to Authorized Admin Email)
  const handleGoogleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: googleEmail.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google authentication failed.');
      }

      localStorage.setItem('smart_developer_admin_token', data.token);
      onLoginSuccess(data.token);
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
        <span className="text-[11px] font-mono text-slate-500">Route: /admin/login</span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0d101e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Portal Access
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to manage website listings, customer inquiries, orders, and platform settings.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Tab switcher: Password vs Google Sign-In */}
        <div className="flex p-1 bg-[#121626] rounded-xl border border-white/5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setGoogleAuthMode(false);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              !googleAuthMode ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Master Key Login
          </button>
          <button
            type="button"
            onClick={() => {
              setGoogleAuthMode(true);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              googleAuthMode ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Sign-In
          </button>
        </div>

        {/* 1. MASTER KEY LOGIN FORM */}
        {!googleAuthMode && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Master Administrator Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#14182a] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span>Default Initial Key: </span>
                <code className="bg-blue-900/60 px-1.5 py-0.5 rounded text-white font-mono">admin123</code>
                <span className="block text-slate-400 mt-0.5">
                  (You can customize this in Admin Settings)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Access Admin Dashboard</span>
              )}
            </button>
          </form>
        )}

        {/* 2. GOOGLE SIGN-IN FORM */}
        {googleAuthMode && (
          <form onSubmit={handleGoogleAuthSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50 space-y-2 text-xs text-indigo-200">
              <div className="font-semibold flex items-center gap-1.5 text-indigo-300">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Google OAuth Verification Notice</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Per security rules: Only specifically authorized administrator Google accounts are permitted. Unauthorized accounts are blocked at the server level.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono">
                Authorized: umairkamboh953@gmail.com / smartbuy9@gmail.com
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Authorized Administrator Google Email
              </label>
              <input
                type="email"
                required
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="e.g. umairkamboh953@gmail.com"
                className="w-full px-4 py-2.5 bg-[#14182a] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {/* Google G Logo */}
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
              <span>{loading ? 'Verifying Authorization...' : 'Sign in with Google'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
