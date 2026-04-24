import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import HelperDashboard from './pages/helper/HelperDashboard';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-screen">
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'CUSTOMER') return '/customer';
    if (user.role === 'WORKER') return '/worker';
    return '/helper';
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={getDashboardPath()} /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to={getDashboardPath()} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={getDashboardPath()} /> : <Register />} />

      <Route path="/customer/*" element={
        <ProtectedRoute allowedRole="CUSTOMER">
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/worker/*" element={
        <ProtectedRoute allowedRole="WORKER">
          <WorkerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/helper/*" element={
        <ProtectedRoute allowedRole="HELPER">
          <HelperDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a2235',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#00d4aa', secondary: '#060b18' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
