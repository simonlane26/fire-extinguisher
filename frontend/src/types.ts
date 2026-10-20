// src/types.ts
export type RoleKey = 'super_admin' | 'admin' | 'manager' | 'inspector' | 'viewer' | 'building_owner';
export type PermissionKey =
  | 'VIEW_USERS' | 'ADD_USERS' | 'EDIT_USERS' | 'DELETE_USERS'
  | 'VIEW_EXTINGUISHERS' | 'ADD_EXTINGUISHERS' | 'EDIT_EXTINGUISHERS' | 'DELETE_EXTINGUISHERS'
  | 'PERFORM_INSPECTIONS' | 'VIEW_INSPECTIONS' | 'VIEW_REPORTS' | 'VIEW_BILLING' | 'MANAGE_SETTINGS';

export type User = {
  id: string; name: string; email: string; role: RoleKey; status: 'active'|'inactive';
  lastLogin: string; createdAt: string; phone?: string;
  isPlatformAdmin?: boolean;
};
export type AuthedUser = User & { tenantId: string };

export type Tenant = {
  id: string; companyName: string; subdomain: string; logoUrl?: string|null;
  primaryColor: string; secondaryColor: string; contactEmail?: string|null;
  subscriptionPlan: 'trial'|'starter'|'professional'|'enterprise';
  subscriptionStatus: string; createdAt: string;
  stockManagementEnabled: boolean;
  fireAlarmEnabled: boolean;
  patTestingEnabled: boolean;
  emergencyLightingEnabled: boolean;
  fireDoorsEnabled: boolean;
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
  customerPrice?: number;
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

export type QuoteLine = {
  id: string;
  quoteId: string;
  extinguisherId?: string;
  inventoryItemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isLabour: boolean;
  sortOrder: number;
  inventoryItem?: {
    partNumber: string;
    partName: string;
    category?: string;
  };
  extinguisher?: {
    id: string;
    location: string;
    building: string;
    floor?: string;
    type: string;
    capacity?: string;
  };
};

export type Quote = {
  id: string;
  tenantId: string;
  extinguisherId?: string;
  inspectionId?: string;
  quoteNumber: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  isBulkQuote: boolean;
  validUntil: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  notes?: string;
  termsConditions?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  extinguisher?: {
    location: string;
    building: string;
    floor?: string;
    type: string;
    capacity?: string;
    serialNumber?: string;
    manufacturer?: string;
    model?: string;
  };
  lines: QuoteLine[];
};

// ─── Fire Alarm Logbook ───────────────────────────────────────────────────────

export type FireAlarmSystem = {
  id: string;
  tenantId: string;
  siteId: string;
  site?: { id: string; name: string };
  systemRef: string;
  name?: string;
  panelMake?: string;
  panelModel?: string;
  panelSerial?: string;
  arcCompany?: string;
  arcNumber?: string;
  installDate?: string;
  notes?: string;
  nextWeeklyDue?: string | null;
  nextMonthlyDue?: string | null;
  nextQuarterlyDue?: string | null;
  nextSixMonthlyDue?: string | null;
  nextAnnualDue?: string | null;
  weeklyToleranceDays?: number;
  monthlyToleranceDays?: number;
  quarterlyToleranceDays?: number;
  sixMonthlyToleranceDays?: number;
  annualToleranceDays?: number;
  createdAt: string;
  _count?: { callPoints: number; logEntries: number };
  latestEntriesByType?: { entryType: string; outcome: string; conductedAt: string }[];
};

export type FireAlarmCallPoint = {
  id: string;
  systemId: string;
  tenantId: string;
  pointRef: string;
  location?: string;
  floor?: string;
  zone?: string;
  lastTestedAt?: string | null;
  createdAt: string;
};

export type FireAlarmLogEntry = {
  id: string;
  systemId: string;
  tenantId: string;
  entryType: 'weekly' | 'monthly' | 'quarterly' | 'six_monthly' | 'annual' | 'non_routine' | 'fault' | 'engineer_visit';
  conductedBy: string;
  conductedAt: string;
  outcome: 'pass' | 'fail' | 'advisory';
  notes?: string;
  data?: Record<string, unknown>;
  createdAt: string;
};

// ─── Platform Admin ───────────────────────────────────────────────────────────

export type PlatformTenant = {
  id: string;
  companyName: string;
  subdomain: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  stockManagementEnabled: boolean;
  fireAlarmEnabled: boolean;
  patTestingEnabled: boolean;
  emergencyLightingEnabled: boolean;
  fireDoorsEnabled: boolean;
  createdAt: string;
  _count: { users: number; extinguishers: number; sites: number };
};

export type StandardServicePart = {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
  category: string;
};

// ─── PAT Testing ─────────────────────────────────────────────────────────────

export type PATAppliance = {
  id: string;
  tenantId: string;
  siteId: string;
  site?: { id: string; name: string };
  applianceRef: string;
  description: string;
  location: string;
  applianceClass?: string;
  notes?: string;
  lastTestedAt?: string | null;
  nextTestDue?: string | null;
  createdAt: string;
  _count?: { tests: number };
  tests?: { id: string; outcome: string; testedAt: string }[];
};

export type PATTest = {
  id: string;
  tenantId: string;
  applianceId: string;
  testedBy: string;
  testedAt: string;
  visualInspect: string;
  earthOhms?: number | null;
  insulationMohms?: number | null;
  functionalCheck: string;
  outcome: 'pass' | 'fail';
  nextTestDate?: string | null;
  comments?: string;
  reportRef?: string;
  createdAt: string;
};

export type EmergencyLuminaire = {
  id: string;
  tenantId: string;
  siteId: string;
  site?: { id: string; name: string };
  luminaireRef: string;
  description: string;
  location: string;
  luminaireType: string;
  fittingType?: string;
  zone?: string;
  notes?: string;
  nextDailyDue?: string | null;
  nextMonthlyDue?: string | null;
  nextAnnualDue?: string | null;
  nextThreeYearlyDue?: string | null;
  lastTestedAt?: string | null;
  createdAt: string;
  _count?: { tests: number };
  tests?: { id: string; testType: string; outcome: string; testedAt: string }[];
};

export type EmergencyLightTest = {
  id: string;
  tenantId: string;
  luminaireId: string;
  testType: 'daily' | 'monthly' | 'annual' | 'three_yearly';
  testedBy: string;
  testedAt: string;
  durationSecs?: number | null;
  durationMins?: number | null;
  luxReading?: number | null;
  outcome: 'pass' | 'fail';
  defectsFound?: string;
  remedialAction?: string;
  nextTestDate?: string | null;
  comments?: string;
  reportRef?: string;
  createdAt: string;
};

export type FireDoorType =
  | 'flat_entrance' | 'communal_stairway' | 'communal_corridor' | 'communal_lobby'
  | 'plant_room' | 'service_riser' | 'riser_cupboard' | 'kitchen' | 'hallway'
  | 'dining_area' | 'office' | 'other';

export type FireDoor = {
  id: string;
  tenantId: string;
  siteId: string;
  site?: { id: string; name: string };
  doorRef: string;
  location: string;
  doorType: FireDoorType;
  fireRating?: string | null;
  manufacturer?: string | null;
  installationDate?: string | null;
  hasIntumescentStrips: boolean;
  hasSmokeSeal: boolean;
  hasLetterbox: boolean;
  hasAirTransferGrille: boolean;
  hasGlazing: boolean;
  inspectionFrequencyMonths: number;
  nextInspectionDue?: string | null;
  lastInspectedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  _count?: { inspections: number };
  inspections?: { id: string; outcome: string; inspectedAt: string }[];
};

export type FireDoorInspection = {
  id: string;
  tenantId: string;
  doorId: string;
  inspectedBy: string;
  inspectedAt: string;
  accessDenied: boolean;
  accessDeniedReason?: string | null;
  visualDamage?: boolean | null;
  closesCompletely?: boolean | null;
  closesFromAnyAngle?: boolean | null;
  opensInTravelDirection?: boolean | null;
  frameGapOk?: boolean | null;
  maxGapSizeMm?: number | null;
  hingesSecure?: boolean | null;
  hingeCount?: number | null;
  selfCloserWorks?: boolean | null;
  intumescentStripIntact?: boolean | null;
  smokeSealIntact?: boolean | null;
  letterboxCloses?: boolean | null;
  airTransferGrilleOk?: boolean | null;
  glazingIntact?: boolean | null;
  signageCorrect?: boolean | null;
  outcome: 'pass' | 'fail' | 'requires_attention';
  defectsFound?: string | null;
  remedialAction?: string | null;
  actionPriority?: 'low' | 'medium' | 'high' | 'urgent' | null;
  comments?: string | null;
  nextInspectionDate?: string | null;
  createdAt: string;
};

export type FireDoorPhoto = {
  id: string;
  tenantId: string;
  doorId: string;
  inspectionId?: string | null;
  url: string;
  caption?: string | null;
  uploadedBy?: string | null;
  createdAt: string;
};
