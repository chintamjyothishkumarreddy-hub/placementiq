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
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PlacementIQEmblem } from './Logo';

export const NAV_SECTIONS = [
  {
    title: 'Overview & Insights',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'placement_officer', 'viewer'] },
      { id: 'analytics', label: 'Placement Analytics', icon: BarChart3, roles: ['admin', 'placement_officer', 'viewer'] },
      { id: 'reports', label: 'Reports', icon: FilePieChart, roles: ['admin', 'placement_officer', 'viewer'] },
    ]
  },
  {
    title: 'Placement Operations',
    items: [
      { id: 'students', label: 'Students', icon: Users, roles: ['admin', 'placement_officer', 'viewer'] },
      { id: 'companies', label: 'Companies', icon: Building2, roles: ['admin', 'placement_officer', 'viewer'] },
      { id: 'drives', label: 'Placement Drives', icon: Briefcase, roles: ['admin', 'placement_officer', 'viewer'] },
      { id: 'applications', label: 'Applications & Interviews', icon: FileText, roles: ['admin', 'placement_officer', 'viewer'] },
      { id: 'offers', label: 'Offers & Salaries', icon: Award, roles: ['admin', 'placement_officer', 'viewer'] },
    ]
  },
  {
    title: 'System & Governance',
    items: [
      { id: 'rules', label: 'Eligibility Rules & Cutoffs', icon: Sliders, roles: ['admin', 'placement_officer', 'viewer'] },
      { id: 'import-export', label: 'Data Import & Export', icon: FileSpreadsheet, roles: ['admin', 'placement_officer'] },
      { id: 'users', label: 'User Management', icon: UserCheck, roles: ['admin'] },
      { id: 'settings', label: 'System Settings', icon: Settings, roles: ['admin'] },
      { id: 'audit-logs', label: 'Audit Logs', icon: History, roles: ['admin', 'placement_officer'] },
    ]
  }
];

export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { role } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white/80 dark:bg-[#161617]/85 backdrop-blur-2xl border-r border-black/[0.06] dark:border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo / Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-black/[0.06] dark:border-white/[0.08]">
          <PlacementIQEmblem size={34} className="hover:scale-105 transition-transform duration-300 drop-shadow-sm" />
          <div>
            <div className="flex items-center gap-1 font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight text-base leading-tight">
              Placement<span className="text-[#0071e3] dark:text-[#2997ff]">IQ</span>
            </div>
            <div className="text-[10px] font-medium tracking-wide text-[#86868b] dark:text-[#a1a1a6]">
              Campus Intelligence
            </div>
          </div>
        </div>

        {/* Organized Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {NAV_SECTIONS.map((section) => {
            const filteredItems = section.items.filter((item) => item.roles.includes(role));
            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-[#86868b] dark:text-[#a1a1a6] uppercase">
                  {section.title}
                </div>
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#0071e3] text-white shadow-md shadow-blue-500/25 font-semibold'
                          : 'text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#86868b] dark:text-[#a1a1a6]'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Live System Indicator */}
        <div className="p-4 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="liquid-pill px-3 py-2 flex items-center justify-between text-xs text-[#86868b] dark:text-[#a1a1a6]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DB Active</span>
            </span>
            <span className="font-mono text-[11px] text-[#0071e3] dark:text-[#2997ff]">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
