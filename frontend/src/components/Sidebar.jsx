import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  Sliders,
  Award,
  BarChart3,
  FileSpreadsheet,
  FilePieChart,
  UserCheck,
  Settings,
  History,
  GraduationCap,
  Sparkles,
  Cpu,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard Overview', category: 'CORE INTELLIGENCE', icon: LayoutDashboard, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'students', label: 'Student Directory', category: 'CORE INTELLIGENCE', icon: Users, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'companies', label: 'Hiring Partners', category: 'CORE INTELLIGENCE', icon: Building2, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'drives', label: 'Recruitment Drives', category: 'CORE INTELLIGENCE', icon: Briefcase, roles: ['admin', 'placement_officer', 'viewer'] },
  
  { id: 'applications', label: 'Candidate Pipelines', category: 'PIPELINES & RULES', icon: FileText, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'rules', label: 'Eligibility Cutoffs', category: 'PIPELINES & RULES', icon: Sliders, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'offers', label: 'Offers & CTC Ledger', category: 'PIPELINES & RULES', icon: Award, roles: ['admin', 'placement_officer', 'viewer'] },
  
  { id: 'analytics', label: 'Placement Analytics', category: 'ANALYTICS & DOSSIER', icon: BarChart3, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'reports', label: 'Intelligence Reports', category: 'ANALYTICS & DOSSIER', icon: FilePieChart, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'import-export', label: 'Data Import & Export', category: 'ANALYTICS & DOSSIER', icon: FileSpreadsheet, roles: ['admin', 'placement_officer'] },
  
  { id: 'users', label: 'Staff & Security', category: 'SYSTEM GOVERNANCE', icon: UserCheck, roles: ['admin'] },
  { id: 'settings', label: 'System Configuration', category: 'SYSTEM GOVERNANCE', icon: Settings, roles: ['admin'] },
  { id: 'audit-logs', label: 'Audit Trail Ledger', category: 'SYSTEM GOVERNANCE', icon: History, roles: ['admin', 'placement_officer'] },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { role } = useAuth();

  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));

  // Group by category for editorial layout
  const categories = ['CORE INTELLIGENCE', 'PIPELINES & RULES', 'ANALYTICS & DOSSIER', 'SYSTEM GOVERNANCE'];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-[#07090e]/80 backdrop-blur-md lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#07090e] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3.5 px-6 border-b border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <GraduationCap className="w-5 h-5 text-cyan-300" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]"></span>
          </div>
          <div>
            <div className="flex items-baseline gap-1 tracking-tight">
              <span className="font-sans font-bold text-lg text-white tracking-tight">Placement</span>
              <span className="font-editorial italic font-normal text-xl text-cyan-400">IQ</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.24em] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>INTEL DOSSIER</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400/80">v2.6</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {categories.map((category) => {
            const items = filteredNav.filter((n) => n.category === category);
            if (!items.length) return null;

            return (
              <div key={category} className="space-y-1">
                <div className="px-3 pb-1.5 text-[9px] font-mono tracking-[0.24em] uppercase text-slate-500">
                  // {category}
                </div>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent text-white border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r shadow-[0_0_8px_#38bdf8]"></span>
                      )}
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span className="truncate tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Live System Indicator */}
        <div className="p-3.5 border-t border-white/[0.08] bg-black/40">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
            <span className="flex items-center gap-2 text-slate-400">
              <span className="phosphor-dot phosphor-dot-green"></span>
              <span>SQLITE.WAL</span>
            </span>
            <span className="text-[10px] text-cyan-400/90 font-semibold tracking-wider">
              ONLINE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
