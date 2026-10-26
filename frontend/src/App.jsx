import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Sidebar, { NAV_ITEMS } from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// All 13 module pages
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import CompaniesPage from './pages/CompaniesPage';
import DrivesPage from './pages/DrivesPage';
import ApplicationsPage from './pages/ApplicationsPage';
import RulesPage from './pages/RulesPage';
import OffersPage from './pages/OffersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ImportExportPage from './pages/ImportExportPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import AuditLogsPage from './pages/AuditLogsPage';

function MainApp() {
  const { user, role, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Automatically reset to dashboard if tab is not permitted for the active role
  useEffect(() => {
    if (user && role) {
      const navItem = NAV_ITEMS.find((n) => n.id === activeTab);
      if (navItem && !navItem.roles.includes(role)) {
        setActiveTab('dashboard');
      }
    }
  }, [user, role, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab);
  const isAuthorized = currentNav ? currentNav.roles.includes(role) : true;

  const renderActivePage = () => {
    if (!isAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-[#0d121f]/80 backdrop-blur-xl rounded-3xl border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="editorial-kicker text-rose-400/90 mb-1">SECURITY VIOLATION // RESTRICTED</span>
          <h2 className="font-editorial text-2xl font-bold text-white mb-2">
            Access Clearance Denied
          </h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 font-sans">
            Your authenticated role (<span className="font-mono text-cyan-300 capitalize">{role.replace('_', ' ')}</span>) lacks protocol clearance to inspect the <strong className="text-white">{currentNav?.label || activeTab}</strong> module.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-semibold tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
          >
            RETURN TO COMMAND DASHBOARD
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveTab} />;
      case 'students':
        return <StudentsPage />;
      case 'companies':
        return <CompaniesPage />;
      case 'drives':
        return <DrivesPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'rules':
        return <RulesPage />;
      case 'offers':
        return <OffersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'import-export':
        return <ImportExportPage />;
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return <UsersPage />;
      case 'settings':
        return <SettingsPage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      default:
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/25 selection:text-cyan-200">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col transition-all">
        <Navbar
          activeTab={activeTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {renderActivePage()}
        </main>
      </div>

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
