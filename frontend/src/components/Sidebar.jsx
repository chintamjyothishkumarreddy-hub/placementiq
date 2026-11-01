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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'students', label: 'Students', icon: Users, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'companies', label: 'Companies', icon: Building2, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'drives', label: 'Placement Drives', icon: Briefcase, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'applications', label: 'Applications & Interviews', icon: FileText, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'rules', label: 'Eligibility Rules & Cutoffs', icon: Sliders, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'offers', label: 'Offers & Salaries', icon: Award, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'analytics', label: 'Placement Analytics', icon: BarChart3, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'import-export', label: 'Data Import & Export', icon: FileSpreadsheet, roles: ['admin', 'placement_officer'] },
  { id: 'reports', label: 'Reports', icon: FilePieChart, roles: ['admin', 'placement_officer', 'viewer'] },
  { id: 'users', label: 'User Management', icon: UserCheck, roles: ['admin'] },
  { id: 'settings', label: 'System Settings', icon: Settings, roles: ['admin'] },
  { id: 'audit-logs', label: 'Audit Logs', icon: History, roles: ['admin', 'placement_officer'] },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { role } = useAuth();

  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo / Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600/5 to-indigo-600/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white tracking-tight text-lg">
              Placement<span className="text-blue-600 dark:text-blue-400">IQ</span>
            </div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">
              Placement Analytics
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Management Modules
          </div>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold shadow-xs border border-blue-100 dark:border-blue-800/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live System Indicator */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-time DB Active
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
