import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppWithAuth from './AppWithAuth';
import LandingPage from './pages/LandingPage';
import CompareJoblogicPage from './pages/CompareJoblogicPage';
import CompareUptickEzPage from './pages/CompareUptickEzPage';
import CompareIndexPage from './pages/CompareIndexPage';
import FaqPage from './pages/FaqPage';
import CompareServiceTradeBuildingReportsPage from './pages/CompareServiceTradeBuildingReportsPage';
import CompareInspectPointPage from './pages/CompareInspectPointPage';
import CompareInspectNTrackPage from './pages/CompareInspectNTrackPage';
import CompareSafetyCulturePage from './pages/CompareSafetyCulturePage';
import CompareGoAuditsPage from './pages/CompareGoAuditsPage';
import CompareFireInspectHubPage from './pages/CompareFireInspectHubPage';
import CompareMaintainXPage from './pages/CompareMaintainXPage';
import CompareFirebugExtPage from './pages/CompareFirebugExtPage';
import ResourceInspectionSoftwarePage from './pages/ResourceInspectionSoftwarePage';
import FireExtinguisherInspectionSoftwarePage from './pages/FireExtinguisherInspectionSoftwarePage';
import FireExtinguisherTrackingSoftwarePage from './pages/FireExtinguisherTrackingSoftwarePage';
import FireExtinguisherComplianceSoftwarePage from './pages/FireExtinguisherComplianceSoftwarePage';
import FireExtinguisherManagementSystemPage from './pages/FireExtinguisherManagementSystemPage';
import FireExtinguisherBarcodeSoftwarePage from './pages/FireExtinguisherBarcodeSoftwarePage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogBs5306Page from './pages/BlogBs5306Page';
import BlogInspectionChecklistPage from './pages/BlogInspectionChecklistPage';
import BlogServicingFrequencyPage from './pages/BlogServicingFrequencyPage';
import BlogComplianceMonitoringPage from './pages/BlogComplianceMonitoringPage';
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
        <Route path="/compare" element={<CompareIndexPage />} />
        <Route path="/compare/joblogic" element={<CompareJoblogicPage />} />
        <Route path="/compare/uptick-ezmanagement" element={<CompareUptickEzPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/compare/firexcheck-vs-servicetrade-vs-buildingreports" element={<CompareServiceTradeBuildingReportsPage />} />
        <Route path="/compare/firexcheck-vs-inspect-point" element={<CompareInspectPointPage />} />
        <Route path="/compare/firexcheck-vs-inspectntrack" element={<CompareInspectNTrackPage />} />
        <Route path="/compare/firexcheck-vs-safetyculture" element={<CompareSafetyCulturePage />} />
        <Route path="/compare/firexcheck-vs-goaudits" element={<CompareGoAuditsPage />} />
        <Route path="/compare/firexcheck-vs-fire-inspect-hub" element={<CompareFireInspectHubPage />} />
        <Route path="/compare/firexcheck-vs-maintainx" element={<CompareMaintainXPage />} />
        <Route path="/compare/firexcheck-vs-firebug-ext" element={<CompareFirebugExtPage />} />
        <Route path="/resources/what-is-fire-extinguisher-inspection-software" element={<ResourceInspectionSoftwarePage />} />
        <Route path="/fire-extinguisher-inspection-software" element={<FireExtinguisherInspectionSoftwarePage />} />
        <Route path="/fire-extinguisher-tracking-software" element={<FireExtinguisherTrackingSoftwarePage />} />
        <Route path="/fire-extinguisher-compliance-software" element={<FireExtinguisherComplianceSoftwarePage />} />
        <Route path="/fire-extinguisher-management-system" element={<FireExtinguisherManagementSystemPage />} />
        <Route path="/fire-extinguisher-barcode-software" element={<FireExtinguisherBarcodeSoftwarePage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/what-is-bs-5306" element={<BlogBs5306Page />} />
        <Route path="/blog/fire-extinguisher-inspection-checklist" element={<BlogInspectionChecklistPage />} />
        <Route path="/blog/how-often-fire-extinguishers-serviced-uk" element={<BlogServicingFrequencyPage />} />
        <Route path="/blog/fire-safety-compliance-monitoring" element={<BlogComplianceMonitoringPage />} />

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

