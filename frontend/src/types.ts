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

export type Site = {
  id: string;
  tenantId: string;
  name: string;
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  _count?: {
    extinguishers: number;
  };
};

export type Extinguisher = {
  id: string;
  siteId?: string;
  site?: {
    id: string;
    name: string;
  };
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

export type InventoryItem = {
  id: string;
  tenantId: string;
  partNumber: string;
  partName: string;
  category?: string;
  description?: string;
  unitPrice?: number;
  quantityInStock: number;
  minStockLevel: number;
  supplier?: string;
  supplierPartNo?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    usages: number;
  };
};

export type PartUsage = {
  id: string;
  tenantId: string;
  inventoryItemId: string;
  extinguisherId?: string;
  inspectionId?: string;
  quantityUsed: number;
  usedBy?: string;
  usedAt: string;
  notes?: string;
  createdAt: string;
  inventoryItem?: {
    partNumber: string;
    partName: string;
    category?: string;
  };
};
