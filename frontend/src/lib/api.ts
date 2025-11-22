// src/lib/api.ts
import type { Extinguisher, AuthedUser, Tenant, Site, InventoryItem, PartUsage } from '../types';

// Determine API base URL based on environment
const getApiBase = () => {
  // In production, always use the environment variable
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }

  // In development, use current hostname with port 3000
  // This allows the app to work on localhost, IP address, or any other hostname
  const hostname = window.location.hostname;
  const protocol = window.location.protocol; // http: or https:
  return `${protocol}//${hostname}:3000/api/v1`;
};

const API_BASE = getApiBase();

// Token management
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('auth_token');
}

// Helper to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/* ---------------------------------- Auth ---------------------------------- */

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
    tenant: Tenant;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Login failed');
    throw new Error(text || 'Invalid credentials');
  }

  return res.json();
}

export async function register(
  email: string,
  password: string,
  name: string,
  tenantId: string,
  role: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, tenantId, role }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Registration failed');
    throw new Error(text || 'Registration failed');
  }

  return res.json();
}

export async function signup(data: {
  companyName: string;
  email: string;
  password: string;
  name: string;
  subdomain?: string;
}): Promise<LoginResponse & { message?: string }> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Signup failed');
    throw new Error(text || 'Signup failed');
  }

  return res.json();
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Verification failed');
    throw new Error(text || 'Verification failed');
  }

  return res.json();
}

export async function resendVerificationEmail(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Failed to resend verification');
    throw new Error(text || 'Failed to resend verification');
  }

  return res.json();
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Request failed');
    throw new Error(text || 'Request failed');
  }

  return res.json();
}

export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Password reset failed');
    throw new Error(text || 'Password reset failed');
  }

  return res.json();
}

export async function getCurrentUser(): Promise<{ user: AuthedUser & { tenant: Tenant } }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  return res.json();
}

/* ------------------------------ Extinguishers ----------------------------- */

/** GET /extinguishers (scoped by authenticated user's tenant) */
export async function fetchExtinguishers(): Promise<Extinguisher[]> {
  const res = await fetch(`${API_BASE}/extinguishers`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch extinguishers (${res.status}): ${text}`);
  }

  return res.json() as Promise<Extinguisher[]>;
}

/** POST /extinguishers */
export async function addExtinguisher(
  payload: Partial<Extinguisher>
): Promise<Extinguisher> {
  const res = await fetch(`${API_BASE}/extinguishers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to add extinguisher (${res.status}): ${text}`);
  }

  return res.json() as Promise<Extinguisher>;
}

/** PATCH /extinguishers/:id */
export async function updateExtinguisher(
  id: string,
  payload: Partial<Extinguisher>
): Promise<Extinguisher> {
  const res = await fetch(`${API_BASE}/extinguishers/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update extinguisher (${res.status}): ${text}`);
  }

  return res.json() as Promise<Extinguisher>;
}

/** GET /extinguishers/export/csv - Download CSV export */
export async function exportExtinguishersCsv(): Promise<void> {
  const res = await fetch(`${API_BASE}/extinguishers/export/csv`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to export extinguishers (${res.status}): ${text}`);
  }

  // Trigger download
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fire-extinguishers-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/** POST /extinguishers/import/csv - Upload CSV file */
export async function importExtinguishersCsv(file: File): Promise<{ success: boolean; imported: number; errors: number; details?: any[] }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/extinguishers/import/csv`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to import extinguishers (${res.status}): ${text}`);
  }

  return res.json();
}

/* ---------------------------------- Sites --------------------------------- */

/** GET /sites */
export async function fetchSites(): Promise<Site[]> {
  const res = await fetch(`${API_BASE}/sites`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch sites (${res.status}): ${text}`);
  }

  return res.json() as Promise<Site[]>;
}

/** POST /sites */
export async function createSite(data: {
  name: string;
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}): Promise<Site> {
  const res = await fetch(`${API_BASE}/sites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create site (${res.status}): ${text}`);
  }

  return res.json() as Promise<Site>;
}

/** GET /sites/:id */
export async function fetchSiteById(id: string): Promise<Site> {
  const res = await fetch(`${API_BASE}/sites/${id}`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch site (${res.status}): ${text}`);
  }

  return res.json() as Promise<Site>;
}

/** PUT /sites/:id */
export async function updateSite(id: string, data: Partial<Site>): Promise<Site> {
  const res = await fetch(`${API_BASE}/sites/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update site (${res.status}): ${text}`);
  }

  return res.json() as Promise<Site>;
}

/** DELETE /sites/:id */
export async function deleteSite(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/sites/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete site (${res.status}): ${text}`);
  }
}

/* -------------------------------- Inventory ------------------------------- */

/** GET /inventory/items */
export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/inventory/items`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch inventory items (${res.status}): ${text}`);
  }

  return res.json() as Promise<InventoryItem[]>;
}

/** GET /inventory/items/low-stock */
export async function fetchLowStockItems(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/inventory/items/low-stock`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch low stock items (${res.status}): ${text}`);
  }

  return res.json() as Promise<InventoryItem[]>;
}

/** POST /inventory/items */
export async function createInventoryItem(data: Partial<InventoryItem>): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/inventory/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create inventory item (${res.status}): ${text}`);
  }

  return res.json() as Promise<InventoryItem>;
}

/** PUT /inventory/items/:id */
export async function updateInventoryItem(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/inventory/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update inventory item (${res.status}): ${text}`);
  }

  return res.json() as Promise<InventoryItem>;
}

/** DELETE /inventory/items/:id */
export async function deleteInventoryItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/inventory/items/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete inventory item (${res.status}): ${text}`);
  }
}

/** POST /inventory/usage */
export async function recordPartUsage(data: {
  inventoryItemId: string;
  extinguisherId?: string;
  inspectionId?: string;
  quantityUsed: number;
  usedBy?: string;
  notes?: string;
}): Promise<PartUsage> {
  const res = await fetch(`${API_BASE}/inventory/usage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to record part usage (${res.status}): ${text}`);
  }

  return res.json() as Promise<PartUsage>;
}

/** GET /inventory/usage */
export async function fetchPartUsages(filters?: {
  inventoryItemId?: string;
  extinguisherId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<PartUsage[]> {
  const params = new URLSearchParams();
  if (filters?.inventoryItemId) params.append('inventoryItemId', filters.inventoryItemId);
  if (filters?.extinguisherId) params.append('extinguisherId', filters.extinguisherId);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const url = `${API_BASE}/inventory/usage${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch part usages (${res.status}): ${text}`);
  }

  return res.json() as Promise<PartUsage[]>;
}
