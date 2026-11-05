import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Sidebar, { NAV_ITEMS } from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProfileModal from './components/ProfileModal';

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
import EnquiriesPage from './pages/EnquiriesPage';

function getViewFromPath(pathname) {
  const path = (pathname || '').toLowerCase().replace(/\/$/, '') || '/';
  if (path === '/login') return 'login';
  if (path === '/signup' || path === '/register') return 'signup';
  if (path === '/dashboard' || path === '/app') return 'dashboard';
  return 'landing';
}

class ModuleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ModuleErrorBoundary caught:", error, errorInfo);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.activeTab !== this.props.activeTab && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="apple-gloss-tile p-8 sm:p-10 rounded-[32px] text-center max-w-lg mx-auto my-12 space-y-4">
          <div className="w-12 h-12 rounded-2xl liquid-pill flex items-center justify-center text-[#ff3b30] mx-auto shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              Module View Recovery
            </h2>
            <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1 leading-relaxed">
              An unexpected render exception was caught in this view. Your session and database data remain safe.
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="apple-btn-primary px-5 py-2.5 text-xs font-semibold cursor-pointer inline-flex items-center gap-2"
          >
            <span>Reload Module View</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const { user, role, isAuthenticated, loading, profileOpen, closeProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // View state: 'landing' | 'login' | 'signup' | 'dashboard'
  const [currentView, setCurrentView] = useState(() => {
    return getViewFromPath(window.location.pathname);
  });

  // Navigate handler that synchronizes view state and URL path
  const handleNavigate = (targetView) => {
    let targetPath = '/';
    let resolvedView = targetView;

    if (targetView === 'login') {
      targetPath = '/login';
      resolvedView = 'login';
    } else if (targetView === 'signup' || targetView === 'register') {
      targetPath = '/signup';
      resolvedView = 'signup';
    } else if (targetView === 'dashboard' || targetView === 'app') {
      if (!isAuthenticated) {
        // Protected route guard: force unauthenticated users to login
        targetPath = '/login';
        resolvedView = 'login';
      } else {
        targetPath = '/dashboard';
        resolvedView = 'dashboard';
      }
    } else {
      targetPath = '/';
      resolvedView = 'landing';
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setCurrentView(resolvedView);
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const view = getViewFromPath(window.location.pathname);
      setCurrentView(view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route guards and authentication state sync
  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      // If an already logged-in user hits /login or /signup, direct them straight to dashboard
      if (currentView === 'login' || currentView === 'signup') {
        handleNavigate('dashboard');
      }
    } else {
      // If an unauthenticated user tries to view the protected dashboard route, redirect to /login
      if (currentView === 'dashboard') {
        handleNavigate('login');
      }
    }
  }, [isAuthenticated, loading, currentView]);

  // Automatically reset to dashboard tab if activeTab is not permitted for the active role
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

  // 1. Landing page view (available at `/`, works for both guests & logged-in users)
  if (currentView === 'landing') {
    return (
      <div key="landing" className="animate-apple-enter">
        <LandingPage onNavigate={handleNavigate} />
        <Toast />
      </div>
    );
  }

  // 2. Unauthenticated views
  if (!isAuthenticated) {
    if (currentView === 'signup') {
      return (
        <div key="signup" className="animate-apple-enter">
          <SignupPage onNavigate={handleNavigate} />
          <Toast />
        </div>
      );
    }
    // Protected fallback: if on /login or any protected route, show LoginPage
    return (
      <div key="login" className="animate-apple-enter">
        <LoginPage onNavigate={handleNavigate} />
        <Toast />
      </div>
    );
  }

  // 3. Authenticated Dashboard Application (/dashboard)
  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab);
  const isAuthorized = currentNav ? currentNav.roles.includes(role) : true;

  const renderActivePage = () => {
    if (!isAuthorized) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 border border-rose-200 dark:border-rose-800">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
            Your current role (<span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{role.replace('_', ' ')}</span>) does not have authorization to access the <strong>{currentNav?.label || activeTab}</strong> module.
          </p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
          >
            Return to Dashboard
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
      case 'enquiries':
        return <EnquiriesPage />;
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
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col font-sans selection:bg-[#0071e3]/20 selection:text-[#0071e3]">
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
          onNavigate={handleNavigate}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <div key={activeTab} className="animate-apple-enter">
            <ModuleErrorBoundary activeTab={activeTab}>
              {renderActivePage()}
            </ModuleErrorBoundary>
          </div>
        </main>
      </div>

      <ProfileModal isOpen={profileOpen} onClose={closeProfile} />
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
