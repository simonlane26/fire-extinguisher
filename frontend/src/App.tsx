// src/App.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Eye,
  QrCode,
  Building2,
  Shield,
  Flame,
  Download,
  Upload,
  Search,
  Filter,
  X,
  FileText,
  ClipboardCheck,
  Pencil,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import QRScanner from './components/QRScanner';
import Sidebar, { type ActiveTab } from './components/Sidebar';
import TopHeader from './components/TopHeader';
import HintTooltip from './components/HintTooltip';
import GettingStartedPanel from './components/GettingStartedPanel';
import AddExtinguisherModal from './components/AddExtinguisherModal';
import EditExtinguisherModal from './components/EditExtinguisherModal';
import ExtinguisherDetails from './components/ExtinguisherDetails';
import SimpleInspectionForm from './components/SimpleInspectionForm';
import { SyncStatusBadge } from './components/SyncStatusBadge';
import FeedbackButton from './components/FeedbackButton';
import { offlineDB } from './lib/offline/database';
import { syncManager } from './lib/offline/syncManager';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';
import SitesPage from './pages/SitesPage';
import QrCodesPage from './pages/QrCodesPage';
import BillingPage from './pages/BillingPage';
import InventoryPage from './pages/InventoryPage';
import HelpPage from './pages/HelpPage';
import ReportsPage from './pages/ReportsPage';
import ComplianceDashboard from './pages/ComplianceDashboard';
import CalendarPage from './pages/CalendarPage';
import FireAlarmLogbookPage from './pages/FireAlarmLogbookPage';
import PATTestingPage from './pages/PATTestingPage';
import EmergencyLightingPage from './pages/EmergencyLightingPage';
import FireDoorsPage from './pages/FireDoorsPage';
import PlatformAdminPage from './pages/PlatformAdminPage';
import QuotesListPage from './pages/QuotesListPage';
import QuoteCreatePage from './pages/QuoteCreatePage';
import QuoteDetailPage from './pages/QuoteDetailPage';
import RoleSwitcherModal from './components/RoleSwitcher';
import Footer from './components/Footer';
import { addExtinguisher, updateExtinguisher, fetchExtinguishers, fetchExtinguisherById, exportExtinguishersCsv, importExtinguishersCsv, updateUserRole, updateTenantSettings, updateOtherUserRole, getUsers, fetchSites, fetchMonthlyInspectionCount } from './lib/api';
import { addExtinguisherOffline } from './lib/offline/offlineApi';
import { getComplianceBucket as getComplianceBucketShared } from './lib/complianceRules';
import { AuthContext, type AuthCtx } from './components/AuthWrapper';
import type {
  Extinguisher,
  Tenant,
  User,
  AuthedUser,
  RoleKey,
  PermissionKey,
  Site,
} from './types';

/* ----------------------------- Context contracts ----------------------------- */
export type TenantCtx = {
  tenant: Tenant;
  loading: boolean;
  error: string | null;
  switchTenant: (sub: string) => void;
  updateTenant: (u: Partial<Tenant>) => Promise<void>;
};

const TenantContext = createContext<TenantCtx | null>(null);

/* -------------------------------- Mock data --------------------------------- */
const MOCK_CURRENT_USER: AuthedUser = {
  id: 'current_user',
  name: 'Admin',
  email: 'admin@demo.com',
  role: 'admin',
  status: 'active',
  lastLogin: 'Never',
  createdAt: new Date().toISOString().split('T')[0],
  tenantId: 'tenant-demo',
};

const MOCK_TENANTS: Record<string, Tenant> = {
  demo: {
    id: 'tenant-demo',
    companyName: 'Demo Company',
    subdomain: 'demo',
    logoUrl: null,
    primaryColor: '#B8121F',
    secondaryColor: '#8A0D17',
    subscriptionPlan: 'trial',
    subscriptionStatus: 'trial',
    createdAt: '2024-12-01',
    stockManagementEnabled: true,
    fireAlarmEnabled: false,
    patTestingEnabled: false,
    emergencyLightingEnabled: false,
    fireDoorsEnabled: false,
    complianceStandard: 'BS',
  },
};

const SUBSCRIPTION_PLANS: Record<
  Tenant['subscriptionPlan'],
  { name: string; price: string }
> = {
  trial: { name: 'Trial', price: 'Free' },
  starter: { name: 'Starter', price: '$29/month' },
  professional: { name: 'Professional', price: '$99/month' },
  enterprise: { name: 'Enterprise', price: 'Custom' },
};

const USER_ROLES: Record<RoleKey, { name: string; description: string }> = {
  super_admin: {
    name: 'Super Admin',
    description: 'Full system access including billing and user management',
  },
  admin: {
    name: 'Administrator',
    description: 'Manage users and extinguishers, view reports',
  },
  manager: {
    name: 'Manager',
    description: 'Manage extinguishers and view reports',
  },
  inspector: {
    name: 'Inspector',
    description: 'Inspect extinguishers and view basic information',
  },
  viewer: {
    name: 'Viewer',
    description: 'Read-only access to extinguisher data',
  },
};

const PERMISSIONS: Record<PermissionKey, RoleKey[]> = {
  VIEW_USERS: ['super_admin', 'admin'],
  ADD_USERS: ['super_admin', 'admin'],
  EDIT_USERS: ['super_admin', 'admin'],
  DELETE_USERS: ['super_admin'],
  VIEW_EXTINGUISHERS: ['super_admin', 'admin', 'manager', 'inspector', 'viewer', 'building_owner'],
  ADD_EXTINGUISHERS: ['super_admin', 'admin', 'manager', 'inspector'],
  EDIT_EXTINGUISHERS: ['super_admin', 'admin', 'manager', 'inspector'],
  DELETE_EXTINGUISHERS: ['super_admin', 'admin'],
  PERFORM_INSPECTIONS: ['super_admin', 'admin', 'manager', 'inspector'],
  VIEW_INSPECTIONS: ['super_admin', 'admin', 'manager', 'inspector', 'viewer', 'building_owner'],
  VIEW_REPORTS: ['super_admin', 'admin', 'manager', 'building_owner'],
  VIEW_BILLING: ['super_admin', 'admin'],
  MANAGE_SETTINGS: ['super_admin', 'admin'],
};

const hasPermissionFor = (role: RoleKey, perm: PermissionKey) =>
  PERMISSIONS[perm]?.includes(role) || false;

/* -------------------------------- Providers --------------------------------- */
const TenantProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const actx = useContext(AuthContext);
  if (!actx) throw new Error('TenantProvider must be used within AuthWrapper');

  const [tenant, setTenant] = useState<Tenant>(actx.currentUser.tenant);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Update tenant when currentUser changes
  useEffect(() => {
    if (actx.currentUser.tenant) {
      setTenant(actx.currentUser.tenant);
    }
  }, [actx.currentUser]);

  const switchTenant = (sub: string) => {
    // In a real app, this would switch to a different tenant the user has access to
    console.log('Switch tenant not implemented:', sub);
  };

  const updateTenant = async (u: Partial<Tenant>) => {
    try {
      // Update tenant in database
      const response = await updateTenantSettings(u);

      // Update local state with response from server
      setTenant(response.tenant);

      // Also update the current user's tenant reference
      actx.setCurrentUser({
        ...actx.currentUser,
        tenant: response.tenant,
      });
    } catch (error) {
      console.error('Failed to update tenant:', error);
      alert('Failed to save settings. Please try again.');
      throw error; // Re-throw so SettingsPage can handle it
    }
  };

  return (
    <TenantContext.Provider
      value={{ tenant, loading, error, switchTenant, updateTenant }}
    >
      {children}
    </TenantContext.Provider>
  );
};

/* --------------------------------- Helpers ---------------------------------- */
// Monthly inspection limits per plan
const PLAN_INSPECTION_LIMITS: Record<Tenant['subscriptionPlan'], number> = {
  trial: 10,
  starter: 50,
  professional: 250,
  enterprise: 1000,
};

function computeKpis(list: Extinguisher[], plan: Tenant['subscriptionPlan'], monthlyInspections: number) {
  const total = list.length;
  const limit = PLAN_INSPECTION_LIMITS[plan] || 10;
  return { total, planLimit: { used: monthlyInspections, limit } };
}

// "CO2 · 2 kg" — type and capacity are separate free-text fields
function formatExtType(ext: Extinguisher): string {
  return ext.capacity ? `${ext.type} · ${ext.capacity}` : ext.type;
}

function daysBetween(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

// "4 months ago" / "3 days ago" / "today" — for Last Inspected
function timeAgo(dateStr?: string): string {
  if (!dateStr) return '—';
  const diff = -daysBetween(dateStr);
  if (diff <= 0) return 'today';
  if (diff === 1) return '1 day ago';
  if (diff < 30) return `${diff} days ago`;
  if (diff < 60) return '1 month ago';
  if (diff < 365) return `${Math.round(diff / 30)} months ago`;
  const years = Math.round(diff / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

// "77 days" or "43 days overdue" — for Next Due
function dueLabel(dateStr?: string): { text: string; overdue: boolean } {
  if (!dateStr) return { text: '—', overdue: false };
  const diff = daysBetween(dateStr);
  if (diff < 0) return { text: `${Math.abs(diff)} days overdue`, overdue: true };
  if (diff === 0) return { text: 'Due today', overdue: false };
  return { text: `${diff} days`, overdue: false };
}

function daysRemainingInMonth(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

type KpiProps = {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  hint?: React.ReactNode;
};

const KpiCard: React.FC<KpiProps> = ({
  label,
  value,
  icon,
  iconBg = 'bg-brand-bg',
  iconColor = 'text-brand-ink-muted',
  hint,
}) => (
  <div className="bg-white border border-brand-line rounded-xl px-4 py-3.5 flex items-center gap-3">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold text-brand-ink leading-none tabular-nums">{value}</p>
      <p className="text-[11px] text-brand-ink-muted mt-1 inline-flex items-center gap-1">{label}{hint}</p>
    </div>
  </div>
);

const KpiProgressCard: React.FC<{ label: string; used: number; limit: number; hint?: React.ReactNode }> = ({ label, used, limit, hint }) => {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const barCls = used >= limit ? 'bg-red-500' : used >= limit * 0.8 ? 'bg-amber-500' : 'bg-brand-red';
  return (
    <div className="bg-white border border-brand-line rounded-xl px-4 py-3.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-brand-ink-muted inline-flex items-center gap-1">{label}{hint}</p>
        <span className="text-xs font-semibold text-brand-ink tabular-nums">{used}/{limit}</span>
      </div>
      <div className="w-full h-1.5 bg-brand-bg rounded-full overflow-hidden mt-2">
        <div className={`h-full rounded-full ${barCls}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] text-brand-ink-faint mt-1.5">{pct}% complete · {daysRemainingInMonth()} days remaining</p>
    </div>
  );
};

const CONDITION_OPTIONS: Extinguisher['condition'][] = ['Excellent', 'Good', 'Fair', 'Needs Attention', 'Out of Service'];

const QuickLogInspectionModal: React.FC<{
  extinguisher: Extinguisher;
  inspectorDefault?: string;
  onClose: () => void;
  onSave: (payload: Partial<Extinguisher>) => Promise<void>;
}> = ({ extinguisher, inspectorDefault, onClose, onSave }) => {
  const today = new Date().toISOString().split('T')[0];
  const defaultNextDue = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  })();

  const [condition, setCondition] = useState<Extinguisher['condition']>(extinguisher.condition);
  const [inspector, setInspector] = useState(inspectorDefault ?? '');
  const [date, setDate] = useState(today);
  const [nextDue, setNextDue] = useState(defaultNextDue);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!inspector.trim()) { setError('Inspector name is required'); return; }
    setError(null);
    setSaving(true);
    try {
      await onSave({
        condition,
        status: condition === 'Out of Service' ? 'Out of Service' : 'Active',
        inspector,
        lastInspection: date,
        nextInspection: nextDue,
        notes: notes || extinguisher.notes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log inspection');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-line">
          <h2 className="font-semibold text-brand-ink">Log Inspection</h2>
          <button onClick={onClose} className="text-brand-ink-faint hover:text-brand-ink"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-brand-ink-muted">{extinguisher.location} — {formatExtType(extinguisher)}</p>
          {error && <div className="p-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">{error}</div>}

          <div>
            <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as Extinguisher['condition'])}
              className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
            >
              {CONDITION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Inspector *</label>
            <input
              value={inspector}
              onChange={(e) => setInspector(e.target.value)}
              className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
              placeholder="Inspector name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Next due</label>
              <input
                type="date"
                value={nextDue}
                onChange={(e) => setNextDue(e.target.value)}
                className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
              placeholder="Optional"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-brand-line">
          <button onClick={onClose} disabled={saving} className="px-4 py-2 bg-brand-bg rounded-lg hover:bg-brand-line text-brand-ink">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-white bg-brand-red rounded-lg hover:bg-brand-red-dark disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Log Inspection'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Main App Shell ------------------------------- */
const FireExtinguisherApp: React.FC = () => {
  const tctx = useContext(TenantContext);
  const actx = useContext(AuthContext);
  if (!tctx || !actx) return null;

  const { tenant, updateTenant } = tctx;
  const { currentUser, setCurrentUser, hasPermission, logout } = actx;

  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<{ id: string; name: string } | null>(null);
  const [patPendingId, setPATPendingId] = useState<string | undefined>(undefined);
  const [elPendingId, setELPendingId] = useState<string | undefined>(undefined);
  const [fdPendingId, setFDPendingId] = useState<string | undefined>(undefined);
  const [extPendingId, setExtPendingId] = useState<string | undefined>(undefined);

  // Extinguishers state (seed with demo; will be replaced by API load)
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([
    {
      id: 'FE001',
      location: 'Main Lobby',
      building: 'Building A',
      floor: '1st Floor',
      type: 'Dry Powder 6KG',
      capacity: '6 kg',
      status: 'Active',
      condition: 'Good',
      manufacturer: 'Amerex',
      model: 'B500',
      serialNumber: 'AX123456',
      installDate: '2023-01-15',
      expiryDate: '2043-01-15',
      lastInspection: '2024-12-15',
      nextInspection: '2025-01-15',
      lastMaintenance: '2024-06-15',
      nextMaintenance: '2025-06-15',
      serviceType: 'Basic',
      inspector: 'John Smith',
      notes: 'Pressure gauge in green zone',
    },
    {
      id: 'FE002',
      location: 'Kitchen',
      building: 'Building A',
      floor: '1st Floor',
      type: 'Wet Chemical',
      capacity: '6 L',
      status: 'Active',
      condition: 'Needs Attention',
      manufacturer: 'Ansul',
      model: 'K-GUARD',
      serialNumber: 'AN789012',
      installDate: '2023-02-10',
      expiryDate: '2043-02-10',
      lastInspection: '2024-11-20',
      nextInspection: '2025-02-20',
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2025-02-10',
      serviceType: 'Extended',
      inspector: 'Sarah Johnson',
      notes: 'Pressure slightly low, monitor closely',
    },
  ]);

  // State to track if offline DB is ready
  const [offlineReady, setOfflineReady] = useState(false);
  // Track online/offline status for header display
  const [isOnline, setIsOnline] = useState(true);
  // Monthly inspection count for plan limit tracking
  const [monthlyInspections, setMonthlyInspections] = useState(0);

  // Load from API (replaces demo data if backend is up) with offline caching
  useEffect(() => {
    (async () => {
      // Wait for offline DB to be ready first
      if (!offlineReady) {
        console.log('Waiting for offline DB to initialize...');
        return;
      }

      try {
        const data = await fetchExtinguishers(); // uses authenticated user's tenant

        // Also get any pending offline extinguishers and merge them
        try {
          const pending = await offlineDB.getAllPendingExtinguishers();
          const pendingAsExtinguishers = pending
            .filter(p => !p.synced)
            .map(p => ({
              id: p.id,
              location: p.location,
              building: p.building || '',
              floor: p.floor || '',
              type: p.type,
              capacity: p.capacity || '',
              manufacturer: p.manufacturer || '',
              serialNumber: p.serialNumber || '',
              installDate: p.installDate || '',
              expiryDate: p.expiryDate || '',
              status: p.status as any,
              condition: p.condition as any,
              notes: p.notes || '',
              _pendingSync: true,
            }));

          setExtinguishers([...data, ...pendingAsExtinguishers] as any);
        } catch {
          setExtinguishers(data);
        }

        // Cache for offline use
        try {
          await offlineDB.cacheExtinguishers(data);
          console.log('Extinguishers cached for offline use');
        } catch (cacheErr) {
          console.warn('Failed to cache extinguishers:', cacheErr);
        }
      } catch (err) {
        console.warn('API load failed, trying offline cache:', err);

        // Try to load from offline cache
        try {
          const cached = await offlineDB.getCachedExtinguishers();
          const pending = await offlineDB.getAllPendingExtinguishers();

          // Combine cached server data with pending offline data
          const pendingAsExtinguishers = pending
            .filter(p => !p.synced)
            .map(p => ({
              id: p.id,
              location: p.location,
              building: p.building || '',
              floor: p.floor || '',
              type: p.type,
              capacity: p.capacity || '',
              manufacturer: p.manufacturer || '',
              serialNumber: p.serialNumber || '',
              installDate: p.installDate || '',
              expiryDate: p.expiryDate || '',
              status: p.status as any,
              condition: p.condition as any,
              notes: p.notes || '',
              _pendingSync: true,
            }));

          const combined = [...(cached as any[]), ...pendingAsExtinguishers];

          if (combined.length > 0) {
            setExtinguishers(combined as any);
            console.log(`Loaded ${cached.length} cached + ${pendingAsExtinguishers.length} pending extinguishers from offline storage`);
          } else {
            console.log('No offline data available');
          }
        } catch (cacheErr) {
          console.warn('Offline cache also failed:', cacheErr);
        }
      }
    })();
  }, [tenant.id, offlineReady]);

  // Users (for UsersPage)
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    loadUsers();
  }, []);

  // Fetch monthly inspection count
  useEffect(() => {
    const loadMonthlyCount = async () => {
      try {
        const data = await fetchMonthlyInspectionCount();
        setMonthlyInspections(data.count);
      } catch (err) {
        console.error('Failed to fetch monthly inspection count:', err);
      }
    };
    loadMonthlyCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadMonthlyCount, 30000);
    return () => clearInterval(interval);
  }, []);
// Initialize offline database and sync on mount
useEffect(() => {
  const initOffline = async () => {
    try {
      await offlineDB.initialize();
      setOfflineReady(true);
      syncManager.startAutoSync(5); // Auto-sync every 5 minutes
      console.log('Offline mode initialized successfully');
    } catch (err) {
      console.error('Failed to initialize offline mode:', err);
      // Still set ready so app can function (just without offline support)
      setOfflineReady(true);
    }
  };

  initOffline();

  // Track online/offline status changes
  const checkStatus = () => {
    setIsOnline(syncManager.getOnlineStatus());
  };
  checkStatus();
  const statusInterval = setInterval(checkStatus, 2000);

  // Cleanup on unmount
  return () => {
    syncManager.stopAutoSync();
    clearInterval(statusInterval);
  };
}, []);
  const handleAddUser = (u: User) => setUsers((prev) => [...prev, u]);
  const handleUpdateUser = async (id: string, patch: Partial<User>) => {
    // If updating role, make API call
    if (patch.role) {
      try {
        const result = await updateOtherUserRole(id, patch.role);
        if (result.success) {
          // Update local state with the returned user data
          setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, ...result.user } : x)));
        }
      } catch (err) {
        console.error('Failed to update user role:', err);
        alert(err instanceof Error ? err.message : 'Failed to update user role');
      }
    } else {
      // For other updates, just update local state for now
      setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    }
  };

  // Detail modal
  const [selectedExtinguisher, setSelectedExtinguisher] =
    useState<Extinguisher | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const openDetails = (ext: Extinguisher) => {
    setSelectedExtinguisher(ext);
    setShowDetails(true);
  };

  useEffect(() => {
    if (!extPendingId || extinguishers.length === 0) return;
    const match = extinguishers.find(e => e.id === extPendingId);
    if (match) { openDetails(match); setExtPendingId(undefined); }
  }, [extPendingId, extinguishers]);

  // Add modal + QR
  const [openAdd, setOpenAdd] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingExtinguisher, setEditingExtinguisher] = useState<Extinguisher | null>(null);
  const [showSimpleForm, setShowSimpleForm] = useState(false);

  // CSV import/export
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Role switcher
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const handleSelectRole = async (role: RoleKey) => {
    try {
      // Update role in database
      const response = await updateUserRole(role);

      // Update local state with response from server
      setCurrentUser({
        ...response.user,
        name: USER_ROLES[role].name,
      });
      setShowRoleSwitcher(false);
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  // Sites state
  const [sites, setSites] = useState<Site[]>([]);

  // Load sites on mount
  useEffect(() => {
    loadSites();
  }, []);

  async function loadSites() {
    try {
      const data = await fetchSites();
      setSites(data.filter(site => site.status === 'active'));
    } catch (err) {
      console.error('Failed to load sites:', err);
    }
  }

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [pillFilter, setPillFilter] = useState<'all' | 'compliant' | 'dueSoon' | 'overdue' | 'outOfService'>('all');
  const [extPage, setExtPage] = useState(1);
  const EXT_PAGE_SIZE = 25;
  const [showExtMenu, setShowExtMenu] = useState(false);
  const extMenuRef = useRef<HTMLDivElement>(null);
  const [quickLogTarget, setQuickLogTarget] = useState<Extinguisher | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (extMenuRef.current && !extMenuRef.current.contains(e.target as Node)) setShowExtMenu(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    setExtPage(1);
  }, [searchQuery, siteFilter, buildingFilter, typeFilter, statusFilter, conditionFilter, pillFilter]);

  // CSV Export handler
  const handleExport = async () => {
    try {
      setExporting(true);
      await exportExtinguishersCsv();
    } catch (err) {
      alert(`Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setExporting(false);
    }
  };

  // CSV Import handlers
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setImportResult(null);
      const result = await importExtinguishersCsv(file);
      setImportResult({ imported: result.imported, errors: result.errors });

      if (result.imported > 0) {
        // Refresh the extinguishers list
        const data = await fetchExtinguishers();
        setExtinguishers(data);
      }

      if (result.errors > 0) {
        console.error('Import errors:', result.details);
      }
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Get unique values for filters
  const buildings = Array.from(new Set(extinguishers.map(e => e.building).filter(Boolean)));
  const types = Array.from(new Set(extinguishers.map(e => e.type).filter(Boolean)));
  const statuses = Array.from(new Set(extinguishers.map(e => e.status).filter(Boolean)));
  const conditions = Array.from(new Set(extinguishers.map(e => e.condition).filter(Boolean)));

  // Compliance bucket for the status-pill filter row — mirrors the thresholds
  // used in ComplianceDashboard so "Due Soon"/"Overdue" mean the same thing everywhere.
  const getComplianceBucket = (ext: Extinguisher) => getComplianceBucketShared(ext, tenant.complianceStandard);

  const pillCounts = extinguishers.reduce(
    (acc, ext) => {
      const bucket = getComplianceBucket(ext);
      acc[bucket] += 1;
      return acc;
    },
    { compliant: 0, dueSoon: 0, overdue: 0, outOfService: 0 } as Record<'compliant' | 'dueSoon' | 'overdue' | 'outOfService', number>,
  );

  const BUCKET_BORDER_CLS: Record<ReturnType<typeof getComplianceBucket>, string> = {
    compliant: 'border-l-green-500',
    dueSoon: 'border-l-amber-500',
    overdue: 'border-l-red-500',
    outOfService: 'border-l-brand-ink-faint',
  };

  // Single merged Condition badge: out-of-service/overdue override the plain
  // physical condition, since those are the more urgent facts about the unit.
  const getRowBadge = (ext: Extinguisher): { label: string; cls: string } => {
    const bucket = getComplianceBucket(ext);
    if (bucket === 'outOfService') return { label: 'Out of Service', cls: 'bg-brand-bg text-brand-ink-muted' };
    if (bucket === 'overdue') return { label: 'Overdue', cls: 'bg-red-100 text-red-700' };
    if (ext.condition === 'Needs Attention') return { label: 'Needs Attention', cls: 'bg-amber-100 text-amber-700' };
    if (bucket === 'dueSoon') return { label: 'Due Soon', cls: 'bg-amber-100 text-amber-700' };
    return { label: ext.condition, cls: 'bg-green-100 text-green-700' };
  };

  // Stable human-readable labels (EXT-001...) keyed by position in the full,
  // unfiltered list — so a unit's label doesn't shift as the user filters,
  // sorts, or paginates.
  const extDisplayIds = new Map(extinguishers.map((e, i) => [e.id, `EXT-${String(i + 1).padStart(3, '0')}`]));

  // Filter extinguishers
  const filteredExtinguishers = extinguishers.filter(item => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.location?.toLowerCase().includes(query) ||
        item.building?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.serialNumber?.toLowerCase().includes(query) ||
        item.manufacturer?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Site filter
    if (siteFilter !== 'all' && item.siteId !== siteFilter) return false;

    // Building filter
    if (buildingFilter !== 'all' && item.building !== buildingFilter) return false;

    // Type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;

    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;

    // Condition filter
    if (conditionFilter !== 'all' && item.condition !== conditionFilter) return false;

    // Status-pill filter
    if (pillFilter !== 'all' && getComplianceBucket(item) !== pillFilter) return false;

    return true;
  });

  // Count active filters
  const activeFilterCount = [
    siteFilter !== 'all',
    buildingFilter !== 'all',
    typeFilter !== 'all',
    statusFilter !== 'all',
    conditionFilter !== 'all',
  ].filter(Boolean).length;

  const extTotalPages = Math.max(1, Math.ceil(filteredExtinguishers.length / EXT_PAGE_SIZE));
  const pagedExtinguishers = filteredExtinguishers.slice((extPage - 1) * EXT_PAGE_SIZE, extPage * EXT_PAGE_SIZE);

  const { total, planLimit } = computeKpis(extinguishers, tenant.subscriptionPlan, monthlyInspections);

  // Helper: next ID
  const getNextExtinguisherId = (list: Extinguisher[]) => {
    const nums = list
      .map((e) => parseInt(String(e.id).replace(/^FE/i, ''), 10))
      .filter((n) => Number.isFinite(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `FE${String(next).padStart(3, '0')}`;
  };

  // Update extinguisher after service
  const handleUpdate = async (id: string, payload: Partial<Extinguisher>) => {
    try {
      const updated = await updateExtinguisher(id, payload);
      // Update in local state
      setExtinguishers((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (err) {
      console.error('Failed to update extinguisher:', err);
      alert('Failed to update extinguisher. Please try again.');
      throw err;
    }
  };

  // Handle edit button from details modal
  const handleEdit = (ext: Extinguisher) => {
    setEditingExtinguisher(ext);
    setOpenEdit(true);
  };

  // Handle delete extinguisher
  const handleDelete = async (id: string) => {
    try {
      // Remove from local state immediately
      setExtinguishers((prev) => prev.filter((e) => e.id !== id));
      // Optionally refresh from server to ensure sync
      const refreshed = await fetchExtinguishers();
      setExtinguishers(refreshed);
    } catch (err) {
      console.error('Failed to delete extinguisher:', err);
      // Refresh to restore state if delete failed
      const refreshed = await fetchExtinguishers();
      setExtinguishers(refreshed);
    }
  };

  // Create with optimistic UI + server reconcile (with offline support)
  const handleCreate = async (payload: Partial<Extinguisher>) => {
    const today = new Date().toISOString().split('T')[0];
    const type = payload.type ?? '';
    const years = type.startsWith('CO2') ? 10 : 20;
    const install = payload.installDate ?? today;
    const expiry = new Date(install);
    expiry.setFullYear(expiry.getFullYear() + years);

    const optimisticId = getNextExtinguisherId(extinguishers);
    const optimistic: Extinguisher = {
      id: optimisticId,
      location: payload.location!,
      building: payload.building!,
      floor: payload.floor ?? '',
      type,
      capacity: payload.capacity ?? '',
      manufacturer: payload.manufacturer ?? '',
      model: payload.model ?? '',
      serialNumber: payload.serialNumber ?? '',
      installDate: install,
      expiryDate: expiry.toISOString().split('T')[0],
      lastInspection: today,
      nextInspection: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      lastMaintenance: today,
      nextMaintenance: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      status: (payload.status as Extinguisher['status']) ?? 'Active',
      condition: (payload.condition as Extinguisher['condition']) ?? 'Good',
      serviceType: payload.serviceType ?? 'Commission',
      inspector: payload.inspector ?? '',
      notes: payload.notes ?? '',
    };

    // optimistic add
    setExtinguishers((prev) => [...prev, optimistic]);

    try {
      // Use offline-aware API that handles both online and offline scenarios
      const result = await addExtinguisherOffline({
        siteId: payload.siteId,
        location: payload.location!,
        building: payload.building,
        floor: payload.floor,
        type: payload.type!,
        capacity: payload.capacity,
        manufacturer: payload.manufacturer,
        serialNumber: payload.serialNumber,
        installDate: payload.installDate,
        expiryDate: expiry.toISOString().split('T')[0],
        status: payload.status,
        condition: payload.condition,
        notes: payload.notes,
      });

      if (result.synced) {
        // Server responded - refresh from server to get the real data
        try {
          const refreshed = await fetchExtinguishers();
          setExtinguishers(refreshed);
        } catch {
          // If refresh fails, keep optimistic data with server ID
          setExtinguishers((prev) =>
            prev.map((e) => (e.id === optimisticId ? { ...e, id: result.id } : e))
          );
        }
      } else {
        // Saved offline - update ID to match offline ID
        setExtinguishers((prev) =>
          prev.map((e) => (e.id === optimisticId ? { ...e, id: result.id, _pendingSync: true } as any : e))
        );
        alert('Saved offline. Will sync when back online.');
      }
    } catch (err) {
      console.error('Failed to create extinguisher:', err);
      // rollback
      setExtinguishers((prev) => prev.filter((e) => e.id !== optimisticId));
      alert('Failed to add extinguisher. Please try again.');
    }
  };

  const canAddUsers = hasPermission('ADD_USERS');
  const canEditUsers = hasPermission('EDIT_USERS');

  return (
    <div className="min-h-screen bg-brand-bg flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tenant={tenant}
        hasPermission={hasPermission}
        isPlatformAdmin={currentUser.isPlatformAdmin}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopHeader
          activeTab={activeTab}
          userName={currentUser.name}
          userRole={USER_ROLES[currentUser.role]?.name ?? currentUser.role}
          isOnline={isOnline}
          onDownload={async () => {
            try {
              await syncManager.downloadExtinguishersForOffline();
              alert('Data downloaded for offline use!');
            } catch (error: any) {
              alert(`Download failed: ${error.message}`);
            }
          }}
          onLogout={logout}
        />
        {/* Sync Status Badge - Fixed position in bottom-right */}
        <SyncStatusBadge />
        <FeedbackButton currentTab={activeTab} />
      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* KPI cards — only on the Extinguishers overview, not every tab */}
        {activeTab === 'overview' && (
        <section className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
          <KpiCard
            label="Total extinguishers"
            value={total}
            icon={<Flame size={17} />}
            iconBg="bg-brand-bg"
            iconColor="text-brand-ink-muted"
          />
          <KpiCard
            label="Compliant"
            value={pillCounts.compliant}
            icon={<CheckCircle size={17} />}
            iconBg="bg-green-50"
            iconColor="text-green-600"
          />
          <KpiCard
            label="Overdue"
            value={pillCounts.overdue}
            icon={<AlertTriangle size={17} />}
            iconBg="bg-red-50"
            iconColor="text-brand-red"
            hint={
              <HintTooltip
                storageKey="kpi_needs_attention"
                content="Extinguishers past their next inspection date. Address these first to stay compliant."
              />
            }
          />
          <KpiProgressCard
            label="Monthly inspections"
            used={planLimit.used}
            limit={planLimit.limit}
            hint={
              <HintTooltip
                storageKey="kpi_monthly_inspections"
                content="Inspections logged this calendar month vs. your plan's monthly limit. The limit resets on the 1st of each month."
              />
            }
          />
        </section>
        )}
        {/* Sites tab */}
        {activeTab === 'sites' && (
          <SitesPage
            onViewSite={(siteId, siteName) => {
              setSiteFilter(siteId);
              setSelectedSiteFilter({ id: siteId, name: siteName });
              setActiveTab('overview');
            }}
          />
        )}

        {/* Stock tab */}
        {activeTab === 'stock' && tenant.stockManagementEnabled !== false && <InventoryPage />}

        {/* Quotes tab */}
        {activeTab === 'quotes' && <QuotesListPage />}

        {/* Users tab */}
        {activeTab === 'users' && (
          <UsersPage
            users={users}
            primaryColor={tenant.primaryColor}
            currentRole={currentUser.role}
            canAdd={canAddUsers}
            canEdit={canEditUsers}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {/* Overview tab: actions + table */}
        {activeTab === 'overview' && (
          <>
            {/* Getting Started panel */}
            <GettingStartedPanel
              extinguisherCount={extinguishers.length}
              siteCount={sites.length}
              tenantCreatedAt={tenant.createdAt}
              monthlyInspections={monthlyInspections}
              primaryColor={tenant.primaryColor}
              onNavigate={(tab) => setActiveTab(tab)}
              onAddExtinguisher={() => setOpenAdd(true)}
            />

            {/* Site Filter Indicator */}
            {selectedSiteFilter && (
              <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Viewing extinguishers for: <span className="font-bold">{selectedSiteFilter.name}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSiteFilter('all');
                    setSelectedSiteFilter(null);
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View All Sites
                </button>
              </div>
            )}

            {/* Toolbar: search + filters + primary actions */}
            <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-brand-line">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute text-brand-ink-faint transform -translate-y-1/2 left-3 top-1/2" size={18} />
                  <input
                    type="text"
                    placeholder="Search by location, building, type, serial number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute text-brand-ink-faint transform -translate-y-1/2 right-3 top-1/2 hover:text-brand-ink"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    showFilters
                      ? 'bg-brand-red-tint border-brand-red text-brand-red-dark'
                      : 'bg-white border-brand-line text-brand-ink hover:border-brand-ink-faint'
                  }`}
                >
                  <Filter size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-brand-red text-white rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setShowQrScanner(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-brand-ink text-white hover:bg-brand-ink/90 transition-colors"
                >
                  <QrCode size={16} /> Scan QR
                </button>

                <button
                  onClick={() => setOpenAdd(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-brand-red text-white hover:bg-brand-red-dark transition-colors"
                >
                  <Plus size={16} /> Add Extinguisher
                </button>

                <div className="relative" ref={extMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowExtMenu(v => !v)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-brand-line text-brand-ink-muted hover:border-brand-ink-faint transition-colors"
                    title="More actions"
                    aria-label="More actions"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {showExtMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-brand-line rounded-lg shadow-lg z-20 py-1">
                      <button
                        onClick={() => { handleExport(); setShowExtMenu(false); }}
                        disabled={exporting || extinguishers.length === 0}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-ink hover:bg-brand-bg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download size={15} /> {exporting ? 'Exporting...' : 'Export CSV'}
                      </button>
                      <button
                        onClick={() => { handleImportClick(); setShowExtMenu(false); }}
                        disabled={importing}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-ink hover:bg-brand-bg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload size={15} /> {importing ? 'Importing...' : 'Import CSV'}
                      </button>
                      <button
                        onClick={() => { setShowSimpleForm(true); setShowExtMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-ink hover:bg-brand-bg"
                      >
                        <FileText size={15} /> Simple Form
                      </button>
                      <button
                        onClick={() => { setShowRoleSwitcher(true); setShowExtMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-ink-muted hover:bg-brand-bg"
                      >
                        <Shield size={15} /> Switch Role
                      </button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Filter Dropdowns */}
              {showFilters && (
                <div className="grid grid-cols-1 gap-3 pt-3 border-t border-brand-line md:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Site</label>
                    <select
                      value={siteFilter}
                      onChange={(e) => {
                        setSiteFilter(e.target.value);
                        if (e.target.value === 'all') {
                          setSelectedSiteFilter(null);
                        }
                      }}
                      className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
                    >
                      <option value="all">All Sites</option>
                      {sites.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Building</label>
                    <select
                      value={buildingFilter}
                      onChange={(e) => setBuildingFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
                    >
                      <option value="all">All Buildings</option>
                      {buildings.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
                    >
                      <option value="all">All Types</option>
                      {types.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
                    >
                      <option value="all">All Statuses</option>
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-brand-ink-muted">Condition</label>
                    <select
                      value={conditionFilter}
                      onChange={(e) => setConditionFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-line rounded-lg focus:ring-2 focus:ring-brand-red-tint focus:border-brand-red outline-none"
                    >
                      <option value="all">All Conditions</option>
                      {conditions.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Status chips */}
            <div className="flex flex-wrap items-center gap-2">
              {([
                { key: 'all', label: 'All', count: extinguishers.length, dot: null },
                { key: 'compliant', label: 'Compliant', count: pillCounts.compliant, dot: 'bg-brand-green' },
                { key: 'dueSoon', label: 'Due Soon', count: pillCounts.dueSoon, dot: 'bg-brand-amber' },
                { key: 'overdue', label: 'Overdue', count: pillCounts.overdue, dot: 'bg-brand-red' },
                { key: 'outOfService', label: 'Out of Service', count: pillCounts.outOfService, dot: 'bg-brand-ink-faint' },
              ] as const).map((pill) => {
                const active = pillFilter === pill.key;
                return (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => setPillFilter(pill.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      active
                        ? 'bg-brand-ink text-white border-brand-ink'
                        : 'bg-white text-brand-ink-muted border-brand-line hover:border-brand-ink-faint'
                    }`}
                  >
                    {pill.dot && <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`} />}
                    {pill.label} <span className="opacity-70">{pill.count}</span>
                  </button>
                );
              })}
            </div>

            {importResult && (
              <div className={`p-4 rounded-lg text-sm ${importResult.errors > 0 ? 'bg-amber-50 text-brand-amber' : 'bg-brand-green/10 text-brand-green'}`}>
                Import complete: {importResult.imported} extinguishers imported
                {importResult.errors > 0 && `, ${importResult.errors} errors occurred (check console)`}
              </div>
            )}

            <div className="overflow-x-auto bg-white border border-brand-line rounded-xl">
              <table className="min-w-full">
                <thead className="bg-brand-bg">
                  <tr>
                    <th className="px-3 py-3 text-xs font-medium text-left text-brand-ink-muted uppercase tracking-wide md:px-6">
                      ID
                    </th>
                    <th className="px-3 py-3 text-xs font-medium text-left text-brand-ink-muted uppercase tracking-wide md:px-6">
                      Location
                    </th>
                    <th className="px-3 py-3 text-xs font-medium text-left text-brand-ink-muted uppercase tracking-wide md:px-6">
                      Type
                    </th>
                    <th className="px-3 py-3 text-xs font-medium text-left text-brand-ink-muted uppercase tracking-wide md:px-6">
                      Condition
                    </th>
                    <th className="hidden px-3 py-3 text-xs font-medium text-left text-brand-ink-muted uppercase tracking-wide sm:table-cell md:px-6">
                      Last Inspected
                    </th>
                    <th className="hidden px-3 py-3 text-xs font-medium text-left text-brand-ink-muted uppercase tracking-wide sm:table-cell md:px-6">
                      Next Due
                    </th>
                    <th className="px-3 py-3 text-xs font-medium text-left text-brand-ink-muted uppercase tracking-wide md:px-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-line">
                  {pagedExtinguishers.map((ext) => {
                    const bucket = getComplianceBucket(ext);
                    const badge = getRowBadge(ext);
                    const due = dueLabel(ext.nextInspection);
                    return (
                      <tr key={ext.id} className={`border-l-4 ${BUCKET_BORDER_CLS[bucket]} hover:bg-brand-bg/60 ${bucket === 'overdue' ? 'bg-red-50/40' : ''}`}>
                        <td className="px-3 py-3 md:px-6">
                          <div className="text-sm font-mono font-semibold text-brand-ink">{extDisplayIds.get(ext.id)}</div>
                          <div className="text-[11px] font-mono text-brand-ink-faint">{ext.id}</div>
                        </td>
                        <td className="px-3 py-3 md:px-6 md:py-4">
                          <div className="text-sm text-brand-ink md:text-base">{ext.location}</div>
                          <div className="text-xs text-brand-ink-muted md:text-sm">
                            {ext.building}
                            {ext.floor ? `, ${ext.floor}` : ''}
                          </div>
                        </td>
                        <td className="px-3 py-3 md:px-6 md:py-4">
                          <div className="text-sm text-brand-ink md:text-base">{formatExtType(ext)}</div>
                        </td>
                        <td className="px-3 py-3 md:px-6 md:py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="hidden px-3 py-3 sm:table-cell md:px-6 md:py-4">
                          <div className="text-sm text-brand-ink">{ext.lastInspection ? new Date(ext.lastInspection).toLocaleDateString('en-GB') : '—'}</div>
                          <div className="text-xs text-brand-ink-muted">{timeAgo(ext.lastInspection)}</div>
                        </td>
                        <td className="hidden px-3 py-3 sm:table-cell md:px-6 md:py-4">
                          <div className="text-sm text-brand-ink">{ext.nextInspection ? new Date(ext.nextInspection).toLocaleDateString('en-GB') : '—'}</div>
                          <div className={`text-xs ${due.overdue ? 'text-red-600 font-medium' : 'text-brand-ink-muted'}`}>{due.text}</div>
                        </td>
                        <td className="px-3 py-3 md:px-6 md:py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setQuickLogTarget(ext)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Log inspection"
                              aria-label={`Log inspection for ${extDisplayIds.get(ext.id)}`}
                            >
                              <ClipboardCheck size={18} />
                            </button>
                            <button
                              onClick={() => openDetails(ext)}
                              className="p-2 text-brand-ink-muted hover:text-brand-red hover:bg-brand-red-tint rounded-lg transition-colors"
                              title="View details"
                              aria-label={`View ${extDisplayIds.get(ext.id)}`}
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(ext)}
                              className="p-2 text-brand-ink-muted hover:text-brand-red hover:bg-brand-red-tint rounded-lg transition-colors"
                              title="Edit"
                              aria-label={`Edit ${extDisplayIds.get(ext.id)}`}
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredExtinguishers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-brand-ink-muted">
                        No extinguishers yet. Click{' '}
                        <span className="font-medium text-brand-ink">Add Extinguisher</span> to get
                        started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {filteredExtinguishers.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-brand-line text-sm text-brand-ink-muted">
                  <span>
                    Showing {(extPage - 1) * EXT_PAGE_SIZE + 1}–{Math.min(extPage * EXT_PAGE_SIZE, filteredExtinguishers.length)} of {filteredExtinguishers.length}
                  </span>
                  {extTotalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExtPage(p => Math.max(1, p - 1))}
                        disabled={extPage === 1}
                        className="p-1.5 rounded-lg border border-brand-line disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-ink-faint"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={15} />
                      </button>
                      {Array.from({ length: extTotalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setExtPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium ${p === extPage ? 'bg-brand-ink text-white' : 'border border-brand-line text-brand-ink-muted hover:border-brand-ink-faint'}`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setExtPage(p => Math.min(extTotalPages, p + 1))}
                        disabled={extPage === extTotalPages}
                        className="p-1.5 rounded-lg border border-brand-line disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-ink-faint"
                        aria-label="Next page"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {quickLogTarget && (
              <QuickLogInspectionModal
                extinguisher={quickLogTarget}
                inspectorDefault={currentUser.name}
                onClose={() => setQuickLogTarget(null)}
                onSave={async (payload) => {
                  await handleUpdate(quickLogTarget.id, payload);
                  setQuickLogTarget(null);
                }}
              />
            )}
          </>
        )}

        {/* QR Codes tab */}
        {activeTab === 'qr-codes' && (
          <QrCodesPage
            primaryColor={tenant.primaryColor}
            buildingFilter={buildingFilter}
            allExtinguishers={extinguishers}
            logoUrl={tenant.logoUrl}
            tenantId={tenant.id}
          />
        )}

        {/* Billing tab */}
        {activeTab === 'billing' && hasPermission('VIEW_BILLING') && (
          <BillingPage tenant={tenant} primaryColor={tenant.primaryColor} />
        )}

        {/* Settings tab */}
        {activeTab === 'settings' && hasPermission('MANAGE_SETTINGS') && (
          <SettingsPage tenant={tenant} updateTenant={updateTenant} userRole={currentUser.role} />
        )}

        {/* Compliance Dashboard tab */}
        {activeTab === 'compliance' && (
          <ComplianceDashboard
            primaryColor={tenant.primaryColor}
            complianceStandard={tenant.complianceStandard}
            onNavigate={() => setActiveTab('overview')}
            fireAlarmEnabled={tenant.fireAlarmEnabled}
            onNavigateFireAlarm={() => setActiveTab('fire-alarm')}
            patTestingEnabled={tenant.patTestingEnabled}
            onNavigatePATTesting={() => setActiveTab('pat-testing')}
            emergencyLightingEnabled={tenant.emergencyLightingEnabled}
            onNavigateEmergencyLighting={() => setActiveTab('emergency-lighting')}
            fireDoorsEnabled={tenant.fireDoorsEnabled}
            onNavigateFireDoors={() => setActiveTab('fire-doors')}
          />
        )}

        {/* Calendar tab */}
        {activeTab === 'calendar' && (
          <CalendarPage
            fireAlarmEnabled={tenant.fireAlarmEnabled}
            patTestingEnabled={tenant.patTestingEnabled}
            emergencyLightingEnabled={tenant.emergencyLightingEnabled}
            fireDoorsEnabled={tenant.fireDoorsEnabled}
            onNavigateToFireAlarm={() => setActiveTab('fire-alarm')}
            onNavigateToPAT={(id) => { setPATPendingId(id); setActiveTab('pat-testing'); }}
            onNavigateToEL={(id) => { setELPendingId(id); setActiveTab('emergency-lighting'); }}
            onNavigateToFireDoors={(id) => { setFDPendingId(id); setActiveTab('fire-doors'); }}
            onNavigateToExtinguisher={(id) => { setExtPendingId(id); setActiveTab('overview'); }}
          />
        )}

        {/* Reports tab */}
        {activeTab === 'reports' && (
          <ReportsPage
            primaryColor={tenant.primaryColor}
            buildingFilter={buildingFilter}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            fireAlarmEnabled={tenant.fireAlarmEnabled}
            patTestingEnabled={tenant.patTestingEnabled}
            emergencyLightingEnabled={tenant.emergencyLightingEnabled}
            fireDoorsEnabled={tenant.fireDoorsEnabled}
          />
        )}

        {/* Help tab */}
        {activeTab === 'help' && <HelpPage />}

        {/* Fire Alarm Logbook tab */}
        {activeTab === 'fire-alarm' && tenant.fireAlarmEnabled && <FireAlarmLogbookPage />}

        {/* PAT Testing tab */}
        {activeTab === 'pat-testing' && tenant.patTestingEnabled && <PATTestingPage initialSelectId={patPendingId} />}

        {/* Emergency Lighting tab */}
        {activeTab === 'emergency-lighting' && tenant.emergencyLightingEnabled && <EmergencyLightingPage initialSelectId={elPendingId} />}

        {/* Fire Doors tab */}
        {activeTab === 'fire-doors' && tenant.fireDoorsEnabled && <FireDoorsPage initialSelectId={fdPendingId} />}

        {/* Platform Admin tab */}
        {activeTab === 'platform-admin' && currentUser.isPlatformAdmin && <PlatformAdminPage />}
      </div>

        {/* Footer */}
        <Footer primaryColor={tenant.primaryColor} />
      </div>

      {/* Modals / overlays */}
      <AddExtinguisherModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCreate={handleCreate}
        primaryColor={tenant.primaryColor}
        complianceStandard={tenant.complianceStandard}
      />

      <ExtinguisherDetails
        open={showDetails}
        onClose={() => setShowDetails(false)}
        data={selectedExtinguisher}
        primaryColor={tenant.primaryColor}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditExtinguisherModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        extinguisher={editingExtinguisher}
        onUpdate={handleUpdate}
        primaryColor={tenant.primaryColor}
        complianceStandard={tenant.complianceStandard}
      />

      {showQrScanner && (
        <QRScanner
          onClose={() => setShowQrScanner(false)}
          onDetected={async (text) => {
            // Close scanner immediately to prevent multiple scans
            setShowQrScanner(false);

            // Extract extinguisher ID from scanned text
            // Handles both raw IDs and URLs like "https://domain.com/verify/{id}"
            let extinguisherId = text.trim();

            // If it's a URL, extract the ID from the path
            if (extinguisherId.includes('/verify/')) {
              const parts = extinguisherId.split('/verify/');
              extinguisherId = parts[1] || text;
              // Remove any query params, hash fragments, or trailing slashes
              extinguisherId = extinguisherId.split('?')[0].split('#')[0].replace(/\/$/, '');
            } else if (extinguisherId.startsWith('QR_')) {
              extinguisherId = extinguisherId.substring(3);
            }

            // Trim any whitespace
            extinguisherId = extinguisherId.trim();

            // First, try to find in the loaded extinguishers list
            let match =
              extinguishers.find(
                (e) => e.id === extinguisherId || e.id === text || `QR_${e.id}` === text,
              ) || null;

            // If not found locally, try fetching from API
            let fetchError = null;
            if (!match) {
              try {
                const fetched = await fetchExtinguisherById(extinguisherId);
                if (fetched) {
                  match = fetched;
                  // Add to local list if not already there
                  setExtinguishers((prev) => {
                    if (!prev.find(e => e.id === fetched.id)) {
                      return [...prev, fetched];
                    }
                    return prev;
                  });
                }
              } catch (err) {
                console.error('Failed to fetch extinguisher:', err);
                fetchError = err instanceof Error ? err.message : String(err);
              }
            }

            if (match) {
              setSelectedExtinguisher(match);
              setShowDetails(true);
            } else {
              const errorMsg = fetchError
                ? `Extinguisher not found.\n\nScanned ID: ${extinguisherId}\n\nError: ${fetchError}`
                : `Extinguisher not found.\n\nScanned ID: ${extinguisherId}\n\nThis extinguisher may not exist or may belong to a different organization.`;
              alert(errorMsg);
            }
          }}
        />
      )}

      <RoleSwitcherModal
        open={showRoleSwitcher}
        onClose={() => setShowRoleSwitcher(false)}
        currentRole={currentUser.role}
        roles={USER_ROLES}
        onSelect={handleSelectRole}
      />

      {showSimpleForm && (
        <SimpleInspectionForm
          onClose={() => setShowSimpleForm(false)}
          onSave={async () => {
            const refreshed = await fetchExtinguishers();
            setExtinguishers(refreshed);
          }}
          primaryColor={tenant.primaryColor}
          siteId={siteFilter !== 'all' ? siteFilter : undefined}
          siteName={selectedSiteFilter?.name}
        />
      )}
    </div>
  );
};

/* -------------------------------- Root export -------------------------------- */
const App: React.FC = () => (
  <TenantProvider>
    <FireExtinguisherApp />
  </TenantProvider>
);

export default App;
