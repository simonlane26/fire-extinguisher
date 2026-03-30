// src/lib/api.ts
import type { Extinguisher, AuthedUser, Tenant, Site, InventoryItem, PartUsage, Quote, QuoteLine } from '../types';

// Determine API base URL based on environment
const getApiBase = () => {
  // In production, always use the environment variable
  if ((import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL;
  }

  const hostname = window.location.hostname;

  // For local development with backend running on port 3000
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const port = window.location.port;
    if (port === '5173' || port === '5174' || port === '5175' || port === '5176') {
      return 'http://localhost:3000/api/v1';
    }
  }

  // All other environments (firexcheck.com, Railway URL, Capacitor) use relative path
  // so requests go to the same server and avoid cross-origin issues
  return '/api/v1';
};

export const API_BASE = getApiBase();

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
export function getAuthHeaders(): Record<string, string> {
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
    try {
      const errorData = await res.json();
      // Extract user-friendly message from error response
      const message = errorData.message || 'Invalid credentials';
      throw new Error(message);
    } catch (parseError) {
      // If JSON parsing fails, show generic message
      throw new Error('Invalid email or password. Please try again.');
    }
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
    try {
      const errorData = await res.json();
      // Extract user-friendly message from error response
      const message = errorData.message || 'Registration failed';
      throw new Error(message);
    } catch (parseError) {
      // If JSON parsing fails, show generic message
      throw new Error('Registration failed. Please try again.');
    }
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

export async function updateUserRole(role: string): Promise<{ success: boolean; user: AuthedUser & { tenant: Tenant } }> {
  const res = await fetch(`${API_BASE}/auth/update-role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update role');
    } catch (parseError) {
      throw new Error('Failed to update role');
    }
  }

  return res.json();
}

export async function createUser(data: { name: string; email: string; role: string; status?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create user');
  }

  return res.json();
}

export async function getUsers(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/auth/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
}

export async function updateOtherUserRole(userId: string, role: string): Promise<{ success: boolean; user: any }> {
  const res = await fetch(`${API_BASE}/auth/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update user role');
    } catch (parseError) {
      throw new Error('Failed to update user role');
    }
  }

  return res.json();
}

export async function updateTenantSettings(data: {
  companyName?: string;
  subdomain?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
}): Promise<{ success: boolean; tenant: Tenant; user: AuthedUser & { tenant: Tenant } }> {
  const res = await fetch(`${API_BASE}/auth/update-tenant`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update tenant settings');
    } catch (parseError) {
      throw new Error('Failed to update tenant settings');
    }
  }

  return res.json();
}

export async function uploadLogo(file: File): Promise<{ success: boolean; url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/auth/upload-logo`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      // Don't set Content-Type - let browser set it with boundary for multipart/form-data
    },
    body: formData,
  });

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to upload logo');
    } catch (parseError) {
      throw new Error('Failed to upload logo');
    }
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

/** GET /extinguishers/:id (fetch single extinguisher by ID) */
export async function fetchExtinguisherById(id: string): Promise<Extinguisher | null> {
  const res = await fetch(`${API_BASE}/extinguishers/${id}`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch extinguisher (${res.status}): ${text}`);
  }

  return res.json() as Promise<Extinguisher>;
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

/** DELETE /extinguishers/:id - Delete an extinguisher */
export async function deleteExtinguisher(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/extinguishers/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete extinguisher (${res.status}): ${text}`);
  }
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

    // Try to parse JSON error response and extract user-friendly message
    try {
      const errorData = JSON.parse(text);
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    } catch (parseError) {
      // If it's already an Error (from the throw above), re-throw it
      if (parseError instanceof Error && parseError.message !== text) {
        throw parseError;
      }
      // Otherwise JSON parsing failed, so use the raw text
    }

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
// Add this section to your api.ts file, right BEFORE the "Photos" section (around line 620)

/* ------------------------------- Inspections ------------------------------ */

export interface Inspection {
  id: string;
  tenantId: string;
  extinguisherId: string;
  inspectorName: string;
  date: string;
  condition: string;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

/** POST /inspections - Create a new inspection */
export async function createInspection(inspection: {
  extinguisherId: string;
  inspectorName: string;
  date: string;
  condition: string;
  notes?: string;
  photoUrl?: string;
}): Promise<Inspection> {
  const res = await fetch(`${API_BASE}/inspections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(inspection),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create inspection (${res.status}): ${text}`);
  }

  return res.json() as Promise<Inspection>;
}

/** GET /inspections/monthly-count - Get inspection count for the current month */
export async function fetchMonthlyInspectionCount(): Promise<{ count: number; month: number; year: number }> {
  const res = await fetch(`${API_BASE}/inspections/monthly-count`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    return { count: 0, month: new Date().getMonth() + 1, year: new Date().getFullYear() };
  }

  return res.json();
}

/** GET /inspections/extinguisher/:extinguisherId - Get inspections for an extinguisher */
export async function fetchExtinguisherInspections(extinguisherId: string): Promise<Inspection[]> {
  const res = await fetch(`${API_BASE}/inspections/extinguisher/${extinguisherId}`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch inspections (${res.status}): ${text}`);
  }

  return res.json() as Promise<Inspection[]>;
}

// Continue with your existing Photos section...
/* ---------------------------------- Photos -------------------------------- */

export interface InspectionPhoto {
  id: string;
  tenantId: string;
  extinguisherId: string;
  inspectionId?: string | null;
  url: string;
  caption?: string | null;
  uploadedBy?: string | null;
  createdAt: string;
}

/** POST /photos/upload - Upload a photo */
export async function uploadPhoto(params: {
  file: File;
  extinguisherId: string;
  inspectionId?: string;
  caption?: string;
}): Promise<InspectionPhoto> {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('extinguisherId', params.extinguisherId);
  if (params.inspectionId) formData.append('inspectionId', params.inspectionId);
  if (params.caption) formData.append('caption', params.caption);

  const res = await fetch(`${API_BASE}/photos/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');

    try {
      const errorData = JSON.parse(text);
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    } catch (parseError) {
      if (parseError instanceof Error && parseError.message !== text) {
        throw parseError;
      }
    }

    throw new Error(`Failed to upload photo (${res.status}): ${text}`);
  }

  return res.json();
}

/** GET /photos/extinguisher/:extinguisherId - Get photos for an extinguisher */
export async function fetchExtinguisherPhotos(extinguisherId: string): Promise<InspectionPhoto[]> {
  const res = await fetch(`${API_BASE}/photos/extinguisher/${extinguisherId}`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch photos (${res.status}): ${text}`);
  }

  return res.json();
}

/** DELETE /photos/:photoId - Delete a photo */
export async function deletePhoto(photoId: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/photos/${photoId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete photo (${res.status}): ${text}`);
  }

  return res.json();
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

/** GET /inventory/extinguisher-types */
export async function fetchExtinguisherTypes(): Promise<Array<{ type: string; name: string; stock: number }>> {
  const res = await fetch(`${API_BASE}/inventory/extinguisher-types`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch extinguisher types (${res.status}): ${text}`);
  }

  return res.json();
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

/* --------------------------------- Users --------------------------------- */

export async function fetchUsers(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/users`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch users (${res.status})`);
  }

  return res.json();
}

export async function fetchUserSites(userId: string): Promise<Site[]> {
  const res = await fetch(`${API_BASE}/users/${userId}/sites`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user sites (${res.status})`);
  }

  return res.json();
}

export async function setUserSiteAccess(userId: string, siteIds: string[]): Promise<any> {
  const res = await fetch(`${API_BASE}/users/${userId}/sites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ siteIds }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update user site access (${res.status}): ${text}`);
  }

  return res.json();
}

export async function grantUserSiteAccess(userId: string, siteId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/users/${userId}/sites/${siteId}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to grant site access (${res.status}): ${text}`);
  }

  return res.json();
}

export async function revokeUserSiteAccess(userId: string, siteId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/users/${userId}/sites/${siteId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to revoke site access (${res.status}): ${text}`);
  }

  return res.json();
}

/* --------------------------------- Quotes --------------------------------- */

/** GET /quotes */
export async function fetchQuotes(status?: string): Promise<Quote[]> {
  const url = status ? `${API_BASE}/quotes?status=${status}` : `${API_BASE}/quotes`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch quotes (${res.status}): ${text}`);
  }

  return res.json() as Promise<Quote[]>;
}

/** GET /quotes/:id */
export async function fetchQuoteById(id: string): Promise<Quote> {
  const res = await fetch(`${API_BASE}/quotes/${id}`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch quote (${res.status}): ${text}`);
  }

  return res.json() as Promise<Quote>;
}

/** GET /quotes/by-extinguisher/:extinguisherId */
export async function fetchQuotesByExtinguisher(extinguisherId: string): Promise<Quote[]> {
  const res = await fetch(`${API_BASE}/quotes/by-extinguisher/${extinguisherId}`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch quotes for extinguisher (${res.status}): ${text}`);
  }

  return res.json() as Promise<Quote[]>;
}

/** POST /quotes */
export async function createQuote(data: {
  extinguisherId: string;
  inspectionId?: string;
  validUntil?: string;
  vatRate?: number;
  notes?: string;
  termsConditions?: string;
  lines?: {
    inventoryItemId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    isLabour?: boolean;
  }[];
}): Promise<Quote> {
  const res = await fetch(`${API_BASE}/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create quote (${res.status}): ${text}`);
  }

  return res.json() as Promise<Quote>;
}

/** PATCH /quotes/:id */
export async function updateQuote(id: string, data: {
  status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil?: string;
  vatRate?: number;
  notes?: string;
  termsConditions?: string;
  lines?: {
    inventoryItemId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    isLabour?: boolean;
  }[];
}): Promise<Quote> {
  const res = await fetch(`${API_BASE}/quotes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update quote (${res.status}): ${text}`);
  }

  return res.json() as Promise<Quote>;
}

/** DELETE /quotes/:id */
export async function deleteQuote(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/quotes/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete quote (${res.status}): ${text}`);
  }
}

/** GET /quotes/stats */
export async function fetchQuoteStats(): Promise<{
  total: number;
  draft: number;
  sent: number;
  accepted: number;
  rejected: number;
  totalValue: number;
  acceptedValue: number;
  acceptanceRate: number;
}> {
  const res = await fetch(`${API_BASE}/quotes/stats`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch quote stats (${res.status}): ${text}`);
  }

  return res.json();
}

/** GET /quotes/bulk-filters - Get available filter options for bulk quotes */
export async function fetchBulkQuoteFilters(): Promise<{
  sites: { id: string; name: string }[];
  buildings: string[];
  conditions: string[];
  totalCount: number;
}> {
  const res = await fetch(`${API_BASE}/quotes/bulk-filters`, {
    headers: {
      'Accept': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch bulk quote filters (${res.status}): ${text}`);
  }

  return res.json();
}

/** POST /quotes/bulk-extinguishers - Get extinguishers matching bulk quote filters */
export async function fetchExtinguishersForBulkQuote(filters: {
  siteId?: string;
  building?: string;
  conditions?: string[];
}): Promise<Extinguisher[]> {
  const res = await fetch(`${API_BASE}/quotes/bulk-extinguishers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(filters),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch extinguishers for bulk quote (${res.status}): ${text}`);
  }

  return res.json() as Promise<Extinguisher[]>;
}

/** POST /quotes - Create bulk quote */
export async function createBulkQuote(data: {
  isBulkQuote: true;
  validUntil?: string;
  vatRate?: number;
  notes?: string;
  termsConditions?: string;
  lines: {
    extinguisherId: string;
    inventoryItemId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    isLabour?: boolean;
  }[];
}): Promise<Quote> {
  const res = await fetch(`${API_BASE}/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create bulk quote (${res.status}): ${text}`);
  }

  return res.json() as Promise<Quote>;
}

/* ─── Platform Admin ─────────────────────────────────────────────────────── */

export async function platformGetTenants() {
  const res = await fetch(`${API_BASE}/platform-admin/tenants`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch tenants');
  return res.json();
}

export async function platformUpdateFeatures(tenantId: string, features: {
  stockManagementEnabled?: boolean;
  fireAlarmEnabled?: boolean;
  patTestingEnabled?: boolean;
  emergencyLightingEnabled?: boolean;
}) {
  const res = await fetch(`${API_BASE}/platform-admin/tenants/${tenantId}/features`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(features),
  });
  if (!res.ok) throw new Error('Failed to update features');
  return res.json();
}

/* ─── Fire Alarm ─────────────────────────────────────────────────────────── */

export async function faGetSystems(siteId?: string) {
  const q = siteId ? `?siteId=${siteId}` : '';
  const res = await fetch(`${API_BASE}/fire-alarm/systems${q}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch fire alarm systems');
  return res.json();
}

export async function faCreateSystem(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/fire-alarm/systems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create system');
  return res.json();
}

export async function faUpdateSystem(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/fire-alarm/systems/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update system');
  return res.json();
}

export async function faDeleteSystem(id: string) {
  const res = await fetch(`${API_BASE}/fire-alarm/systems/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete system');
}

export async function faGetCallPoints(systemId: string) {
  const res = await fetch(`${API_BASE}/fire-alarm/systems/${systemId}/call-points`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch call points');
  return res.json();
}

export async function faGetNextDueCallPoint(systemId: string) {
  const res = await fetch(`${API_BASE}/fire-alarm/systems/${systemId}/call-points/next-due`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch next due call point');
  return res.json();
}

export async function faAddCallPoint(systemId: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/fire-alarm/systems/${systemId}/call-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add call point');
  return res.json();
}

export async function faImportCallPoints(systemId: string, rows: Record<string, unknown>[]) {
  const res = await fetch(`${API_BASE}/fire-alarm/systems/${systemId}/call-points/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ rows }),
  });
  if (!res.ok) throw new Error('Failed to import call points');
  return res.json();
}

export async function faDeleteCallPoint(id: string) {
  const res = await fetch(`${API_BASE}/fire-alarm/call-points/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete call point');
}

export async function faGetLogEntries(systemId: string, entryType?: string) {
  const q = entryType ? `?entryType=${entryType}` : '';
  const res = await fetch(`${API_BASE}/fire-alarm/systems/${systemId}/log-entries${q}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch log entries');
  return res.json();
}

export async function faCreateLogEntry(systemId: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/fire-alarm/systems/${systemId}/log-entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create log entry');
  return res.json();
}

export async function faDeleteLogEntry(id: string) {
  const res = await fetch(`${API_BASE}/fire-alarm/log-entries/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete log entry');
}

export async function faDownloadCertificate(entryId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/fire-alarm/log-entries/${entryId}/certificate`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to download certificate');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fire-alarm-certificate-${entryId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── PAT Testing ────────────────────────────────────────────────────────── */

export async function patGetAppliances(siteId?: string) {
  const q = siteId ? `?siteId=${siteId}` : '';
  const res = await fetch(`${API_BASE}/pat-testing/appliances${q}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch PAT appliances');
  return res.json();
}

export async function patCreateAppliance(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/pat-testing/appliances`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create appliance');
  return res.json();
}

export async function patUpdateAppliance(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/pat-testing/appliances/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update appliance');
  return res.json();
}

export async function patDeleteAppliance(id: string) {
  const res = await fetch(`${API_BASE}/pat-testing/appliances/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete appliance');
  return res.json();
}

export async function patGetTests(applianceId: string) {
  const res = await fetch(`${API_BASE}/pat-testing/appliances/${applianceId}/tests`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch PAT tests');
  return res.json();
}

export async function patCreateTest(applianceId: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/pat-testing/appliances/${applianceId}/tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create PAT test');
  return res.json();
}

export async function patDeleteTest(id: string) {
  const res = await fetch(`${API_BASE}/pat-testing/tests/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete PAT test');
  return res.json();
}

export async function downloadPATTestReport(siteId?: string, days = 365): Promise<void> {
  const params = new URLSearchParams();
  if (siteId && siteId !== 'all') params.set('siteId', siteId);
  params.set('days', String(days));
  const res = await fetch(`${API_BASE}/reports/pat-testing?${params}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to generate PAT report');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pat-testing-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importPATCsv(file: File): Promise<{ success: boolean; imported: number; errors: number; details?: any[] }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/pat-testing/appliances/import/csv`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Import failed'); }
  return res.json();
}

/* ─── Emergency Lighting ─────────────────────────────────────────────────── */

export async function elGetLuminaires(siteId?: string) {
  const q = siteId && siteId !== 'all' ? `?siteId=${siteId}` : '';
  const res = await fetch(`${API_BASE}/emergency-lighting/luminaires${q}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch luminaires');
  return res.json();
}

export async function elCreateLuminaire(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/emergency-lighting/luminaires`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create luminaire');
  return res.json();
}

export async function elUpdateLuminaire(id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/emergency-lighting/luminaires/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update luminaire');
  return res.json();
}

export async function elDeleteLuminaire(id: string) {
  const res = await fetch(`${API_BASE}/emergency-lighting/luminaires/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete luminaire');
  return res.json();
}

export async function elGetTests(luminaireId: string) {
  const res = await fetch(`${API_BASE}/emergency-lighting/luminaires/${luminaireId}/tests`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch tests');
  return res.json();
}

export async function elCreateTest(luminaireId: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/emergency-lighting/luminaires/${luminaireId}/tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create test');
  return res.json();
}

export async function elDeleteTest(id: string) {
  const res = await fetch(`${API_BASE}/emergency-lighting/tests/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete test');
  return res.json();
}

export async function downloadEmergencyLightingReport(siteId?: string, days = 365): Promise<void> {
  const params = new URLSearchParams();
  if (siteId && siteId !== 'all') params.set('siteId', siteId);
  params.set('days', String(days));
  const res = await fetch(`${API_BASE}/reports/emergency-lighting?${params}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to generate emergency lighting report');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `emergency-lighting-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importELCsv(file: File): Promise<{ success: boolean; imported: number; errors: number; details?: any[] }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/emergency-lighting/luminaires/import/csv`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Import failed'); }
  return res.json();
}

export async function importFireAlarmCsv(file: File): Promise<{ success: boolean; imported: number; errors: number; details?: any[] }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/fire-alarm/systems/import/csv`, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || 'Import failed'); }
  return res.json();
}
