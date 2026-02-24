import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppWithAuth from './AppWithAuth';
import LandingPage from './pages/LandingPage';
import PublicVerificationPage from './pages/PublicVerificationPage';
import SignupPage from './pages/SignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import QuoteCreatePage from './pages/QuoteCreatePage';
import QuoteDetailPage from './pages/QuoteDetailPage';
import BulkQuoteCreatePage from './pages/BulkQuoteCreatePage';
import AuthWrapper from './components/AuthWrapper';
import './index.css';   // ✅ import Tailwind CSS here

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public routes */}
        <Route path="/verify/:id" element={<PublicVerificationPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* /login redirects to /app which shows LoginForm when not authenticated */}
        <Route path="/login" element={<Navigate to="/app" replace />} />

        {/* Authenticated routes */}
        <Route path="/app/*" element={<AppWithAuth />} />

        {/* Quote routes (authenticated) */}
        <Route path="/quotes/create" element={<AuthWrapper><QuoteCreatePage /></AuthWrapper>} />
        <Route path="/quotes/bulk/create" element={<AuthWrapper><BulkQuoteCreatePage /></AuthWrapper>} />
        <Route path="/quotes/:id" element={<AuthWrapper><QuoteDetailPage /></AuthWrapper>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

