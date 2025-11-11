// src/types.ts
export type RoleKey = 'super_admin' | 'admin' | 'manager' | 'inspector' | 'viewer';
export type PermissionKey =
  | 'VIEW_USERS' | 'ADD_USERS' | 'EDIT_USERS' | 'DELETE_USERS'
  | 'VIEW_EXTINGUISHERS' | 'ADD_EXTINGUISHERS' | 'EDIT_EXTINGUISHERS' | 'DELETE_EXTINGUISHERS'
  | 'PERFORM_INSPECTIONS' | 'VIEW_INSPECTIONS' | 'VIEW_REPORTS' | 'VIEW_BILLING' | 'MANAGE_SETTINGS';

export type User = {
  id: string; name: string; email: string; role: RoleKey; status: 'active'|'inactive';
  lastLogin: string; createdAt: string; phone?: string;
};
export type AuthedUser = User & { tenantId: string };

export type Tenant = {
  id: string; companyName: string; subdomain: string; logoUrl?: string|null;
  primaryColor: string; secondaryColor: string;
  subscriptionPlan: 'trial'|'starter'|'professional'|'enterprise';
  subscriptionStatus: string; createdAt: string;
};

export type Extinguisher = {
  id: string;
  location: string;
  building: string;
  floor?: string;
  type: string;
  capacity?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string;
  expiryDate?: string;
  lastInspection?: string;
  nextInspection?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  status: 'Active' | 'Out of Service';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' | 'Out of Service';
  serviceType?: string;
  inspector?: string;
  notes?: string;
};
