import React from 'react';
import { Menu, Sun, Moon, LogOut, Shield, User, Info, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from './Sidebar';
import { PlacementIQEmblem } from './Logo';

export default function Navbar({ activeTab, onToggleSidebar, onNavigate }) {
  const { user, role, logout, darkMode, toggleDarkMode } = useAuth();

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab);

  const roleStyles = {
    admin: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    placement_officer: 'bg-blue-500/10 text-[#0071e3] dark:text-[#2997ff] border-blue-500/20',
    viewer: 'bg-black/5 dark:bg-white/5 text-[#86868b] dark:text-[#a1a1a6] border-black/10 dark:border-white/10',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.08] px-4 lg:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <PlacementIQEmblem size={28} className="lg:hidden drop-shadow-sm" />
          <h1 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight flex items-center gap-2">
            {currentNav?.label || 'PlacementIQ'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Fictional Demonstration Data Notice */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Fictional Demonstration Data</span>
        </div>

        {/* Public Landing Link */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('landing')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0071e3] dark:hover:text-[#2997ff] liquid-pill transition-all cursor-pointer"
            title="View Public Landing Page"
          >
            <Globe className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#2997ff]" />
            <span>Public Site</span>
          </button>
        )}

        {/* Authenticated User Role Badge */}
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-medium py-1 px-3 rounded-full border flex items-center gap-1.5 ${roleStyles[role] || roleStyles.viewer}`}
          >
            {role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Admin</span>
              </>
            ) : role === 'placement_officer' ? (
              <>
                <User className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#2997ff]" />
                <span>Placement Officer</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-[#86868b] dark:text-[#a1a1a6]" />
                <span>Viewer (Read-Only)</span>
              </>
            )}
          </span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#86868b]" />}
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-black/[0.08] dark:border-white/[0.1]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0071e3] to-[#af52de] text-white flex items-center justify-center font-bold text-xs shadow-xs select-none">
            {((user?.full_name || user?.username || 'User') + '')
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase() || 'U'}
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
              {user?.full_name || 'User'}
            </span>
            <span className="text-[10px] text-[#86868b] dark:text-[#a1a1a6] font-mono">
              @{user?.username}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-[#ff3b30] hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
