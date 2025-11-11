// src/lib/api.ts
import type { Extinguisher, AuthedUser, Tenant } from '../types';

const API_BASE =
  (import.meta as any).env?.VITE_API_URL ??
  'http://localhost:3000/api/v1';

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
