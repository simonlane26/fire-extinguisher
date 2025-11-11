// AppWithAuth.tsx - Wrapper that adds authentication to the existing App
import React from 'react';
import App from './App';
import AuthWrapper from './components/AuthWrapper';

export default function AppWithAuth() {
  return (
    <AuthWrapper>
      <App />
    </AuthWrapper>
  );
}
