import React from 'react';
import { Menu, Sun, Moon, LogOut, Shield, User, Info, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from './Sidebar';

export default function Navbar({ activeTab, onToggleSidebar }) {
  const { user, role, logout, darkMode, toggleDarkMode } = useAuth();

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab);

  const roleStyles = {
    admin: 'bg-purple-950/40 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.12)]',
    placement_officer: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.12)]',
    viewer: 'bg-slate-900/80 text-slate-300 border-slate-700/60',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#07090e]/80 backdrop-blur-xl border-b border-white/[0.08] px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="editorial-kicker text-[9px] text-cyan-400/90 font-mono tracking-[0.22em] uppercase">
              MODULE // {activeTab?.toUpperCase() || 'DASHBOARD'}
            </span>
          </div>
          <h1 className="font-editorial text-lg sm:text-xl font-medium tracking-tight text-white flex items-center gap-2">
            <span>{currentNav?.label || 'PlacementIQ Intelligence'}</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Real-time System Telemetry */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono bg-white/[0.03] text-slate-300 border border-white/[0.08]">
          <span className="phosphor-dot phosphor-dot-green"></span>
          <span className="tracking-wider text-slate-300">SYS.ONLINE</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-semibold tracking-widest text-[10px]">SECURE</span>
        </div>

        {/* Authenticated User Role Badge (Non-interactive, reflects verified server role) */}
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-mono font-medium py-1 px-3 rounded-lg border flex items-center gap-1.5 transition-all ${roleStyles[role] || roleStyles.viewer}`}
          >
            {role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span className="tracking-wide">ADMINISTRATOR</span>
              </>
            ) : role === 'placement_officer' ? (
              <>
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="tracking-wide">PLACEMENT OFFICER</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="tracking-wide text-slate-300">VIEWER (READ-ONLY)</span>
              </>
            )}
          </span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-colors cursor-pointer"
          title={darkMode ? "Switch to light mode" : "Switch to dark intelligence mode"}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/[0.08]">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-editorial text-xs font-medium text-slate-200 leading-tight">
              {user?.full_name || 'Authorized User'}
            </span>
            <span className="text-[10px] text-cyan-400/80 font-mono tracking-wider">
              ID: @{user?.username}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Terminate Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
