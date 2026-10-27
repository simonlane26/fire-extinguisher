// Standard-aware extinguisher compliance rules (BS 5306-3 / IS 291).
//
// Both standards share the same two-cycle shape: an annual service
// (ext.lastInspection/nextInspection) plus a longer secondary cycle
// (ext.lastMaintenance/nextMaintenance) whose meaning and interval differ
// by standard:
//   - BS 5306-3 Table 1: "Extended Service" — 5 years for water-based/powder,
//     10 years for powder (primary sealed) and for the pressure-vessel types
//     that BS calls "Overhaul" instead (CO2, clean agent, halon).
//   - IS 291 clause 11.2: "Discharge Test" — 3 years for every type.
//
// IS 291 clause 9.4.1 additionally flags water/foam/wet-chemical/powder
// units as non-compliant once 10 years have passed since manufacture; BS
// 5306-3 has no equivalent rule for those types.
import type { Extinguisher } from '../types';

export type ComplianceStandard = 'BS' | 'IS';

function isHighPressureType(type: string): boolean {
  const t = type.toLowerCase();
  return t.includes('co2') || t.includes('p50') || t.includes('clean agent') || t.includes('halon');
}

function isPrimarySealedPowder(type: string): boolean {
  const t = type.toLowerCase();
  return t.includes('powder') && t.includes('primary seal');
}

/** Years until the secondary cycle (Extended Service / Overhaul / Discharge Test) is next due. */
export function getSecondaryCycleYears(standard: ComplianceStandard, type: string | undefined): number {
  if (!type) return standard === 'IS' ? 3 : 5;
  if (standard === 'IS') return 3;
  // BS 5306-3
  if (isHighPressureType(type) || isPrimarySealedPowder(type)) return 10;
  return 5;
}

/** Label for the secondary-cycle date fields, shown in the Add/Edit forms. */
export function getSecondaryCycleLabel(standard: ComplianceStandard, type: string | undefined): string {
  if (standard === 'IS') return 'Discharge Test';
  return type && isHighPressureType(type) ? 'Overhaul' : 'Extended Service';
}

/**
 * IS 291 clause 9.4.1: water/foam/wet-chemical/powder PFEs become
 * non-compliant once 10 years have passed since manufacture. No BS 5306-3
 * equivalent — always false for that standard or when manufactureDate is unset.
 */
export function getManufactureCutoffExceeded(
  standard: ComplianceStandard,
  type: string | undefined,
  manufactureDate: string | null | undefined,
): boolean {
  if (standard !== 'IS' || !manufactureDate || !type) return false;
  if (isHighPressureType(type)) return false; // CO2 has its own 10yr pressure-test rule, not this cutoff
  const years = (Date.now() - new Date(manufactureDate).getTime()) / (365.25 * 86_400_000);
  return years >= 10;
}

export type ComplianceBucket = 'compliant' | 'dueSoon' | 'overdue' | 'outOfService';

function bucketForDate(dateStr: string | null | undefined, warnDays: number): ComplianceBucket | null {
  if (!dateStr) return null;
  const diffDays = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  if (diffDays < 0) return 'overdue';
  if (diffDays <= warnDays) return 'dueSoon';
  return 'compliant';
}

const WORST: Record<ComplianceBucket, number> = { compliant: 0, dueSoon: 1, overdue: 2, outOfService: 3 };
function worstOf(a: ComplianceBucket, b: ComplianceBucket): ComplianceBucket {
  return WORST[b] > WORST[a] ? b : a;
}

/**
 * Single source of truth for an extinguisher's compliance status. Checks
 * both the annual service (nextInspection) and the secondary cycle
 * (nextMaintenance) — a unit is only as compliant as its least-compliant
 * cycle. Used by the Extinguishers page, ComplianceDashboard, and the row
 * badge/border logic, replacing what were previously separate, partially
 * duplicated, and incomplete inline copies of this check.
 */
export function getComplianceBucket(ext: Extinguisher, standard: ComplianceStandard): ComplianceBucket {
  if (ext.status !== 'Active' || ext.condition === 'Out of Service') return 'outOfService';

  let bucket: ComplianceBucket = 'compliant';
  const annual = bucketForDate(ext.nextInspection, 30);
  if (annual) bucket = worstOf(bucket, annual);

  const secondary = bucketForDate(ext.nextMaintenance, 30);
  if (secondary) bucket = worstOf(bucket, secondary);

  if (getManufactureCutoffExceeded(standard, ext.type, ext.manufactureDate)) {
    bucket = worstOf(bucket, 'overdue');
  }

  return bucket;
}
