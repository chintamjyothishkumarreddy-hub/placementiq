import React from 'react';
import { Menu, Sun, Moon, LogOut, Shield, User, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from './Sidebar';

export default function Navbar({ activeTab, onToggleSidebar }) {
  const { user, role, logout, darkMode, toggleDarkMode } = useAuth();

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab);

  const roleStyles = {
    admin: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
    placement_officer: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    viewer: 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {currentNav?.label || 'PlacementIQ'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Fictional Demonstration Data Notice */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Fictional Demonstration Data</span>
        </div>

        {/* Authenticated User Role Badge (Non-interactive, reflects verified server role) */}
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-semibold py-1 px-2.5 rounded-lg border flex items-center gap-1.5 ${roleStyles[role] || roleStyles.viewer}`}
          >
            {role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Admin</span>
              </>
            ) : role === 'placement_officer' ? (
              <>
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Placement Officer</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Viewer (Read-Only)</span>
              </>
            )}
          </span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {user?.full_name || 'User'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              @{user?.username}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
