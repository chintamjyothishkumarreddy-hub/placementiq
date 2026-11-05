import React, { useState } from 'react';
import {
  Lock,
  User,
  Mail,
  Shield,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PlacementIQEmblem } from '../components/Logo';

export default function SignupPage({ onNavigate }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const success = await register({
      full_name: fullName,
      username: username.trim(),
      email: email.trim(),
      password,
      role: 'viewer',
      is_active: true
    });
    setLoading(false);

    if (!success) {
      setErrorMsg('Registration failed. Username or email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] relative overflow-hidden font-sans">
      
      {/* Ambient Siri Aurora Glow */}
      <div className="siri-ambient-aura w-[650px] h-[500px] bg-gradient-to-r from-[#0071e3]/20 via-[#bf5af2]/25 to-[#ff2d55]/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />

      <div className="w-full max-w-5xl relative z-10 py-6">
        
        {/* Back to Home Button */}
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="liquid-pill px-4 py-2 inline-flex items-center gap-2 text-xs font-medium text-[#86868b] hover:text-[#0071e3] dark:hover:text-[#2997ff] mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: SHOWCASE & INSTANT EXPLORATION HIGHLIGHTS
          ========================================================================== */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 liquid-pill text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Institutional Exploration</span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <PlacementIQEmblem size={42} className="drop-shadow-md hover:scale-105 transition-transform duration-300" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Placement<span className="text-[#0071e3] dark:text-[#2997ff]">IQ</span>
                </h1>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.04em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight mt-3">
                <span className="apple-titanium-text">Join the Network.</span><br />
                <span className="apple-siri-gradient-text">Explore Insights.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#86868b] dark:text-[#a1a1a6] mt-3 leading-relaxed max-w-md font-normal">
                Create your verified viewer account to explore department conversion statistics, salary distributions, and company eligibility cutoffs.
              </p>
            </div>

            {/* Feature Glass Cards */}
            <div className="space-y-3 pt-2">
              <div className="apple-gloss-tile p-4 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl liquid-pill text-[#34c759] flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Full Institutional Analytics</h4>
                  <p className="text-[11px] text-[#86868b] dark:text-[#a1a1a6]">Inspect department benchmarks, CTC tiers, and company selections.</p>
                </div>
              </div>

              <div className="apple-gloss-tile p-4 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl liquid-pill text-[#0071e3] dark:text-[#2997ff] flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Cutoff & Eligibility Rules</h4>
                  <p className="text-[11px] text-[#86868b] dark:text-[#a1a1a6]">Understand visiting recruiter criteria and simulated cohort pass rates.</p>
                </div>
              </div>

              <div className="apple-gloss-tile p-4 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl liquid-pill text-[#af52de] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Placement Summary Reports</h4>
                  <p className="text-[11px] text-[#86868b] dark:text-[#a1a1a6]">Export certified placement summaries and historical progression.</p>
                </div>
              </div>
            </div>

            {/* Account Role Badge */}
            <div className="p-3.5 rounded-2xl liquid-pill flex items-center gap-2.5 text-xs text-[#0071e3] dark:text-[#2997ff]">
              <Shield className="w-4 h-4 shrink-0" />
              <span>New self-serve accounts are automatically granted <strong>Viewer</strong> access.</span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: LIQUID GLASS SIGNUP CARD
          ========================================================================== */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="liquid-glass siri-aurora-glow rounded-[32px] p-7 sm:p-10 shadow-2xl">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Create Your Account
                </h3>
                <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1">
                  Enter your details to generate your verified access credentials.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-[#ff3b30] text-xs font-medium flex items-center gap-2.5 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#ff3b30]" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868b]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      required
                      placeholder="e.g. Dr. Rajesh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868b]">
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
                      placeholder="e.g. rajesh_k"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868b]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      required
                      autoComplete="email"
                      placeholder="name@college.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868b]">
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
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="apple-btn-primary w-full mt-2 py-3 px-5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account & Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {onNavigate && (
                <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] text-center text-xs text-[#86868b] dark:text-[#a1a1a6]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="font-semibold text-[#0071e3] dark:text-[#2997ff] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
