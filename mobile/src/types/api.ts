/**
 * API response types — matches the real FireXCheck NestJS API (src/ at the repo root),
 * not a separate schema package. Keep in sync with frontend/src/types.ts, which is the
 * other consumer of the same backend.
 */

// ─── Auth ────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export type RoleKey = 'super_admin' | 'admin' | 'manager' | 'inspector' | 'viewer' | 'building_owner';

export interface Tenant {
  id: string;
  companyName: string;
  subdomain: string;
  logoUrl?: string | null;
  complianceStandard: 'BS' | 'IS';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: RoleKey;
  tenantId: string;
  tenant: Tenant;
  isPlatformAdmin?: boolean;
}

// ─── Sites ───────────────────────────────────────────
export interface Site {
  id: string;
  name: string;
}

// ─── Extinguishers ───────────────────────────────────
// `type` and `capacity` are free-text fields set from the Add Extinguisher form, not an enum.
export type ExtinguisherCondition = 'Excellent' | 'Good' | 'Fair' | 'Needs Attention' | 'Out of Service';

export interface Extinguisher {
  id: string;
  siteId?: string | null;
  site?: Site; // only present on the list endpoint (GET /extinguishers), not GET /extinguishers/:id
  location: string;
  building: string;
  floor?: string | null;
  type: string;
  capacity?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  manufactureDate?: string | null;
  installDate?: string | null;
  expiryDate?: string | null;
  lastInspection?: string | null; // annual service cycle
  nextInspection?: string | null;
  lastMaintenance?: string | null; // extended service / discharge-test cycle
  nextMaintenance?: string | null;
  status: 'Active' | 'Out of Service';
  condition: ExtinguisherCondition;
  serviceType?: string | null;
  inspector?: string | null;
  notes?: string | null;
}

// ─── Inspections ─────────────────────────────────────
// Created automatically server-side when a PATCH to an extinguisher changes
// lastInspection/lastMaintenance/serviceType/inspector — there's no standalone
// "create inspection" endpoint. There's no pass/fail/checklist storage either;
// `condition` on the extinguisher record is the source of truth for status.
export interface Inspection {
  id: string;
  extinguisherId: string;
  serviceDate: string;
  serviceType: string;
  technician?: string | null;
  condition: string;
  notes?: string | null;
  partsReplaced?: string | null;
  nextServiceDate?: string | null;
  createdAt: string;
}

// A locally-derived due/overdue item for the Today screen — not a backend concept.
export interface DueItem {
  extinguisher: Extinguisher;
  dueDate: string;
  isOverdue: boolean;
  daysOverdue: number;
}
