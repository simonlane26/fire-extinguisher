import React, { useState, useEffect, createContext } from 'react';
import LoginForm from './LoginForm';
import { login as apiLogin, register as apiRegister, getCurrentUser, setToken, getToken, clearToken } from '../lib/api';
import type { AuthedUser, Tenant, RoleKey, PermissionKey } from '../types';

export type AuthCtx = {
  currentUser: AuthedUser & { tenant: Tenant };
  setCurrentUser: React.Dispatch<React.SetStateAction<AuthedUser & { tenant: Tenant }>>;
  hasPermission: (perm: PermissionKey) => boolean;
  getAllowedRoles: () => RoleKey[];
  logout: () => void;
};

export const AuthContext = createContext<AuthCtx | null>(null);

const PERMISSIONS: Record<PermissionKey, RoleKey[]> = {
  VIEW_USERS: ['super_admin', 'admin', 'manager'],
  ADD_USERS: ['super_admin', 'admin'],
  EDIT_USERS: ['super_admin', 'admin'],
  DELETE_USERS: ['super_admin'],
  VIEW_EXTINGUISHERS: ['super_admin', 'admin', 'manager', 'inspector', 'viewer'],
  ADD_EXTINGUISHERS: ['super_admin', 'admin', 'manager'],
  EDIT_EXTINGUISHERS: ['super_admin', 'admin', 'manager'],
  DELETE_EXTINGUISHERS: ['super_admin'],
  PERFORM_INSPECTIONS: ['super_admin', 'admin', 'manager', 'inspector'],
  VIEW_INSPECTIONS: ['super_admin', 'admin', 'manager', 'inspector', 'viewer'],
  VIEW_REPORTS: ['super_admin', 'admin', 'manager'],
  VIEW_BILLING: ['super_admin', 'admin'],
  MANAGE_SETTINGS: ['super_admin', 'admin'],
};

const hasPermissionFor = (role: RoleKey, perm: PermissionKey) =>
  PERMISSIONS[perm]?.includes(role) || false;

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [currentUser, setCurrentUser] = useState<(AuthedUser & { tenant: Tenant }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      getCurrentUser()
        .then((response) => {
          setCurrentUser(response.user as any);
          setLoading(false);
        })
        .catch(() => {
          clearToken();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      setToken(response.access_token);
      setCurrentUser(response.user as any);
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      // For now, we'll create a default tenant for new registrations
      // In production, you'd have a proper tenant creation flow
      const tenantId = 'tenant-demo'; // This should be created properly
      const role = 'admin'; // Default role for new registrations

      const response = await apiRegister(email, password, name, tenantId, role);
      setToken(response.access_token);
      setCurrentUser(response.user as any);
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }
  };

  const logout = () => {
    clearToken();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const authValue: AuthCtx = {
    currentUser,
    setCurrentUser,
    hasPermission: (perm) => hasPermissionFor(currentUser.role as RoleKey, perm),
    getAllowedRoles: () => [],
    logout,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}
