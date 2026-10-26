import React, { useState } from 'react';
import { GraduationCap, Lock, User, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (!success) {
      setErrorMsg('SYS.AUTH_FAILURE // Invalid credentials. Please verify your access token or username.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#07090e] text-[#f1f5f9] relative overflow-hidden font-sans">
      {/* Ambient Dark Intelligence Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Editorial Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.25)] mb-4">
            <GraduationCap className="w-7 h-7 text-cyan-300" />
          </div>
          
          <div className="editorial-kicker justify-center mb-1 text-cyan-400">
            <span>PROTOCOL // AUTHENTICATION GATEWAY</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            <span className="font-sans">Placement</span>
            <span className="font-editorial italic font-normal text-4xl text-cyan-400">IQ</span>
          </h1>
          
          <p className="font-editorial italic text-slate-400 text-sm mt-1 max-w-sm mx-auto">
            Institutional Placement Intelligence &amp; Strategic Cutoff Governance
          </p>
        </div>

        {/* Intelligence Card */}
        <div className="intel-card rounded-3xl p-7 sm:p-9 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-400 block">SECURITY CLEARANCE</span>
              <h2 className="font-editorial text-2xl font-semibold text-white tracking-tight">
                Sign In to Portal
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
              <span className="phosphor-dot phosphor-dot-green"></span>
              <span>TLS.1.3</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2.5 animate-fade-in shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                User Identifier
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  required
                  autoComplete="username"
                  placeholder="e.g. admin, officer, viewer"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300">
                  Security Passcode
                </label>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">ENCRYPTED</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-semibold tracking-wider rounded-xl text-xs uppercase shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>AUTHORIZE &amp; ENTER SYSTEM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Editorial Footer */}
        <div className="text-center mt-7 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 tracking-[0.2em] uppercase">
            PLACEMENTIQ // INSTITUTIONAL TELEMETRY SUITE
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            SQLITE CORE • BCRYPT SIGNATURES • AUDIT TRAIL LOGGED
          </div>
        </div>
      </div>
    </div>
  );
}
