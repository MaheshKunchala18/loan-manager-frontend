import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import LoanApplication from '@/pages/LoanApplication';
import Loans from '@/pages/Loans';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// App Content Component
const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="loans" element={<Loans />} />
            <Route path="apply-loan" element={<LoanApplication />} />
            
            {/* Placeholder routes for other dashboard sections */}
            <Route path="borrowers" element={<div className="p-6"><h1 className="text-2xl font-bold">Borrowers</h1><p>Coming soon...</p></div>} />
            <Route path="repayments" element={<div className="p-6"><h1 className="text-2xl font-bold">Repayments</h1><p>Coming soon...</p></div>} />
            <Route path="loan-parameters" element={<div className="p-6"><h1 className="text-2xl font-bold">Loan Parameters</h1><p>Coming soon...</p></div>} />
            <Route path="accounting" element={<div className="p-6"><h1 className="text-2xl font-bold">Accounting</h1><p>Coming soon...</p></div>} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p>Coming soon...</p></div>} />
            <Route path="collateral" element={<div className="p-6"><h1 className="text-2xl font-bold">Collateral</h1><p>Coming soon...</p></div>} />
            <Route path="access-config" element={<div className="p-6"><h1 className="text-2xl font-bold">Access Configuration</h1><p>Coming soon...</p></div>} />
            <Route path="savings" element={<div className="p-6"><h1 className="text-2xl font-bold">Savings</h1><p>Coming soon...</p></div>} />
            <Route path="other-incomes" element={<div className="p-6"><h1 className="text-2xl font-bold">Other Incomes</h1><p>Coming soon...</p></div>} />
            <Route path="payroll" element={<div className="p-6"><h1 className="text-2xl font-bold">Payroll</h1><p>Coming soon...</p></div>} />
            <Route path="expenses" element={<div className="p-6"><h1 className="text-2xl font-bold">Expenses</h1><p>Coming soon...</p></div>} />
            <Route path="e-signature" element={<div className="p-6"><h1 className="text-2xl font-bold">E-signature</h1><p>Coming soon...</p></div>} />
            <Route path="investor-accounts" element={<div className="p-6"><h1 className="text-2xl font-bold">Investor Accounts</h1><p>Coming soon...</p></div>} />
            <Route path="calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Calendar</h1><p>Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Coming soon...</p></div>} />
            <Route path="profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Profile</h1><p>Coming soon...</p></div>} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </div>
    </Router>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
