/// <reference types="vite/client" />
import axios from 'axios';

/** Configure your API base URL in .env:
 *  VITE_API_URL=http://localhost:3000
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  // withCredentials: true, // enable if you use cookies
});

/** Helper to attach auth token later (optional) */
export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/** Tenant header helper (multi-tenancy) */
const tenantHeader = (tenantId: string) => ({
  headers: { 'X-Tenant-Id': tenantId },
});

/* ---------- Types (keep in sync with your Prisma schema) ---------- */
export interface Extinguisher {
  id: string;
  tenantId: string;
  externalId?: string | null;
  location: string;
  building: string;
  floor?: string | null;
  type: string;
  capacity?: string | null;
  weight?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  installDate?: string | null;      // ISO date string
  expiryDate?: string | null;
  lastInspection?: string | null;
  nextInspection?: string | null;
  lastMaintenance?: string | null;
  nextMaintenance?: string | null;
  status: string;                    // e.g. "Active"
  condition: string;                 // e.g. "Good"
  serviceType?: string | null;
  inspector?: string | null;
  notes?: string | null;
  createdAt: string;                 // ISO
}

export type CreateExtinguisherDto = Pick<
  Extinguisher,
  | 'location'
  | 'building'
  | 'type'
  | 'capacity'
  | 'manufacturer'
  | 'model'
  | 'serialNumber'
  | 'installDate'
  | 'status'
  | 'condition'
  | 'serviceType'
  | 'inspector'
  | 'notes'
> & {
  floor?: string | null;
  externalId?: string | null;
};

export type UpdateExtinguisherDto = Partial<CreateExtinguisherDto> & {
  lastInspection?: string | null;
  nextInspection?: string | null;
  lastMaintenance?: string | null;
  nextMaintenance?: string | null;
  expiryDate?: string | null;
};

/* --------------------- CRUD functions --------------------- */

export async function listExtinguishers(tenantId: string): Promise<Extinguisher[]> {
  const { data } = await api.get<Extinguisher[]>('/extinguishers', tenantHeader(tenantId));
  return data;
}

export async function getExtinguisher(tenantId: string, id: string): Promise<Extinguisher> {
  const { data } = await api.get<Extinguisher>(`/extinguishers/${id}`, tenantHeader(tenantId));
  return data;
}

export async function createExtinguisher(
  tenantId: string,
  payload: CreateExtinguisherDto,
): Promise<Extinguisher> {
  const { data } = await api.post<Extinguisher>('/extinguishers', payload, tenantHeader(tenantId));
  return data;
}

export async function updateExtinguisher(
  tenantId: string,
  id: string,
  payload: UpdateExtinguisherDto,
): Promise<Extinguisher> {
  const { data } = await api.patch<Extinguisher>(`/extinguishers/${id}`, payload, tenantHeader(tenantId));
  return data;
}

export async function deleteExtinguisher(tenantId: string, id: string): Promise<{ success: true }> {
  await api.delete(`/extinguishers/${id}`, tenantHeader(tenantId));
  return { success: true };
}
