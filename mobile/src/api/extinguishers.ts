import { api } from './client';
import type { Extinguisher, Inspection } from '../types/api';

// ─── Extinguishers ───────────────────────────────────
// GET /extinguishers returns the tenant's full list, no pagination or
// server-side filtering — filter/search client-side, same as the web app.

export async function getExtinguishers(): Promise<Extinguisher[]> {
  return api<Extinguisher[]>('/extinguishers');
}

export async function getExtinguisher(id: string): Promise<Extinguisher> {
  return api<Extinguisher>(`/extinguishers/${id}`);
}

// There's no server-side QR lookup endpoint — a scanned code is either the
// extinguisher's raw id, a "QR_<id>" tag, or a "https://.../verify/<id>" URL
// (same formats the web app's scanner handles), so we parse it client-side
// and then fetch by id.
export async function getExtinguisherByQr(scannedText: string): Promise<Extinguisher> {
  let id = scannedText.trim();

  if (id.includes('/verify/')) {
    id = id.split('/verify/')[1] ?? id;
    id = id.split('?')[0].split('#')[0].replace(/\/$/, '');
  } else if (id.startsWith('QR_')) {
    id = id.substring(3);
  }

  return getExtinguisher(id.trim());
}

export async function updateExtinguisher(
  id: string,
  dto: Partial<Pick<Extinguisher, 'condition' | 'inspector' | 'notes' | 'lastInspection' | 'nextInspection' | 'lastMaintenance' | 'nextMaintenance'>>,
): Promise<Extinguisher> {
  return api<Extinguisher>(`/extinguishers/${id}`, {
    method: 'PATCH',
    body: dto as Record<string, unknown>,
  });
}

// ─── Inspections ─────────────────────────────────────
// There's no POST /inspections endpoint — an Inspection row is created
// automatically server-side whenever a PATCH changes lastInspection/
// lastMaintenance/serviceType/inspector. Logging an inspection from the
// mobile app means calling updateExtinguisher() with those fields.

export async function getInspections(extinguisherId: string): Promise<Inspection[]> {
  return api<Inspection[]>(`/inspections/${extinguisherId}`);
}
