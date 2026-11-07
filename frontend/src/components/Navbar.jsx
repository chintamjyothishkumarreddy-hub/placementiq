import React from 'react';
import { Menu, Sun, Moon, LogOut, Shield, User, Info, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from './Sidebar';
import { PlacementIQEmblem } from './Logo';
import UserAvatar from './UserAvatar';

export default function Navbar({ activeTab, onToggleSidebar, onNavigate }) {
  const { user, role, logout, darkMode, toggleDarkMode, openProfile } = useAuth();

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab);

  const roleStyles = {
    admin: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    placement_officer: 'bg-blue-500/10 text-[#0071e3] dark:text-[#2997ff] border-blue-500/20',
    viewer: 'bg-black/5 dark:bg-white/5 text-[#86868b] dark:text-[#a1a1a6] border-black/10 dark:border-white/10',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.08] px-3 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <PlacementIQEmblem size={26} className="lg:hidden shrink-0 drop-shadow-sm" />
          <h1 className="text-sm sm:text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight truncate max-w-[110px] xs:max-w-[160px] sm:max-w-none">
            {currentNav?.label || 'PlacementIQ'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
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

        {/* Authenticated User Role Badge (Compact on mobile) */}
        <div className="flex items-center">
          <span
            className={`text-[11px] sm:text-xs font-medium py-1 px-2.5 sm:px-3 rounded-full border flex items-center gap-1.5 ${roleStyles[role] || roleStyles.viewer}`}
          >
            {role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Admin</span>
              </>
            ) : role === 'placement_officer' ? (
              <>
                <User className="w-3.5 h-3.5 text-[#0071e3] dark:text-[#2997ff] shrink-0" />
                <span className="hidden sm:inline">Placement Officer</span>
                <span className="sm:hidden">Officer</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-[#86868b] dark:text-[#a1a1a6] shrink-0" />
                <span className="hidden sm:inline">Viewer (Read-Only)</span>
                <span className="sm:hidden">Viewer</span>
              </>
            )}
          </span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer relative overflow-hidden group active:scale-95"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          <div className="relative w-4 h-4">
            <Sun
              className={`w-4 h-4 text-amber-400 absolute inset-0 transition-all duration-500 transform ${
                darkMode ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
              }`}
            />
            <Moon
              className={`w-4 h-4 text-[#86868b] group-hover:text-[#1d1d1f] absolute inset-0 transition-all duration-500 transform ${
                darkMode ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
          </div>
        </button>

        {/* User Info & Profile Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-black/[0.08] dark:border-white/[0.1]">
          <button
            onClick={openProfile}
            className="flex items-center gap-2 p-1 min-h-[40px] rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer group text-left focus:outline-hidden"
            title="Open Account Profile & Settings"
          >
            <UserAvatar user={user} size={32} interactive={true} showRoleBadge={true} />

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight group-hover:text-[#0071e3] dark:group-hover:text-[#2997ff] transition-colors truncate max-w-[110px]">
                {user?.full_name || 'User'}
              </span>
              <span className="text-[10px] text-[#86868b] dark:text-[#a1a1a6] font-mono truncate max-w-[110px]">
                @{user?.username}
              </span>
            </div>
          </button>

          <button
            onClick={logout}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#ff3b30] hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
