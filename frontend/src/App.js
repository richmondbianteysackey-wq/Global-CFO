import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Documents from './pages/Documents';
import Transactions from './pages/Transactions';
import Messages from './pages/Messages';
import CompanyProfile from './pages/CompanyProfile';
import AuditLogs from './pages/AuditLogs';
import ServiceDetail from './pages/ServiceDetail';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import IntakePage from './pages/IntakePage';
import LegalPage from './pages/LegalPage';
import ClientPortal from './pages/ClientPortal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import '@/App.css';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  useEffect(() => {
    const gaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (!gaId) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    const inline = document.createElement('script');
    inline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(inline);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(inline);
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services/tax" element={<ServiceDetail serviceKey="tax" />} />
            <Route path="/services/bookkeeping" element={<ServiceDetail serviceKey="bookkeeping" />} />
            <Route path="/services/advisory" element={<ServiceDetail serviceKey="advisory" />} />
            <Route path="/services/payroll" element={<ServiceDetail serviceKey="payroll" />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/intake" element={<IntakePage />} />
            <Route path="/client-portal" element={<ClientPortal />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <ClientDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <PrivateRoute>
                  <Documents />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />
            <Route
              path="/company"
              element={
                <PrivateRoute>
                  <CompanyProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/audit-logs"
              element={
                <PrivateRoute>
                  <AuditLogs />
                </PrivateRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
