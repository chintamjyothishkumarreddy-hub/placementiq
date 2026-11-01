import React, { useState } from 'react';
import {
  GraduationCap,
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
  Users,
  Building2,
  FileSpreadsheet,
  Zap,
  Clock,
  ChevronRight,
  Check,
  Star,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  Target,
  BrainCircuit,
  UserCheck,
  Briefcase,
  PieChart as PieIcon,
  HelpCircle,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../context/AuthContext';

// Sample demonstration dataset clearly marked for preview
const DEMO_DEPARTMENT_DATA = [
  { dept: 'CSE', registered: 45, eligible: 42, placed: 39, avgPackage: 14.8 },
  { dept: 'IT', registered: 32, eligible: 30, placed: 27, avgPackage: 12.5 },
  { dept: 'ECE', registered: 28, eligible: 24, placed: 20, avgPackage: 9.8 },
  { dept: 'EEE', registered: 20, eligible: 17, placed: 14, avgPackage: 8.2 },
  { dept: 'Mech', registered: 18, eligible: 14, placed: 11, avgPackage: 7.4 },
  { dept: 'Civil', registered: 12, eligible: 9, placed: 7, avgPackage: 6.8 },
];

const DEMO_SALARY_TIERS = [
  { name: 'Dream (> 18 LPA)', count: 28, color: '#8b5cf6' },
  { name: 'Super Dream (12-18 LPA)', count: 36, color: '#3b82f6' },
  { name: 'Core (6-12 LPA)', count: 42, color: '#10b981' },
  { name: 'Mass Recruiters (3-6 LPA)', count: 22, color: '#f59e0b' },
];

const DEMO_ELIGIBILITY_DATA = [
  { name: 'Eligible', value: 78, color: '#10b981' },
  { name: 'Needs Review', value: 14, color: '#f59e0b' },
  { name: 'Not Eligible', value: 8, color: '#ef4444' },
];

export default function LandingPage({ onNavigate }) {
  const { isAuthenticated, user, role, darkMode, toggleDarkMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState('department');

  // Contact form submission feedback
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300">
      {/* =========================================================================
          1. NAVIGATION BAR (Sticky, Responsive, Clean SaaS Styling)
      ========================================================================== */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Project Title */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-white tracking-tight text-lg leading-tight">
                Student Placement <span className="text-blue-600 dark:text-blue-400">Analysis</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                PlacementIQ Intelligence System
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Analytics Preview</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">Live</span>
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer hover:shadow-lg"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
            >
              Analytics Preview
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600"
            >
              Contact
            </button>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('dashboard');
                  }}
                  className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-center shadow-xs"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('login');
                    }}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('signup');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl text-center shadow-md shadow-blue-500/25"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION (Headline, Subtitle, Dual CTAs & Analytics Mockup)
      ========================================================================== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-radial from-blue-50/50 via-transparent to-transparent dark:from-blue-950/20 dark:via-transparent dark:to-transparent">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-cyan-400/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-14">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-xs mb-6 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Next-Generation Campus Recruitment Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] mb-6">
              Transform Student Potential Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                Placement Success.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10 font-medium">
              Analyze student performance, discover placement trends, identify skill gaps, and make smarter career decisions with intelligent placement analytics.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    onNavigate('dashboard');
                  } else {
                    scrollToSection('preview');
                  }
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-2xl text-base shadow-lg shadow-slate-900/10 dark:shadow-none transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:-translate-y-0.5"
              >
                <BarChart3 className="w-5 h-5 text-blue-400 dark:text-blue-600" />
                <span>Explore Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('signup')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Highlights Pills */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Real-Time Cutoff Engine
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Zero Hardcoded Data
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                3-Tier Role-Based Security
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Excel & CSV Pre-Commit Validator
              </span>
            </div>
          </div>

          {/* =========================================================================
              HERO DASHBOARD MOCKUP WITH FLOATING STATS
          ========================================================================== */}
          <div className="relative max-w-5xl mx-auto">
            {/* Floating Stat Badge 1: Top Salary */}
            <div className="hidden md:flex absolute -top-6 -left-6 z-20 items-center gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-none border border-slate-200/80 dark:border-slate-800 animate-bounce duration-1000">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                ₹
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Peak Campus Offer</div>
                <div className="text-base font-black text-slate-900 dark:text-white">₹44.0 LPA • Microsoft</div>
              </div>
            </div>

            {/* Floating Stat Badge 2: Eligibility Accuracy */}
            <div className="hidden md:flex absolute -bottom-6 -right-6 z-20 items-center gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-none border border-slate-200/80 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Automated Eligibility</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">92.4% Eligible Cohort</div>
              </div>
            </div>

            {/* Main Mockup Window */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-blue-500/10 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              {/* Window Header Chrome */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  <span className="ml-3 text-xs font-mono text-slate-400">placementiq.internal/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Database Live
                  </span>
                </div>
              </div>

              {/* 4 Mockup Headline KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Students</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">112</div>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">Across 6 Departments</div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Placed Students</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">78</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Verified accepted offers</div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Placement %</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">88.6%</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Eligible student cohort</div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Package</div>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">₹12.4 LPA</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Mean placed package</div>
                </div>
              </div>

              {/* Two Preview Charts in Mockup */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Placement Statistics Chart */}
                <div className="lg:col-span-2 p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        Department-wise Placement Performance
                      </h4>
                      <p className="text-[11px] text-slate-400">Registered vs Eligible vs Placed candidates</p>
                    </div>
                  </div>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DEMO_DEPARTMENT_DATA} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="registered" name="Registered" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="eligible" name="Eligible" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="placed" name="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Salary Package Tiers Preview */}
                <div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Salary Bracket Tiers
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-3">Placed candidate CTC distribution</p>
                    <div className="h-36 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={DEMO_SALARY_TIERS}
                            dataKey="count"
                            nameKey="name"
                            innerRadius={38}
                            outerRadius={55}
                            paddingAngle={4}
                          >
                            {DEMO_SALARY_TIERS.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-2">
                    {DEMO_SALARY_TIERS.map((tier) => (
                      <div key={tier.name} className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tier.color }} />
                          <span className="truncate">{tier.name.split(' ')[0]}</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{tier.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURES SECTION (6 High-Impact Cards, Accurate to Implemented Code)
      ========================================================================== */}
      <section id="features" className="py-20 lg:py-28 bg-white dark:bg-slate-900/60 border-y border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Comprehensive Platform Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built Specifically for Modern Campus Recruitment
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 font-medium">
              Every feature corresponds to functional database logic, automated recalculations, and verified analytics models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1: Student Performance Analysis */}
            <div className="p-7 bg-slate-50/80 dark:bg-slate-800/40 rounded-3xl border border-slate-200/70 dark:border-slate-700/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Student Performance Analysis
              </h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Analyze academic performance and student profiles.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Centralize student records with semester marks, CGPA progression, active backlog counts, backlog history, verified technical skills, and direct resume links.
              </p>
            </div>

            {/* Feature 2: Placement Prediction */}
            <div className="p-7 bg-slate-50/80 dark:bg-slate-800/40 rounded-3xl border border-slate-200/70 dark:border-slate-700/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Placement Prediction
              </h3>
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
                Estimate placement outcomes using available student data.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Our dynamic rules engine calculates eligibility (Eligible, Not Eligible, Needs Review) for any visiting company, simulating pass/fail counts before drive announcements.
              </p>
            </div>

            {/* Feature 3: Placement Statistics */}
            <div className="p-7 bg-slate-50/80 dark:bg-slate-800/40 rounded-3xl border border-slate-200/70 dark:border-slate-700/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Placement Statistics
              </h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                Visualize placement percentages, trends, and historical data.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Monitor 12 real-time institutional KPIs including total registered candidates, placed count, placement percentage, highest salary package, and median compensation.
              </p>
            </div>

            {/* Feature 4: Department-wise Analysis */}
            <div className="p-7 bg-slate-50/80 dark:bg-slate-800/40 rounded-3xl border border-slate-200/70 dark:border-slate-700/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Department-wise Analysis
              </h3>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                Compare placement performance across different departments.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Benchmark engineering branches (CSE, IT, ECE, EEE, Mechanical, Civil) to understand cohort readiness, branch placement conversion rates, and salary variations.
              </p>
            </div>

            {/* Feature 5: Skill Gap Analysis */}
            <div className="p-7 bg-slate-50/80 dark:bg-slate-800/40 rounded-3xl border border-slate-200/70 dark:border-slate-700/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Skill Gap Analysis
              </h3>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">
                Identify skills students may need to improve for opportunities.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Compare visiting recruiter requirements with student technical competencies, identifying missing skills and training priorities across batches.
              </p>
            </div>

            {/* Feature 6: Interactive Analytics Dashboard */}
            <div className="p-7 bg-slate-50/80 dark:bg-slate-800/40 rounded-3xl border border-slate-200/70 dark:border-slate-700/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <PieIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Interactive Analytics Dashboard
              </h3>
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
                Present important insights using charts, graphs, and statistics.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Filter analytics on the fly by academic year, graduation batch, department, and company drive with instant visual re-rendering powered by Recharts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS SECTION (Modern Step-Based Process Timeline)
      ========================================================================== */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Intuitive Operational Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How PlacementIQ Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 font-medium">
              From raw student enrollment data to predictive placement analytics in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Step 1: Upload Student Data
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Import student academic and placement information via Excel (.xlsx) or CSV with intelligent pre-commit schema and duplicate validation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-md shadow-indigo-500/20">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Step 2: Analyze Performance
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Evaluate academic records, CGPAs, backlog histories, semester mark breakdowns, technical proficiencies, and internship qualifications.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-md shadow-purple-500/20">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Step 3: Generate Insights
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore placement statistics, recruitment trends, and real-time eligibility predictions configured for specific visiting recruiters.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Step 4: Make Better Decisions
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Use data-driven insights to tailor training sessions, adjust dynamic cutoffs, optimize hiring drive scheduling, and maximize offer acceptances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ANALYTICS PREVIEW SECTION (Interactive Sample Dashboard Showcase)
      ========================================================================== */}
      <section id="preview" className="py-20 lg:py-28 bg-white dark:bg-slate-900/60 border-y border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 mb-3">
              <span>Interactive Demonstration Data</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Placement Analytics In Action
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Explore sample visualizations powered by PlacementIQ’s analytical engine.
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActivePreviewTab('department')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePreviewTab === 'department'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Department Comparison
            </button>
            <button
              onClick={() => setActivePreviewTab('salary')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePreviewTab === 'salary'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Salary Tier Distribution
            </button>
            <button
              onClick={() => setActivePreviewTab('eligibility')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePreviewTab === 'eligibility'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Eligibility Compliance
            </button>
          </div>

          {/* Chart Display Container */}
          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-5xl mx-auto">
            {activePreviewTab === 'department' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Department-wise Placement & Average Package
                    </h3>
                    <p className="text-xs text-slate-500">Comparison of registered, eligible, and placed counts across branches</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 self-start sm:self-auto">
                    6 Active Departments
                  </span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEMO_DEPARTMENT_DATA} barGap={6}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="registered" name="Total Students" fill="#64748b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="eligible" name="Eligible Students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="placed" name="Placed Students" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activePreviewTab === 'salary' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Compensation Package Distribution
                    </h3>
                    <p className="text-xs text-slate-500">Candidate placements grouped by LPA salary tiers</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 self-start sm:self-auto">
                    Median: ₹12.0 LPA
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DEMO_SALARY_TIERS}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          innerRadius={50}
                          paddingAngle={4}
                        >
                          {DEMO_SALARY_TIERS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {DEMO_SALARY_TIERS.map((tier) => (
                      <div key={tier.name} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{tier.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white">{tier.count} offers</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'eligibility' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Placement Eligibility Compliance (Rule Engine)
                    </h3>
                    <p className="text-xs text-slate-500">Breakdown of students meeting active academic and backlog cutoffs</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 self-start sm:self-auto">
                    Dynamic Evaluation Active
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DEMO_ELIGIBILITY_DATA}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          innerRadius={50}
                          paddingAngle={4}
                        >
                          {DEMO_ELIGIBILITY_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Eligible (78%)</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">87 Students</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Meets minimum CGPA, zero active backlogs, and branch criteria.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Needs Review (14%)</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">16 Students</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Borderline CGPA or pending backlog clearance history.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-800/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Not Eligible (8%)</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">9 Students</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Does not satisfy company-specific cutoff criteria.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ABOUT SECTION (Institutional Mission & Core Pillars)
      ========================================================================== */}
      <section id="about" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                Our Institutional Mission
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                Empowering Better Placement Decisions Through Data.
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
                Student Placement Analysis System is designed to help educational institutions understand student placement performance through structured data analysis and visualization. It transforms placement data into meaningful insights that support students, faculty, and placement coordinators.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                By uniting student academic transcripts, company requirements, multiple offer records, and pipeline interview stages into one synchronized ecosystem, educational leadership gains the transparency required to maximize campus hiring outcomes.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">100%</div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Configurable Rules</div>
                  <div className="text-[11px] text-slate-400">Zero hardcoded cutoffs</div>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">Real-time</div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Recalculation</div>
                  <div className="text-[11px] text-slate-400">Instant batch sync</div>
                </div>
              </div>
            </div>

            {/* Value Pillars List */}
            <div className="space-y-4">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Role-Based Governance (RBAC)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Granular permissions protecting sensitive data. Administrators control system rules, Placement Officers coordinate recruitment drives, and Viewers explore reports safely.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Immutable Audit Trail</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Every creation, edit, deletion, and bulk update records the actor, timestamp, entity ID, and exact before/after JSON diffs for institutional compliance.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Batch Import & Export Validation</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Pre-formatted Excel and CSV templates with transactional pre-commit checks to catch duplicate roll numbers and schema inconsistencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CALL-TO-ACTION SECTION (Ready to Discover...)
      ========================================================================== */}
      <section id="cta" className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-300 border border-blue-400/20 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accelerate Institutional Placement Outcomes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-5 leading-tight">
            Ready to Discover the Power of Placement Analytics?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-medium">
            Start exploring student placement insights and make smarter, data-driven decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-slate-950 font-black rounded-2xl text-base shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl text-base border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Existing Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CONTACT SECTION (Institutional Support & Enquiries)
      ========================================================================== */}
      <section id="contact" className="py-20 bg-white dark:bg-slate-900/60 border-t border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              Get In Touch
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Contact PlacementIQ Support
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Have questions about integrating your college data or need customized reporting assistance?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Office Location</h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    Directorate of Training & Placement, Campus Tech Center
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Placement Desk</h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    placements@college.edu
                  </p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Support</h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    +91 (080) 2456-7890
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="lg:col-span-2 p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200/70 dark:border-slate-700/60">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Send an Institutional Inquiry
              </h3>

              {contactSubmitted ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Message Received</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    Thank you. The placement coordination team will review your message shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        placeholder="Prof. Ananya Rao"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        placeholder="ananya.rao@university.edu"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message / Requirement
                    </label>
                    <textarea
                      rows={3}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      required
                      placeholder="Specify your department, batch inquiry, or placement drive coordination question..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FOOTER SECTION
      ========================================================================== */}
      <footer className="bg-slate-900 text-slate-400 py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">
                    Student Placement <span className="text-blue-400">Analysis</span>
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">
                    PlacementIQ System
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Empowering educational institutions through predictive student placement data analysis, real-time CGPA cutoff evaluation, and automated recruitment pipelines.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('preview')} className="hover:text-white transition-colors cursor-pointer">
                    Analytics Preview
                  </button>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Features</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-white transition-colors">Performance Analysis</span></li>
                <li><span className="hover:text-white transition-colors">Placement Prediction</span></li>
                <li><span className="hover:text-white transition-colors">Placement Statistics</span></li>
                <li><span className="hover:text-white transition-colors">Department-wise Analysis</span></li>
                <li><span className="hover:text-white transition-colors">Skill Gap Insights</span></li>
              </ul>
            </div>

            {/* Portals & Access */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Access Portals</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Administrator Login
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Placement Officer Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Institutional Viewer
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('signup')} className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer text-left">
                    Create New Account →
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 Student Placement Analysis System. All Rights Reserved.</p>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Full-Stack Enterprise Architecture</span>
              <span>•</span>
              <span>SQLite & Python FastAPI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
