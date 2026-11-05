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
import { PlacementIQEmblem } from '../components/Logo';
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
  Cell
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
  { name: 'Dream Super (20+ LPA)', count: 18, color: '#0071e3' },
  { name: 'Dream (12-20 LPA)', count: 29, color: '#af52de' },
  { name: 'Core (6-12 LPA)', count: 42, color: '#34c759' },
  { name: 'Mass Recruiters (3-6 LPA)', count: 22, color: '#ff9500' },
];

const DEMO_ELIGIBILITY_DATA = [
  { name: 'Eligible', value: 78, color: '#34c759' },
  { name: 'Needs Review', value: 14, color: '#ff9500' },
  { name: 'Not Eligible', value: 8, color: '#ff3b30' },
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
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] font-sans selection:bg-[#0071e3] selection:text-white transition-colors duration-500 relative overflow-x-hidden">
      
      {/* Dynamic Ambient Liquid Glow Orbs (Apple Intelligence Siri Aura) */}
      <div className="siri-ambient-aura w-[650px] h-[450px] bg-gradient-to-r from-[#ff2d55]/25 via-[#bf5af2]/30 to-[#0a84ff]/25 top-16 left-1/2 -translate-x-1/2 -z-10" />
      <div className="siri-ambient-aura w-[500px] h-[500px] bg-gradient-to-tr from-[#30d158]/20 to-[#64d2ff]/25 top-[40rem] -right-28 -z-10" />
      <div className="siri-ambient-aura w-[480px] h-[480px] bg-gradient-to-tr from-[#ff9f0a]/20 to-[#ff375f]/20 top-[85rem] -left-28 -z-10" />

      {/* =========================================================================
          1. NAVIGATION BAR (Apple Minimalist Liquid Glass Header)
      ========================================================================== */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.08] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Project Title */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-hidden"
          >
            <PlacementIQEmblem size={36} className="group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
            <div>
              <div className="flex items-center gap-1 font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight text-sm sm:text-base leading-none">
                Student Placement <span className="text-[#0071e3] dark:text-[#2997ff]">Analysis</span>
              </div>
              <div className="text-[10px] font-semibold text-[#86868b] dark:text-[#a1a1a6] tracking-wider uppercase mt-0.5">
                PlacementIQ Intelligence
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links (Apple Style - Subdued, Tight, Crisp) */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-normal tracking-tight text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Analytics Preview</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#0071e3]/10 text-[#0071e3] dark:bg-[#2997ff]/20 dark:text-[#2997ff]">Live</span>
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Header Action Buttons (Apple Pill Badges) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="liquid-pill p-2 text-[#1d1d1f] dark:text-[#f5f5f7] hover:scale-105 transition-all cursor-pointer"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#86868b]" />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="apple-btn-primary px-4 py-2 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="apple-btn-secondary px-4 py-2 text-xs font-medium cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="apple-btn-primary px-4 py-2 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleDarkMode}
              className="liquid-pill p-2 text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#86868b]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="liquid-pill p-2 text-[#1d1d1f] dark:text-[#f5f5f7]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Liquid Glass Drawer) */}
        {mobileMenuOpen && (
          <div className="lg:hidden liquid-glass border-b border-black/[0.08] dark:border-white/[0.1] px-5 pt-3 pb-6 space-y-3 animate-fade-in shadow-2xl">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="block w-full text-left py-2 text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              Analytics Preview
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              Contact
            </button>
            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('dashboard');
                  }}
                  className="apple-btn-primary w-full py-2.5 text-xs font-medium text-center"
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
                    className="apple-btn-secondary flex-1 py-2 text-xs font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('signup');
                    }}
                    className="apple-btn-primary flex-1 py-2 text-xs font-medium"
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
          2. HERO SECTION (Apple Typographic Grandeur & Liquid Glass Showcase)
      ========================================================================== */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-14">
            
            {/* Liquid Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 liquid-pill text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-7 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#2997ff]" />
              <span>Intelligent Campus Recruitment Platform</span>
            </div>

            {/* Apple Grand Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.04] mb-6">
              <span className="apple-titanium-text">Intelligence.</span>
              <br />
              <span className="apple-siri-gradient-text">Unmatched Clarity.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-2xl text-[#86868b] dark:text-[#a1a1a6] font-normal tracking-[-0.02em] leading-relaxed max-w-2xl mx-auto mb-10">
              The next-generation campus placement platform. Predictive cutoff modeling, automated student intelligence, and executive reporting engineered with liquid glass.
            </p>

            {/* Dual CTAs (Apple Signature Pills) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    onNavigate('dashboard');
                  } else {
                    scrollToSection('preview');
                  }
                }}
                className="apple-btn-secondary w-full sm:w-auto px-7 py-3 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <BarChart3 className="w-4 h-4 text-[#0071e3] dark:text-[#2997ff]" />
                <span>Explore Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('signup')}
                className="apple-btn-primary w-full sm:w-auto px-7 py-3 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro Highlight Pills */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-[#86868b] dark:text-[#a1a1a6]">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#34c759]" />
                Real-Time Cutoff Engine
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#34c759]" />
                Zero Hardcoded Data
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#34c759]" />
                3-Tier Role Governance
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#34c759]" />
                Transactional Excel/CSV Sync
              </span>
            </div>
          </div>

          {/* =========================================================================
              HARDWARE SHOWCASE MOCKUP WITH SIRI AURORA GLOW & LIQUID GLASS
          ========================================================================== */}
          <div className="relative max-w-5xl mx-auto mt-14 siri-aurora-glow rounded-[34px] sm:rounded-[42px]">
            
            {/* Floating Liquid Capsule 1: Peak Salary */}
            <div className="hidden md:flex absolute -top-5 -left-6 z-20 items-center gap-3 p-3.5 liquid-glass rounded-2xl animate-liquid-float shadow-xl">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                ₹
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">Top Campus Offer</div>
                <div className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">₹44.0 LPA • Microsoft</div>
              </div>
            </div>

            {/* Floating Liquid Capsule 2: Eligibility Accuracy */}
            <div className="hidden md:flex absolute -bottom-5 -right-6 z-20 items-center gap-3 p-3.5 liquid-glass rounded-2xl animate-liquid-float-delayed shadow-xl">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">Automated Eligibility</div>
                <div className="text-sm font-bold text-[#34c759]">92.4% Eligible Cohort</div>
              </div>
            </div>

            {/* Apple Hardware Display Frame */}
            <div className="liquid-glass rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] relative overflow-hidden">
              
              {/* Traffic Light Chrome */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-black/[0.05] dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10 inline-block shadow-2xs" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10 inline-block shadow-2xs" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10 inline-block shadow-2xs" />
                  <span className="ml-3 text-xs font-mono text-[#86868b] hidden sm:inline">placementiq.internal/analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="liquid-pill px-3 py-1 text-[11px] font-semibold text-[#34c759] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
                    Database Active
                  </span>
                </div>
              </div>

              {/* 4 Apple Liquid KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] transition-all hover:scale-[1.01]">
                  <div className="text-xs font-medium text-[#86868b]">Total Students</div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">112</div>
                  <div className="text-[11px] text-[#0071e3] dark:text-[#2997ff] font-medium mt-0.5">Across 6 Departments</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] transition-all hover:scale-[1.01]">
                  <div className="text-xs font-medium text-[#86868b]">Placed Students</div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#34c759] mt-1">78</div>
                  <div className="text-[11px] text-[#86868b] font-medium mt-0.5">Verified accepted offers</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] transition-all hover:scale-[1.01]">
                  <div className="text-xs font-medium text-[#86868b]">Placement %</div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#af52de] mt-1">88.6%</div>
                  <div className="text-[11px] text-[#34c759] font-medium mt-0.5">Eligible student cohort</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] transition-all hover:scale-[1.01]">
                  <div className="text-xs font-medium text-[#86868b]">Average Package</div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0071e3] dark:text-[#2997ff] mt-1">₹12.4 LPA</div>
                  <div className="text-[11px] text-[#86868b] font-medium mt-0.5">Mean placed package</div>
                </div>
              </div>

              {/* Mini Chart Mockup Preview */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Department-wise Placement Overview
                  </div>
                  <span className="text-[11px] text-[#86868b]">CSE • IT • ECE • EEE • Mech • Civil</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEMO_DEPARTMENT_DATA.slice(0, 4)} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                      <Bar dataKey="registered" fill="#86868b" radius={[6, 6, 0, 0]} opacity={0.4} />
                      <Bar dataKey="placed" fill="#0071e3" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURES SECTION (Apple Bento Grid - 6 Liquid Glass Tiles)
      ========================================================================== */}
      <section id="features" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff] mb-2">
              Engineered for Institutional Excellence
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Built for Modern Campus Recruitment.
            </h2>
            <p className="text-base text-[#86868b] dark:text-[#a1a1a6] mt-3 font-normal max-w-2xl mx-auto">
              Every feature corresponds to functional database logic, automated recalculations, and verified analytics models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Student Performance Analysis */}
            <div className="apple-gloss-tile p-8 group">
              <div className="w-12 h-12 rounded-2xl liquid-pill flex items-center justify-center text-[#0071e3] dark:text-[#2997ff] mb-6 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Student Performance Analysis
              </h3>
              <p className="text-xs font-medium text-[#0071e3] dark:text-[#2997ff] mb-2">
                Analyze academic performance and student profiles.
              </p>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Centralize student records with semester marks, CGPA progression, active backlog counts, backlog history, verified technical skills, and direct resume links.
              </p>
            </div>

            {/* Feature 2: Placement Prediction */}
            <div className="apple-gloss-tile p-8 group">
              <div className="w-12 h-12 rounded-2xl liquid-pill flex items-center justify-center text-[#af52de] mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Placement Prediction
              </h3>
              <p className="text-xs font-medium text-[#af52de] mb-2">
                Estimate placement outcomes using available student data.
              </p>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Our dynamic rules engine calculates eligibility (Eligible, Not Eligible, Needs Review) for any visiting company, simulating pass/fail counts before drive announcements.
              </p>
            </div>

            {/* Feature 3: Placement Statistics */}
            <div className="apple-gloss-tile p-8 group">
              <div className="w-12 h-12 rounded-2xl liquid-pill flex items-center justify-center text-[#34c759] mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Placement Statistics
              </h3>
              <p className="text-xs font-medium text-[#34c759] mb-2">
                Visualize placement percentages, trends, and historical data.
              </p>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Monitor 12 real-time institutional KPIs including total registered candidates, placed count, placement percentage, highest salary package, and median compensation.
              </p>
            </div>

            {/* Feature 4: Department-wise Analysis */}
            <div className="apple-gloss-tile p-8 group">
              <div className="w-12 h-12 rounded-2xl liquid-pill flex items-center justify-center text-[#5856d6] mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Department-wise Analysis
              </h3>
              <p className="text-xs font-medium text-[#5856d6] mb-2">
                Compare placement performance across different departments.
              </p>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Benchmark engineering branches (CSE, IT, ECE, EEE, Mechanical, Civil) to understand cohort readiness, branch placement conversion rates, and salary variations.
              </p>
            </div>

            {/* Feature 5: Skill Gap Analysis */}
            <div className="apple-gloss-tile p-8 group">
              <div className="w-12 h-12 rounded-2xl liquid-pill flex items-center justify-center text-[#ff9500] mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Skill Gap Analysis
              </h3>
              <p className="text-xs font-medium text-[#ff9500] mb-2">
                Identify skills students may need to improve for opportunities.
              </p>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Compare visiting recruiter requirements with student technical competencies, identifying missing skills and training priorities across batches.
              </p>
            </div>

            {/* Feature 6: Interactive Analytics Dashboard */}
            <div className="apple-gloss-tile p-8 group">
              <div className="w-12 h-12 rounded-2xl liquid-pill flex items-center justify-center text-[#30b0c7] mb-6 group-hover:scale-110 transition-transform">
                <PieIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Interactive Analytics Dashboard
              </h3>
              <p className="text-xs font-medium text-[#30b0c7] mb-2">
                Present important insights using charts, graphs, and statistics.
              </p>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Filter analytics on the fly by academic year, graduation batch, department, and company drive with instant visual re-rendering powered by Recharts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS SECTION (Apple 4-Step Process)
      ========================================================================== */}
      <section id="how-it-works" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff] mb-2">
              Intuitive Workflow
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              How PlacementIQ Works.
            </h2>
            <p className="text-base text-[#86868b] dark:text-[#a1a1a6] mt-3 font-normal max-w-2xl mx-auto">
              From raw student enrollment data to predictive placement analytics in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="apple-bento-card p-7 relative">
              <div className="w-10 h-10 rounded-full liquid-pill text-[#0071e3] dark:text-[#2997ff] font-bold text-sm flex items-center justify-center mb-5">
                01
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Step 1: Upload Student Data
              </h3>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Import student academic and placement information via Excel (.xlsx) or CSV with intelligent pre-commit schema and duplicate validation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="apple-bento-card p-7 relative">
              <div className="w-10 h-10 rounded-full liquid-pill text-[#5856d6] font-bold text-sm flex items-center justify-center mb-5">
                02
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Step 2: Analyze Performance
              </h3>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Evaluate academic records, CGPAs, backlog histories, semester mark breakdowns, technical proficiencies, and internship qualifications.
              </p>
            </div>

            {/* Step 3 */}
            <div className="apple-bento-card p-7 relative">
              <div className="w-10 h-10 rounded-full liquid-pill text-[#af52de] font-bold text-sm flex items-center justify-center mb-5">
                03
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Step 3: Generate Insights
              </h3>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Explore placement statistics, recruitment trends, and real-time eligibility predictions configured for specific visiting recruiters.
              </p>
            </div>

            {/* Step 4 */}
            <div className="apple-bento-card p-7 relative">
              <div className="w-10 h-10 rounded-full liquid-pill text-[#34c759] font-bold text-sm flex items-center justify-center mb-5">
                04
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                Step 4: Make Better Decisions
              </h3>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                Use data-driven insights to tailor training sessions, adjust dynamic cutoffs, optimize hiring drive scheduling, and maximize offer acceptances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. ANALYTICS PREVIEW SECTION (Apple Segmented Pill & Clean Recharts)
      ========================================================================== */}
      <section id="preview" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="liquid-pill px-3.5 py-1 text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] inline-flex items-center gap-1.5 mb-3">
              <span>Interactive Demonstration Data</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Placement Analytics in Action.
            </h2>
            <p className="text-base text-[#86868b] dark:text-[#a1a1a6] mt-2 font-normal">
              Explore sample visualizations powered by PlacementIQ’s analytical engine.
            </p>
          </div>

          {/* Apple-Style Segmented Control Switcher */}
          <div className="flex justify-center mb-8">
            <div className="p-1 rounded-full liquid-glass inline-flex gap-1">
              <button
                onClick={() => setActivePreviewTab('department')}
                className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activePreviewTab === 'department'
                    ? 'apple-btn-primary shadow-xs'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                Department Comparison
              </button>
              <button
                onClick={() => setActivePreviewTab('salary')}
                className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activePreviewTab === 'salary'
                    ? 'apple-btn-primary shadow-xs'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                Salary Tiers
              </button>
              <button
                onClick={() => setActivePreviewTab('eligibility')}
                className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activePreviewTab === 'eligibility'
                    ? 'apple-btn-primary shadow-xs'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                Eligibility
              </button>
            </div>
          </div>

          {/* Liquid Glass Showcase Display */}
          <div className="liquid-glass rounded-[32px] sm:rounded-[40px] p-6 sm:p-9 shadow-xl max-w-5xl mx-auto">
            {activePreviewTab === 'department' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Department-wise Placement & Average Package
                    </h3>
                    <p className="text-xs text-[#86868b]">Comparison of registered, eligible, and placed counts across branches</p>
                  </div>
                  <span className="liquid-pill px-3 py-1 text-xs font-medium text-[#0071e3] dark:text-[#2997ff] self-start sm:self-auto">
                    6 Active Departments
                  </span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEMO_DEPARTMENT_DATA} barGap={6}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis dataKey="dept" tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1d1d1f', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="registered" name="Total Students" fill="#86868b" radius={[6, 6, 0, 0]} opacity={0.4} />
                      <Bar dataKey="eligible" name="Eligible Students" fill="#0071e3" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="placed" name="Placed Students" fill="#34c759" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activePreviewTab === 'salary' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Compensation Package Distribution
                    </h3>
                    <p className="text-xs text-[#86868b]">Candidate placements grouped by LPA salary tiers</p>
                  </div>
                  <span className="liquid-pill px-3 py-1 text-xs font-medium text-[#af52de] self-start sm:self-auto">
                    Median: ₹12.0 LPA
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DEMO_SALARY_TIERS}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          innerRadius={55}
                          paddingAngle={4}
                        >
                          {DEMO_SALARY_TIERS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1d1d1f', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {DEMO_SALARY_TIERS.map((tier) => (
                      <div key={tier.name} className="p-3.5 liquid-pill flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                          <span className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{tier.name}</span>
                        </div>
                        <span className="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{tier.count} offers</span>
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
                    <h3 className="text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Placement Eligibility Compliance (Rule Engine)
                    </h3>
                    <p className="text-xs text-[#86868b]">Breakdown of students meeting active academic and backlog cutoffs</p>
                  </div>
                  <span className="liquid-pill px-3 py-1 text-xs font-medium text-[#34c759] self-start sm:self-auto">
                    Dynamic Evaluation Active
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={DEMO_ELIGIBILITY_DATA}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          innerRadius={55}
                          paddingAngle={4}
                        >
                          {DEMO_ELIGIBILITY_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1d1d1f', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#34c759]">Eligible (78%)</span>
                        <span className="text-xs font-black text-[#1d1d1f] dark:text-[#f5f5f7]">87 Students</span>
                      </div>
                      <p className="text-[11px] text-[#86868b]">Meets minimum CGPA, zero active backlogs, and branch criteria.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#ff9500]">Needs Review (14%)</span>
                        <span className="text-xs font-black text-[#1d1d1f] dark:text-[#f5f5f7]">16 Students</span>
                      </div>
                      <p className="text-[11px] text-[#86868b]">Borderline CGPA or pending backlog clearance history.</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-rose-500/[0.06] border border-rose-500/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#ff3b30]">Not Eligible (8%)</span>
                        <span className="text-xs font-black text-[#1d1d1f] dark:text-[#f5f5f7]">9 Students</span>
                      </div>
                      <p className="text-[11px] text-[#86868b]">Does not satisfy company-specific cutoff criteria.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. ABOUT SECTION (Apple Editorial Aesthetic)
      ========================================================================== */}
      <section id="about" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff] mb-2">
                Our Institutional Mission
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight mb-6">
                Empowering Better Placement Decisions Through Data.
              </h2>
              <p className="text-base sm:text-lg text-[#1d1d1f]/90 dark:text-[#f5f5f7]/90 leading-relaxed mb-6 font-normal">
                Student Placement Analysis System is designed to help educational institutions understand student placement performance through structured data analysis and visualization. It transforms placement data into meaningful insights that support students, faculty, and placement coordinators.
              </p>
              <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] leading-relaxed mb-8">
                By uniting student academic transcripts, company requirements, multiple offer records, and pipeline interview stages into one synchronized ecosystem, educational leadership gains the transparency required to maximize campus hiring outcomes.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="apple-bento-card p-5">
                  <div className="text-3xl font-bold tracking-tight text-[#0071e3] dark:text-[#2997ff]">100%</div>
                  <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">Configurable Rules</div>
                  <div className="text-[11px] text-[#86868b]">Zero hardcoded cutoffs</div>
                </div>
                <div className="apple-bento-card p-5">
                  <div className="text-3xl font-bold tracking-tight text-[#af52de]">Real-time</div>
                  <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">Recalculation</div>
                  <div className="text-[11px] text-[#86868b]">Instant batch sync</div>
                </div>
              </div>
            </div>

            {/* Value Pillars (Apple Bento Tiles) */}
            <div className="space-y-4">
              <div className="apple-bento-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl liquid-pill text-[#0071e3] dark:text-[#2997ff] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Role-Based Governance (RBAC)</h4>
                  <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1 leading-relaxed">
                    Granular permissions protecting sensitive data. Administrators control system rules, Placement Officers coordinate recruitment drives, and Viewers explore reports safely.
                  </p>
                </div>
              </div>

              <div className="apple-bento-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl liquid-pill text-[#af52de] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Immutable Audit Trail</h4>
                  <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1 leading-relaxed">
                    Every creation, edit, deletion, and bulk update records the actor, timestamp, entity ID, and exact before/after JSON diffs for institutional compliance.
                  </p>
                </div>
              </div>

              <div className="apple-bento-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl liquid-pill text-[#34c759] flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Batch Import & Export Validation</h4>
                  <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1 leading-relaxed">
                    Pre-formatted Excel and CSV templates with transactional pre-commit checks to catch duplicate roll numbers and schema inconsistencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CALL-TO-ACTION SECTION (Apple Liquid Glass Hero Bento)
      ========================================================================== */}
      <section id="cta" className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="apple-gloss-tile siri-aurora-glow p-10 sm:p-16 text-center relative overflow-hidden rounded-[36px] sm:rounded-[44px]">
            
            {/* Ambient Floating Chromatic Light */}
            <div className="siri-ambient-aura w-[500px] h-[300px] bg-gradient-to-r from-[#0071e3]/30 via-[#af52de]/30 to-[#ff2d55]/25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />

            <div className="max-w-3xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 liquid-pill text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Accelerate Campus Placement Outcomes</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-5 leading-tight">
                <span className="apple-titanium-text">Ready to Experience</span><br />
                <span className="apple-siri-gradient-text">Next-Gen Placement Intelligence?</span>
              </h2>

              <p className="text-base sm:text-lg text-[#86868b] dark:text-[#a1a1a6] max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
                Join forward-thinking colleges leveraging automated cutoffs, verified student records, and instant recruiter intelligence.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate('signup')}
                  className="apple-btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('login')}
                  className="apple-btn-secondary w-full sm:w-auto px-8 py-3.5 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Sign In to Existing Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CONTACT SECTION (Apple Clean Cards)
      ========================================================================== */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff] mb-2">
              Get In Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Contact PlacementIQ Support
            </h2>
            <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-2 font-normal">
              Have questions about integrating your college data or need customized reporting assistance?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Contact Info Bento */}
            <div className="lg:col-span-1 space-y-4">
              <div className="apple-bento-card p-5 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl liquid-pill text-[#0071e3] dark:text-[#2997ff] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Location</h4>
                  <p className="text-xs sm:text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                    Directorate of Training & Placement, Campus Tech Center
                  </p>
                </div>
              </div>

              <div className="apple-bento-card p-5 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl liquid-pill text-[#5856d6] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Email Desk</h4>
                  <p className="text-xs sm:text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                    placements@college.edu
                  </p>
                </div>
              </div>

              <div className="apple-bento-card p-5 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl liquid-pill text-[#34c759] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Helpline</h4>
                  <p className="text-xs sm:text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                    +91 (080) 2456-7890
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Message Form (Liquid Glass Container) */}
            <div className="lg:col-span-2 apple-bento-card p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
                Send an Institutional Inquiry
              </h3>

              {contactSubmitted ? (
                <div className="p-6 liquid-pill bg-emerald-500/10 border-emerald-500/30 text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#34c759] mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">Message Received</h4>
                  <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1">
                    Thank you. The placement coordination team will review your message shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        placeholder="Prof. Ananya Rao"
                        className="w-full px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        placeholder="ananya.rao@university.edu"
                        className="w-full px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#86868b] dark:text-[#a1a1a6] mb-1.5">
                      Message / Requirement
                    </label>
                    <textarea
                      rows={3}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      required
                      placeholder="Specify your department, batch inquiry, or placement drive coordination question..."
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-hidden focus:border-[#0071e3] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="apple-btn-primary px-6 py-2.5 text-xs font-medium cursor-pointer"
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
          9. FOOTER SECTION (Apple Global Footer)
      ========================================================================== */}
      <footer className="bg-[#f5f5f7] dark:bg-[#111112] text-[#86868b] dark:text-[#a1a1a6] py-14 border-t border-black/[0.06] dark:border-white/[0.08] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            
            {/* Brand column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <PlacementIQEmblem size={32} className="drop-shadow-sm" />
                <div>
                  <div className="font-bold text-[#1d1d1f] dark:text-[#f5f5f7] text-sm">
                    Student Placement <span className="text-[#0071e3] dark:text-[#2997ff]">Analysis</span>
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-[#86868b] tracking-wider">
                    PlacementIQ System
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] leading-relaxed max-w-sm">
                Empowering educational institutions through predictive student placement data analysis, real-time CGPA cutoff evaluation, and automated recruitment pipelines.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] uppercase tracking-wider mb-3">Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#0071e3] transition-colors cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-[#0071e3] transition-colors cursor-pointer">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#0071e3] transition-colors cursor-pointer">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('preview')} className="hover:text-[#0071e3] transition-colors cursor-pointer">
                    Analytics Preview
                  </button>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] uppercase tracking-wider mb-3">Features</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-[#0071e3] transition-colors">Performance Analysis</span></li>
                <li><span className="hover:text-[#0071e3] transition-colors">Placement Prediction</span></li>
                <li><span className="hover:text-[#0071e3] transition-colors">Placement Statistics</span></li>
                <li><span className="hover:text-[#0071e3] transition-colors">Department-wise Analysis</span></li>
                <li><span className="hover:text-[#0071e3] transition-colors">Skill Gap Insights</span></li>
              </ul>
            </div>

            {/* Portals & Access */}
            <div>
              <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] uppercase tracking-wider mb-3">Access Portals</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-[#0071e3] transition-colors cursor-pointer text-left">
                    Administrator Login
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-[#0071e3] transition-colors cursor-pointer text-left">
                    Placement Officer Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('login')} className="hover:text-[#0071e3] transition-colors cursor-pointer text-left">
                    Institutional Viewer
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('signup')} className="text-[#0071e3] dark:text-[#2997ff] font-semibold cursor-pointer text-left">
                    Create New Account →
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868b]">
            <p>© 2026 Student Placement Analysis System. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
