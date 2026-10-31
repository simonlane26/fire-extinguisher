import type { Extinguisher } from '../types/api';

// The backend stores no human-readable id, only a CUID. Derive a stable
// EXT-00N label from position in a full list fetch — mirrors the same
// approach used in the web app's Extinguishers page. Only meaningful when
// the caller has the full (unfiltered) list in hand.
export function buildShortIds(all: Extinguisher[]): Map<string, string> {
  const map = new Map<string, string>();
  all.forEach((ext, i) => map.set(ext.id, `EXT-${String(i + 1).padStart(3, '0')}`));
  return map;
}

export function formatType(type: string, capacity?: string | null): string {
  return capacity ? `${type} · ${capacity}` : type;
}

export interface DueStatus {
  dueDate: string;
  isOverdue: boolean;
  daysOverdue: number;
}

// The earlier of the two service cycles (annual inspection, extended
// service/discharge test) is what's actually "due" — same priority the web
// app's getComplianceBucket uses. Returns null when out of service or when
// neither date is set yet.
export function getDueStatus(ext: Extinguisher): DueStatus | null {
  if (ext.status === 'Out of Service') return null;

  const candidates = [ext.nextInspection, ext.nextMaintenance].filter(Boolean) as string[];
  if (candidates.length === 0) return null;

  candidates.sort();
  const dueDate = candidates[0];
  const daysOverdue = Math.round((Date.now() - new Date(dueDate).getTime()) / 86_400_000);

  return {
    dueDate,
    isOverdue: daysOverdue > 0,
    daysOverdue: Math.max(daysOverdue, 0),
  };
}
