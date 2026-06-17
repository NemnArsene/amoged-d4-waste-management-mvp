import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth
import { useAuthStore } from './store/useAuthStore';
import { useAppStore } from './store/useAppStore';

// Auth Pages
import { SplashScreen } from './pages/auth/SplashScreen';
import { OnboardingScreen } from './pages/auth/OnboardingScreen';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Admin Layout & Pages
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ReportsPage } from './pages/admin/ReportsPage';
import { MapPage } from './pages/admin/MapPage';
import { AgentsPage } from './pages/admin/AgentsPage';
import { InterventionsPage } from './pages/admin/InterventionsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { ReportingPage } from './pages/admin/ReportingPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AuditPage } from './pages/admin/AuditPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Citizen Layout & Pages
import { CitizenLayout } from './components/layout/CitizenLayout';
import { CitizenHome } from './pages/citizen/CitizenHome';
import { ReportForm } from './pages/citizen/ReportForm';
import { MyReportsPage } from './pages/citizen/MyReportsPage';
import { CalendarPage } from './pages/citizen/CalendarPage';
import { MorePage } from './pages/citizen/MorePage';
import { NotificationsPage } from './pages/citizen/NotificationsPage';

// Types
import type { UserRole } from './types';

// ─── GUARDS ───────────────────────────────────────────────────────────────────

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to appropriate portal
    if (user.role === 'CITIZEN') {
      return <Navigate to="/citizen/home" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute roles={['ADMIN', 'SUPERVISOR', 'AGENT']}>
      {children}
    </ProtectedRoute>
  );
}

function CitizenGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute roles={['CITIZEN']}>
      {children}
    </ProtectedRoute>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const { theme, setOnlineStatus } = useAppStore();

  // Apply theme on mount
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      }
    }
  }, [theme]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '16px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
            iconTheme: { primary: '#059669', secondary: '#fff' },
          },
          error: {
            style: { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' },
          },
        }}
      />

      <Routes>
        {/* ── Public routes ── */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<LoginPage />} />

        {/* ── Admin Portal ── */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="interventions" element={<InterventionsPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reporting" element={<ReportingPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* ── Citizen Portal ── */}
        <Route
          path="/citizen"
          element={
            <CitizenGuard>
              <CitizenLayout />
            </CitizenGuard>
          }
        >
          <Route index element={<Navigate to="/citizen/home" replace />} />
          <Route path="home" element={<CitizenHome />} />
          <Route path="report" element={<ReportForm />} />
          <Route path="my-reports" element={<MyReportsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<MorePage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
